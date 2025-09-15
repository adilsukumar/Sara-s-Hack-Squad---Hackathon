import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Twitter, Facebook, Instagram } from "lucide-react";
import EmergencyButton from "@/components/emergency/emergency-button";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16" data-testid="footer">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="text-2xl" />
              <span className="text-xl font-bold">CyberSHE</span>
            </div>
            <p className="text-primary-foreground/80 mb-6" data-testid="text-footer-description">
              Empowering women with digital privacy and security tools for online safety.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-twitter">
                <Twitter className="text-xl" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-facebook">
                <Facebook className="text-xl" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" data-testid="link-instagram">
                <Instagram className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-tools-heading">Tools</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><Link href="/privacy-audit" className="hover:text-primary-foreground transition-colors" data-testid="link-privacy-audit">Privacy Audit</Link></li>
              <li><Link href="/digital-footprint" className="hover:text-primary-foreground transition-colors" data-testid="link-digital-footprint">Digital Footprint</Link></li>
              <li><Link href="/harassment-detection" className="hover:text-primary-foreground transition-colors" data-testid="link-harassment-detection">Harassment Detection</Link></li>
              <li><Link href="/security-checklist" className="hover:text-primary-foreground transition-colors" data-testid="link-security-checklist">Security Checklist</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-support-heading">Support</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors" data-testid="link-help">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors" data-testid="link-contact">Contact Support</a></li>
              <li><Link href="/resources" className="hover:text-primary-foreground transition-colors" data-testid="link-crisis">Crisis Resources</Link></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors" data-testid="link-community">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-emergency-heading">Emergency</h4>
            <div className="space-y-4">
              <EmergencyButton className="w-full" />
              <Button 
                variant="outline" 
                className="w-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => window.location.replace('https://www.weather.com')}
                data-testid="button-footer-quick-exit"
              >
                Quick Exit
              </Button>
              <p className="text-xs text-primary-foreground/60" data-testid="text-esc-hint">Press ESC anytime for quick exit</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/80">
          <p data-testid="text-copyright">&copy; 2025 CyberSHE. Built with privacy and safety in mind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
