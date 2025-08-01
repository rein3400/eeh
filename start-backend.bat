@echo off
echo Starting Express English Hub Backend...
echo.

cd /d "D:\RealUses\eeh\backend"

echo Checking Python environment...
python --version
echo.

echo Installing requirements...
pip install -r requirements.txt
echo.

echo Starting FastAPI server on port 8001...
python server.py

pause