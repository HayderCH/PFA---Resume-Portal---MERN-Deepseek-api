
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { uploadCV } from '@/services/candidate';
import { toast } from 'sonner';

// Define the file status types
type FileUploadStatus = 'idle' | 'processing' | 'complete' | 'error';

const CandidateProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>('idle');
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      setFileSelected(true);
    } else {
      setFileSelected(false);
      setFileName('');
    }
  };

  const handleUpload = async () => {
    try {
      if (!fileInputRef.current?.files || fileInputRef.current.files.length === 0) {
        toast.error('Please select a file to upload');
        return;
      }

      setUploadStatus('processing');
      const file = fileInputRef.current.files[0];
      
      if (!user?.id) {
        toast.error('User ID not found. Please log in again.');
        setUploadStatus('error');
        return;
      }

      // Upload CV using the correct function name
      await uploadCV(file, user.id);
      
      setUploadStatus('complete');
      toast.success('CV uploaded successfully!');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileSelected(false);
      setFileName('');
      
      // Refresh page after short delay to show updated profile status
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error uploading CV:', error);
      setUploadStatus('error');
      toast.error(`Failed to upload CV: ${error.message || 'Unknown error'}`);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Candidate Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal and contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user?.candidateDetails?.fullName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profile Status</p>
                  <p className="font-medium capitalize">
                    {user?.candidateDetails?.profileStatus?.replace('_', ' ') || 'Incomplete'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry Category</p>
                  <p className="font-medium">{user?.candidateDetails?.category || 'Not specified'}</p>
                </div>
                {user?.candidateDetails?.overallScore !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                    <p className="font-medium">{user.candidateDetails.overallScore}/100</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CV Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Your CV</CardTitle>
              <CardDescription>
                Upload a PDF or DOCX file of your resume to showcase your skills and experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user?.candidateDetails?.cvUrl ? (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium text-green-800">CV Uploaded</p>
                        <p className="text-sm text-green-600">Your CV has been successfully uploaded</p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(user.candidateDetails?.cvUrl, '_blank')}
                      >
                        View CV
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={triggerFileInput}
                      >
                        Replace CV
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-600">
                      Drag and drop your CV here, or click to browse files
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Supported formats: PDF, DOCX (Max 5MB)
                    </p>
                    <Button 
                      onClick={triggerFileInput}
                      className="mt-4"
                      variant="secondary"
                    >
                      Browse Files
                    </Button>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />

                {fileSelected && (
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
                    </div>
                    <Button
                      onClick={handleUpload}
                      disabled={uploadStatus === 'processing'}
                      size="sm"
                    >
                      {uploadStatus === 'processing' ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                )}
                
                {uploadStatus === 'error' && (
                  <p className="text-sm text-red-600">
                    There was an error uploading your CV. Please try again.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Profile Sections */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-800">Complete Your Profile</p>
                  <p className="text-sm text-blue-700 mt-1">
                    For the best results, complete your profile information and take the credibility test.
                  </p>
                  <div className="mt-4">
                    <Button 
                      onClick={() => navigate('/candidate/credibility-test')}
                      variant="outline"
                    >
                      Take Credibility Test
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateProfile;
