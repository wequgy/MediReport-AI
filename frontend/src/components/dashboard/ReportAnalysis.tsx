import { FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ReportAnalysis = () => {
  const previousReports = [
    {
      date: "2024-01-15",
      summary: "Complete Blood Count",
      confidence: 98,
      status: "normal",
    },
    {
      date: "2023-12-10",
      summary: "Lipid Panel",
      confidence: 95,
      status: "attention",
    },
    {
      date: "2023-11-05",
      summary: "Thyroid Function",
      confidence: 97,
      status: "normal",
    },
    {
      date: "2023-10-01",
      summary: "Liver Function Test",
      confidence: 96,
      status: "normal",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Analysis</h1>
        <p className="text-gray-600">View and manage your previous test reports</p>
      </div>

      <Card className="border-sky-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-sky-500" />
            Previous Reports
          </CardTitle>
          <CardDescription>Your report history and analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {previousReports.map((report, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{report.summary}</p>
                    <p className="text-sm text-gray-600">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      report.status === "normal"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {report.status === "normal" ? "Normal" : "Needs Attention"}
                  </span>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportAnalysis;
