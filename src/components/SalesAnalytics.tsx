import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  Download,
  ArrowUp,
  ArrowDown,
  Users,
  Target
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 245000, orders: 156, shops: 42 },
  { month: "Feb", revenue: 268000, orders: 178, shops: 45 },
  { month: "Mar", revenue: 312000, orders: 198, shops: 48 },
  { month: "Apr", revenue: 298000, orders: 189, shops: 52 },
  { month: "May", revenue: 352000, orders: 221, shops: 55 },
  { month: "Jun", revenue: 389000, orders: 245, shops: 58 },
  { month: "Jul", revenue: 425000, orders: 268, shops: 62 },
  { month: "Aug", revenue: 398000, orders: 251, shops: 65 },
  { month: "Sep", revenue: 445000, orders: 281, shops: 68 },
  { month: "Oct", revenue: 485000, orders: 306, shops: 72 }
];

const productPerformance = [
  { name: "FUSION System", sales: 4768, revenue: 866000, growth: 21 },
  { name: "Resin Film", sales: 1654, revenue: 289000, growth: 32 },
  { name: "Seal", sales: 3124, revenue: 198000, growth: 15 },
  { name: "Matte Box", sales: 2567, revenue: 156000, growth: 22 }
];

const regionPerformance = [
  { name: "North America", value: 42, revenue: "$2.1M", color: "#0EA0DC" },
  { name: "Europe", value: 28, revenue: "$1.4M", color: "#0B7FB3" },
  { name: "Asia", value: 18, revenue: "$890K", color: "#085A7F" },
  { name: "South America", value: 12, revenue: "$580K", color: "#06465D" }
];

const topShops = [
  { name: "Elite Auto Detail NYC", orders: 45, revenue: "$125K", growth: "+32%" },
  { name: "Prestige Care London", orders: 38, revenue: "$98K", growth: "+28%" },
  { name: "Premium Detail Tokyo", orders: 35, revenue: "$89K", growth: "+24%" },
  { name: "Gloss Masters Berlin", orders: 32, revenue: "$82K", growth: "+21%" },
  { name: "Shine Pro Sydney", orders: 28, revenue: "$75K", growth: "+18%" }
];

export function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const totalRevenue = monthlyRevenue.reduce((acc, m) => acc + m.revenue, 0);
  const totalOrders = monthlyRevenue.reduce((acc, m) => acc + m.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const growthRate = ((monthlyRevenue[monthlyRevenue.length - 1].revenue - monthlyRevenue[0].revenue) / monthlyRevenue[0].revenue * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0EA0DC] to-[#0B7FB3] flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl text-[#272727]">Sales Analytics</h1>
                <p className="text-xs sm:text-sm text-[#666666]">Track sales performance</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-[150px] rounded-xl border-[#0EA0DC]/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-[#0EA0DC] text-white hover:bg-[#0B7FB3] rounded-xl w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="skygloss-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#0EA0DC]/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#0EA0DC]" />
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                  <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  {growthRate}%
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-[#666666] mb-1">Revenue</p>
              <p className="text-lg sm:text-2xl text-[#272727]">${(totalRevenue / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-[#666666] mt-1 sm:mt-2">vs last</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="skygloss-card p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  23%
                </Badge>
              </div>
              <p className="text-sm text-[#666666] mb-1">Total Orders</p>
              <p className="text-2xl text-[#272727]">{totalOrders.toLocaleString()}</p>
              <p className="text-xs text-[#666666] mt-2">+156 this month</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="skygloss-card p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  12%
                </Badge>
              </div>
              <p className="text-sm text-[#666666] mb-1">Avg Order Value</p>
              <p className="text-2xl text-[#272727]">${avgOrderValue.toFixed(0)}</p>
              <p className="text-xs text-[#666666] mt-2">+$48 increase</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="skygloss-card p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  8%
                </Badge>
              </div>
              <p className="text-sm text-[#666666] mb-1">Active Shops</p>
              <p className="text-2xl text-[#272727]">247</p>
              <p className="text-xs text-[#666666] mt-2">+18 new shops</p>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white rounded-xl p-1.5 border-2 border-[#0EA0DC] shadow-[0_0_10px_rgba(14,160,220,0.15)] h-auto">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-3 px-6 rounded-lg transition-all duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-3 px-6 rounded-lg transition-all duration-200"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="regions"
              className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-3 px-6 rounded-lg transition-all duration-200"
            >
              Regions
            </TabsTrigger>
            <TabsTrigger
              value="shops"
              className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-3 px-6 rounded-lg transition-all duration-200"
            >
              Top Shops
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="skygloss-card p-6 rounded-2xl">
                <h3 className="text-lg text-[#272727] mb-6">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA0DC" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0EA0DC" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis dataKey="month" stroke="#666666" />
                    <YAxis stroke="#666666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #0EA0DC",
                        borderRadius: "8px"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0EA0DC"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="skygloss-card p-6 rounded-2xl">
                <h3 className="text-lg text-[#272727] mb-6">Orders & Shops Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis dataKey="month" stroke="#666666" />
                    <YAxis stroke="#666666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #0EA0DC",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#0EA0DC"
                      strokeWidth={2}
                      name="Orders"
                    />
                    <Line
                      type="monotone"
                      dataKey="shops"
                      stroke="#0B7FB3"
                      strokeWidth={2}
                      name="Active Shops"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="skygloss-card p-6 rounded-2xl">
                <h3 className="text-lg text-[#272727] mb-6">Product Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis dataKey="name" stroke="#666666" />
                    <YAxis stroke="#666666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #0EA0DC",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="revenue" fill="#0EA0DC" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="skygloss-card p-6 rounded-2xl">
                <h3 className="text-lg text-[#272727] mb-6">Product Details</h3>
                <div className="space-y-4">
                  {productPerformance.map((product, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#0EA0DC]/5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm text-[#272727]">{product.name}</h4>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          {product.growth}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-[#666666]">Sales</p>
                          <p className="text-sm text-[#272727]">{product.sales.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#666666]">Revenue</p>
                          <p className="text-sm text-[#272727]">${(product.revenue / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Regions Tab */}
          <TabsContent value="regions">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="skygloss-card p-6 rounded-2xl">
                <h3 className="text-lg text-[#272727] mb-6">Sales by Region</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={regionPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {regionPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #0EA0DC",
                        borderRadius: "8px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="skygloss-card p-6 rounded-2xl">
                <h3 className="text-lg text-[#272727] mb-6">Regional Breakdown</h3>
                <div className="space-y-4">
                  {regionPerformance.map((region, idx) => (
                    <div key={idx} className="p-4 rounded-xl" style={{ backgroundColor: `${region.color}10` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: region.color }} />
                          <h4 className="text-sm text-[#272727]">{region.name}</h4>
                        </div>
                        <p className="text-sm text-[#272727]">{region.revenue}</p>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${region.value}%`, backgroundColor: region.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Top Shops Tab */}
          <TabsContent value="shops">
            <Card className="skygloss-card p-6 rounded-2xl">
              <h3 className="text-lg text-[#272727] mb-6">Top Performing Shops</h3>
              <div className="space-y-4">
                {topShops.map((shop, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#0EA0DC]/5 hover:bg-[#0EA0DC]/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA0DC] to-[#0B7FB3] flex items-center justify-center">
                        <span className="text-white text-lg">{idx + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-sm text-[#272727]">{shop.name}</h4>
                        <p className="text-xs text-[#666666]">{shop.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#272727]">{shop.revenue}</p>
                      <Badge className="bg-green-100 text-green-800 border-green-200 mt-1">
                        {shop.growth}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
