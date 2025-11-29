from fastapi import APIRouter
from pydantic import BaseModel
from app.core.supabase_client import supabase
from app.ai.pdf_utils import extract_pdf_text
from app.ai.resume_evaluator import evaluate_resume
from app.utils.storage import download_resume

router = APIRouter()

class ScreeningRequest(BaseModel):
    job_id: str


@router.post("/run")
def run_screening(payload: ScreeningRequest):
    job_id = payload.job_id

    # 1. Fetch job description
    job = (
        supabase.table("job_descriptions")
        .select("*")
        .eq("id", job_id)
        .single()
        .execute()
        .data
    )

    if not job:
        return {"error": "Job description not found"}

    # 2. Fetch MOST RECENT resume per user (avoid duplicates)
    resumes = (
        supabase.table("resumes")
        .select("*")
        .order("created_at", desc=True)
        .execute()
        .data
    )

    if not resumes:
        return {"error": "No resumes found"}

    # Deduplicate: keep only latest resume per user_id
    latest_resumes = {}
    for r in resumes:
        uid = r["user_id"]
        if uid not in latest_resumes:
            latest_resumes[uid] = r

    resumes = list(latest_resumes.values())

    # 3. DELETE old results for this job (avoid repeated duplicates)
    supabase.table("screening_results").delete().eq("job_id", job_id).execute()

    results = []

    # 4. Process each resume using Gemini
    for r in resumes:
        try:
            # Download PDF
            pdf_bytes = download_resume(r["file_path"])
            print(f"Downloaded {r['original_filename']} => {len(pdf_bytes)} bytes")

            # Extract text
            resume_text = extract_pdf_text(pdf_bytes)

            # Evaluate with Gemini
            data = evaluate_resume(job["description"], resume_text)

        except Exception as e:
            print("Error processing resume:", e)

            data = {
                "score": 0,
                "fit_percentage": 0,
                "strengths": "Error processing resume",
                "weaknesses": str(e),
                "raw_explanation": "AI evaluation failed"
            }

        # Append processed result
        results.append({
            "resume_id": r["id"],
            "score": data["score"],
            "fit_percentage": data["fit_percentage"],
            "strengths": data["strengths"],
            "weaknesses": data["weaknesses"],
            "raw_explanation": data["raw_explanation"],
        })

    # 5. Insert final results into screening_results
    inserted_rows = []
    for res_data in results:
        row = {
            "job_id": job_id,
            "resume_id": res_data["resume_id"],
            "score": res_data["score"],
            "fit_percentage": res_data["fit_percentage"],
            "strengths": res_data["strengths"],
            "weaknesses": res_data["weaknesses"],
            "raw_explanation": res_data["raw_explanation"],
        }

        saved = (
            supabase.table("screening_results")
            .insert(row)
            .execute()
        )

        inserted_rows.append(saved.data[0])

    return inserted_rows


@router.get("/results/{job_id}")
def get_results(job_id: str):
    res = (
        supabase.table("screening_results")
        .select("*, resumes!inner(original_filename, user_id)")
        .eq("job_id", job_id)
        .order("score", desc=True)
        .execute()
    )

    return res.data
