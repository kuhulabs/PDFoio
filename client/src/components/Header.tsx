// 1. FIXED: 'import' should be lowercase
import { Link, useLocation } from "wouter";
import { useState } from "react"; // Added for handling mobile menu state
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false); // 2. FIXED: State to control mobile menu

  // 3. IMPROVEMENT: Centralized navigation items
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/api", label: "API" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* Replaced inline styles with Tailwind classes for better performance */}
            <img
              src="/logo.webp"
              alt="PDFo - Free Online PDF Tools Home"
              width={120}
              height={40}
              className="w-[120px] h-[40px] object-contain"
              loading="eager"
              decoding="async"
              {...({ fetchpriority: "high" } as Record<string, string>)}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                  location === item.href ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-600 dark:text-gray-300"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white dark:bg-gray-800">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Access all pages and user account options
                </SheetDescription>
                <div className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className={`text-lg font-medium transition-colors ${
                        location === item.href 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                      // 4. FIXED: Close menu when link is clicked
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
