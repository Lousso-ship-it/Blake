# Blake

## API

Current API endpoints:

- `POST /auth/signup` – register a new user.
- `POST /auth/login` – log in and receive a token.
- `POST /auth/logout` – log out the current user.
- `GET /user/profile` – retrieve the authenticated user profile.
- `GET /market/prices/{symbol}` – get market prices for a symbol.
- `GET /market/orderbook/{symbol}` – get order book data for a symbol.

The client `ApiService` and the FastAPI backend only support these routes.
