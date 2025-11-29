import os
import uvicorn
from fastapi import FastAPI, Response
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

@app.head("/")
def home_head():
    return Response(status_code=200)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
