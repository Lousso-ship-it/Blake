from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os
import asyncpg
from passlib.context import CryptContext
import jwt

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

# Configuration PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET", "changeme")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.on_event("startup")
async def startup():
    app.state.db = await asyncpg.create_pool(DATABASE_URL)

@app.on_event("shutdown")
async def shutdown():
    await app.state.db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Middleware d'authentification
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        async with app.state.db.acquire() as conn:
            user = await conn.fetchrow("SELECT id, email FROM users WHERE id=$1", int(user_id))
            if not user:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
            return dict(user)
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
        hashed = pwd_context.hash(password)
        async with app.state.db.acquire() as conn:
            user = await conn.fetchrow(
                "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
                email,
                hashed,
            )
        return {"id": user["id"], "email": user["email"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.post("/auth/login")
async def login(email: str, password: str):
    try:
        async with app.state.db.acquire() as conn:
            user = await conn.fetchrow("SELECT id, password FROM users WHERE email=$1", email)
        if not user or not pwd_context.verify(password, user["password"]):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
        token = jwt.encode({"sub": str(user["id"])}, JWT_SECRET, algorithm="HS256")
        return {"access_token": token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Routes protégées
@app.get("/user/profile")
async def get_profile(current_user = Depends(get_current_user)):
    try:
        async with app.state.db.acquire() as conn:
            profile = await conn.fetchrow("SELECT * FROM profiles WHERE id=$1", current_user["id"])
        return dict(profile) if profile else None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Routes pour les données de trading
@app.get("/market/prices/{symbol}")
async def get_market_prices(symbol: str, current_user = Depends(get_current_user)):
    # Implémentation pour récupérer les prix du marché
    pass

@app.get("/market/orderbook/{symbol}")
async def get_orderbook(symbol: str, current_user = Depends(get_current_user)):
    # Implémentation pour récupérer le carnet d'ordres
    pass

# Plus de routes à venir... 