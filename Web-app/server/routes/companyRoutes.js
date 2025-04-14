import express from 'express'
import { getCompanyData,ChangeJobApplicationsStatus, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany, changeVisibility } from '../controllers/CompanyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddle.js'

const router = express.Router()

//register a candidate
router.post('/register',upload.single('image'), registerCompany)

//candidate login
router.post('/login',loginCompany)

// get candidate data
router.get('/company',protectCompany,getCompanyData)

//post a resume
router.post('/post-job',protectCompany, upload.single('file'),postJob)

//get applicants data of company
//router.get('/applicants',protectCompany,getCompanyJobApplicants)

//get candidate resume list
router.get('/list-jobs',protectCompany,getCompanyPostedJobs)

//change application status
//router.post('/change-status',protectCompany,ChangeJobApplicationsStatus)

//change resume visibility
router.post('/change-visibility',protectCompany,changeVisibility)

export default router