import { Home, FileText, TrendingUp, Watch, MapPin, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const DashboardNav = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "See you again soon!",
    });
    setTimeout(() => navigate("/"), 1000);
  };

  const navItems = [
    { to: "/dashboard/home", icon: Home, label: "Home" },
    { to: "/dashboard/reports", icon: FileText, label: "Report Analysis" },
    { to: "/dashboard/progress", icon: TrendingUp, label: "Health Progress" },
    { to: "/dashboard/smartwatch", icon: Watch, label: "Smartwatch" },
    { to: "/dashboard/hospitals", icon: MapPin, label: "Nearby Hospitals" },
    { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-sky-100 min-h-screen sticky top-0">
        <div className="p-6 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-sky-500" />
            <span className="text-xl font-bold">
              <span className="text-teal-500">MediReport</span>{" "}
              <span className="text-sky-500">AI</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-teal-50 transition-all duration-300 hover:-translate-y-0.5"
              activeClassName="bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-[0_4px_24px_rgba(56,189,248,0.4)]"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sky-100">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-sky-100 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-sky-500" />
            <span className="font-bold">
              <span className="text-teal-500">MediReport</span>{" "}
              <span className="text-sky-500">AI</span>
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex overflow-x-auto px-2 pb-2 gap-1 scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 whitespace-nowrap hover:bg-sky-50 transition-all"
              activeClassName="bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md"
            >
              <item.icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardNav;
