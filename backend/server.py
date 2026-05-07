from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import requests


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class VisitorCountry(BaseModel):
    country: str
    visitors: int
    share: float


class VisitorCountriesResponse(BaseModel):
    configured: bool
    source: str = "plausible"
    window_days: int
    min_visitors: int
    countries: List[VisitorCountry]
    error: Optional[str] = None


def fetch_plausible_visitor_countries() -> VisitorCountriesResponse:
    api_key = os.environ.get("PLAUSIBLE_API_KEY")
    site_id = os.environ.get("PLAUSIBLE_SITE_ID", "yaduraj.me")
    api_url = os.environ.get("PLAUSIBLE_API_URL", "https://plausible.io/api/v2/query")
    window_days = int(os.environ.get("PLAUSIBLE_LOOKBACK_DAYS", "30"))
    min_visitors = int(os.environ.get("PLAUSIBLE_MIN_VISITORS", "3"))
    max_countries = int(os.environ.get("PLAUSIBLE_MAX_COUNTRIES", "12"))

    if not api_key:
        return VisitorCountriesResponse(
            configured=False,
            window_days=window_days,
            min_visitors=min_visitors,
            countries=[],
            error="missing_plausible_api_key",
        )

    response = requests.post(
        api_url,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "site_id": site_id,
            "metrics": ["visitors"],
            "date_range": f"{window_days}d",
            "dimensions": ["visit:country"],
            "order_by": [["visitors", "desc"]],
        },
        timeout=10,
    )
    response.raise_for_status()
    payload = response.json()
    rows = payload.get("results") or payload.get("data") or []

    countries = []
    total_visitors = 0

    for row in rows:
        dimensions = row.get("dimensions", [])
        metrics = row.get("metrics", [])
        country = (dimensions[0] if dimensions else "").strip().upper()
        visitors = int(metrics[0] if metrics else 0)

        if not country or country in {"ZZ", "NOT SET", "(NOT SET)"}:
            continue

        total_visitors += visitors
        if visitors < min_visitors:
            continue

        countries.append((country, visitors))

    if total_visitors == 0:
        return VisitorCountriesResponse(
            configured=True,
            window_days=window_days,
            min_visitors=min_visitors,
            countries=[],
        )

    country_models = [
        VisitorCountry(
            country=country,
            visitors=visitors,
            share=round((visitors / total_visitors) * 100, 1),
        )
        for country, visitors in countries[:max_countries]
    ]

    return VisitorCountriesResponse(
        configured=True,
        window_days=window_days,
        min_visitors=min_visitors,
        countries=country_models,
    )

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.get("/visitor-countries", response_model=VisitorCountriesResponse)
async def get_visitor_countries():
    try:
        return await run_in_threadpool(fetch_plausible_visitor_countries)
    except requests.RequestException:
        logger.exception("Failed to fetch visitor countries from Plausible")
        return VisitorCountriesResponse(
            configured=True,
            window_days=int(os.environ.get("PLAUSIBLE_LOOKBACK_DAYS", "30")),
            min_visitors=int(os.environ.get("PLAUSIBLE_MIN_VISITORS", "3")),
            countries=[],
            error="plausible_request_failed",
        )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
