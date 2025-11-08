import { FileText, Menu, X, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "For Doctors", href: "#doctors" },
  ];

  return (
    <>
      {/* ✅ Top Info Bar */}
      {!isAuthPage && (
        <div className="hidden md:flex justify-end items-center px-10 py-1 bg-gradient-to-r from-sky-500 to-teal-500 text-white text-sm gap-6">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <a
              href="mailto:support@medireport.ai"
              className="hover:underline"
            >
              support@medireport.ai
            </a>
          </div>
        </div>
      )}

      {/* ✅ Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex flex-col items-start hover:opacity-90 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-7 w-7 text-sky-600" />
              <span className="text-[22px] font-bold tracking-tight text-gray-800 font-sans">
                <span className="text-teal-600">MediReport</span>{" "}
                <span className="text-sky-600">AI</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium -mt-1">
              AI-Powered Health Insights
            </p>
          </Link>

          {/* Nav Links (only for non-auth) */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-10 text-[16px] font-medium font-[Inter]">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-sky-600 transition-colors duration-200 tracking-wide"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthPage ? (
              <>
                <Link
                  to="/auth"
                  className="px-5 py-2 rounded-lg text-[15px] font-semibold text-sky-600 border border-sky-500 hover:bg-sky-50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="px-5 py-2 rounded-lg text-[15px] font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:opacity-90 shadow-sm transition-all duration-200"
                >
                  Doctor Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="px-5 py-2 rounded-lg text-[15px] font-semibold text-sky-600 border border-sky-500 hover:bg-sky-50 transition-all duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/auth"
                  className="px-4 py-1.5 rounded-lg text-[15px] font-semibold text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:opacity-90 transition-all duration-200"
                >
                  Doctor Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          {!isAuthPage && (
            <button
              className="md:hidden p-3 rounded-lg hover:bg-sky-50 transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-gray-800" />
              ) : (
                <Menu className="h-6 w-6 text-gray-800" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {!isAuthPage && isOpen && (
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
                <div className="text-gray-600 text-sm">
                  📞 +91 98765 43210
                  <br />
                  ✉️ support@medireport.ai
                </div>
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
    </>
  );
};

export default Navbar;
