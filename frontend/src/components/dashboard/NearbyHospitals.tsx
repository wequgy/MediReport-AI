import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NearbyHospitals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nearby Hospitals</h1>
        <p className="text-gray-600">Locate healthcare facilities near you</p>
      </div>

      <div className="max-w-4xl">
        <Card className="border-sky-100 shadow-[0_4px_24px_rgba(14,165,233,0.15)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-sky-500" />
              Healthcare Facilities
            </CardTitle>
            <CardDescription>
              Find hospitals and clinics in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2799198932!2d-74.25987368715491!3d40.69767006458873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
              <div className="absolute top-3 right-3">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-red-500" />
                    <span className="text-xs font-medium">12 nearby</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full mt-4 bg-gradient-to-r from-sky-500 to-teal-500 hover:opacity-90 text-white shadow-[0_4px_24px_rgba(14,165,233,0.3)] transition-all duration-300 hover:-translate-y-1"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NearbyHospitals;
