import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HealthProgress = () => {
  const healthParams = [
    {
      name: "Cholesterol",
      current: 180,
      previous: 195,
      unit: "mg/dL",
      trend: "down",
      status: "good",
    },
    {
      name: "Hemoglobin",
      current: 14.2,
      previous: 13.8,
      unit: "g/dL",
      trend: "up",
      status: "good",
    },
    {
      name: "WBC Count",
      current: 7.5,
      previous: 8.2,
      unit: "K/µL",
      trend: "down",
      status: "good",
    },
    {
      name: "Blood Sugar",
      current: 98,
      previous: 105,
      unit: "mg/dL",
      trend: "down",
      status: "good",
    },
    {
      name: "Blood Pressure",
      current: 120,
      previous: 125,
      unit: "mmHg",
      trend: "down",
      status: "good",
    },
    {
      name: "Platelet Count",
      current: 250,
      previous: 240,
      unit: "K/µL",
      trend: "up",
      status: "good",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Progress</h1>
        <p className="text-gray-600">Track your key health parameters over time</p>
      </div>

      <Card className="border-sky-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-500" />
            Parameter Trends
          </CardTitle>
          <CardDescription>
            Monitor changes in your health metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthParams.map((param) => (
            <div
              key={param.name}
              className="p-4 bg-gradient-to-r from-sky-50/50 to-teal-50/30 rounded-lg border border-sky-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{param.name}</span>
                <div className="flex items-center gap-2">
                  {param.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-xl">{param.trend === "up" ? "📈" : "📉"}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {param.current}
                </span>
                <span className="text-sm text-gray-600">{param.unit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Previous: {param.previous} {param.unit}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    param.status === "good"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {param.status === "good" ? "Optimal" : "Attention"}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthProgress;
