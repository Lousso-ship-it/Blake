import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

os.environ.setdefault("SUPABASE_URL", "http://localhost")
os.environ.setdefault("SUPABASE_SERVICE_KEY", "dummy")

from main import app


def _get_paths():
    return set(app.openapi()["paths"].keys())


def test_available_endpoints():
    paths = _get_paths()
    expected = {
        "/auth/signup",
        "/auth/login",
        "/auth/logout",
        "/user/profile",
        "/market/prices/{symbol}",
        "/market/orderbook/{symbol}",
    }
    assert expected.issubset(paths)


def test_trading_endpoints_absent():
    paths = _get_paths()
    unexpected = [
        "/trading/order",
        "/trading/orders/open",
        "/trading/orders/history",
        "/trading/positions",
        "/trading/position/{positionId}/close",
    ]
    for path in unexpected:
        assert path not in paths
