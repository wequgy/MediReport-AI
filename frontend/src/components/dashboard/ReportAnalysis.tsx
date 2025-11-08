import { useEffect, useState } from "react";
import { FileText, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "react-router-dom";

const ReportAnalysis = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id || 1;

  const query = new URLSearchParams(location.search);
  const reportId = query.get("report");

  // 🧠 Fetch report history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/report-history/${userId}`);
        const data = await res.json();

        if (data.success) {
          setReports(data.data);
          setLoading(false);

          // scroll if redirected from dashboard
          if (reportId) {
            setTimeout(() => {
              const el = document.getElementById(`report-${reportId}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 400);
          }
        } else {
          setReports([]);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch report history:", err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, reportId]);

  // 🔍 Fetch individual report details
  const handleViewDetails = async (reportId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/report-details/${reportId}`);
      const data = await res.json();

      if (data.success) {
        setSelectedReport(data.data);
        setShowModal(true);
      } else {
        alert("Failed to fetch report details");
      }
    } catch (err) {
      console.error("Error fetching details:", err);
    }
  };

  // 🎨 Color logic for test status
  const statusColor = (status: string) => {
    switch (status) {
      case "High":
        return "border-red-300 bg-red-50";
      case "Low":
        return "border-amber-300 bg-amber-50";
      default:
        return "border-green-200 bg-green-50";
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading report history...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Analysis</h1>
        <p className="text-gray-600">View and manage your previous test reports</p>
      </div>

      {/* 📋 Previous Reports */}
      <Card className="border-sky-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-sky-500" />
            Previous Reports
          </CardTitle>
          <CardDescription>Your report history and AI summaries</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {reports.length === 0 ? (
            <p className="text-gray-600 text-center py-6">No reports found yet.</p>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                id={`report-${report.id}`}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {report.summary || "AI-generated summary"}
                      </p>
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

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(report.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 🧠 Modal for Report Details */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-sky-700">
                  Report Details
                </DialogTitle>
              </DialogHeader>

              {/* Patient Info */}
              <div className="p-4 bg-sky-50 rounded-lg mb-4">
                <h3 className="font-semibold text-sky-700 mb-2">Patient Information</h3>
                <p><strong>Name:</strong> {selectedReport.patient.name}</p>
                <p><strong>Age:</strong> {selectedReport.patient.age}</p>
                <p><strong>Sex:</strong> {selectedReport.patient.sex}</p>
                <p><strong>Sample Type:</strong> {selectedReport.patient.sample_type}</p>
                <p><strong>Date:</strong> {selectedReport.patient.report_date}</p>
              </div>

              {/* Test Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {selectedReport.tests.map((t: any, index: number) => (
                  <Card key={index} className={statusColor(t.status)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{t.test}</h3>
                        <span
                          className={`text-sm font-medium ${
                            t.status === "High"
                              ? "text-red-600"
                              : t.status === "Low"
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-sky-700 font-bold">
                        {t.value} {t.unit}
                      </p>
                      <p className="text-sm text-gray-600">
                        Normal: {t.range || "N/A"}
                      </p>
                      {t.remarks && (
                        <p className="text-sm italic mt-2">{t.remarks}</p>
                      )}
                      {t.possible_causes && (
                        <p className="text-xs text-gray-500 mt-1">
                          <strong>Causes:</strong> {t.possible_causes}
                        </p>
                      )}
                      {t.related_factors && (
                        <p className="text-xs text-gray-500 mt-1">
                          <strong>Related:</strong> {t.related_factors}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">
                  General Summary
                </h3>
                <p className="text-gray-700">{selectedReport.summary}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportAnalysis;
