
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

const SignupChoice: React.FC = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Join TalentPulse</h1>
          <p className="text-xl text-gray-600">Are you looking to hire talent or showcase your skills?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Option */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-talent-primary">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                  <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
                  <path d="M12 13v4"></path>
                  <circle cx="9" cy="13" r="1"></circle>
                  <circle cx="15" cy="13" r="1"></circle>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2">I'm a Company</h2>
              <p className="text-gray-600 mb-6">
                Looking to hire top talent quickly? Access our marketplace of pre-vetted, AI-scored candidates.
              </p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Browse talent packs by industry
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Purchase packs of pre-vetted candidates
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Access industry insights and trends
                </li>
              </ul>
            </div>
            <Link to="/signup/company">
              <Button className="w-full">Sign up as a company</Button>
            </Link>
          </div>

          {/* Candidate Option */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-talent-secondary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="9" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2">I'm a Candidate</h2>
              <p className="text-gray-600 mb-6">
                Showcase your skills, get an objective AI assessment, and connect with companies.
              </p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Upload your CV for AI assessment
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Take a credibility test in your field
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Get included in talent packs for companies
                </li>
              </ul>
            </div>
            <Link to="/signup/candidate">
              <Button variant="outline" className="w-full">Sign up as a candidate</Button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-talent-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignupChoice;
