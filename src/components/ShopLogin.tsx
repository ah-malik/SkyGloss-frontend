import { motion } from "motion/react";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Lock, Globe, Key } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ShopIcon } from "./CustomIcons";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { Footer } from "./Footer";
import { useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export function ShopLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [country, setCountry] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Request Certification Form State
  const [activeTab, setActiveTab] = useState("login");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>("");
  const [websiteSocialMedia, setWebsiteSocialMedia] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Australia",
    "Japan",
    "Mexico",
    "Brazil",
    "Argentina",
    "Other"
  ];

  const isUSA = country === "United States";

  const handleBack = () => {
    navigate("/"); // Back to landing page
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);

    try {
      let response;
      if (isUSA) {
        response = await api.post('/auth/login', { email: username, password });
      } else {
        response = await api.post('/auth/login/access-code', {
          accessCode: accessCode.trim(),
          country: country
        });
      }

      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setUser(user);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              navigate("/dashboard/shop");
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

  const handleRequestCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/shop-requests', {
        shopName: businessName,
        contactName,
        email,
        phone,
        website: websiteSocialMedia,
        country
      });
      setRequestSubmitted(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit request.');
    }
  };

  const canSubmitLogin = isUSA
    ? (username && password && country)
    : (accessCode.trim() && country);

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

          <Card className="skygloss-card rounded-2xl bg-white py-8 px-8 my-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto rounded-lg bg-[#0EA0DC] flex items-center justify-center mb-6 shadow-[0_4px_16px_rgba(14,160,220,0.3)]"
            >
              <ShopIcon className="text-white" />
            </motion.div>

            <div className="text-center mb-8">
              <h2 className="text-2xl text-[#272727] mb-2">Certified Shop Access</h2>
              {activeTab === "request" && (
                <p className="text-[#666666]">Interested in being SkyGloss Certified?</p>
              )}
              <p className="text-[#666666]">Fill out the details below.</p>
            </div>

            <Tabs defaultValue="login" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white rounded-xl p-1.5 border-2 border-[#0EA0DC] shadow-[0_0_10px_rgba(14,160,220,0.15)] h-auto">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="request"
                  className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Request Access
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Country Selection */}
                  <div>
                    <label className="block text-sm text-[#272727] mb-2">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666] z-10 pointer-events-none" />
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="pl-10 bg-white border-[#0EA0DC]/30 rounded-lg">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Conditional Fields based on Country */}
                  {country && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      {isUSA ? (
                        <>
                          <div>
                            <label className="block text-sm text-[#272727] mb-2">Username</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                              <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="pl-10 bg-white border-[#0EA0DC]/30 rounded-lg"
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
                                className="pl-10 bg-white border-[#0EA0DC]/30 rounded-lg"
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="block text-sm text-[#272727] mb-2">Certificate Number</label>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                            <Input
                              type="text"
                              value={accessCode}
                              onChange={(e) => setAccessCode(e.target.value)}
                              placeholder="Enter your access code"
                              className="pl-10 bg-white border-[#0EA0DC]/30 rounded-lg"
                              disabled={isLoading}
                              maxLength={8}
                            />
                          </div>
                          <p className="text-xs text-[#666666] mt-1">
                            Enter your 8-digit certification code
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

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

                  <Button type="submit" disabled={!canSubmitLogin || isLoading} className="w-full skygloss-button h-12">
                    {isLoading ? "Logging in..." : "Login to Shop"}
                  </Button>

                  {isUSA && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-[#0EA0DC] hover:underline transition-colors duration-200"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </form>
              </TabsContent>

              <TabsContent value="request">
                {!requestSubmitted ? (
                  <form onSubmit={handleRequestCertification} className="space-y-4">
                    <p className="text-sm text-[#666666] mb-4">
                      Once you submit your details, someone will follow up on next steps.
                    </p>

                    <Input required placeholder="Business Name" className="bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] focus:ring-[#0EA0DC] rounded-lg" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                    <Input required placeholder="Contact Name" className="bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] focus:ring-[#0EA0DC] rounded-lg" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                    <Input required type="email" placeholder="Email" className="bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] focus:ring-[#0EA0DC] rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <div className="space-y-2">
                      <label className="block text-sm text-[#272727]">Phone Number</label>
                      <div className="skygloss-phone-input-wrapper">
                        <PhoneInput
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={setPhone}
                          defaultCountry="US"
                          international
                          withCountryCallingCode
                          className="skygloss-phone-input"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666] z-10 pointer-events-none" />
                      <Select value={country} onValueChange={setCountry} required>
                        <SelectTrigger className="pl-10 bg-white border-[#0EA0DC]/30 rounded-lg">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Input required type="url" placeholder="Website/Social Media" className="bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] focus:ring-[#0EA0DC] rounded-lg" value={websiteSocialMedia} onChange={(e) => setWebsiteSocialMedia(e.target.value)} />

                    <Button type="submit" className="w-full skygloss-button h-12">Submit Request</Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg text-[#272727] mb-2">Request Submitted!</h3>
                    <p className="text-[#666666]">
                      Your certification request has been submitted for approval. You'll receive an email once processed.
                    </p>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </Card>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 p-4 bg-[#0EA0DC]/10 rounded-lg border border-[#0EA0DC]/20">
            <p className="text-xs text-[#0EA0DC]">
              <strong>Demo USA:</strong> Username: "shop123", Password: "demo123"<br />
              <strong>Demo International:</strong> Access Code: "12345678"
            </p>
          </motion.div>

        </motion.div>
      </div>

      <Footer />

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        userType="shop"
      />
    </div>
  );
}
