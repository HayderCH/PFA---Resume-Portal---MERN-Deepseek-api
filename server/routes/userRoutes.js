import express from 'express'
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../controllers/userController.js'


const router = express.Router()

//get entreprise data
router.get('/user', getUserData)

//bookmark a resume
router.post('/apply',applyForJob)

//get bookmarked resumes
router.get('/applications', getUserJobApplications)

//update entreprise profile resume(not implemeneted)
//router.post('/update-resume',upload.single('resume'),updateUserResume)

export default router