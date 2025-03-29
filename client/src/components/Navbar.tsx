import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavLinkClick = (id: string) => {
    // Smooth scroll to section
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-primary">Profiler</span>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('features');
              }}
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#templates"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('templates');
              }}
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Templates
            </a>
            <a
              href="#testimonials"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('testimonials');
              }}
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('pricing');
              }}
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center">
            <a
              href="#waitlist"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('waitlist');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Join Waitlist
            </a>
            <button
              className="ml-2 md:hidden p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden bg-white border-b border-gray-200 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick('features');
            }}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
          >
            Features
          </a>
          <a
            href="#templates"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick('templates');
            }}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
          >
            Templates
          </a>
          <a
            href="#testimonials"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick('testimonials');
            }}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
          >
            Testimonials
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick('pricing');
            }}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
          >
            Pricing
          </a>
        </div>
      </div>
    </nav>
  );
}
