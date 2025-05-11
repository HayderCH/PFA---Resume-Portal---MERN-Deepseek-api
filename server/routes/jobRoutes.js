import express from 'express'
import { getJobById, getJobs } from '../controllers/jobController.js'

const router = express.Router()

//Route to get all resume data
router.get('/',getJobs)

//Route to get a single resume by id
router.get('/:id',getJobById)

export default router