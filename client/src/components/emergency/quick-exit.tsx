import { useEffect } from "react";

export default function QuickExit() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Quick exit - redirect to a safe site and clear history
        window.location.replace('https://www.weather.com');
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Show indicator briefly when component mounts
    const indicator = document.createElement('div');
    indicator.className = 'quick-exit-indicator visible';
    indicator.textContent = 'Press ESC for quick exit';
    document.body.appendChild(indicator);

    // Hide indicator after 3 seconds
    setTimeout(() => {
      if (document.body.contains(indicator)) {
        indicator.classList.remove('visible');
        setTimeout(() => {
          if (document.body.contains(indicator)) {
            document.body.removeChild(indicator);
          }
        }, 300);
      }
    }, 3000);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (document.body.contains(indicator)) {
        document.body.removeChild(indicator);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}
