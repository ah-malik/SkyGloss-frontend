import { motion } from "motion/react";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { DistributorIcon } from "./CustomIcons";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { Footer } from "./Footer";
import { useNavigate } from "react-router";

export function DistributorLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = () => {
    navigate("/"); // Back to access selection
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);

    try {
      const response = await api.post('/auth/login', { email: username, password });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              navigate("/dashboard/distributor");
            }, 300);
            return 100;
          }
          return prev + 25;
        });
      }, 100);
    } catch (err: any) {
      setIsLoading(false);
      alert(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen geometric-bg flex flex-col">
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
          <span className="hidden sm:inline">Back to Access Selection</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </motion.div>

      <div className="flex-1 flex items-center justify-center p-4 pt-20 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >

          <Card className="skygloss-card p-8 rounded-2xl bg-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto rounded-lg bg-[#0EA0DC] flex items-center justify-center mb-6 shadow-[0_4px_16px_rgba(14,160,220,0.3)]"
            >
              <DistributorIcon className="text-white" />
            </motion.div>

            <div className="text-center mb-8">
              <h2 className="text-2xl text-[#272727] mb-2">Master Distributor Access</h2>
              <p className="text-[#666666]">Login to manage your global network</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-[#272727] mb-2">Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="pl-10 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] focus:ring-[#0EA0DC] rounded-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#272727] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pl-10 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] focus:ring-[#0EA0DC] rounded-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-[#0EA0DC]">Authenticating...</p>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={!username || !password || isLoading}
                className="w-full skygloss-button h-12"
              >
                {isLoading ? "Logging in..." : "Access Dashboard"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-[#0EA0DC] hover:underline transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-4 bg-[#0EA0DC]/10 rounded-lg border border-[#0EA0DC]/20"
          >
            <p className="text-xs text-[#0EA0DC]">
              <strong>Demo:</strong> Username: "distributor", Password: "demo123"
            </p>
          </motion.div>

        </motion.div>
      </div>

      <Footer />

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        userType="distributor"
      />
    </div>
  );
}
