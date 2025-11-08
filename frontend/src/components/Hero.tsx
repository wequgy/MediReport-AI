import { Activity, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-white via-sky-50 to-teal-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">

        {/* Glowing badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[--color-sky-500]/10 border border-[--color-sky-500]/30 shadow-sm">
            <Activity className="h-4 w-4 text-[--color-sky-500]" />
            <span className="text-sm font-medium text-[--color-sky-500] tracking-wide">
              AI-Powered Medical Analysis
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-gray-900 mb-6 leading-tight">
            Understand Your Blood Test Results{" "}
            <span className="text-[--color-sky-500]">Instantly</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your blood test reports and get AI-powered insights in seconds.{" "}
            Connect with verified doctors for personalized health recommendations.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up">
        {/* Primary gradient button */}
        <button
            className="group px-6 py-3 rounded-lg text-white font-medium text-lg
                    bg-gradient-to-r from-[rgb(var(--color-sky-500))] to-[rgb(var(--color-teal-500))]
                    hover:opacity-90 transition-all flex items-center shadow-md"
        >
            Upload Your Report
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Outline button */}
        <button
            className="px-6 py-3 rounded-lg text-[rgb(var(--color-sky-500))] font-medium text-lg
                    border border-[rgb(var(--color-sky-500))] hover:bg-[rgb(var(--color-sky-50))]/50
                    transition-all"
        >
            Learn More
        </button>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[--color-sky-500] mb-2">10K+</div>
            <div className="text-gray-600 font-medium">Reports Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[--color-sky-500] mb-2">500+</div>
            <div className="text-gray-600 font-medium">Verified Doctors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[--color-sky-500] mb-2">98%</div>
            <div className="text-gray-600 font-medium">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
