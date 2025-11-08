import { FileText, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Pricing", href: "#" },
      { name: "FAQ", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#" },
    ],
    doctors: [
      { name: "For Doctors", href: "#doctors" },
      { name: "Apply Now", href: "#" },
      { name: "Doctor Portal", href: "#" },
      { name: "Resources", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "HIPAA Compliance", href: "#" },
    ],
  };

  return (
    <footer className="bg-[rgb(var(--color-sky-50))]/50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-[rgb(var(--color-sky-500))]" />
              <span className="text-xl font-bold text-gray-900">
                MediReport AI
              </span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              AI-powered medical report analysis for instant health insights.
              Understand your blood tests and connect with verified doctors.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[rgb(var(--color-sky-500))]" />
                <a
                  href="mailto:support@medireport.ai"
                  className="hover:text-[rgb(var(--color-sky-500))] transition-colors"
                >
                  support@medireport.ai
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[rgb(var(--color-sky-500))]" />
                <span>1-800-MEDI-AI</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[rgb(var(--color-sky-500))]" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-gray-900 mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-[rgb(var(--color-sky-500))] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MediReport AI. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {/* Twitter */}
            <a
              href="#"
              className="text-gray-500 hover:text-[rgb(var(--color-sky-500))] transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.93 4.93 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482A13.947 13.947 0 0 1 1.671 3.149a4.822 4.822 0 0 0-.665 2.475 4.92 4.92 0 0 0 2.188 4.1 4.903 4.903 0 0 1-2.228-.616v.06a4.926 4.926 0 0 0 3.946 4.827 4.902 4.902 0 0 1-2.224.084 4.923 4.923 0 0 0 4.6 3.419 9.867 9.867 0 0 1-6.102 2.105A10.02 10.02 0 0 1 0 19.54a13.933 13.933 0 0 0 7.548 2.212c9.142 0 14.308-7.721 13.995-14.646A9.935 9.935 0 0 0 24 4.557z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="#"
              className="text-gray-500 hover:text-[rgb(var(--color-sky-500))] transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.372 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386C24 5.373 18.627 0 12 0z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="#"
              className="text-gray-500 hover:text-[rgb(var(--color-sky-500))] transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5V5c0-2.761-2.238-5-5-5zM7 19H4V8h3v11zM5.5 6.268A1.768 1.768 0 1 1 5.5 2.732a1.768 1.768 0 0 1 0 3.536zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765C14.396 7.179 20 6.988 20 12.241V19z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
