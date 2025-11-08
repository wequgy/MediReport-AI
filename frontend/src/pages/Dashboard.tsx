import { Routes, Route, Navigate } from "react-router-dom";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardHome from "@/components/dashboard/DashboardHome";
import ReportAnalysis from "@/components/dashboard/ReportAnalysis";
import HealthProgress from "@/components/dashboard/HealthProgress";
import SmartwatchIntegration from "@/components/dashboard/SmartwatchIntegration";
import NearbyHospitals from "@/components/dashboard/NearbyHospitals";
import Settings from "@/components/dashboard/Settings";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50/30 to-teal-50/20 flex">
      <DashboardNav />
      
      <main className="flex-1 p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
          <Route path="/home" element={<DashboardHome />} />
          <Route path="/reports" element={<ReportAnalysis />} />
          <Route path="/progress" element={<HealthProgress />} />
          <Route path="/smartwatch" element={<SmartwatchIntegration />} />
          <Route path="/hospitals" element={<NearbyHospitals />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
