import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { manageJobsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ManageJobs = () => {

const navigate = useNavigate()

const [jobs, setJobs] = useState(false)

const {backendUrl, companyToken} = useContext(AppContext)

//function to fetch candidate resumes data
const fetchCompanyJobs = async () =>{

    try {
        const {data} = await axios.get(backendUrl+'/api/company/list-jobs',
            {headers:{token:companyToken}}
        )

        if (data.success) {
            setJobs(data.jobsData.reverse())
            console.log(data.jobs)
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error.message)
    }

}


//function to chnge resume visibility
const changeVisibility = async (id)=>{
    try {
        
        const {data} = await axios.post(backendUrl+'/api/company/change-visibility',
            { 
                id 
            },
            {
                headers:{token:companyToken}
            }
        )

        if (data.success) {
            toast.success(data.message)
            setJobs(prev => prev.map(job => 
                job._id === id ? { ...job, visible: !job.visible } : job
            ))
        } else {
            toast.error(data.message)
        }
        

    } catch (error) {
        toast.error(error.message)
    }
}

useEffect(()=>{
    if (companyToken){
        fetchCompanyJobs()
    }
}, [companyToken])

  return jobs ? jobs.length === 0 ? (<div className='flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl'>No Uploaded Resumes</p>
  </div>): (
    <div className='container p-4 max-w-5xl'>
        <div className='overflow x-auto'>
            <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
                <thead>
                    <tr>
                        <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
                        <th className='py-2 px-4 border-b text-left'>Title</th>
                        <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
                        <th className='py-2 px-4 border-b text-left max-sm:hidden'>Resume</th>
                        <th className='py-2 px-4 border-b text-left'>Visible</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs && jobs.map((job, index) => (
                        <tr key={job._id} className="text-gray-700">
                        <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>

                        <td className="py-2 px-4 border-b">{job.title}</td>

                        <td className="py-2 px-4 border-b max-sm:hidden">
                            {moment(job.createdAt).format('ll')}
                        </td>

                        <td className="py-2 px-4 border-b max-sm:hidden">
                            <a
                            href={job.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                            >
                            View File
                            </a>
                        </td>

                        <td className="py-2 px-4 border-b">
                            <input
                            onChange={()=>changeVisibility(job._id)}
                            className="scale-125 ml-4"
                            type="checkbox"
                            checked={job.visible}
                            readOnly // You can later implement toggle logic
                            />
                        </td>
                        </tr>
                    ))}
                    </tbody>

            </table>
        </div>
        <div className='mt-4 flex justify-end'>
        <button onClick={()=> navigate('/dashboard/add-job')} className='bg-blue-800 text-white py-2 px-4 rounded'>Add New Resume</button>
        </div>
    </div>
  ) : <Loading/>
}

export default ManageJobs