#!/bin/bash
echo "Starting Unitrade Twilio WhatsApp Backend..."
echo ""
echo "Please enter your Twilio Auth Token:"
read -s TWILIO_AUTH_TOKEN
echo ""
echo "Starting server with your auth token..."
export PORT=3001
node api/twilio-whatsapp.js
