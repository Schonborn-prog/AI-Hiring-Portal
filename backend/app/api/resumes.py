from fastapi import APIRouter
from pydantic import BaseModel
from app.core.supabase_client import supabase

router = APIRouter()

class ResumeCreate(BaseModel):
    user_id: str
    file_path: str
    original_filename: str

@router.post("/")
def add_resume(payload: ResumeCreate):
    res = supabase.table("resumes").insert({
        "user_id": payload.user_id,
        "file_path": payload.file_path,
        "original_filename": payload.original_filename
    }).execute()

    return res.data[0]

@router.get("/{user_id}")
def get_resumes(user_id: str):
    res = supabase.table("resumes") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .execute()

    return res.data
