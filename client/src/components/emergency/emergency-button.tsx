import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EmergencyButtonProps {
  className?: string;
}

export default function EmergencyButton({ className }: EmergencyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const { toast } = useToast();

  const triggerEmergencyAlert = async () => {
    setIsTriggering(true);
    
    try {
      const sessionId = localStorage.getItem('cybershe-session');
      if (!sessionId) {
        toast({
          title: "Session Error",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        });
        return;
      }

      // Get location if available
      let location;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch {
          // Location access denied or failed
        }
      }

      const response = await fetch('/api/emergency-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({
          location,
          message: "Emergency alert triggered from CyberSHE app",
        }),
      });

      if (response.ok) {
        toast({
          title: "Emergency Alert Sent",
          description: "Your emergency contacts have been notified. Help is on the way.",
        });
        setIsOpen(false);
      } else {
        throw new Error('Failed to send alert');
      }
    } catch (error) {
      toast({
        title: "Alert Failed",
        description: "Unable to send emergency alert. Please call 911 directly.",
        variant: "destructive",
      });
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          className={cn("emergency-pulse", className)}
          data-testid="button-emergency"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Emergency
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Emergency Alert</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will immediately notify your emergency contacts and share your location. 
            Only use in genuine emergencies.
          </p>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <h4 className="font-medium text-destructive mb-2">What happens when you trigger this alert:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Emergency contacts receive SMS/email notification</li>
              <li>• Your current location is shared (if available)</li>
              <li>• Incident report is generated for authorities</li>
              <li>• 24/7 crisis support is contacted on your behalf</li>
            </ul>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
              data-testid="button-cancel-emergency"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={triggerEmergencyAlert}
              disabled={isTriggering}
              className="flex-1"
              data-testid="button-confirm-emergency"
            >
              {isTriggering ? (
                "Sending Alert..."
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" />
                  Send Alert Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
