import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Menu } from "lucide-react";
import EmergencyButton from "@/components/emergency/emergency-button";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Tools", hash: "#tools" },
    { href: "/resources", label: "Resources" },
    { href: "/resources", label: "Support", hash: "#support" },
    { href: "/", label: "About", hash: "#about" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm" data-testid="header">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer" data-testid="logo">
              <Shield className="text-primary text-2xl" />
              <span className="text-xl font-bold text-primary">CyberSHE</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href + (item.hash || '')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </a>
            ))}
          </div>
          
          {/* Emergency Button - Always Visible */}
          <div className="flex items-center space-x-4">
            <EmergencyButton />
            
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <a 
                      key={item.label}
                      href={item.href + (item.hash || '')}
                      className="text-muted-foreground hover:text-primary transition-colors p-2"
                      data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
