import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['image', 'pdf'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  visible: {
    type:Boolean,
    default:true
  },
  companyId:{type: mongoose.Schema.Types.ObjectId,
     ref: 'Company',
    required: true}

});

const Job = mongoose.model("Resume", jobSchema);

export default Job;
