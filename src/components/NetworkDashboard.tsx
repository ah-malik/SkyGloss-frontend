import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { TrendingUp, MapPin, Download, Plus, ArrowLeft, MessageCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { InteractiveWorldMap } from "./InteractiveWorldMap";
import { ManagePartners } from "./ManagePartners";
import { SalesAnalytics } from "./SalesAnalytics";
import { GenerateReports } from "./GenerateReports";
import { PortalCloningWizard } from "./PortalCloningWizard";
import { ChatWidget } from "./ChatWidget";
import { toast } from "sonner";
import api from "../api/axios";
import { useAuth } from "../AuthContext";

// Remove static placeholder data and replace with dynamic derivations where needed

export function NetworkDashboard() {
  const { user } = useAuth();
  const [activeToolView, setActiveToolView] = useState<"main" | "Partners" | "analytics" | "reports" | "cloning">("main");
  const [shops, setShops] = useState<any[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [selectedChatShop, setSelectedChatShop] = useState<any>(null);

  useEffect(() => {
    const fetchShops = async () => {
      setIsLoadingShops(true);
      try {
        const response = await api.get('/users/referred-shops');
        setShops(response.data);
      } catch (error) {
        console.error("Failed to fetch referred shops:", error);
      } finally {
        setIsLoadingShops(false);
      }
    };

    fetchShops();
  }, []);

  // Compute live stats from shops data
  const totalShopsCount = shops.length;

  const countryBreakdown = shops.reduce((acc: any, shop) => {
    const country = shop.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const dynamicTopCountries = Object.entries(countryBreakdown)
    .map(([country, count]) => ({ country, shops: count as number }))
    .sort((a, b) => b.shops - a.shops);

  const dynamicRecentCertifications = [...shops]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(shop => ({
      shop: `${shop.firstName} ${shop.lastName}`,
      country: shop.country,
      date: new Date(shop.createdAt).toLocaleDateString(),
      status: "active"
    }));

  const dynamicNetworkStats = [
    { label: "Total Certified Shops in Your Territory", value: totalShopsCount.toString(), change: "+0%", trend: "up" },
    { label: "Direct Referral Shops", value: totalShopsCount.toString(), change: "+0%", trend: "up" }
  ];

  if (activeToolView === "Partners") {
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
        <ManagePartners />
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
                Monitor your worldwide Partner network and performance
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
            {dynamicNetworkStats.map((stat, index) => (
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
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-1.5 mb-8 bg-white rounded-xl p-1.5 border-2 border-[#0EA0DC] shadow-[0_0_10px_rgba(14,160,220,0.15)] h-auto">
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
            {/* <TabsTrigger
              value="clone"
              className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-2 sm:py-3 px-2 sm:px-6 rounded-lg transition-all duration-200 text-xs sm:text-sm"
            >
              Cloning
            </TabsTrigger> */}
            <TabsTrigger
              value="shops"
              className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-2 sm:py-3 px-2 sm:px-6 rounded-lg transition-all duration-200 text-xs sm:text-sm"
            >
              Certified Shops
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
                    {dynamicTopCountries.length === 0 ? (
                      <div className="text-center py-8 text-[#666666] text-sm italic">
                        No geographical data yet
                      </div>
                    ) : dynamicTopCountries.map((country, idx) => (
                      <div key={idx} className="flex items-center gap-3 pb-4 border-b border-[#0EA0DC]/10 last:border-0">
                        <div className="w-10 h-10 rounded-lg bg-[#0EA0DC]/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-[#0EA0DC]" />
                        </div>
                        <div>
                          <div className="text-[#272727] font-medium">{country.country}</div>
                          <div className="text-sm text-[#666666]">{country.shops} {country.shops === 1 ? 'shop' : 'shops'}</div>
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
                    {dynamicRecentCertifications.length === 0 ? (
                      <div className="text-center py-8 text-[#666666] text-sm italic">
                        No recent activity
                      </div>
                    ) : dynamicRecentCertifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-between pb-4 border-b border-[#0EA0DC]/10 last:border-0">
                        <div>
                          <div className="text-[#272727] font-medium">{cert.shop}</div>
                          <div className="text-sm text-[#666666]">{cert.country} · {cert.date}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-0">
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Certified Shops Tab */}
          <TabsContent value="shops">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="skygloss-card p-6 rounded-2xl overflow-hidden">
                <h3 className="text-xl text-[#272727] mb-6">Linked Certified Shops</h3>
                {isLoadingShops ? (
                  <div className="flex justify-center p-8 text-[#0EA0DC] animate-pulse">Loading shops...</div>
                ) : shops.length === 0 ? (
                  <div className="text-center py-12 text-[#666666]">
                    No certified shops registered under your ID yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b-2 border-[#0EA0DC]/10 bg-gray-50/50">
                          <th className="px-6 py-4 text-sm font-semibold text-[#272727]">Shop Name</th>
                          <th className="px-6 py-4 text-sm font-semibold text-[#272727]">Location</th>
                          <th className="px-6 py-4 text-sm font-semibold text-[#272727]">Registration Date</th>
                          <th className="px-6 py-4 text-sm font-semibold text-[#272727]">Status</th>
                          <th className="px-6 py-4 text-sm font-semibold text-[#272727] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shops.map((shop, idx) => (
                          <tr key={idx} className="border-b border-[#0EA0DC]/10 hover:bg-[#0EA0DC]/5 transition-colors">
                            <td className="px-6 py-4 text-[#272727] font-medium">
                              {shop.firstName} {shop.lastName}
                            </td>
                            <td className="px-6 py-4 text-[#666666] text-sm">
                              {shop.city}, {shop.country}
                            </td>
                            <td className="px-6 py-4 text-[#666666] text-sm">
                              {new Date(shop.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <Badge className="bg-green-100 text-green-800 border-0 font-semibold px-3 py-1">
                                CERTIFIED
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {shop.isTrainingComplete ? (
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedChatShop(shop)}
                                  className="bg-[#0EA0DC] hover:bg-[#272727] text-white transition-all shadow-md"
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Live Chat
                                </Button>
                              ) : (
                                <Badge variant="outline" className="text-gray-400 border-gray-200">
                                  Training Pending
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </motion.div>
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
          {/* <TabsContent value="clone">
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
          </TabsContent> */}
        </Tabs>
      </div>

      {selectedChatShop && (
        <ChatWidget
          userName={`${user?.firstName} ${user?.lastName}`}
          userEmail={user?.email || 'partner@skygloss.com'}
          userType="admin"
          userId={selectedChatShop._id}
          onClose={() => setSelectedChatShop(null)}
        />
      )}
    </div>
  );
}
