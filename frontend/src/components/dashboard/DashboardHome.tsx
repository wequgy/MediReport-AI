import { useState, useEffect } from "react";
import {
  Upload,
  Brain,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  FileText,
  Clock,
  ArrowRight,
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [latestReport, setLatestReport] = useState<any | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const userId = 1; // Replace with actual logged-in user id

  // 🧠 Fetch latest report when component loads
  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/latest-report/${userId}`);
        const data = await res.json();

        if (data.success && data.data) {
          const sortedTests = [...data.data.tests].sort((a, b) => {
            const priority = { High: 1, Low: 2, Normal: 3 };
            return priority[a.status] - priority[b.status];
          });

          setLatestReport({
            ...data.data,
            tests: sortedTests,
          });
        }
      } catch (err) {
        console.warn("No previous report found or failed to load.");
      }
    };

    fetchLatestReport();
  }, []);

  // 📤 Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsAnalyzing(true);
    toast({
      title: "Analyzing Report",
      description: "Uploading your report for AI analysis...",
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", String(userId));

    try {
      const response = await fetch("http://localhost:5000/api/upload-report", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setIsAnalyzing(false);

      if (data.success) {
        const sortedTests = [...data.data.tests].sort((a, b) => {
          const priority = { High: 1, Low: 2, Normal: 3 };
          return priority[a.status] - priority[b.status];
        });

        setAnalysisData({
          ...data.data,
          tests: sortedTests,
        });

        // 🧩 Hide upload section after successful upload
        setSelectedFile(null);
        toast({
          title: "Analysis Complete!",
          description: "AI has analyzed and saved your report.",
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

  // 🎨 Helper for color coding
  const statusColor = (status: string) => {
    switch (status) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Low":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "High") return <AlertTriangle className="text-red-500" />;
    if (status === "Low") return <TrendingDown className="text-amber-500" />;
    return <CheckCircle className="text-green-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, John 👋
        </h1>
        <p className="text-gray-600">
          Upload new reports anytime and view AI insights instantly.
        </p>
      </div>

      {/* 🚫 Upload Card - Hidden during analysis view */}
      {!analysisData && (
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
      )}

      {/* ✅ Display analysis result when upload done */}
      {analysisData && (
        <>
          <Card className="border-sky-100 bg-sky-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sky-700">
                <FileText className="h-5 w-5" /> Current Report Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Name:</strong> {analysisData.patient.name}</p>
              <p><strong>Age:</strong> {analysisData.patient.age}</p>
              <p><strong>Sex:</strong> {analysisData.patient.sex}</p>
              <p><strong>Sample Type:</strong> {analysisData.patient.sample_type}</p>
              <p><strong>Report Date:</strong> {analysisData.patient.report_date}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisData.tests.map((t: any, index: number) => (
              <Card
                key={index}
                className={`border ${statusColor(t.status)} shadow-[0_4px_24px_rgba(14,165,233,0.1)]`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {t.test}
                    </h3>
                    <StatusIcon status={t.status} />
                  </div>
                  <p className="text-2xl font-bold text-sky-700 mb-1">
                    {t.value} {t.unit}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    Normal Range: {t.range || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700 italic">
                    {t.remarks || "No remarks provided."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Activity className="h-5 w-5" />
                General Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {analysisData.summary ||
                  "Overall, your report appears stable. Maintain a balanced diet, hydrate well, and consult your physician if any symptoms persist."}
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* 🩺 Show last report summary when no current analysis */}
      {!analysisData && latestReport && (
        <Card className="border border-gray-200 hover:border-sky-200 transition-all shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sky-700 text-lg">
              <Clock className="h-5 w-5" />
              Last Analyzed Report – {latestReport.patient.report_date}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              {latestReport.summary.length > 120
                ? latestReport.summary.slice(0, 120) + "..."
                : latestReport.summary}
            </p>
            <div className="flex items-center gap-4">
              {latestReport.tests.slice(0, 2).map((t: any, i: number) => (
                <div
                  key={i}
                  className={`text-sm px-3 py-1 rounded-full ${statusColor(t.status)}`}
                >
                  {t.test}: {t.status}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-sky-600 hover:bg-sky-50 flex items-center gap-2"
              onClick={() => navigate(`/report-history?report=${latestReport.id}`)}
            >
              View Full Report History
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardHome;
