import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddJob = () => {
  const [file, setFile] = useState(null);
  const [title,setTitle] = useState('')

  const {backendUrl, companyToken} = useContext(AppContext)

/*const onSubmitHandler = async (e)=>{

    e.preventDefault()

    try {
      
      const {data} = await axios.post(backendUrl+'/api/jobs/add',{title,file},
        {headers: {token:companyToken}}
      )

      if (data.success){
        toast.success(data.message)
        setTitle('')
        setFile= null
      } else {
          toast.error(data.message)

      }

    } catch (error) {
      toast.error(error.message)
    }

  }
*/
const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    const { data } = await axios.post(
      `${backendUrl}/api/company/post-job`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          token: companyToken
        }
      }
    );

    if (data.success) {
      toast.success("Resume uploaded successfully!");
      setTitle("");
      setFile(null);
    } else {
      toast.error(data.message || "Failed to upload resume.");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  return (
    
    <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3" action="">
        <div className="w-full">
            <p className="mb-2">Choose title (eg. react developper/machine learning student,etc...)</p>
            <p className="mb-2">Please avoid spelling errors to improve your visibility.</p>
            <input className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded" placeholder='Type here' value={title} required onChange={e=> setTitle(e.target.value)} type="text" />
        </div>
        
        <div className="p-4 w-full max-w-lg border rounded">

            <h2 className="text-lg font-semibold mb-2">Upload Image or PDF</h2>
            <input required
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
            />
            {file && (
                <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
            )}
        </div>

        <button className="w-28 py-3 mt-4 bg-blue-800 text-white">Add Resume</button>
            <p>Please don't spam click "Add Resume" and wait till notification appears!</p>
    </form>
  );
};

export default AddJob;
