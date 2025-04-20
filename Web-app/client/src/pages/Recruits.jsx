import React, { useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';
import { useAuth, useUser } from '@clerk/clerk-react';

const Recruits = () => {

  const {user}= useUser()
  const {getToken}= useAuth()

  {/*may be unneeded */}


  const{backendUrl, userData, userApplications, fetchUserData}= useContext(AppContext)



  return (
<>
  <Navbar />
  <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
    <h2 className='text-xl font-semibold mb-6'>Bookmarked Resumes</h2>

    {userApplications.length === 0 ? (
      <p className='text-gray-500'>No bookmarked resumes yet.</p>
    ) : (
      <div className='grid grid-cols-1 gap-6'>
        {userApplications.map((application, index) => (
          <div
            key={index}
            className='border p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white'
          >
            <div className='flex items-center gap-4 mb-4 sm:mb-0'>
              <img
                src={application.companyId.image}
                alt='Company Logo'
                className='w-14 h-14 rounded-full object-cover border'
              />
              <div>
                <h3 className='text-lg font-semibold'>{application.companyId.name}</h3>
                <p className='text-sm text-gray-500'>{application.companyId.email}</p>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <a
                href={application.jobId.fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 underline text-sm font-medium'
              >
                View Resume
              </a>
              <p className='text-sm text-gray-500'>
                Date: {moment(application.date).format('LL')}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  <Footer />
</>

  );
};

export default Recruits;
