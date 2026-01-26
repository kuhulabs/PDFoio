import { Coffee } from "lucide-react";
import { useState } from "react";

interface BuyMeCoffeeButtonProps {
  username?: string;
  className?: string;
  variant?: "default" | "outline" | "minimal";
  showLabel?: boolean;
  trackClick?: boolean;
}

export function BuyMeCoffeeButton({
  username = "kuhulabsq",
  className = "",
  variant = "default",
  showLabel = true,
  trackClick = false,
}: BuyMeCoffeeButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const url = `https://www.buymeacoffee.com/${username}`;

  const variants = {
    default:
      "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white shadow-sm",
    outline:
      "border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950",
    minimal:
      "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950",
  };

  const handleClick = () => {
    if (trackClick) {
      setIsClicked(true);
      
      // Analytics tracking (optional)
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('Buy Me Coffee Click');
      }

      // Reset after 2 seconds
      setTimeout(() => setIsClicked(false), 2000);
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Support us by buying a coffee (opens in new tab)"
      className={`
        inline-flex items-center gap-2 px-6 py-2 
        text-sm font-medium rounded-lg 
        transition-all duration-200
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${isClicked ? "bg-green-500 text-white" : variants[variant]}
        ${className}
      `}
    >
      <Coffee
        className={`h-4 w-4 ${isClicked ? "animate-bounce" : ""}`}
        aria-hidden="true"
      />
      {showLabel && (
        <span>{isClicked ? "Thank you! ❤️" : "Buy me a coffee"}</span>
      )}
    </a>
  );
}

// Icon-only variant
export function BuyMeCoffeeIcon({
  username = "kuhulabsq",
  className = "",
}: {
  username?: string;
  className?: string;
}) {
  return (
    <BuyMeCoffeeButton
      username={username}
      className={`px-3 py-3 ${className}`}
      showLabel={false}
      variant="default"
    />
  );
}