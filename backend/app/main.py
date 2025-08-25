from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import books

app = FastAPI()

# Habilitar CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router)

@app.get("/")
def read_root():
    return {"message": "Hola hola XD"}

