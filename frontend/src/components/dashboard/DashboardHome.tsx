import { useState } from "react";
import { Upload, FileText, Brain, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const DashboardHome = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ocrText, setOcrText] = useState<string | null>(null); // ✅ NEW
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsAnalyzing(true);
    setOcrText(null); // reset previous OCR text

    toast({
      title: "Analyzing Report",
      description: "Uploading your report for AI analysis...",
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload-report", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setIsAnalyzing(false);

      if (data.success) {
        setOcrText(data.extracted_text); // ✅ store OCR text
        toast({
          title: "Analysis Complete!",
          description: "AI has extracted text from your report.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to analyze report.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Error",
        description: "Unable to connect to the server.",
        variant: "destructive",
      });
    }
  };

  const insights = [
    { title: "Hemoglobin Stable", value: "14.2 g/dL", trend: "up", message: "Healthy range" },
    { title: "Cholesterol Improved", value: "180 mg/dL", trend: "down", message: "Good progress" },
    { title: "WBC Count Normal", value: "7,500 /µL", trend: "down", message: "Optimal level" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John 👋</h1>
        <p className="text-gray-600">Your last report was analyzed on January 15, 2024</p>
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

          {/* ✅ Display OCR result */}
          {ocrText && !isAnalyzing && (
            <div className="mt-6 p-4 bg-white border border-sky-200 rounded-lg shadow-sm">
              <h3 className="font-semibold text-sky-700 mb-2">🧠 Extracted Text</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-sky-50 p-3 rounded-lg border border-sky-100">
                {ocrText}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
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
                <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                <p className="text-2xl font-bold text-sky-600 mb-2">{insight.value}</p>
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
