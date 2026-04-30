import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { TrendingUp, MapPin, Download, Plus, ArrowLeft, MessageCircle, Trophy, Clock, Award } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useSearchParams } from "react-router";
import { InteractiveWorldMap } from "./InteractiveWorldMap";
import { ManagePartners } from "./ManagePartners";
import { SalesAnalytics } from "./SalesAnalytics";
import { GenerateReports } from "./GenerateReports";
import { PortalCloningWizard } from "./PortalCloningWizard";
import { ChatWidget } from "./ChatWidget";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import api from "../api/axios";
import { useAuth } from "../AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function NetworkDashboard() {
  const { user, recentActivities } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'stats';
  const [activeToolView, setActiveToolView] = useState<"main" | "Partners" | "analytics" | "reports" | "cloning">("main");
  const [shops, setShops] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [isAssigning, setIsAssigning] = useState<string | null>(null);
  const [selectedChatShop, setSelectedChatShop] = useState<any>(null);

  const isGlobalPartner =
    user?.partnerCode === 'GLOBAL77' ||
    user?.email?.toLowerCase().trim() === 'certified@skygloss.com' ||
    user?.role === 'admin';

  useEffect(() => {
    const fetchShops = async () => {
      setIsLoadingShops(true);
      try {
        const response = await api.get('/users/referred-shops');
        // Combined response with shops and partners
        if (response.data.shops) {
          setShops(response.data.shops);
          setPartners(response.data.partners || []);
        } else {
          // Fallback if structure is old array
          setShops(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch referred shops:", error);
      } finally {
        setIsLoadingShops(false);
      }
    };

    fetchShops();
  }, []);

  const toggleShopVisibility = async (shopId: string, isVisible: boolean) => {
    try {
      await api.patch(`/users/referred-shops/${shopId}/visibility`, {
        isVisibleOnMap: isVisible,
      });
      setShops(prev => prev.map(s => s._id === shopId ? { ...s, isVisibleOnMap: isVisible } : s));
      toast.success(isVisible ? "Shop visible on map" : "Shop hidden from map");
    } catch (error) {
      console.error("Failed to toggle shop visibility:", error);
      toast.error("Failed to update visibility");
    }
  };

  const handleTransferShop = async (shopId: string, partnerCode: string) => {
    setIsAssigning(shopId);
    try {
      await api.patch(`/users/${shopId}/transfer-shop`, { partnerCode });
      setShops(prev => prev.map(s => s._id === shopId ? { ...s, referredByPartnerCode: partnerCode } : s));
      toast.success("Shop re-assigned successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to re-assign shop");
    } finally {
      setIsAssigning(null);
    }
  };

  const approveCertification = async (shopId: string) => {
    try {
      await api.patch(`/users/${shopId}`, { isCertified: true });
      setShops(prev => prev.map(s => s._id === shopId ? { ...s, isCertified: true } : s));
      toast.success("Shop certified successfully");
    } catch (error) {
      console.error("Failed to certify shop:", error);
      toast.error("Failed to certify shop");
    }
  };

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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
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
        <Tabs defaultValue={initialTab} className="w-full">
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
                          <th className="px-6 py-4 text-sm font-semibold text-[#272727]">Assigned Partner</th>
                          <th className="px-6 py-4 text-sm font-semibold text-[#272727]">Registration Date</th>
                          <th className="px-6 py-4 text-sm font-semibold text-[#272727]">Status</th>
                          <th className="px-6 py-4 text-sm font-semibold text-[#272727]">Show on Map</th>
                          <th className="px-6 py-4 text-sm font-semibold text-[#272727] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shops.map((shop, idx) => (
                          <tr key={idx} className="border-b border-[#0EA0DC]/10 hover:bg-[#0EA0DC]/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-[#272727] font-medium">
                                  {shop.firstName} {shop.lastName}
                                </span>
                                {!shop.isPartnerPaid && (
                                  <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 text-[10px] px-1.5 py-0 h-5 flex items-center shadow-sm">
                                    UNPAID
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#666666] text-sm">
                              {shop.city}, {shop.country}
                            </td>
                            <td className="px-6 py-4 text-[#666666] text-sm">
                              {isGlobalPartner ? (
                                <Select
                                  defaultValue={shop.referredByPartnerCode}
                                  onValueChange={(val) => handleTransferShop(shop._id, val)}
                                  disabled={isAssigning === shop._id}
                                >
                                  <SelectTrigger className="w-[180px] h-9 border-[#0EA0DC]/30">
                                    <SelectValue placeholder="No Partner" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="GLOBAL77">
                                      Global Partner (GLOBAL77)
                                    </SelectItem>
                                    {partners
                                      .filter(p => p.partnerCode && p.partnerCode !== 'GLOBAL77')
                                      .map((p) => (
                                        <SelectItem key={p.partnerCode || p._id} value={p.partnerCode || p._id}>
                                          {p.firstName} {p.lastName} ({p.partnerCode || 'No Code'}) {p.status !== 'active' ? `[${p.status.toUpperCase()}]` : ''}
                                        </SelectItem>
                                      ))
                                    }
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#666666]">
                                  {shop.referredByPartnerCode || 'GLOBAL'}
                                </Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 text-[#666666] text-sm">
                              {new Date(shop.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              {shop.isCertified ? (
                                <Badge className="bg-emerald-100 text-emerald-800 border-0 font-bold px-3 py-1 flex items-center gap-1 w-fit">
                                  <Award className="w-3 h-3" /> CERTIFIED
                                </Badge>
                              ) : shop.isTrainingComplete ? (
                                <Badge className="bg-amber-100 text-amber-800 border-0 font-bold px-3 py-1 flex items-center gap-1 w-fit">
                                  <Clock className="w-3 h-3" /> PENDING APPROVAL
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-400 border-0 font-bold px-3 py-1 w-fit">
                                  IN TRAINING
                                </Badge>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`visibility-${shop._id}`}
                                  checked={shop.isVisibleOnMap}
                                  onCheckedChange={(checked) => toggleShopVisibility(shop._id, !!checked)}
                                  className="border-[#0EA0DC] data-[state=checked]:bg-[#0EA0DC]"
                                />
                                <label
                                  htmlFor={`visibility-${shop._id}`}
                                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#666666]"
                                >
                                  {shop.isVisibleOnMap ? "Visible" : "Hidden"}
                                </label>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {shop.isTrainingComplete && !shop.isCertified && (
                                  <Button
                                    size="sm"
                                    onClick={() => approveCertification(shop._id)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-md font-bold"
                                  >
                                    <Trophy className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedChatShop(shop)}
                                  className="bg-[#0EA0DC] hover:bg-[#272727] text-white transition-all shadow-md relative"
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Live Chat
                                  {recentActivities.some(n => 
                                    n.type === 'CHAT_MESSAGE' && 
                                    !n.isRead && 
                                    n.metadata?.roomId === shop._id
                                  ) && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                  )}
                                </Button>
                              </div>
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
