import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Globe,
  DollarSign,
  CreditCard,
  Palette,
  Languages,
  Rocket,
  CheckCircle,
  Settings,
  Code,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface PortalConfig {
  // Step 1: Base Portal
  portalName: string;
  subdomain: string;
  region: string;
  templateType: string;

  // Step 2: Branding
  primaryColor: string;
  secondaryColor: string;
  language: string;
  currency: string;
  currencySymbol: string;
  timezone: string;

  // Step 3: Payment
  paymentGateway: string;
  merchantId: string;
  apiKey: string;
  webhookUrl: string;
}

interface PortalCloningWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" }
];

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" }
];

const paymentGateways = [
  { id: "stripe", name: "Stripe", description: "Global payment processing" },
  { id: "paypal", name: "PayPal", description: "Worldwide payment solution" },
  { id: "mercadopago", name: "MercadoPago", description: "Latin America focused" },
  { id: "square", name: "Square", description: "US and Canada" },
  { id: "adyen", name: "Adyen", description: "European markets" }
];

export function PortalCloningWizard({ onClose, onComplete }: PortalCloningWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [config, setConfig] = useState<PortalConfig>({
    portalName: "",
    subdomain: "",
    region: "",
    templateType: "full",
    primaryColor: "#0EA0DC",
    secondaryColor: "#272727",
    language: "en",
    currency: "USD",
    currencySymbol: "$",
    timezone: "America/New_York",
    paymentGateway: "",
    merchantId: "",
    apiKey: "",
    webhookUrl: ""
  });

  const updateConfig = (field: keyof PortalConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!config.portalName || !config.subdomain || !config.region) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!config.language || !config.currency) {
        toast.error("Please select language and currency");
        return;
      }
    } else if (currentStep === 3) {
      if (!config.paymentGateway) {
        toast.error("Please select a payment gateway");
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsProcessing(true);

    // Simulate portal cloning process
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Portal cloned successfully!", {
        description: `${config.portalName} is ready at ${config.subdomain}.skygloss.com`
      });
      onComplete();
    }, 3000);
  };

  const generateSubdomain = () => {
    if (config.portalName) {
      const subdomain = config.portalName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      updateConfig("subdomain", subdomain);
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8 pt-20 md:pt-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0EA0DC] to-[#0B7FB3] flex items-center justify-center shadow-lg">
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl text-[#272727]">Clone Portal</h1>
                <p className="text-xs sm:text-sm text-[#666666]">Step {currentStep} of 3</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-[#0EA0DC]/30 text-[#666666] hover:bg-gray-50 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-3 rounded-full" />
          </div>

          {/* Steps Indicator */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {[
              { num: 1, title: "Clone Base Portal", icon: Copy },
              { num: 2, title: "Customize Branding", icon: Palette },
              { num: 3, title: "Connect Payment", icon: CreditCard }
            ].map((step) => (
              <div
                key={step.num}
                className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${currentStep === step.num
                  ? "border-[#0EA0DC] bg-[#0EA0DC]/5"
                  : currentStep > step.num
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                  }`}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${currentStep === step.num
                      ? "bg-[#0EA0DC] text-white"
                      : currentStep > step.num
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-[#666666]"
                      }`}
                  >
                    {currentStep > step.num ? (
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <step.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm text-[#272727] text-center sm:text-left hidden sm:block">{step.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="skygloss-card p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0EA0DC]/10 flex items-center justify-center">
                    <Copy className="w-6 h-6 text-[#0EA0DC]" />
                  </div>
                  <div>
                    <h2 className="text-[#272727]">Clone Base Portal</h2>
                    <p className="text-sm text-[#666666]">Start with SkyGloss template</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Portal Name *</Label>
                    <Input
                      value={config.portalName}
                      onChange={(e) => updateConfig("portalName", e.target.value)}
                      onBlur={generateSubdomain}
                      placeholder="e.g., SkyGloss Brazil"
                      className="rounded-xl border-[#0EA0DC]/30"
                    />
                    <p className="text-xs text-[#666666] mt-2">
                      This will be displayed as the main title of your portal
                    </p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Subdomain *</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={config.subdomain}
                        onChange={(e) => updateConfig("subdomain", e.target.value)}
                        placeholder="brazil"
                        className="rounded-xl border-[#0EA0DC]/30"
                      />
                      <span className="text-[#666666] whitespace-nowrap">.skygloss.com</span>
                    </div>
                    <p className="text-xs text-[#666666] mt-2">
                      Your portal URL will be: {config.subdomain || "your-subdomain"}.skygloss.com
                    </p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Target Region *</Label>
                    <Select value={config.region} onValueChange={(value) => updateConfig("region", value)}>
                      <SelectTrigger className="rounded-xl border-[#0EA0DC]/30">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="south-america">South America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="oceania">Oceania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Template Type</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => updateConfig("templateType", "full")}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${config.templateType === "full"
                          ? "border-[#0EA0DC] bg-[#0EA0DC]/5"
                          : "border-gray-200 hover:border-[#0EA0DC]/50"
                          }`}
                      >
                        <Settings className="w-6 h-6 text-[#0EA0DC] mb-2" />
                        <h4 className="text-sm text-[#272727] mb-1">Full Portal</h4>
                        <p className="text-xs text-[#666666]">
                          Complete portal with all features (Technician, Shop, Distributor)
                        </p>
                      </button>
                      <button
                        onClick={() => updateConfig("templateType", "shop-only")}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${config.templateType === "shop-only"
                          ? "border-[#0EA0DC] bg-[#0EA0DC]/5"
                          : "border-gray-200 hover:border-[#0EA0DC]/50"
                          }`}
                      >
                        <Globe className="w-6 h-6 text-[#0EA0DC] mb-2" />
                        <h4 className="text-sm text-[#272727] mb-1">Shop Only</h4>
                        <p className="text-xs text-[#666666]">
                          E-commerce focused for retail shops only
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="skygloss-card p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0EA0DC]/10 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-[#0EA0DC]" />
                  </div>
                  <div>
                    <h2 className="text-[#272727]">Customize Branding</h2>
                    <p className="text-sm text-[#666666]">Add local language & currency</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="mb-2 block">Primary Color</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig("primaryColor", e.target.value)}
                          className="w-16 h-12 rounded-xl border-2 border-[#0EA0DC]/30 cursor-pointer"
                        />
                        <Input
                          value={config.primaryColor}
                          onChange={(e) => updateConfig("primaryColor", e.target.value)}
                          placeholder="#0EA0DC"
                          className="flex-1 rounded-xl border-[#0EA0DC]/30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Secondary Color</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                          className="w-16 h-12 rounded-xl border-2 border-[#0EA0DC]/30 cursor-pointer"
                        />
                        <Input
                          value={config.secondaryColor}
                          onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                          placeholder="#272727"
                          className="flex-1 rounded-xl border-[#0EA0DC]/30"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Portal Language *
                    </Label>
                    <Select value={config.language} onValueChange={(value) => updateConfig("language", value)}>
                      <SelectTrigger className="rounded-xl border-[#0EA0DC]/30">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="mb-2 block flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Currency *
                      </Label>
                      <Select
                        value={config.currency}
                        onValueChange={(value) => {
                          const currency = currencies.find((c) => c.code === value);
                          updateConfig("currency", value);
                          if (currency) {
                            updateConfig("currencySymbol", currency.symbol);
                          }
                        }}
                      >
                        <SelectTrigger className="rounded-xl border-[#0EA0DC]/30">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((curr) => (
                            <SelectItem key={curr.code} value={curr.code}>
                              {curr.symbol} {curr.name} ({curr.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-2 block">Timezone</Label>
                      <Select value={config.timezone} onValueChange={(value) => updateConfig("timezone", value)}>
                        <SelectTrigger className="rounded-xl border-[#0EA0DC]/30">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="America/Sao_Paulo">Brasília Time (BRT)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-[#0EA0DC]/30">
                    <h4 className="text-sm text-[#666666] mb-4">Preview</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
                        <span className="text-sm text-[#666666]">Primary Button</span>
                        <button
                          style={{ backgroundColor: config.primaryColor }}
                          className="px-6 py-2 rounded-xl text-white"
                        >
                          Sample Button
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
                        <span className="text-sm text-[#666666]">Sample Price</span>
                        <span className="text-xl" style={{ color: config.primaryColor }}>
                          {config.currencySymbol}99.99
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="skygloss-card p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0EA0DC]/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#0EA0DC]" />
                  </div>
                  <div>
                    <h2 className="text-[#272727]">Connect Payment Gateway</h2>
                    <p className="text-sm text-[#666666]">Integrate local payment solution</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Select Payment Gateway *</Label>
                    <div className="grid gap-4">
                      {paymentGateways.map((gateway) => (
                        <button
                          key={gateway.id}
                          onClick={() => updateConfig("paymentGateway", gateway.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${config.paymentGateway === gateway.id
                            ? "border-[#0EA0DC] bg-[#0EA0DC]/5"
                            : "border-gray-200 hover:border-[#0EA0DC]/50"
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm text-[#272727] mb-1">{gateway.name}</h4>
                              <p className="text-xs text-[#666666]">{gateway.description}</p>
                            </div>
                            {config.paymentGateway === gateway.id && (
                              <CheckCircle className="w-5 h-5 text-[#0EA0DC]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {config.paymentGateway && (
                    <>
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <Code className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm text-blue-900 mb-1">API Configuration</h4>
                            <p className="text-xs text-blue-700">
                              Enter your {paymentGateways.find((g) => g.id === config.paymentGateway)?.name} API credentials below.
                              You can find these in your payment provider dashboard.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="mb-2 block">Merchant ID (Optional)</Label>
                        <Input
                          value={config.merchantId}
                          onChange={(e) => updateConfig("merchantId", e.target.value)}
                          placeholder="merchant_123456789"
                          className="rounded-xl border-[#0EA0DC]/30"
                        />
                      </div>

                      <div>
                        <Label className="mb-2 block">API Key (Optional)</Label>
                        <Input
                          type="password"
                          value={config.apiKey}
                          onChange={(e) => updateConfig("apiKey", e.target.value)}
                          placeholder="sk_test_..."
                          className="rounded-xl border-[#0EA0DC]/30"
                        />
                        <p className="text-xs text-[#666666] mt-2">
                          Your API key is encrypted and stored securely
                        </p>
                      </div>

                      <div>
                        <Label className="mb-2 block">Webhook URL (Auto-generated)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={`https://${config.subdomain || "your-subdomain"}.skygloss.com/webhook/payment`}
                            readOnly
                            className="rounded-xl border-[#0EA0DC]/30 bg-gray-50"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `https://${config.subdomain || "your-subdomain"}.skygloss.com/webhook/payment`
                              );
                              toast.success("Webhook URL copied to clipboard");
                            }}
                            className="rounded-xl border-[#0EA0DC]/30"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-[#666666] mt-2">
                          Add this URL to your payment provider's webhook settings
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-8 gap-3">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1 || isProcessing}
            variant="outline"
            className="rounded-xl border-[#0EA0DC]/30 text-[#666666] hover:bg-gray-50 order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 order-1 sm:order-2">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isProcessing}
              className="rounded-xl border-[#0EA0DC]/30 text-[#666666] hover:bg-gray-50"
            >
              Save Draft
            </Button>
            <Button
              onClick={handleNext}
              disabled={isProcessing}
              className="bg-[#0EA0DC] text-white hover:bg-[#0B7FB3] rounded-xl px-6 sm:px-8"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Cloning...
                </>
              ) : currentStep === 3 ? (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Portal
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Summary Card (shown on last step) */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="skygloss-card p-6 rounded-2xl bg-gradient-to-br from-[#0EA0DC]/5 to-[#0EA0DC]/10 border-[#0EA0DC]/30">
              <h3 className="text-lg text-[#272727] mb-4">Configuration Summary</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#666666]">Portal Name</p>
                  <p className="text-sm text-[#272727]">{config.portalName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#666666]">URL</p>
                  <p className="text-sm text-[#272727]">
                    {config.subdomain ? `${config.subdomain}.skygloss.com` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#666666]">Language</p>
                  <p className="text-sm text-[#272727]">
                    {languages.find((l) => l.code === config.language)?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#666666]">Currency</p>
                  <p className="text-sm text-[#272727]">
                    {currencies.find((c) => c.code === config.currency)?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#666666]">Payment Gateway</p>
                  <p className="text-sm text-[#272727]">
                    {paymentGateways.find((g) => g.id === config.paymentGateway)?.name || "Not configured"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#666666]">Template</p>
                  <p className="text-sm text-[#272727]">
                    {config.templateType === "full" ? "Full Portal" : "Shop Only"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
