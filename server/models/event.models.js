import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    vendorName: { type: String, required: true },
    status: { type: String, default: 'NOT_STARTED' }, // NOT_STARTED, IN_PROGRESS, COMPLETED
    checkIn: {
        photo: String, // Base64 string [cite: 9]
        latitude: Number, // [cite: 10]
        longitude: Number,
        timestamp: Date
    },
    startOtp: String, // [cite: 12]
    setupPhotos: [String], // [cite: 16]
    notes: String, // [cite: 18]
    endOtp: String, // [cite: 20]
    isCompleted: { type: Boolean, default: false }
});

const Event = mongoose.model('Event', EventSchema);

export default Event;