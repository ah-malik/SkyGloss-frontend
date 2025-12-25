import { motion, AnimatePresence } from "motion/react";
import api from "../api/axios";
import { useState } from "react";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: "shop" | "distributor";
}

export function ForgotPasswordModal({ isOpen, onClose, userType }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err.response?.data?.message || 'Failed to send reset instructions.');
    }
  };

  const handleClose = () => {
    setEmail("");
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md"
            >
              <Card className="skygloss-card p-8 rounded-2xl bg-white relative">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-[#666666] hover:text-[#0EA0DC] transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {!isSubmitted ? (
                  <>
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-16 h-16 mx-auto rounded-full bg-[#0EA0DC]/10 flex items-center justify-center mb-6"
                    >
                      <Mail className="w-8 h-8 text-[#0EA0DC]" />
                    </motion.div>

                    {/* Title */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl text-[#272727] mb-2">
                        Reset Password
                      </h3>
                      <p className="text-sm text-[#666666]">
                        Enter your email address and we'll send you instructions to reset your password
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#272727] mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="pl-10 bg-white border-[#0EA0DC]/30 rounded-lg"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={!email || isSubmitting}
                        className="w-full skygloss-button h-12"
                      >
                        {isSubmitting ? "Sending..." : "Send Reset Instructions"}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        className="w-full text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    {/* Success State */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </motion.div>

                    <div className="text-center mb-6">
                      <h3 className="text-xl text-[#272727] mb-2">
                        Check Your Email
                      </h3>
                      <p className="text-sm text-[#666666] mb-4">
                        We've sent password reset instructions to:
                      </p>
                      <p className="text-sm text-[#0EA0DC] mb-4">
                        {email}
                      </p>
                      <p className="text-xs text-[#666666]">
                        Didn't receive the email? Check your spam folder or try again.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleClose}
                        className="w-full skygloss-button h-12"
                      >
                        Back to Login
                      </Button>

                      <Button
                        onClick={() => {
                          setIsSubmitted(false);
                          setEmail("");
                        }}
                        variant="ghost"
                        className="w-full text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                      >
                        Resend Email
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
