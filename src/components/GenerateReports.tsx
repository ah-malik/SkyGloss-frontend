import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

interface ReportHistory {
  id: string;
  name: string;
  type: "CSV" | "PDF";
  category: string;
  dateGenerated: string;
  status: "completed" | "processing" | "failed";
  size: string;
}

const reportHistory: ReportHistory[] = [
  {
    id: "RPT001",
    name: "October Sales Report",
    type: "PDF",
    category: "Sales",
    dateGenerated: "Oct 24, 2024",
    status: "completed",
    size: "2.4 MB"
  },
  {
    id: "RPT002",
    name: "Q3 Distributor Performance",
    type: "CSV",
    category: "Distributors",
    dateGenerated: "Oct 20, 2024",
    status: "completed",
    size: "1.8 MB"
  },
  {
    id: "RPT003",
    name: "Product Inventory Report",
    type: "PDF",
    category: "Inventory",
    dateGenerated: "Oct 18, 2024",
    status: "completed",
    size: "3.2 MB"
  },
  {
    id: "RPT004",
    name: "Regional Analysis",
    type: "CSV",
    category: "Analytics",
    dateGenerated: "Oct 15, 2024",
    status: "processing",
    size: "-"
  }
];

export function GenerateReports() {
  const [reportType, setReportType] = useState<"CSV" | "PDF">("PDF");
  const [reportCategory, setReportCategory] = useState("sales");
  const [dateRange, setDateRange] = useState("month");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "revenue",
    "orders",
    "products"
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const metrics = [
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "orders", label: "Orders", icon: Package },
    { id: "products", label: "Products", icon: Package },
    { id: "distributors", label: "Distributors", icon: Users },
    { id: "regions", label: "Regions", icon: MapPin },
    { id: "growth", label: "Growth Trends", icon: TrendingUp }
  ];

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleGenerateReport = () => {
    if (selectedMetrics.length === 0) {
      toast.error("Please select at least one metric");
      return;
    }

    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(
        `${reportType} report generated successfully! Check your downloads.`,
        {
          description: `Report includes ${selectedMetrics.length} metrics for ${dateRange === "month" ? "this month" : dateRange === "quarter" ? "this quarter" : "this year"}`
        }
      );
    }, 2500);
  };

  const handleDownloadReport = (reportId: string) => {
    toast.success("Report downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA0DC] to-[#0B7FB3] flex items-center justify-center shadow-lg">
              <Download className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-[#272727]">Generate Reports</h1>
              <p className="text-[#666666]">Create custom CSV or PDF reports for analysis</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Report Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Configuration */}
            <Card className="skygloss-card p-6 rounded-2xl">
              <h3 className="text-lg text-[#272727] mb-6">Configure Report</h3>

              <div className="space-y-6">
                {/* Report Type */}
                <div>
                  <Label className="mb-3 block">Report Format</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setReportType("PDF")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        reportType === "PDF"
                          ? "border-[#0EA0DC] bg-[#0EA0DC]/5"
                          : "border-gray-200 hover:border-[#0EA0DC]/50"
                      }`}
                    >
                      <FileText className={`w-8 h-8 mx-auto mb-2 ${reportType === "PDF" ? "text-[#0EA0DC]" : "text-[#666666]"}`} />
                      <p className="text-sm text-[#272727]">PDF Report</p>
                      <p className="text-xs text-[#666666]">Best for viewing & printing</p>
                    </button>
                    <button
                      onClick={() => setReportType("CSV")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        reportType === "CSV"
                          ? "border-[#0EA0DC] bg-[#0EA0DC]/5"
                          : "border-gray-200 hover:border-[#0EA0DC]/50"
                      }`}
                    >
                      <FileSpreadsheet className={`w-8 h-8 mx-auto mb-2 ${reportType === "CSV" ? "text-[#0EA0DC]" : "text-[#666666]"}`} />
                      <p className="text-sm text-[#272727]">CSV Export</p>
                      <p className="text-xs text-[#666666]">Best for data analysis</p>
                    </button>
                  </div>
                </div>

                {/* Report Category */}
                <div>
                  <Label className="mb-3 block">Report Category</Label>
                  <Select value={reportCategory} onValueChange={setReportCategory}>
                    <SelectTrigger className="rounded-xl border-[#0EA0DC]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Performance</SelectItem>
                      <SelectItem value="distributors">Distributor Network</SelectItem>
                      <SelectItem value="inventory">Inventory & Products</SelectItem>
                      <SelectItem value="analytics">Business Analytics</SelectItem>
                      <SelectItem value="regional">Regional Performance</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <Label className="mb-3 block">Time Period</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="rounded-xl border-[#0EA0DC]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Metrics Selection */}
                <div>
                  <Label className="mb-3 block">Include Metrics</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {metrics.map((metric) => (
                      <div
                        key={metric.id}
                        onClick={() => toggleMetric(metric.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedMetrics.includes(metric.id)
                            ? "border-[#0EA0DC] bg-[#0EA0DC]/5"
                            : "border-gray-200 hover:border-[#0EA0DC]/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={() => toggleMetric(metric.id)}
                            className="border-[#0EA0DC]"
                          />
                          <metric.icon className={`w-5 h-5 ${selectedMetrics.includes(metric.id) ? "text-[#0EA0DC]" : "text-[#666666]"}`} />
                          <span className="text-sm text-[#272727]">{metric.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Generate Button */}
            <Card className="skygloss-card p-6 rounded-2xl bg-gradient-to-br from-[#0EA0DC]/5 to-[#0EA0DC]/10 border-[#0EA0DC]/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg text-[#272727] mb-1">Ready to Generate?</h4>
                  <p className="text-sm text-[#666666]">
                    {reportType} • {selectedMetrics.length} metrics • {dateRange === "month" ? "Last 30 days" : dateRange === "quarter" ? "Last quarter" : "Custom range"}
                  </p>
                </div>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="bg-[#0EA0DC] text-white hover:bg-[#0B7FB3] rounded-xl px-8"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Report History */}
          <div>
            <Card className="skygloss-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-[#272727]">Recent Reports</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {reportHistory.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-[#0EA0DC]/5 hover:bg-[#0EA0DC]/10 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        report.type === "PDF" 
                          ? "bg-red-100" 
                          : "bg-green-100"
                      }`}>
                        {report.type === "PDF" ? (
                          <FileText className="w-5 h-5 text-red-600" />
                        ) : (
                          <FileSpreadsheet className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm text-[#272727] mb-1">{report.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 text-xs">
                            {report.category}
                          </Badge>
                          <Badge
                            className={
                              report.status === "completed"
                                ? "bg-green-100 text-green-800 border-green-200 text-xs"
                                : report.status === "processing"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200 text-xs"
                                : "bg-red-100 text-red-800 border-red-200 text-xs"
                            }
                          >
                            {report.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {report.status === "processing" && <Clock className="w-3 h-3 mr-1" />}
                            {report.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#666666]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {report.dateGenerated}
                          </span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    {report.status === "completed" && (
                      <Button
                        onClick={() => handleDownloadReport(report.id)}
                        variant="outline"
                        size="sm"
                        className="w-full rounded-lg border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                      >
                        <Download className="w-3 h-3 mr-2" />
                        Download
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 rounded-xl border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
              >
                View All Reports
              </Button>
            </Card>

            {/* Quick Stats */}
            <Card className="skygloss-card p-6 rounded-2xl mt-4">
              <h4 className="text-sm text-[#666666] mb-4">Report Statistics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#666666]">Generated this month</span>
                  <span className="text-sm text-[#272727]">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#666666]">Total reports</span>
                  <span className="text-sm text-[#272727]">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#666666]">Storage used</span>
                  <span className="text-sm text-[#272727]">284 MB</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
