import { motion } from "motion/react";
import { useState } from "react";
import { HelpCircle, Mail, MessageSquare, Phone, Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import api from "../api/axios";
import { ChatWidget } from "./ChatWidget";

const faqs = [
  {
    category: "Product",
    question: "How long does the clear coating last?",
    answer: "SkyGloss clear coatings provide protection ranging from 3 to 5+ years depending on the product line and maintenance. Our Forever line offers lifetime protection with proper care."
  },
  {
    category: "Application",
    question: "What temperature should I apply the coating at?",
    answer: "Apply SkyGloss products in a controlled environment between 15-25°C (59-77°F). Avoid direct sunlight and ensure the surface temperature is within this range."
  },
  {
    category: "Technical",
    question: "Can I apply over existing wax or sealant?",
    answer: "No, all previous waxes, sealants, and coatings must be completely removed before application. Use a panel wipe or IPA solution to ensure a clean surface."
  },
  {
    category: "Order",
    question: "What is your return policy?",
    answer: "Unopened products can be returned within 30 days of purchase. Contact your distributor for specific return procedures."
  },
  {
    category: "Training",
    question: "How do I access the training platform?",
    answer: "Training access is provided upon certification. Use your technician access code to log in to the portal and access all training modules."
  },
  {
    category: "Technical",
    question: "How do I fix high spots or streaking?",
    answer: "If you notice high spots within 1-2 minutes of application, buff immediately with a clean microfiber towel. For cured high spots, polish with a fine polish and reapply."
  }
];

interface SupportPageProps {
  onBack?: () => void;
}

export function SupportPage({ onBack }: SupportPageProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Ticket Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [message, setMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/support', {
        name,
        email,
        userType,
        issueCategory,
        message
      });
      setTicketSubmitted(true);
      toast.success("Support ticket submitted!", {
        description: "Our team will contact you within 24 hours"
      });
    } catch (error) {
      console.error("Failed to submit ticket:", error);
      toast.error("Failed to submit ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category.toLowerCase() === selectedCategory;
    const matchesSearch = searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["all", ...Array.from(new Set(faqs.map(f => f.category.toLowerCase())))];

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20">
            Support Center
          </Badge>
          <h1 className="text-4xl text-[#272727] mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Get quick answers from our FAQ or submit a support ticket
          </p>
        </motion.div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="skygloss-card p-6 rounded-2xl text-center h-full flex flex-col">
              <Mail className="w-10 h-10 mx-auto mb-3 text-[#0EA0DC]" />
              <h3 className="text-[#272727] mb-2">Email Support</h3>
              <p className="text-sm text-[#666666] mb-4 flex-grow">support@skygloss.com</p>
              <Button
                size="sm"
                variant="outline"
                className="border-[#0EA0DC]/30 text-[rgb(255,255,255)] hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                onClick={() => window.location.href = "mailto:support@skygloss.com"}
              >
                Send Email
              </Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="skygloss-card p-6 rounded-2xl text-center h-full flex flex-col">
              <Phone className="w-10 h-10 mx-auto mb-3 text-[#0EA0DC]" />
              <h3 className="text-[#272727] mb-4">Phone Support</h3>
              <div className="space-y-3 mb-4 flex-grow">
                <div>
                  <p className="text-xs text-[#0EA0DC] mb-1">Technical Support</p>
                  <a
                    href="tel:+13604414886"
                    className="text-sm text-[#0EA0DC] hover:underline transition-all"
                  >
                    +1 (360) 441-4886
                  </a>
                </div>
                <div>
                  <p className="text-xs text-[#0EA0DC] mb-1">Ordering Support</p>
                  <a
                    href="tel:+16027844113"
                    className="text-sm text-[#0EA0DC] hover:underline transition-all"
                  >
                    +1 (602) 784-4113
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="skygloss-card p-6 rounded-2xl text-center h-full flex flex-col">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-[#0EA0DC]" />
              <h3 className="text-[#272727] mb-2">Live Chat</h3>
              <p className="text-sm text-[#666666] mb-4 flex-grow">Average response: 2 min</p>
              <Button
                size="sm"
                onClick={() => setShowChat(true)}

                className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)]"
              >
                Start Chat

              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Support Ticket Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="skygloss-card p-8 rounded-2xl">
            <div className="text-center mb-6">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-[#0EA0DC]" />
              <h3 className="text-xl text-[#272727]">
                Submit a Ticket
              </h3>
            </div>

            {!ticketSubmitted ? (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#272727] mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="border-[#0EA0DC]/30 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#272727] mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="border-[#0EA0DC]/30 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#272727] mb-2">
                    User Type
                  </label>
                  <Select value={userType} onValueChange={setUserType} required>
                    <SelectTrigger className="border-[#0EA0DC]/30 rounded-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="shop">Shop</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-[#272727] mb-2">
                    Issue Category
                  </label>
                  <Select value={issueCategory} onValueChange={setIssueCategory} required>
                    <SelectTrigger className="border-[#0EA0DC]/30 rounded-lg">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="login">Login Issue</SelectItem>
                      <SelectItem value="product">Product Question</SelectItem>
                      <SelectItem value="training">Training Access</SelectItem>
                      <SelectItem value="order">Order Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-[#272727] mb-2">
                    Message
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue..."
                    className="border-[#0EA0DC]/30 rounded-lg min-h-[120px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-11 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Ticket"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0EA0DC]/10 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-[#0EA0DC]" />
                </div>
                <h4 className="text-lg text-[#272727] mb-2">
                  Ticket Submitted!
                </h4>
                <p className="text-sm text-[#666666] mb-4">
                  Our support team will contact you within 24 hours.
                </p>
                <Button
                  onClick={() => setTicketSubmitted(false)}
                  variant="outline"
                  size="sm"
                  className="border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                >
                  Submit Another
                </Button>
              </div>
            )}

          </Card>

        </motion.div>
        {/* </motion.div> */}
      </div>
      {/* Live Chat Widget */}
      {showChat && (
        <ChatWidget
          userName="Guest User"
          userEmail="guest@skygloss.com"
          userType="guest"
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

