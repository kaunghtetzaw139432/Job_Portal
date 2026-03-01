import express from 'express';
import userAuth from '../middlewares/auth.js'; // အရင်ရေးခဲ့တဲ့ middleware
import {
    createJobController,
    deleteJobController,
    getAllJobsController,
    updateJobController,
    getAllJobsStatusController
} from '../controllers/job.js';

const router = express.Router();

// routes
// CREATE JOB || POST
router.post('/create-job', userAuth, createJobController);

// GET JOBS || GET
router.get('/get-job', userAuth, getAllJobsController);

// UPDATE JOBS || PUT or PATCH
router.put('/update-job/:id', userAuth, updateJobController);

// DELETE JOBS || DELETE
router.delete('/delete-job/:id', userAuth, deleteJobController);

router.get('/job-status', userAuth, getAllJobsStatusController)

export default router;