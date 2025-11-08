import React from "react";

const Doctors = () => {
  return (
    <section id="doctors" className="py-20 bg-white text-center">
      <p className="text-sm text-teal-600 font-medium mb-2">For Medical Professionals</p>
      <h2 className="text-3xl font-bold mb-4">
        Join Our Network of <span className="text-sky-500">Healthcare Experts</span>
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12">
        Expand your practice and help more patients by joining our platform.
        Review reports, provide consultations, and manage appointments efficiently.
      </p>

      <div className="grid md:grid-cols-3 gap-8 px-8 md:px-20">
        <div className="bg-sky-50 p-8 rounded-xl shadow-sm">
          <h3 className="text-2xl text-sky-600 font-semibold">$150K+</h3>
          <p>Average Annual Earnings</p>
        </div>
        <div className="bg-sky-50 p-8 rounded-xl shadow-sm">
          <h3 className="text-2xl text-sky-600 font-semibold">2,500+</h3>
          <p>Active Doctors</p>
        </div>
        <div className="bg-sky-50 p-8 rounded-xl shadow-sm">
          <h3 className="text-2xl text-sky-600 font-semibold">95%</h3>
          <p>Satisfaction Rate</p>
        </div>
      </div>
    </section>
  );
};

export default Doctors;
