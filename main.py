from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

app = FastAPI(title="Trading Platform API")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration Supabase
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Middleware d'authentification
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Routes d'authentification
@app.post("/auth/signup")
async def signup(email: str, password: str):
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.post("/auth/login")
async def login(email: str, password: str):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.post("/auth/logout")
async def logout():
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Routes protégées
@app.get("/user/profile")
async def get_profile(current_user=Depends(get_current_user)):
    try:
        profile = (
            supabase.from_("profiles")
            .select("*")
            .eq("id", current_user.id)
            .single()
            .execute()
        )
        return profile
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Routes pour les données de trading
@app.get("/market/prices/{symbol}")
async def get_market_prices(symbol: str, current_user=Depends(get_current_user)):
    # Implémentation pour récupérer les prix du marché
    pass

@app.get("/market/orderbook/{symbol}")
async def get_orderbook(symbol: str, current_user=Depends(get_current_user)):
    # Implémentation pour récupérer le carnet d'ordres
    pass

# Plus de routes à venir...
