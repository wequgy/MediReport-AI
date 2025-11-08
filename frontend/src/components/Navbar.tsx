import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "For Doctors", href: "#doctors" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white via-sky-50 to-teal-50 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-sky-600" />
          <span className="text-[20px] font-semibold tracking-tight text-gray-800">
            <span className="text-teal-600">MediReport</span>{" "}
            <span className="text-sky-600">AI</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-sky-600 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/auth"
            className="px-4 py-1.5 rounded-lg text-[15px] font-medium text-sky-600 border border-sky-500 hover:bg-sky-50 transition-all duration-200"
          >
            Login
          </Link>
          <Link
            to="/auth"
            className="px-4 py-1.5 rounded-lg text-[15px] font-medium text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:opacity-90 transition-all duration-200"
          >
            Doctor Register
          </Link>
        </div>


        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-sky-50 transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-gray-800" />
          ) : (
            <Menu className="h-6 w-6 text-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-md">
          <div className="flex flex-col gap-4 px-5 py-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-700 font-medium hover:text-sky-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              <button className="w-full px-4 py-2 rounded-lg text-[15px] font-medium text-sky-600 border border-sky-500 hover:bg-sky-50 transition-all duration-200">
                Login
              </button>
              <button className="w-full px-4 py-2 rounded-lg text-[15px] font-medium text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:opacity-90 transition-all duration-200">
                Doctor Register
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
