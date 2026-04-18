import { motion } from "motion/react";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

export function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#0EA0DC] to-[#0c80b3] flex items-center justify-center shadow-[0_0_40px_rgba(14,160,220,0.3)]"
        >
          <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
        </motion.div>

        {/* Main Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl text-[#272727] mb-4"
        >
          Thank you for your request
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-xl text-[#666666] mb-8"
        >
          Our team is processing your order and will contact you shortly.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] hover:bg-[#0c80b3] px-8 py-6 rounded-lg transition-all duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
