import Job from "../models/Job.js"



//get all resumes
export const getJobs = async (req,res)=>{
    try {
        
        const jobs = await Job.find({visible:true})
        .populate({path:'companyId', select : '-password'})

        res.json({success:true,jobs})

    } catch (error) {
        
        res.json({success:false, message:error.message})

    }
}

export const getJobById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the job by its ID and populate companyId
      const job = await Job.findById(id)
        .populate({
          path: 'companyId', // Populating companyId
          select: '-password' // Excluding password field from the company model
        });
  
      if (!job) {
        return res.json({
          success: false,
          message: 'Resume not found.'
        });
      }
  
      // Check if the file URL is a valid URL (basic validation)
      if (!job.fileUrl || !isValidURL(job.fileUrl)) {
        return res.json({
          success: false,
          message: 'Invalid file URL.'
        });
      }
  
      // Send the job along with the company information
      res.json({
        success: true,
        job
      });
  
    } catch (error) {
      res.json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Basic URL validation function
  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  