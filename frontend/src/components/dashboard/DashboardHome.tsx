import { useState } from "react";
import {
  Upload,
  Brain,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const DashboardHome = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportData, setReportData] = useState<any | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsAnalyzing(true);
    setReportData(null);

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

      if (data.success && data.data) {
        setReportData(data.data);
        toast({
          title: "Analysis Complete!",
          description: "AI has analyzed your report successfully.",
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back 👋
        </h1>
        <p className="text-gray-600">
          Upload a medical report to view your health summary instantly
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
        </CardContent>
      </Card>

      {/* AI-Extracted Insights */}
      {reportData && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Latest Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.tests?.map((test: any, index: number) => (
              <Card
                key={index}
                className={`border ${
                  test.status === "High"
                    ? "border-red-200"
                    : test.status === "Low"
                    ? "border-yellow-200"
                    : "border-green-200"
                } shadow hover:shadow-[0_4px_24px_rgba(14,165,233,0.15)] transition-all`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    {test.status === "Normal" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle
                        className={`h-5 w-5 ${
                          test.status === "High"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      />
                    )}
                    {test.status === "High" ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : test.status === "Low" ? (
                      <TrendingDown className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {test.test}
                  </h3>
                  <p className="text-2xl font-bold text-sky-600 mb-1">
                    {test.value} {test.unit}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Normal Range: {test.range}
                  </p>
                  <p className="text-sm text-gray-500">{test.remarks}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
            <h3 className="font-semibold text-sky-700 mb-1">
              🩺 Overall Summary
            </h3>
            <p className="text-gray-700 text-sm">{reportData.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
