from app.ai.gemini_client import run_gemini
import json
import re

def evaluate_resume(job_description: str, resume_text: str) -> dict:
    prompt = f"""
You are an AI hiring agent. Compare the following job description and resume.

JOB DESCRIPTION:
{job_description}

RESUME:
{resume_text}

Score the resume on:
1. Overall match score (0–100)
2. Fit percentage (0–100)
3. Strengths (3–5 bullet points)
4. Weaknesses (3–5 bullet points)

Return ONLY valid JSON. Do NOT include triple backticks or code fences.

Format:
{{
  "score": <number>,
  "fit_percentage": <number>,
  "strengths": "<string>",
  "weaknesses": "<string>",
  "raw_explanation": "<string>"
}}
"""

    try:
        raw = run_gemini(prompt)
        print("Gemini raw output:", raw)

        cleaned = (
            raw.replace("```json", "")
               .replace("```", "")
               .replace("```JSON", "")
               .strip()
        )

        # Also remove markdown code fences if present
        cleaned = re.sub(r"```.*?```", "", cleaned, flags=re.S)

        data = json.loads(cleaned)

        return {
            "score": int(data.get("score", 0)),
            "fit_percentage": int(data.get("fit_percentage", 0)),
            "strengths": data.get("strengths", ""),
            "weaknesses": data.get("weaknesses", ""),
            "raw_explanation": data.get("raw_explanation", cleaned),
        }

    except Exception as e:
        print("Gemini parsing error:", e)
        return {
            "score": 0,
            "fit_percentage": 0,
            "strengths": "Error",
            "weaknesses": str(e),
            "raw_explanation": "AI failed to parse response."
        }
