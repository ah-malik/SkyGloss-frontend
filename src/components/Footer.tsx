import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import skyglossLogo from "../assets/600x400.svg";
import signatureImage from "../assets/600x400.svg";

export function Footer() {
  const socialLinks = [
    { name: "Instagram", url: "#" },
    { name: "Facebook", url: "#" },
    { name: "X", url: "#" },
    { name: "TikTok", url: "#" },
    { name: "LinkedIn", url: "#" },
    { name: "YouTube", url: "#" },
  ];

  const supportLinks = [
    { name: "FAQs", url: "#" },
    { name: "Warranty", url: "#" },
    { name: "Contact Us", url: "#" },
  ];

  const companyLinks = [
    { name: "About", url: "#" },
    { name: "Blog", url: "#" },
    { name: "Careers", url: "#" },
  ];

  return (
    <footer className="bg-[#0EA0DC] text-white rounded-t-[32px] sm:rounded-t-[48px]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        {/* Top Section - Social Media on left, Signature on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Social Media */}
          <div>
            <h3 className="mb-4 sm:mb-6">Social Media</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200"
                >
                  <span className="text-sm sm:text-base">{link.name}</span>
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Signature/Handwriting */}
          <div className="flex items-center justify-center lg:justify-end">
            <img 
              src={signatureImage} 
              alt="Signature" 
              className="w-full max-w-md h-auto opacity-90"
            />
          </div>
        </div>

        {/* Middle Section - Mail, Support, Company */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Mail Section */}
          <div>
            <h3 className="mb-4 sm:mb-6">Mail</h3>
            <a
              href="mailto:info@skygloss.com"
              className="text-sm sm:text-base hover:opacity-80 transition-opacity duration-200 block mb-6 underline"
            >
              info@skygloss.com
            </a>
            <Button
              variant="secondary"
              className="bg-white text-[#0EA0DC] hover:bg-white/90 rounded-full px-6 py-2 group transition-all duration-200"
            >
              <span>Partners Portal</span>
              <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Button>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="mb-4 sm:mb-6">Support</h3>
            <div className="flex flex-col gap-3">
              {supportLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="text-sm sm:text-base hover:opacity-80 transition-opacity duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="mb-4 sm:mb-6">Company</h3>
            <div className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="text-sm sm:text-base hover:opacity-80 transition-opacity duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/30 mb-4"></div>
      </div>

      {/* Bottom Section - Full Width Logo */}
      <div className="w-full pb-8 -mt-4">
        {/* SkyGloss Logo - 100% Width */}
        <div className="w-full mb-4">
          <img 
            src={skyglossLogo} 
            alt="SkyGloss" 
            className="w-full h-auto scale-150 sm:scale-100"
          />
        </div>

        {/* Legal Links */}
        <div className="flex items-center justify-end gap-4 text-sm text-white/80 px-6 sm:px-8 lg:px-12">
          <a href="#" className="hover:text-white transition-colors duration-200">
            Term & Conditions
          </a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors duration-200">
            Privacy and Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
