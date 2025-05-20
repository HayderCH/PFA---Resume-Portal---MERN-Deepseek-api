
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Our platform provides unique experiences for both talent and companies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* For Candidates */}
          <div className="space-y-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-talent-secondary mb-2">For Candidates</h3>
              <p className="text-gray-600">Get your skills objectively assessed and connect with companies</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-talent-secondary text-white flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Upload Your CV</h4>
                  <p className="text-gray-600">
                    Submit your CV/resume to our AI system, which extracts and organizes your skills, experience, and education.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-talent-secondary text-white flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Take the Credibility Test</h4>
                  <p className="text-gray-600">
                    Complete an AI-generated assessment tailored to your industry and skills to verify your expertise.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-talent-secondary text-white flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Get Scored & Ranked</h4>
                  <p className="text-gray-600">
                    Receive comprehensive scoring across multiple dimensions and see how you rank within your industry.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-talent-secondary text-white flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Get Discovered</h4>
                  <p className="text-gray-600">
                    Your profile is included in industry-specific talent packs that companies can purchase, based on your performance.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/signup/candidate">
                <Button className="bg-talent-secondary hover:bg-purple-700">
                  Register as a Candidate
                </Button>
              </Link>
            </div>
          </div>

          {/* For Companies */}
          <div className="space-y-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-talent-primary mb-2">For Companies</h3>
              <p className="text-gray-600">Find pre-vetted talent efficiently through our unique marketplace</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-talent-primary text-white flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Browse the Marketplace</h4>
                  <p className="text-gray-600">
                    Explore our marketplace of industry-specific talent packs containing pre-vetted, scored candidates.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-talent-primary text-white flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Review Pack Details</h4>
                  <p className="text-gray-600">
                    View pack descriptions, selection criteria, and aggregate statistics about the candidates included.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-talent-primary text-white flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Purchase Packs</h4>
                  <p className="text-gray-600">
                    Purchase talent packs that match your hiring needs through our secure payment system.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-talent-primary text-white flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Access Candidate Data</h4>
                  <p className="text-gray-600">
                    Get detailed profiles and contact information for all candidates in your purchased packs.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/signup/company">
                <Button>
                  Register as a Company
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
