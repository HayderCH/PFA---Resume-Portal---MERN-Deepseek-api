
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MenuIcon, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-talent-primary">TalentPulse</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/about" className="text-gray-700 hover:text-talent-primary px-3 py-2">
            About
          </Link>
          <Link to="/how-it-works" className="text-gray-700 hover:text-talent-primary px-3 py-2">
            How It Works
          </Link>
          <Link to="/pricing" className="text-gray-700 hover:text-talent-primary px-3 py-2">
            Pricing
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-talent-primary px-3 py-2">
            Contact
          </Link>
          <div className="ml-4 flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-talent-primary focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white p-4 border-t border-gray-200">
          <div className="flex flex-col space-y-2">
            <Link
              to="/about"
              className="text-gray-700 hover:text-talent-primary px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-700 hover:text-talent-primary px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/pricing"
              className="text-gray-700 hover:text-talent-primary px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-talent-primary px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 space-y-2">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link to="/signup" className="block">
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
