# HeatShield AI

Professional AI-powered urban heat intelligence web application.

## Setup Instructions

1. **Install Dependencies**
   - Run `npm install` in the `backend` folder.
   - Run `npm install` in the `frontend` folder.

2. **Environment Variables**
   - Copy `.env.example` to `.env` in both the backend and frontend directories as needed (adjusting variable names for Vite if required).

3. **Running the Application**
   - Start Backend: `cd backend && npm run start` (or `node server.js`)
   - Start Frontend: `cd frontend && npm run dev`

## Architecture

The project is split into a React (Vite) frontend and Node.js (Express) backend. 
A weather service abstraction allows switching between Open-Meteo (for demo purposes) and FortyGuard API in the future.
