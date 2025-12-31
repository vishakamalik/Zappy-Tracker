import express from "express";
import { 
    checkIn, 
    verifyStartOtp, 
    updateProgress, 
    completeEvent 
} from "../controllers/event.controllers.js";

const router = express.Router();

router.post('/check-in', checkIn);
router.post('/verify-start-otp', verifyStartOtp);
router.post('/update-progress', updateProgress);
router.post('/complete-event', completeEvent);

export default router;