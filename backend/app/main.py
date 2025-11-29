from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import jobs, resumes, screening

app = FastAPI(title="AI Hiring Portal API")

# CORS (allow frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # later restrict to frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
app.include_router(screening.router, prefix="/screening", tags=["screening"])

@app.get("/")
def home():
    return {"status": "backend working"}
