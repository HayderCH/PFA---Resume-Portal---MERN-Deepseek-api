
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Talent Acquisition?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join TalentPulse today and experience the power of AI-driven talent assessment and matching.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup/company">
              <Button size="lg" className="bg-talent-accent hover:bg-blue-600 text-white">
                I'm a Company
              </Button>
            </Link>
            <Link to="/signup/candidate">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                I'm a Candidate
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-indigo-200">
            Have questions? <Link to="/contact" className="underline hover:text-white">Contact our team</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
