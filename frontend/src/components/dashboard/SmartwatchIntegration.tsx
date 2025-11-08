import { useState } from "react";
import { Watch, Bluetooth, HeartPulse, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SmartwatchIntegration = () => {
  const [smartwatchConnected, setSmartWatchConnected] = useState(false);
  const { toast } = useToast();

  const handleConnectSmartwatch = () => {
    setSmartWatchConnected(!smartwatchConnected);
    toast({
      title: smartwatchConnected ? "Device Disconnected" : "Device Connected!",
      description: smartwatchConnected
        ? "Smartwatch disconnected"
        : "Syncing your health data...",
    });
  };

  const vitalSigns = [
    { label: "Heart Rate", value: "72 bpm", icon: HeartPulse, color: "text-red-500" },
    { label: "Steps Today", value: "8,547", icon: Activity, color: "text-green-500" },
    { label: "Sleep", value: "7.2 hrs", icon: Clock, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Smartwatch Integration</h1>
        <p className="text-gray-600">Sync your daily vitals and activity data</p>
      </div>

      <div className="max-w-2xl">
        <Card className="border-teal-100 shadow-[0_4px_24px_rgba(20,184,166,0.15)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Watch className="h-6 w-6 text-teal-500" />
              Connect Your Device
            </CardTitle>
            <CardDescription>
              Sync your daily vitals and activity from Fitbit, Google Fit, or Apple Watch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleConnectSmartwatch}
              size="lg"
              className={`w-full ${
                smartwatchConnected
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-teal-500 to-sky-500"
              } hover:opacity-90 text-white shadow-[0_4px_24px_rgba(14,165,233,0.3)] transition-all duration-300 hover:-translate-y-1`}
            >
              <Bluetooth className="mr-2 h-5 w-5" />
              {smartwatchConnected ? "✓ Connected to Fitbit" : "Connect Device"}
            </Button>

            {smartwatchConnected && (
              <>
                <p className="text-sm text-gray-600 text-center">
                  Last synced: 5 minutes ago
                </p>
                <div className="space-y-3">
                  {vitalSigns.map((vital) => (
                    <div
                      key={vital.label}
                      className="p-4 bg-gradient-to-r from-teal-50/50 to-sky-50/30 rounded-lg border border-teal-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <vital.icon className={`h-6 w-6 ${vital.color}`} />
                          <span className="text-sm font-medium text-gray-700">
                            {vital.label}
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                          {vital.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!smartwatchConnected && (
              <div className="text-center py-8">
                <Watch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">
                  Connect your smartwatch to track daily vitals
                </p>
                <p className="text-sm text-gray-400">
                  Supports Fitbit, Google Fit, and Apple Health
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartwatchIntegration;
