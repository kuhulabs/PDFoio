// 1. FIXED: 'import' should be lowercase
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSubscriberSchema, type InsertSubscriber } from "@shared/schema";
import { useSubscribeToNewsletter } from "@/hooks/use-newsletter";
import { FileText, Send } from "lucide-react";
// Agar aap React Router use kar rahe hain to yeh line uncomment karein:
// import { Link } from "react-router-dom"; 

export function Footer() {
  const { mutate, isPending } = useSubscribeToNewsletter();
  
  const form = useForm<InsertSubscriber>({
    resolver: zodResolver(insertSubscriberSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: InsertSubscriber) => {
    mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  // Helper helper for links to avoid code repetition (Optional but clean)
  const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <li>
      {/* Agar real routing hai to <a> ki jagah <Link to={href}> use karein */}
      <a 
        href={href} 
        className="hover:text-blue-400 transition-colors cursor-pointer"
        onClick={(e) => href === '#' && e.preventDefault()} // Prevents scroll jump
      >
        {children}
      </a>
    </li>
  );

  return (
    <footer className="bg-slate-900 text-slate-200 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                PDFMaster
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The ultimate toolkit for managing your documents efficiently. 
              Convert, edit, and sign PDFs securely in the cloud.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
              <FooterLink href="#">Enterprise</FooterLink>
              <FooterLink href="#">API</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-4">
              Get the latest tips and updates delivered to your inbox.
            </p>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="relative">
                {/* 2. FIXED: Added aria-label for Accessibility */}
                <input
                  {...form.register("email")}
                  type="email" // Explicitly setting type
                  placeholder="Enter your email"
                  aria-label="Email address for newsletter"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-10" // added pr-10 so text doesn't go under button
                />
                <button
                  type="submit"
                  disabled={isPending}
                  aria-label="Subscribe" // 3. FIXED: Button needs label because it only has an icon
                  className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.email && (
                <p className="text-red-400 text-xs pl-1">{form.formState.errors.email.message}</p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2024 PDFMaster Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Cookie Policy</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
