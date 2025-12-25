import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Globe, TrendingUp, Users, ShoppingBag, MapPin, Download, Plus, ArrowLeft } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { InteractiveWorldMap } from "./InteractiveWorldMap";
import { ManageDistributors } from "./ManageDistributors";
import { SalesAnalytics } from "./SalesAnalytics";
import { GenerateReports } from "./GenerateReports";
import { PortalCloningWizard } from "./PortalCloningWizard";
import { toast } from "sonner";

const networkStats = [
  { label: "Total Certified Shops in Your Territory", value: "247", change: "+12%", trend: "up" },
  { label: "Orders This Month", value: "1,234", change: "+23%", trend: "up" }
];

const topCountries = [
  { country: "United States", shops: 98, growth: "+15%" },
  { country: "Germany", shops: 42, growth: "+22%" },
  { country: "United Kingdom", shops: 38, growth: "+18%" },
  { country: "Canada", shops: 31, growth: "+12%" },
  { country: "Australia", shops: 18, growth: "+25%" }
];

const recentCertifications = [
  { shop: "Prestige Auto Detail", country: "USA", date: "2 days ago", status: "active" },
  { shop: "Elite Car Care", country: "UK", date: "5 days ago", status: "active" },
  { shop: "Gloss Masters", country: "Germany", date: "1 week ago", status: "active" },
  { shop: "Premium Detailing Co", country: "Canada", date: "1 week ago", status: "pending" }
];

export function NetworkDashboard() {
  const [selectedMap, setSelectedMap] = useState("global");
  const [activeToolView, setActiveToolView] = useState<"main" | "distributors" | "analytics" | "reports" | "cloning">("main");

  if (activeToolView === "distributors") {
    return (
      <div className="relative">
        <div className="mb-4 px-4">
          <Button
            onClick={() => setActiveToolView("main")}
            variant="outline"
            className="rounded-xl border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Network
          </Button>
        </div>
        <ManageDistributors />
      </div>
    );
  }

  if (activeToolView === "analytics") {
    return (
      <div className="relative">
        <div className="mb-4 px-4">
          <Button
            onClick={() => setActiveToolView("main")}
            variant="outline"
            className="rounded-xl border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Network
          </Button>
        </div>
        <SalesAnalytics />
      </div>
    );
  }

  if (activeToolView === "reports") {
    return (
      <div className="relative">
        <div className="mb-4 px-4">
          <Button
            onClick={() => setActiveToolView("main")}
            variant="outline"
            className="rounded-xl border-[#0EA0DC]/30 text-[rgb(255,255,255)] hover:bg-[#0EA0DC]/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Network
          </Button>
        </div>
        <GenerateReports />
      </div>
    );
  }

  if (activeToolView === "cloning") {
    return (
      <PortalCloningWizard
        onClose={() => setActiveToolView("main")}
        onComplete={() => {
          setActiveToolView("main");
          toast.success("Portal cloned successfully!", {
            description: "Your new portal is being deployed and will be ready in a few minutes."
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl text-[#272727] mb-2">
                Global Network Dashboard
              </h1>
              <p className="text-sm sm:text-base text-[#666666]">
                Monitor your worldwide distributor network and performance
              </p>
            </div>
            <Button className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] whitespace-nowrap">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {networkStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="skygloss-card p-6 sm:p-8 rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-sm text-[#666666]">{stat.label}</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-3xl sm:text-4xl text-[#272727] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-green-600">
                    {stat.change}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-1.5 mb-8 bg-white rounded-xl p-1.5 border-2 border-[#0EA0DC] shadow-[0_0_10px_rgba(14,160,220,0.15)] h-auto">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-2 sm:py-3 px-2 sm:px-6 rounded-lg transition-all duration-200 text-xs sm:text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="network"
              className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-2 sm:py-3 px-2 sm:px-6 rounded-lg transition-all duration-200 text-xs sm:text-sm"
            >
              Network Map
            </TabsTrigger>
            <TabsTrigger 
              value="clone"
              className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-2 sm:py-3 px-2 sm:px-6 rounded-lg transition-all duration-200 text-xs sm:text-sm"
            >
              Cloning
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Performing Countries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="skygloss-card p-6 rounded-2xl">
                  <h3 className="text-xl text-[#272727] mb-6">
                    Certified Shops
                  </h3>
                  <div className="space-y-4">
                    {topCountries.map((country, idx) => (
                      <div key={idx} className="flex items-center gap-3 pb-4 border-b border-[#0EA0DC]/10 last:border-0">
                        <div className="w-10 h-10 rounded-lg bg-[#0EA0DC]/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-[#0EA0DC]" />
                        </div>
                        <div>
                          <div className="text-[#272727]">{country.country}</div>
                          <div className="text-sm text-[#666666]">{country.shops} shops</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Recent Certifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="skygloss-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl text-[#272727]">
                      Recent Certifications
                    </h3>
                    <Button size="sm" className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)]">
                      <Plus className="w-4 h-4 mr-1" />
                      New
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentCertifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-between pb-4 border-b border-[#0EA0DC]/10 last:border-0">
                        <div>
                          <div className="text-[#272727]">{cert.shop}</div>
                          <div className="text-sm text-[#666666]">{cert.country} · {cert.date}</div>
                        </div>
                        <Badge className={cert.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                        }>
                          {cert.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Network Map Tab */}
          <TabsContent value="network">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <InteractiveWorldMap />
            </motion.div>
          </TabsContent>

          {/* Portal Cloning Tab */}
          <TabsContent value="clone">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="skygloss-card p-8 rounded-2xl">
                <h3 className="text-2xl text-[#272727] mb-6">
                  Clone Portal for Local Markets
                </h3>
                <p className="text-[#666666] mb-8">
                  Create customized versions of the SkyGloss Partner Portal for your local markets.
                  Maintain brand consistency while adapting to regional needs.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[
                    { step: 1, title: "Clone Base Portal", desc: "Start with SkyGloss template" },
                    { step: 2, title: "Customize Branding", desc: "Add local language & currency" },
                    { step: 3, title: "Connect Payment", desc: "Integrate local payment gateway" }
                  ].map((item, idx) => (
                    <div key={idx} className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#0EA0DC] text-white flex items-center justify-center text-lg">
                        {item.step}
                      </div>
                      <h4 className="text-[#272727] mb-2">{item.title}</h4>
                      <p className="text-sm text-[#666666]">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={() => setActiveToolView("cloning")}
                    className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] px-8"
                  >
                    Start Portal Cloning Process
                  </Button>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
