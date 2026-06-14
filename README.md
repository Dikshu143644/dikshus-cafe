
# Dikshu's Cafe

An elegant full-stack café portfolio, featuring a glassmorphism design, real-time booking, menu filters, Razorpay test payment, custom customer and manager dashboards, and an AI-powered Café assistant with server-side Gemini integration.


## Features

- **Secure Authentication**: Registration, Login, and OTP verification using Drizzle ORM and PostgreSQL.
- **Role-Based Access**: Separate dashboards for Customers and Managers.
- **AI Assistant**: Intelligent concierge powered by Google Gemini for ordering and reservations.
- **Real-Time Payments**: Integrated Razorpay (test mode) with secure server-side signature verification.
- **Rate Limiting**: Security middleware to prevent brute-force attacks on sensitive endpoints.
- **3D Interactive Scenes**: Immersive coffee house experience using React Three Fiber.

## Deployment

### Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Dikshu143644/dikshus-cafe)

1. Click the **Deploy to Render** button above.
2. Render will automatically detect the `render.yaml` file.
3. Provide your `GEMINI_API_KEY` and other secrets in the Render dashboard.
4. Render will provision a free PostgreSQL database and deploy the web service.

## Run Locally

**Prerequisites:** Node.js, PostgreSQL

1. Install dependencies:
   `npm install`
2. Configure your environment:
   - Create a `.env` file based on `.env.example`.
   - Set your `GEMINI_API_KEY`.
   - Set your PostgreSQL connection details.
3. Push the database schema:
   `npx drizzle-kit push`
4. Run the development server:
   `npm run dev`
