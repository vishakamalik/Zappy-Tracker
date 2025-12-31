import Event from "../models/event.models.js";

// Step 1: Vendor Check-In [cite: 8]
export const checkIn = async (req, res) => {
    try {
        const { vendorName, photo, lat, long } = req.body;

        // Generate Mock OTP [cite: 13]
        const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log(`[MOCK SMS] OTP for Customer: ${mockOtp}`);

        const newEvent = new Event({
            vendorName,
            checkIn: { photo, latitude: lat, longitude: long, timestamp: new Date() },
            startOtp: mockOtp, 
            status: 'CHECKED_IN'
        });

        await newEvent.save();
        res.status(201).json({ message: "Check-in successful", eventId: newEvent._id, mockOtpResponse: mockOtp });
    } catch (error) {
        res.status(500).json({ message: "Error checking in", error: error.message });
    }
};

// Step 2: Verify Start OTP [cite: 14]
export const verifyStartOtp = async (req, res) => {
    try {
        const { eventId, otp } = req.body;
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.startOtp === otp) {
            event.status = 'IN_PROGRESS';
            await event.save();
            res.json({ success: true, message: "Event Started!" });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};

// Step 3: Upload Progress (Photos/Notes) [cite: 15]
export const updateProgress = async (req, res) => {
    try {
        const { eventId, photo, notes } = req.body;
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });

        if (photo) event.setupPhotos.push(photo);
        if (notes) event.notes = notes;

        // Generate Closing OTP [cite: 13]
        const closingOtp = Math.floor(1000 + Math.random() * 9000).toString();
        event.endOtp = closingOtp;
        console.log(`[MOCK SMS] Closing OTP: ${closingOtp}`);

        await event.save();
        res.json({ success: true, mockClosingOtp: closingOtp });
    } catch (error) {
        res.status(500).json({ message: "Error updating progress", error: error.message });
    }
};

// Step 4: Closing Confirmation [cite: 19]
export const completeEvent = async (req, res) => {
    try {
        const { eventId, otp } = req.body;
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.endOtp === otp) {
            event.status = 'COMPLETED';
            event.isCompleted = true;
            await event.save();
            res.json({ success: true, message: "Event Completed Successfully!" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Closing OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error completing event", error: error.message });
    }
};