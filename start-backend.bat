@echo off
echo Starting Unitrade Twilio WhatsApp Backend...
echo.
echo Please enter your Twilio Auth Token:
set /p TWILIO_AUTH_TOKEN=Auth Token: 
echo.
echo Starting server with your auth token...
set PORT=3001
node api/twilio-whatsapp.js
pause
