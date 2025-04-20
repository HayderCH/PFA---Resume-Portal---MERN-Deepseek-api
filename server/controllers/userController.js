import Job from "../models/Job.js"
import JobApplication from "../models/jobApplication.js"
import User from "../models/User.js"



// get entreprise data
export const getUserData = async (req,res)=>{

    const userId = req.auth.userId

    try {

        const user = await User.findById(userId)

        if (!user) {
            return res.json({success:false,
                message: 'User not found'
            })
        }

        res.json({success:true, user})
        
    } catch (error) {
        res.json({success:false, message: error.message})
    }

}


//bookmark resume
export const applyForJob = async (req,res)=>{

    const { jobId } = req.body

    const userId = req.auth.userId

    try {
        
        const isAlreadyApplied = await JobApplication.find({jobId,userId})
        
        if (isAlreadyApplied > 0) {
            res.json({success:false, message : 'Already bookmarked!'})
        }

        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({success:false, message: 'Resume not found'})
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({success:true, message:'Bookmarked successfully!'})


    } catch (error) {
        
        res.json({success:false, message: error.message})

    }

}

//get entreprise bookmarked resumes
export const getUserJobApplications = async (req,res)=>{

    try {
        
        const userId = req.auth.userId

        const applications = await JobApplication.find({userId})
        .populate('companyId', 'name email image')
        .populate('jobId', 'title fileUrl')
        .exec()

        if (!applications) {
            return res.json({success:false, message:'No Resume bookmarks found for this user.'})
        }

        return res.json({ success:true, applications})
    } catch (error) {
        
        res.json({success:false, message: error.message})

    }

}

// update entreprise profile (resume/ probably not implemented)
export const updateUserResume = async (req,res) =>{

}