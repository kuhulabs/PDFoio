// 1. FIXED: 'import' must be lowercase
import { Link } from "wouter";

export function ToolFooter() {
  return (
    // 2. OPTIMIZATION: Removed redundant 'dark:bg-gray-900'
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
            PDFo is a free online PDF tool by Kuhu Labs. We respect your privacy—files are processed securely and automatically deleted after processing.
          </p>
          
          {/* Company Links */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 mb-6">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm" data-testid="link-about">About Us</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm" data-testid="link-privacy">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm" data-testid="link-terms">Terms of Use</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm" data-testid="link-contact">Contact</Link>
            
            {/* External Link */}
            <a 
              href="https://buymeacoffee.com/pravaah" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-yellow-400 transition-colors text-sm font-medium" // Added yellow hover for coffee link
              data-testid="link-support"
            >
              Support Us
            </a>
          </div>
          
          <div className="mt-8 border-t border-gray-800 pt-8">
            <p className="text-gray-500 text-sm">
              © 2026 PDFo | Made with ❤️ by Kuhu Labs
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Proudly Made in India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
