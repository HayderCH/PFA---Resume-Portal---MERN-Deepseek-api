
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block">
              <span className="text-xl font-bold text-talent-primary">TalentPulse</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              AI-powered talent marketplace connecting companies with pre-vetted, 
              scored candidates.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-base text-gray-600 hover:text-talent-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-base text-gray-600 hover:text-talent-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-base text-gray-600 hover:text-talent-primary">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-base text-gray-600 hover:text-talent-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-600 hover:text-talent-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-talent-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-600 hover:text-talent-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 text-center">
            &copy; {currentYear} TalentPulse Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
