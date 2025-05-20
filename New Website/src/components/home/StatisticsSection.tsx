
import React from 'react';

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold mb-2 text-talent-primary">{value}</div>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

const StatisticsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl text-gray-600">
            Revolutionizing how talent is assessed and hired
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem value="25,000+" label="Candidates Scored" />
          <StatItem value="500+" label="Companies Using Platform" />
          <StatItem value="40+" label="Industry Categories" />
          <StatItem value="85%" label="Hiring Efficiency Increase" />
        </div>

        <div className="mt-16 bg-gradient-to-r from-indigo-100 via-purple-50 to-indigo-100 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-talent-primary">Customer Success</h3>
              <p className="text-gray-700 mb-4">
                "TalentPulse has transformed our hiring process. The quality of candidates we've found through their pre-vetted packs is exceptional, and it's saved us countless hours in screening and initial interviews."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 bg-white rounded-full"></div>
                <div className="ml-4">
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Director of HR, TechCorp Inc.</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-talent-secondary">Candidate Experience</h3>
              <p className="text-gray-700 mb-4">
                "As someone transitioning to a new field, traditional job boards weren't working for me. TalentPulse's objective scoring system helped me showcase my skills and get noticed by companies that wouldn't have found me otherwise."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 bg-white rounded-full"></div>
                <div className="ml-4">
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
