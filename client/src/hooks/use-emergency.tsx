import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isActive: boolean;
}

interface EmergencyLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

interface EmergencyAlert {
  id?: string;
  location?: EmergencyLocation;
  message?: string;
  contactIds?: string[];
  timestamp: number;
}

export function useEmergency() {
  const [isTriggering, setIsTriggering] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [lastAlert, setLastAlert] = useState<EmergencyAlert | null>(null);
  const { toast } = useToast();

  // Get current location
  const getCurrentLocation = useCallback((): Promise<EmergencyLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          });
        },
        (error) => {
          // Still resolve with no location rather than reject
          console.warn('Location access denied or failed:', error);
          resolve({
            latitude: 0,
            longitude: 0,
            timestamp: Date.now()
          });
        },
        { 
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 60000 
        }
      );
    });
  }, []);

  // Trigger emergency alert
  const triggerEmergencyAlert = useCallback(async (message?: string, contactIds?: string[]) => {
    setIsTriggering(true);

    try {
      const sessionId = localStorage.getItem('cybershe-session');
      if (!sessionId) {
        throw new Error('Session not found');
      }

      // Get location
      let location: EmergencyLocation | undefined;
      try {
        location = await getCurrentLocation();
      } catch (error) {
        console.warn('Could not get location:', error);
      }

      const alertData: EmergencyAlert = {
        location: location && location.latitude !== 0 ? location : undefined,
        message: message || "Emergency alert triggered from CyberSHE app",
        contactIds,
        timestamp: Date.now()
      };

      const response = await fetch('/api/emergency-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify(alertData),
      });

      if (!response.ok) {
        throw new Error('Failed to send emergency alert');
      }

      const result = await response.json();
      const alert = { ...alertData, id: result.alertId };
      setLastAlert(alert);

      toast({
        title: "Emergency Alert Sent",
        description: "Your emergency contacts have been notified. Help is on the way.",
      });

      return alert;
    } catch (error) {
      toast({
        title: "Alert Failed",
        description: error instanceof Error ? error.message : "Unable to send emergency alert. Please call 911 directly.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsTriggering(false);
    }
  }, [getCurrentLocation, toast]);

  // Add emergency contact
  const addEmergencyContact = useCallback(async (contactData: Omit<EmergencyContact, 'id' | 'isActive'>) => {
    try {
      const sessionId = localStorage.getItem('cybershe-session');
      if (!sessionId) {
        throw new Error('Session not found');
      }

      const response = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({ contactData }),
      });

      if (!response.ok) {
        throw new Error('Failed to add emergency contact');
      }

      const result = await response.json();
      const newContact: EmergencyContact = {
        ...contactData,
        id: result.id,
        isActive: true
      };

      setContacts(prev => [...prev, newContact]);
      toast({
        title: "Contact Added",
        description: `${contactData.name} has been added to your emergency contacts.`,
      });

      return newContact;
    } catch (error) {
      toast({
        title: "Failed to Add Contact",
        description: error instanceof Error ? error.message : "Unable to add emergency contact.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Load emergency contacts
  const loadEmergencyContacts = useCallback(async () => {
    try {
      const sessionId = localStorage.getItem('cybershe-session');
      if (!sessionId) {
        return;
      }

      const response = await fetch('/api/emergency-contacts', {
        headers: {
          'X-Session-ID': sessionId,
        },
      });

      if (response.ok) {
        const contactsData = await response.json();
        setContacts(contactsData.filter((c: any) => !c.error));
      }
    } catch (error) {
      console.warn('Failed to load emergency contacts:', error);
    }
  }, []);

  // Remove emergency contact
  const removeEmergencyContact = useCallback(async (contactId: string) => {
    try {
      const sessionId = localStorage.getItem('cybershe-session');
      if (!sessionId) {
        throw new Error('Session not found');
      }

      const response = await fetch(`/api/emergency-contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'X-Session-ID': sessionId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove emergency contact');
      }

      setContacts(prev => prev.filter(c => c.id !== contactId));
      toast({
        title: "Contact Removed",
        description: "Emergency contact has been removed.",
      });
    } catch (error) {
      toast({
        title: "Failed to Remove Contact",
        description: error instanceof Error ? error.message : "Unable to remove emergency contact.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Quick exit function
  const quickExit = useCallback(() => {
    // Clear sensitive data
    try {
      // Clear browser history
      if (window.history?.replaceState) {
        window.history.replaceState(null, '', 'https://www.weather.com');
      }
      
      // Navigate to safe site
      window.location.replace('https://www.weather.com');
    } catch (error) {
      // Fallback navigation
      window.location.href = 'https://www.weather.com';
    }
  }, []);

  return {
    // State
    isTriggering,
    contacts,
    lastAlert,
    
    // Actions
    triggerEmergencyAlert,
    addEmergencyContact,
    removeEmergencyContact,
    loadEmergencyContacts,
    getCurrentLocation,
    quickExit,
  };
}
