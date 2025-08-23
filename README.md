# Blake

## Project Overview
Blake is a modular trading platform combining a FastAPI backend with a React-based dashboard. It provides widgets for market data, news, and performance analysis, along with Supabase-powered authentication.

## Installation
1. Clone the repository.
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install backend dependencies:
   ```bash
   pip install fastapi uvicorn supabase python-dotenv
   ```
4. (Optional) Install frontend dependencies:
   ```bash
   npm install
   ```

## Development Commands
| Purpose | Command |
|---------|---------|
| Run the API | `uvicorn main:app --reload` |
| Start frontend (if applicable) | `npm start` |
| Run tests | `pytest` |

## Environment Variables
`main.py` expects the following variables (use a `.env` file or export them in your shell):
```
SUPABASE_URL=<your-project-url>
SUPABASE_SERVICE_KEY=<your-service-key>
```

## Directory Structure
```
Blake/
├── main.py
├── services/
├── hooks/
├── pages/
├── dashboard/
├── datalake/
├── home/
├── public/
└── ...
```

## Usage Examples
### Sign up via API
```bash
curl -X POST "http://localhost:8000/auth/signup" \
  -d "email=user@example.com&password=secret"
```

### Use the DataSearch component
```jsx
import DataSearch from './DataSearch';

function App() {
  return <DataSearch onSearch={(query) => console.log(query)} />;
}
```
