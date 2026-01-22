import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import skyglossLogo from "../assets/skyglossLogoFooter.svg";
import signatureImage from "../assets/Signature.svg";

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Left Column - Social Media */}
          <div>
            <h3 className="mb-4 sm:mb-6 text-xl font-bold underline">Social Media</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  style={{ color: "#bfe7f6" }}
                  className=" flex items-center gap-1 hover:opacity-80 transition-opacity duration-200"
                >
                  <span className="text-md sm:text-lg">{link.name}</span>
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>
          </div>
          {/* Mail Section */}
          <div  >
            <h3 className="mb-4 sm:mb-6 text-xl font-bold underline">Mail</h3>
            <a
              href="mailto:info@skygloss.com"
              style={{ color: "#bfe7f6" }}
              className="text-md sm:text-lg hover:opacity-80 transition-opacity duration-200 block mb-6 underline"
            >
              info@skygloss.com
            </a>

          </div>

          {/* Support Section */} {/* Company Section */}
          <div className="flex flex-flex gap-8">

            <div>
              <h3 className="mb-4 sm:mb-6 text-xl font-bold underline">Support</h3>
              <div className="flex flex-col gap-3">
                {supportLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    style={{ color: "#bfe7f6" }}
                    className="text-md sm:text-lg hover:opacity-80 transition-opacity duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div>

              <h3 className="mb-4 sm:mb-6 text-xl font-bold underline">Company</h3>
              <div className="flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    style={{ color: "#bfe7f6" }}
                    className="text-md sm:text-lg hover:opacity-80 transition-opacity duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
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

        <Button
          variant="secondary"
          className="bg-white text-[#0EA0DC] hover:bg-white/90 rounded-full px-6 py-2 group transition-all duration-200"
        >
          <span>Warrenty Portal</span>
          <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </Button>
        {/* Divider */}
        <div className="border-t border-white/30 mb-4 hidden"></div>
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
