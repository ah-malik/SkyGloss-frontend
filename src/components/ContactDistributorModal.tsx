import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { User, Mail, Phone, Building2, MessageSquare, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";

interface ContactDistributorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactDistributorModal({ isOpen, onClose }: ContactDistributorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: ""
    });
    setIsSubmitted(false);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name && formData.email && formData.message;

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-lg my-8"
            >
              <Card className="skygloss-card sm:p-10 rounded-2xl sm:rounded-3xl bg-white relative px-[40px] py-[89px] my-[50px] mx-[0px]">
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
                      className="w-16 h-16 mx-auto rounded-full bg-[#0EA0DC]/10 flex items-center justify-center mb-6 sm:mb-8"
                    >
                      <MessageSquare className="w-8 h-8 text-[#0EA0DC]" />
                    </motion.div>

                    {/* Title */}
                    <div className="text-center mb-8 sm:mb-10">
                      <h3 className="text-xl sm:text-2xl text-[#272727] mb-3">
                        Request Technician Access Code
                      </h3>
                      <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                        Fill out this form and your assigned master distributor will contact you with your access code
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                      <div>
                        <label className="block text-sm sm:text-base text-[#272727] mb-2.5">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                          <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Enter your full name"
                            className="pl-10 h-12 bg-white border-[#0EA0DC]/30 rounded-xl"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base text-[#272727] mb-2.5">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="your.email@example.com"
                            className="pl-10 h-12 bg-white border-[#0EA0DC]/30 rounded-xl"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base text-[#272727] mb-2.5">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="pl-10 h-12 bg-white border-[#0EA0DC]/30 rounded-xl"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base text-[#272727] mb-2.5">
                          Company/Shop Name
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                          <Input
                            type="text"
                            value={formData.company}
                            onChange={(e) => handleChange("company", e.target.value)}
                            placeholder="Enter your company name"
                            className="pl-10 h-12 bg-white border-[#0EA0DC]/30 rounded-xl"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base text-[#272727] mb-2.5">
                          Message *
                        </label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          placeholder="Please provide details about your certification request, including your current certification status and distributor information if known..."
                          className="bg-white border-[#0EA0DC]/30 rounded-xl min-h-[140px] resize-none"
                          required
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-[#666666] mt-2">
                          Include any relevant certification numbers or distributor contact information
                        </p>
                      </div>

                      <div className="bg-[#0EA0DC]/5 border border-[#0EA0DC]/20 rounded-xl p-4">
                        <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                          <strong className="text-[#0EA0DC]">Note:</strong> Your request will be forwarded to the appropriate master distributor in your region. You should receive a response within 24-48 hours.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className="w-full skygloss-button h-12"
                      >
                        {isSubmitting ? "Sending Request..." : "Submit Request"}
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
                        Request Submitted Successfully!
                      </h3>
                      <p className="text-sm text-[#666666] mb-4">
                        Your access code request has been sent to your regional master distributor.
                      </p>
                      <div className="bg-[#0EA0DC]/5 border border-[#0EA0DC]/20 rounded-lg p-4 mb-4">
                        <p className="text-sm text-[#272727] mb-2">
                          <strong>What happens next?</strong>
                        </p>
                        <ul className="text-sm text-[#666666] space-y-2 text-left">
                          <li className="flex items-start gap-2">
                            <span className="text-[#0EA0DC] mt-1">•</span>
                            <span>Your distributor will review your request</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#0EA0DC] mt-1">•</span>
                            <span>You'll receive an email with your 8-digit access code</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#0EA0DC] mt-1">•</span>
                            <span>Use the code to access training materials and product catalog</span>
                          </li>
                        </ul>
                      </div>
                      <p className="text-xs text-[#666666]">
                        Expected response time: <strong className="text-[#0EA0DC]">24-48 hours</strong>
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
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            company: "",
                            message: ""
                          });
                        }}
                        variant="ghost"
                        className="w-full text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                      >
                        Submit Another Request
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
