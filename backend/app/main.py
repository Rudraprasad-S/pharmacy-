"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import medicines, categories, brands, orders, ai

app = FastAPI(title="Pharmacy API", version="1.0.0")

# Allow all Vite dev server ports to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(medicines.router)
app.include_router(categories.router)
app.include_router(brands.router)
app.include_router(orders.router)
app.include_router(ai.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
