from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import process

app = FastAPI()

# CORS (important for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(process.router)

@app.get("/")
def home():
    return {"message": "OCR Backend Running 🚀"}