from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import json
from urllib.request import urlopen

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

# Mapping des flux de prix Pyth
PYTH_PRICE_FEEDS = {
    "BTCUSD": "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d6654806ec6fac6a5b",
    "ETHUSD": "0xca80ba6dc32e08d22b1e06c80b5f994ad1f89a2b84f9a56b96c679596c8a9e9",
}

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

# Routes protégées
@app.get("/user/profile")
async def get_profile(current_user = Depends(get_current_user)):
    try:
        profile = supabase.from_('profiles').select('*').eq('id', current_user.id).single().execute()
        return profile
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Routes pour les données de trading
@app.get("/market/prices/{symbol}")
async def get_market_prices(symbol: str, current_user = Depends(get_current_user)):
    symbol_key = symbol.upper().replace("-", "").replace("/", "")
    feed_id = PYTH_PRICE_FEEDS.get(symbol_key)
    if not feed_id:
        raise HTTPException(status_code=404, detail="Unsupported symbol")
    try:
        url = f"https://hermes.pyth.network/v2/price_feeds?ids[]={feed_id}"
        with urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
        feed = data.get("price_feeds", [None])[0]
        if not feed or "price" not in feed:
            raise ValueError("No price data returned from Pyth")
        price_info = feed["price"]
        price = price_info.get("price")
        expo = price_info.get("expo", 0)
        publish_time = price_info.get("publish_time")
        if price is None:
            raise ValueError("Price missing in Pyth response")
        final_price = price * (10 ** expo)
        return {
            "symbol": symbol_key,
            "price": final_price,
            "publish_time": publish_time,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market/orderbook/{symbol}")
async def get_orderbook(symbol: str, current_user = Depends(get_current_user)):
    # Pyth Network ne fournit pas de carnet d'ordres
    raise HTTPException(status_code=501, detail="Order book not available from Pyth")

# Plus de routes à venir...

