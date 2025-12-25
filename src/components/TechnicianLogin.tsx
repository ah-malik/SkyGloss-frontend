import { motion } from "motion/react";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { ArrowLeft, Globe, Key } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TechnicianIcon } from "./CustomIcons";
import { ContactDistributorModal } from "./ContactDistributorModal";
import { useNavigate } from "react-router";

export function TechnicianLogin() {
  const navigate = useNavigate();

  const [accessCode, setAccessCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Japan",
    "Other"
  ];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = () => {
    navigate("/"); // Back to landing page
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);

    try {
      const response = await api.post('/auth/login/access-code', {
        accessCode: accessCode.trim(),
        country
      });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Show progress for better UX
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              navigate("/dashboard/technician");
            }, 300);
            return 100;
          }
          return prev + 25;
        });
      }, 100);
    } catch (err: any) {
      setIsLoading(false);
      alert(err.response?.data?.message || 'Access denied. Please check your code.');
    }
  };

  return (
    <div className="min-h-screen geometric-bg flex items-center justify-center p-4 pt-20 sm:pt-24">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-20 sm:top-24 left-4 sm:left-6 z-40"
      >
        <Button
          variant="ghost"
          onClick={handleBack}
          className="group text-[#272727] hover:text-[#0EA0DC] hover:bg-white hover:shadow-[0_0_20px_rgba(14,160,220,0.25)] transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-md border-2 border-[#0EA0DC]/30 hover:border-[#0EA0DC] rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 gap-2"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Login Card */}
        <Card className="skygloss-card p-8 rounded-2xl bg-white shadow-xl">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-16 h-16 mx-auto rounded-lg bg-[#0EA0DC] flex items-center justify-center mb-6 shadow-[0_4px_16px_rgba(14,160,220,0.3)]"
          >
            <TechnicianIcon className="text-white" />
          </motion.div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#272727] mb-2">Technician Access</h2>
            <p className="text-[#666666]">Select your country and enter your code</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Country Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#272727] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0EA0DC]" />
                  Select Country
                </label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-full bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] focus:ring-[#0EA0DC] rounded-lg">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Access Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#272727] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#0EA0DC]" />
                  Access Code
                </label>
                <Input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter 8-digit code"
                  className="w-full bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] focus:ring-[#0EA0DC] rounded-lg"
                  disabled={isLoading}
                />
                <p className="text-xs text-[#666666]">
                  Tied to your certification issued by your distributor
                </p>
              </div>
            </div>

            {/* Progress */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-[#0EA0DC]">
                  Verifying access...
                </p>
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={!accessCode.trim() || isLoading}
              className="w-full skygloss-button h-12"
            >
              {isLoading ? "Verifying..." : "Access Dashboard"}
            </Button>
          </form>

          {/* Help */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#666666]">
              Don't have an access code?{" "}
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="text-[#0EA0DC] hover:underline transition-colors duration-200"
              >
                Contact your distributor
              </button>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-[#0EA0DC]/10 rounded-lg border border-[#0EA0DC]/20"
        >
          <p className="text-xs text-[#0EA0DC]">
            <strong>Demo:</strong> Use code "12345678" to access the dashboard
          </p>
        </motion.div>
      </motion.div>

      {/* Contact Distributor Modal */}
      <ContactDistributorModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}
