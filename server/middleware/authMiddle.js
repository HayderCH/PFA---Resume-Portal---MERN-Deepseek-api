import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'
/*
export const protectCompany = async (req,res,next)=>{

    const token = req.headers.token

    if (!token) {
        return res.json({success:false,message:'Not Authorized, login again.'})
        
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.company = await Company.findById(decoded.id)
        .select('-password')

        next()

    } catch (error) {
        res.json({success:false,message:error.message})
    }

}*/
export const protectCompany = async (req, res, next) => {
    const token = req.headers.token;
    
    console.log('Received token:', token);  // Debugging line
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized, login again.',
      });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);  // Debugging line
  
      req.company = await Company.findById(decoded.id).select('-password');
  
      if (!req.company) {
        return res.status(401).json({
          success: false,
          message: 'Company not found.',
        });
      }
  
      next();
    } catch (error) {
      console.error('Error in token verification:', error);  // Debugging line
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
  };
  