import { useState } from "react";
import { Upload, FileText, Brain, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const DashboardHome = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsAnalyzing(true);

      toast({
        title: "Analyzing Report",
        description: "AI is processing your blood test...",
      });

      setTimeout(() => {
        setIsAnalyzing(false);
        toast({
          title: "Analysis Complete!",
          description: "Your results are ready below",
        });
      }, 3000);
    }
  };

  const insights = [
    {
      title: "Hemoglobin Stable",
      value: "14.2 g/dL",
      status: "good",
      trend: "up",
      message: "Your hemoglobin levels are within healthy range",
    },
    {
      title: "Cholesterol Improved",
      value: "180 mg/dL",
      status: "good",
      trend: "down",
      message: "Great progress! Keep up the healthy lifestyle",
    },
    {
      title: "WBC Count Normal",
      value: "7,500 /µL",
      status: "good",
      trend: "down",
      message: "White blood cell count is optimal",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, John 👋
        </h1>
        <p className="text-gray-600">
          Your last report was analyzed on January 15, 2024
        </p>
      </div>

      {/* Upload Section */}
      <Card className="border-sky-100 shadow-[0_4px_24px_rgba(14,165,233,0.15)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-sky-500" />
            Upload Medical Report
          </CardTitle>
          <CardDescription>
            Upload your blood test report for instant AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-sky-300 rounded-xl p-8 text-center bg-sky-50/30 hover:bg-sky-50/50 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  Drag & drop or click to upload
                </p>
                <p className="text-sm text-gray-600">
                  Supports PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
            </label>
          </div>

          {isAnalyzing && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-sky-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  AI is analyzing your report...
                </span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
          )}

          {selectedFile && !isAnalyzing && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900 mb-1">
                    Analysis Complete!
                  </p>
                  <p className="text-sm text-green-700 mb-3">
                    All parameters are within normal range. Great job maintaining your health!
                  </p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ Hemoglobin: 14.2 g/dL (Normal)</li>
                    <li>✓ WBC Count: 7,500 /µL (Normal)</li>
                    <li>✓ Cholesterol: 180 mg/dL (Optimal)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <Card
              key={index}
              className="border-sky-100 hover:shadow-[0_4px_24px_rgba(14,165,233,0.2)] transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {insight.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {insight.title}
                </h3>
                <p className="text-2xl font-bold text-sky-600 mb-2">
                  {insight.value}
                </p>
                <p className="text-sm text-gray-600">{insight.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
