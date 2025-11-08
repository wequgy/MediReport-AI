import { Upload, Scan, MessageSquare, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      number: "01",
      title: "Upload Your Report",
      description:
        "Simply upload your blood test report in PDF or image format. We support all major lab formats.",
    },
    {
      icon: Scan,
      number: "02",
      title: "AI Analysis",
      description:
        "Our advanced AI scans and extracts data from your report, identifying all key health parameters.",
    },
    {
      icon: MessageSquare,
      number: "03",
      title: "Get Insights",
      description:
        "Receive instant, easy-to-understand explanations of your results with abnormality detection.",
    },
    {
      icon: CheckCircle,
      number: "04",
      title: "Consult Doctors",
      description:
        "Connect with verified doctors for personalized recommendations and treatment plans.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-[--color-sky-50]/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It <span className="text-[--color-sky-500]">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in minutes with our simple, streamlined process.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 right-[-50%] w-full h-0.5 bg-gray-200" />
                )}

                {/* Icon Circle */}
                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                  <div className="absolute inset-0 bg-[--color-sky-500]/10 rounded-full" />
                  <div className="absolute inset-2 bg-[--color-sky-500]/5 rounded-full" />
                  <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Icon className="h-10 w-10 text-[--color-sky-500]" />
                  </div>

                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-[--color-sky-500] to-[--color-teal-500] text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                    {step.number}
                  </div>
                </div>

                {/* Step Text */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
