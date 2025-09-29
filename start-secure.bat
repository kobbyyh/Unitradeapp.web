@echo off
echo ========================================
echo  Unitrade Twilio WhatsApp Backend
echo ========================================
echo.
echo Starting backend with secure configuration...
echo.

REM Check if config.env exists
if not exist "config.env" (
    echo ERROR: config.env file not found!
    echo Please make sure config.env exists with your Twilio credentials.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the server
echo Starting server on port 3001...
echo Backend will be available at: http://localhost:3001
echo.
node api/twilio-whatsapp.js

pause
