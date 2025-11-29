from fastapi import APIRouter
from pydantic import BaseModel
from app.core.supabase_client import supabase

router = APIRouter()

class JobCreate(BaseModel):
    admin_id: str
    title: str
    description: str

@router.post("/")
def create_job(payload: JobCreate):
    res = supabase.table("job_descriptions").insert({
        "admin_id": payload.admin_id,
        "title": payload.title,
        "description": payload.description
    }).execute()

    return res.data[0]

@router.get("/{admin_id}")
def get_jobs(admin_id: str):
    res = supabase.table("job_descriptions") \
        .select("*") \
        .eq("admin_id", admin_id) \
        .order("created_at", desc=True) \
        .execute()

    return res.data

@router.get("/test")
def test_route():
    return {"msg": "jobs endpoint works"}
