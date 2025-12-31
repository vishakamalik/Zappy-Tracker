# Zappy Vendor Event Tracker (Simulation)

A full-stack web application simulating the daily workflow of vendors executing events. Built as part of the Zappy Full Stack Developer Internship Assessment.

## Project Overview

This application provides a "Mini Vendor Event Day Tracker" that allows vendors to verify their presence and track event progress in real-time. It simulates a complete lifecycle:

**Check-In → Verification (OTP) → Work Progress → Completion**.

The project is built with a focus on **modularity**, **clean architecture (MVC)**, and **real-world simulation logic**.

## 🛠️ Tech Stack

**Frontend:**

- **React.js: (Vite)** Fast, modern build tool for optimized frontend performance.
- **Axios:** For handling HTTP requests.
- **HTML5/CSS3:** For layout and styling.

**Backend:**

- **Node.js & Express.js:** RESTful API architecture.
- **MongoDB (Atlas):** NoSQL database for flexible data storage.
- **Mongoose:** ODM for schema validation and data modeling.
- **Nodemon:** Used for efficient development with hot-reloading.
- **Dotenv:** For secure environment variable management.

---

## ✨ Key Features

- **Geo-Location Check-In:** Captures the vendor's precise Latitude, Longitude, and Timestamp upon arrival.
- **Fully Responsive UI:** Designed to work seamlessly on mobile and desktop screens.
- **Mock Authentication & Security:** Simulates user login and secure OTP (One-Time Password) verification flows.
- **Evidence Upload:** Supports image uploads (converted to Base64) for check-ins and work progress.
- **State Management:** Tracks event status (`CHECKED_IN`, `IN_PROGRESS`, `COMPLETED`) via MongoDB.
- **Modular Code Structure:** Backend follows the **MVC (Model-View-Controller)** pattern for scalability and code clarity.

---

## ⚙️ Installation & Setup Guide

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas Account (or local MongoDB)

### 1. Clone the Repository

```bash
git clone <your-repo-link-here>
cd zappy-tracker
```
### 2. Backend Setup

```bash
cd server
npm install
```
- **Configure Environment Variables**: Create a `.env file` in the server/ root directory and add your MongoDB connection string:

```bash
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/zappy?retryWrites=true&w=majority
PORT=3000
```
**Start the Server:**

```bash
npm run dev
OR,
nodemon server.js
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

**Start the React Application:**

```bash
npm run dev
```

### Usage Flow

- Since this is a simulation without a real SMS gateway, the `OTPs are returned in the API response for testing purposes`.

**Login**: Enter any vendor name (e.g., "xyz") to mock login.

**Check-In**: Upload a selfie/photo. The app will capture your browser's location.

`Note: Allow "Location Permissions" in your browser.`

**Start OTP**: An alert will pop up with the Mock OTP (e.g., 1234). Enter this to start the event.

**Work Progress**: Upload a setup photo and add notes.

**Completion**: The app will generate a final Closing OTP. Enter it to mark the event as COMPLETED.

### Project Structure

- The backend is organized using the MVC Pattern to ensure separation of concerns:

server/
├── controllers/      # Logic for Check-in, OTP verification, etc.
├── models/           # Mongoose Schemas (Event data structure)
├── routes/           # API Endpoints
├── db/               # Database connection logic
└── server.js         # Entry point

### Edge Cases Handled

**Location Permission**: Gracefully handles scenarios where the user denies browser geolocation access.
**Database Connection**: The server waits for a successful DB connection before accepting requests to prevent crashes.
**Validation**: Ensures photos and names are present before allowing submissions.

`Author: Vishaka Malik Submission for: Zappy Full Stack Developer Internship`