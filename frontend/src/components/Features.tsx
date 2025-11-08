import { Brain, Clock, Shield, Users, Zap, FileCheck } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced algorithms analyze your reports and provide accurate health insights instantly.",
    },
    {
      icon: Clock,
      title: "Instant Results",
      description:
        "Get comprehensive analysis in seconds, not days. No more waiting for doctor appointments.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your medical data is encrypted and protected with industry-leading security standards.",
    },
    {
      icon: Users,
      title: "Verified Doctors",
      description:
        "Connect with certified medical professionals for personalized recommendations.",
    },
    {
      icon: Zap,
      title: "Smart Insights",
      description:
        "Understand complex medical terms with clear explanations and actionable advice.",
    },
    {
      icon: FileCheck,
      title: "Report History",
      description:
        "Track your health progress over time with organized report storage and trends.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 px-6 bg-gradient-to-b from-sky-50 to-white relative overflow-hidden"
    >
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Explore Our{" "}
          <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
            Smart Health Features
          </span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">
          Designed to simplify your medical journey — from analyzing blood
          reports to connecting you with the right doctors.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-lg border border-sky-100 rounded-2xl p-8 text-left shadow-[0_4px_24px_rgba(56,189,248,0.15)] 
                hover:shadow-[0_6px_28px_rgba(56,189,248,0.25)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white mb-5 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
