import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const JobCard = ({ job }) => {
  const navigate = useNavigate()

  // Format the creation date
  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className='border p-6 shadow rounded'>
      {/* Job Title */}
      <h4 className='font-medium text-xl'>{job.title}</h4>

      {/* Company Info */}
      <div className='flex items-center gap-4 mt-3'>
        <img
          className='h-12 w-12 rounded-full object-cover'
          src={job.companyId?.image || assets.company_icon}
          alt="Company"
        />
        <div>
          <p className='font-medium'>{job.companyId?.name}</p>
          <p className='text-sm text-gray-500'>{job.companyId?.email}</p>
        </div>
      </div>

      {/* Job Created At */}
      <p className='text-sm text-gray-400 mt-2'>Posted on {formattedDate}</p>

      {/* Action Buttons */}
      <div className='mt-4 flex gap-4 text-sm'>
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`)
            scrollTo(0, 0)
          }}
          className='bg-blue-600 text-white px-4 py-2 rounded'
        >
          Bookmark
        </button>
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`)
            scrollTo(0, 0)
          }}
          className='text-gray-500 border border-gray-500 rounded px-4 py-2'
        >
          Learn more
        </button>
      </div>
    </div>
  )
}

export default JobCard
