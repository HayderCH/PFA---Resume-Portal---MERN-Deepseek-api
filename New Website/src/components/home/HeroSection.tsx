
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                AI-Powered Talent Marketplace
              </h1>
              <p className="mt-6 text-xl text-indigo-100 max-w-xl">
                Connect with pre-vetted, scored, and categorized talent. Find the perfect match for your organization with confidence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup/company">
                <Button size="lg" className="bg-talent-accent hover:bg-blue-600 text-white">
                  Find Talent
                </Button>
              </Link>
              <Link to="/signup/candidate">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Get Scored as a Candidate
                </Button>
              </Link>
            </div>
            
            <div className="text-indigo-200 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-indigo-400/90 border-2 border-indigo-900"></div>
                ))}
              </div>
              <p className="ml-4 text-sm">
                Join 2000+ companies already finding top talent
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-white rounded-lg opacity-5"></div>
            <div className="relative bg-gradient-to-br from-indigo-800/80 to-purple-700/80 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-indigo-500/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-talent-accent flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI-Driven Assessment</h3>
                  <p className="text-indigo-200 text-sm">Objective evaluation</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-8">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span>Technical Skills</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-indigo-900/50 rounded-full h-2">
                    <div className="bg-talent-accent h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span>Experience</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="w-full bg-indigo-900/50 rounded-full h-2">
                    <div className="bg-talent-accent h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span>Problem Solving</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <div className="w-full bg-indigo-900/50 rounded-full h-2">
                    <div className="bg-talent-accent h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Overall Score</p>
                    <p className="text-2xl font-bold">91/100</p>
                  </div>
                  
                  <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                    Top 5% in category
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-24 bg-gradient-to-b from-indigo-900 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
