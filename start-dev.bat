@echo off
echo Starting Express English Hub Development Environment...
echo.

REM Check if Python is installed
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed! Please install Python first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed! Please install Node.js first.
    pause
    exit /b 1
)

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Install backend dependencies if needed
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
)

REM Start backend server
echo Starting backend server...
start cmd /k "cd backend && venv\Scripts\activate && python server.py"

REM Wait for backend to initialize
timeout /t 5 /nobreak > nul

REM Start frontend development server
echo Starting frontend...
start cmd /k "npm run dev"

echo.
echo Development servers are running:
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8001
echo.
echo Press any key to stop all servers...
pause > nul

REM Kill all running servers
taskkill /F /IM python.exe /T
taskkill /F /IM node.exe /T
