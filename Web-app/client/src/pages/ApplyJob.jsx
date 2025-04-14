// src/pages/ApplyJob.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import moment from 'moment';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import PdfReactPdf from '../components/PdfReactPdf';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const ApplyJob = () => {
  const { id } = useParams();
  const { getToken } = useAuth();

  const [JobData, setJobData] = useState(null);
  const { jobs, backendUrl, userData, userApplications, fetchUserApplications } = useContext(AppContext);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const applyHandler = async () => {
    try {
      if (!userData) {
        return toast.error('Login to bookmark resumes');
      }

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: JobData._id },
        { headers: { Authorization: `Bearer ${token}` } } // Fixed "Authorizatio" typo
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(item => item.jobId._id === JobData._id);
    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (userApplications.length > 0 && JobData) {
      checkAlreadyApplied();
    }
  }, [JobData, userApplications]);

  return JobData ? (
    <>
      <Navbar />
      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
          {/* Top Section */}
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
              <img
                className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border object-cover'
                src={JobData.companyId.image || assets.company_icon}
                alt="Company Logo"
              />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{JobData.companyId.name}</h1>
                <p className='text-gray-600'>{JobData.companyId.email}</p>
                <p className='text-sm text-gray-400 mt-2'>Posted {moment(JobData.createdAt).fromNow()}</p>
              </div>
            </div>
            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded'>
                {isAlreadyApplied ? 'Already Bookmarked' : 'Bookmark'}
              </button>
            </div>
          </div>

          {/* Resume Preview */}
          <div className='flex flex-col items-center justify-center gap-6 px-6 md:px-20 py-10'>
            <h2 className='font-bold text-2xl mb-2'>{JobData.title}</h2>
            <p className='text-sm text-gray-400 mb-6'>Uploaded {moment(JobData.createdAt).fromNow()}</p>

            {JobData.fileType === 'pdf' ? (
              <div style={{ width: '100%', height: '80vh' }}>
                <PdfReactPdf src={JobData.fileUrl} />
              </div>
            ) : (
              <div className='max-w-full'>
                <img
                  src={JobData.fileUrl}
                  alt="Resume Preview"
                  className="max-w-3xl max-h-[80vh] object-contain border rounded mb-4"
                />
                <a href={JobData.fileUrl} target="_blank" rel="noopener noreferrer">
                  <button className="bg-red-800 p-2.5 px-10 text-white rounded">
                    View Resume
                  </button>
                </a>
              </div>
            )}

            <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded mt-6'>
              {isAlreadyApplied ? 'Already Bookmarked' : 'Bookmark'}
            </button>
          </div>

          {/* More Resumes Section */}
          <div className='px-6 md:px-20 py-10'>
            <h2 className='text-lg font-semibold mb-4'>More Resumes like {JobData.title}</h2>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {jobs
                .filter(job => job._id !== JobData._id)
                .filter(job => {
                  const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id));
                  return !appliedJobsIds.has(job._id);
                })
                .filter(job => {
                  const jobTitle = job.title.toLowerCase();
                  const currentTitle = JobData.title.toLowerCase();
                  const currentWords = currentTitle.split(/\s+/);
                  return currentWords.some(word => jobTitle.includes(word));
                })
                .map(job => {
                  const jobTitle = job.title.toLowerCase();
                  const currentWords = JobData.title.toLowerCase().split(/\s+/);
                  const matchCount = currentWords.reduce((count, word) => jobTitle.includes(word) ? count + 1 : count, 0);
                  return { job, matchCount };
                })
                .sort((a, b) => b.matchCount - a.matchCount)
                .slice(0, 4)
                .map((item, index) => <JobCard key={index} job={item.job} />)}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
