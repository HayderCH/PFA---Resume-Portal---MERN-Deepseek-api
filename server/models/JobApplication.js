import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({

    userId:{
        type: String,
        ref:'User',
        required:true
    },

    companyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true
    },

    jobId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },

    date:{
        type: Number,
        required:true
    },
})

const JobApplication = mongoose.model('JobApplication',JobApplicationSchema)

export default JobApplication

