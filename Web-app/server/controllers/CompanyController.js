import Company from "../models/Company.js";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";
import Job from '../models/Job.js';
import upload from '../config/multer.js';


// Helper function to use Cloudinary with buffer
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "resume_portal/companies" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer); // this is where Multer's memory buffer goes
  });
};

export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({ success: false, message: "User already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = await streamUpload(imageFile.buffer); // Upload from memory

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


/// company login
export const loginCompany = async (req,res) => {

const { email, password} = req.body

try {

    const company = await Company.findOne({email})

    if (await bcrypt.compare(password, company.password)) {

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
              },
              token: generateToken(company._id)
        })
        
    }
    else{
        res.json({success:false, message:'Invalid email or password.'})
    }
    
} catch (error) {
    res.json({success:false, message:error.message})
    
}

}

//get company data
export const getCompanyData = async (req,res) =>{



try {
    const company = req.company
    res.json({success:true, company})


} catch (error) {
    res.json({success:false, message:error.message})
}

}


  // Function to post a new resume/job
  export const postJob = async (req, res) => {
    try {
      const { title } = req.body;
      const file = req.file; // File uploaded via Postman
      
      if (!title || !file) {
        return res.status(400).json({ success: false, message: 'Missing title or file' });
      }
  
      const companyId = req.company._id; // Get company ID from protected route
  
      // Upload the file to Cloudinary
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, // Auto-detect image or PDF
        async (error, result) => {
          if (error) {
            return res.status(500).json({ success: false, message: 'Cloudinary upload failed', error });
          }
  
          // Determine file type (image or pdf)
          const fileType = result.resource_type === 'image' ? 'image' : 'pdf';
  
          // Create a new job (resume)
          const newJob = new Job({
            title,
            fileUrl: result.secure_url, // URL from Cloudinary
            fileType,
            visible: true,
            companyId,
          });
  
          await newJob.save(); // Save the job to DB
  
          // Update the company's resume array with the new job
          await Company.findByIdAndUpdate(companyId, {
            $push: { resume: newJob._id }
          });
  
          // Respond with the created job data
          res.status(201).json({ success: true, job: newJob });
        }
      ).end(file.buffer); // Pass file buffer to Cloudinary upload
    } catch (error) {
      console.error('Post Job Error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
  
//get company resume bookmarks
export const getCompanyJobApplicants = async (req,res)=>{

}

// Get company posted resumes with populated image
export const getCompanyPostedJobs = async (req, res) => {
    try {
      const companyId = req.company._id;
  
      const jobs = await Job.find({ companyId }).populate('companyId', 'image');
  
      res.json({ success: true, jobsData: jobs });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };
  

//change job application status not implemented
export const ChangeJobApplicationsStatus = async (req,res) =>{

}

//change resume visibility
export const changeVisibility = async (req,res)=>{


    try {
        
        const {id} = req.body

        const companyId = req.company._id

        const job = await Job.findById(id)
        //** */
        if (!job) {
            return res.json({ success: false, message: 'Resume not found' });
          }
         //** */ 

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible
            /** */
           // console.log(`Resume "${job.title}" visibility changed to: ${job.visible}`);
            /** */
        }

        await job.save()

       // res.json({success:true, job})
       //**/
       res.json({ success: true, message: 'Visibility updated successfully', job });
        /**/ 
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}