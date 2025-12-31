import React, { useState } from "react";
import axios from "axios";
import "./App.css";

// Set the base URL for your backend
const API_BASE = "http://localhost:3000/api";

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Data State
  const [eventId, setEventId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [photoPreview, setPhotoPreview] = useState(""); // To see what you uploaded
  const [photoBase64, setPhotoBase64] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [notes, setNotes] = useState("");

  // --- HELPER FUNCTIONS ---

  // 1. Login Funciton
  const handleLogin = () => {
    if (vendorName.trim() !== "") {
      setIsLoggedIn(true); // "Mock" authentication successful
    } else {
      alert("Please enter a name to login.");
    }
  };

  // 2. Get Location (Promisified)
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (error) => reject(error)
        );
      }
    });
  };

  // 3. Handle File Selection (Convert to Base64)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result);
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ACTIONS ---

  // Step 1: Check In
  const handleCheckIn = async () => {
    if (!vendorName || !photoBase64) {
      alert("Please enter your name and select a photo.");
      return;
    }

    setLoading(true);
    try {
      console.log("Step 1: Getting Location...");
      const coords = await getLocation();
      console.log("Location Found:", coords.latitude, coords.longitude);

      console.log("Step 2: Sending Data to Server...");
      const res = await axios.post(`${API_BASE}/check-in`, {
        vendorName,
        photo: photoBase64,
        lat: coords.latitude,
        long: coords.longitude,
      });

      console.log("Server Response:", res.data);
      setEventId(res.data.eventId);
      alert(`SIMULATION: Customer received OTP: ${res.data.mockOtpResponse}`);
      setStep(2);
    } catch (error) {
      console.error("Check-In Failed:", error);

      if (error.code === 1) {
        alert("Location Permission Denied. Please allow location access.");
      } else if (error.response) {
        alert(
          `Server Error: ${
            error.response.data.message || "Unknown Backend Error"
          }`
        );
      } else if (error.request) {
        alert("Server is not reachable. Is 'node server.js' running?");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/verify-start-otp`, {
        eventId,
        otp: otpInput,
      });
      setStep(3);
      setOtpInput("");
      setPhotoBase64(""); // Clear photo for next step
      setPhotoPreview("");
    } catch (error) {
      alert("Invalid OTP or Server Error");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Upload Progress
  const submitWork = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/update-progress`, {
        eventId,
        photo: photoBase64,
        notes,
      });
      alert(`SIMULATION: Closing OTP sent: ${res.data.mockClosingOtp}`);
      setStep(4);
      setOtpInput("");
    } catch (error) {
      alert("Failed to update progress.");
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Complete Event
  const completeEvent = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/complete-event`, {
        eventId,
        otp: otpInput,
      });
      setStep(5);
    } catch (error) {
      alert("Invalid Closing OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="app-root">
      <h1 className="app-title">Zappy Vendor Tracker</h1>

      {!isLoggedIn ? (
        <div className="card login-card glass-card">
          <h2 className="card-title">Vendor Login</h2>
          <p className="card-subtitle">
            Enter your Vendor ID or Name to access the dashboard.
          </p>

          <input
            type="text"
            placeholder="e.g. John Doe / V-123"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className="input-field"
          />

          <button onClick={handleLogin} className="btn btn-primary">
            Login
          </button>

          <p className="hint-text">(Simulation: No password required)</p>
        </div>
      ) : (
        <>
          <div className="top-bar glass-card">
            <span className="top-bar-text">
              Logged in as: <strong>{vendorName}</strong>
            </span>
          </div>

          <div className="stepper">
            <div className={`step-dot ${step >= 1 ? "active" : ""}`}>
              <span>1</span>
              <p>Check‑In</p>
            </div>
            <div className={`step-line ${step >= 2 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 2 ? "active" : ""}`}>
              <span>2</span>
              <p>Start OTP</p>
            </div>
            <div className={`step-line ${step >= 3 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 3 ? "active" : ""}`}>
              <span>3</span>
              <p>Progress</p>
            </div>
            <div className={`step-line ${step >= 4 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 4 ? "active" : ""}`}>
              <span>4</span>
              <p>Close OTP</p>
            </div>
            <div className={`step-line ${step >= 5 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 5 ? "active" : ""}`}>
              <span>5</span>
              <p>Done</p>
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="card glass-card">
              <h3 className="card-title">📍 Vendor Check-In</h3>
              <p className="card-subtitle">
                Confirm your name and upload a quick selfie for check‑in.
              </p>

              <input
                type="text"
                placeholder="Your Name"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="input-field"
              />

              <p className="field-label">Upload Selfie</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />

              {photoPreview && (
                <div className="image-preview">
                  <img src={photoPreview} alt="Preview" />
                </div>
              )}

              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="btn btn-primary full-width"
              >
                {loading ? "Checking In..." : "Check In & Get Location"}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="card glass-card">
              <h3 className="card-title">Enter Start OTP</h3>
              <p className="card-subtitle">
                Ask the customer for the OTP sent to their mobile.
              </p>

              <input
                placeholder="Enter 4-digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="input-field"
              />

              <button
                onClick={verifyOtp}
                className="btn btn-primary full-width"
              >
                Start Event
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="card glass-card">
              <h3 className="card-title">Event Setup</h3>
              <p className="card-subtitle">
                Upload a setup photo and add short notes.
              </p>

              <textarea
                placeholder="Notes (e.g., 'Setup completed on time')"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="textarea-field"
              />

              <p className="field-label">Upload Progress Photo</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />

              {photoPreview && (
                <div className="image-preview">
                  <img src={photoPreview} alt="Preview" />
                </div>
              )}

              <button
                onClick={submitWork}
                className="btn btn-primary full-width"
              >
                Submit & Finish
              </button>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="card glass-card">
              <h3 className="card-title"> Completion OTP</h3>
              <p className="card-subtitle">
                Enter the final OTP given by the customer to close the event.
              </p>

              <input
                placeholder="Final OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="input-field"
              />

              <button
                onClick={completeEvent}
                className="btn btn-primary full-width"
              >
                Close Event
              </button>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="card glass-card success-card">
              <h2 className="success-title">🎉 Great Job!</h2>
              <p className="success-text">
                The event has been successfully completed and logged.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-secondary"
              >
                Start New Event
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-indicator">
              <span className="spinner" />
              <span>Processing... Please wait.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
