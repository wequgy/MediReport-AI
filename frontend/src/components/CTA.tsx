import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 px-4 bg-[rgb(var(--color-sky-50))]">
      <div className="max-w-4xl mx-auto relative">
        <div className="relative overflow-hidden rounded-2xl 
                        bg-gradient-to-r from-[rgb(var(--color-sky-500))] to-[rgb(var(--color-teal-500))] 
                        p-12 md:p-16 text-center shadow-[0_10px_30px_rgba(14,165,233,0.25)]">
          
          {/* Background Blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Get Started Today
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Take Control of Your Health?
            </h2>

            {/* Subtext */}
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who trust MediReport AI for instant, accurate medical insights. 
              Upload your first report and experience the future of healthcare.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="group px-6 py-3 rounded-lg text-[rgb(var(--color-sky-600))] font-semibold text-lg 
                            bg-white hover:bg-white/90 transition-all flex items-center shadow-md"
                >
                Upload Your Report
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>

              <button
                className="px-6 py-3 rounded-lg border border-white/40 text-white font-semibold text-lg 
                           hover:bg-white/10 transition-all"
              >
                Schedule a Demo
              </button>
            </div>

            {/* Small note */}
            <p className="text-sm text-white/80 mt-6">
              No credit card required • Free trial available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
