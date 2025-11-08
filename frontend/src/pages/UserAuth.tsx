import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { useGoogleLogin } from "@react-oauth/google";

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    const endpoint = isLogin
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Error",
          description: data.message || "Invalid credentials or input.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: data.message || (isLogin ? "Welcome back!" : "Account created!"),
        description: "Redirecting to dashboard...",
      });

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to connect to the server.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Google login integration
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("http://localhost:5000/api/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await res.json();

        if (data.success) {
          toast({
            title: "Google Login Successful!",
            description: "Redirecting to dashboard...",
          });
          setTimeout(() => navigate("/dashboard"), 1000);
        } else {
          toast({
            title: "Login Failed",
            description: data.message || "Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to connect to the server.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Google login was canceled or failed.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex pt-[84px]">
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-500 to-teal-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          <div className="relative z-10 flex flex-col items-center justify-center px-12 text-white text-center w-full h-full transform -translate-y-2">
            <FileText className="h-20 w-20 mb-6" />
            <h2 className="text-4xl font-bold mb-4">Welcome to MediReport AI</h2>
            <p className="text-lg text-white/90 max-w-md">
              Get instant AI-powered insights from your blood test reports and connect with verified doctors.
            </p>
            <div className="mt-12 space-y-4 w-full max-w-md">
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/20">
                <div className="w-20 h-20 rounded-xl bg-white/25 flex items-center justify-center shadow-inner">
                  <span className="text-2xl font-bold text-white">10K+</span>
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-white">Reports Analyzed</p>
                  <p className="text-xs text-white/80">Join thousands of users</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/20">
                <div className="w-20 h-20 rounded-xl bg-white/25 flex items-center justify-center shadow-inner">
                  <span className="text-2xl font-bold text-white">98%</span>
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-white">Accuracy Rate</p>
                  <p className="text-xs text-white/80">Trusted AI analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white via-sky-50/30 to-white">
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-[0_8px_32px_rgba(14,165,233,0.15)] p-8 border border-sky-100">
              <div className="flex gap-2 mb-8 p-1 bg-sky-50/50 rounded-lg">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                    isLogin
                      ? "bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                    !isLogin
                      ? "bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-10 h-11 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 h-11 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 h-11 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 h-11 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-sky-500 to-teal-500 hover:opacity-90 text-white font-medium text-base group"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* ✅ Google Login Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => googleLogin()}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAuth;
