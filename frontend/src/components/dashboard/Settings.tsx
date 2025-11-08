import { User, Mail, Phone, MapPin, Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="border-sky-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-sky-500" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                Full Name
              </Label>
              <Input
                id="name"
                defaultValue="John Doe"
                className="border-gray-300 focus:border-sky-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="john.doe@example.com"
                className="border-gray-300 focus:border-sky-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="border-gray-300 focus:border-sky-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Location
              </Label>
              <Input
                id="location"
                defaultValue="New York, NY"
                className="border-gray-300 focus:border-sky-500"
              />
            </div>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:opacity-90 text-white shadow-[0_4px_24px_rgba(14,165,233,0.3)] transition-all duration-300 hover:-translate-y-1"
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="border-sky-100">
          <CardHeader>
            <CardTitle>Connected Devices</CardTitle>
            <CardDescription>
              Manage your connected health devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Fitbit Charge 5</p>
                <p className="text-sm text-gray-600">Connected 3 days ago</p>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                Disconnect
              </Button>
            </div>
            <Button variant="outline" className="w-full border-sky-300 text-sky-600 hover:bg-sky-50">
              Add New Device
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
