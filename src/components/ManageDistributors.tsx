import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface Distributor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  status: "active" | "pending" | "inactive";
  shops: number;
  revenue: string;
  joinedDate: string;
}

const mockDistributors: Distributor[] = [
  {
    id: "DIST001",
    name: "Elite Auto Care Europe",
    contact: "Carlos Mendoza",
    email: "carlos@eliteauto.eu",
    phone: "+34 912 345 678",
    country: "Spain",
    region: "Europe",
    status: "active",
    shops: 28,
    revenue: "$890K",
    joinedDate: "Jan 2023"
  },
  {
    id: "DIST002",
    name: "Premium Detail Brasil",
    contact: "Maria Silva",
    email: "maria@premiumdetail.br",
    phone: "+55 11 9876 5432",
    country: "Brazil",
    region: "South America",
    status: "active",
    shops: 34,
    revenue: "$1.2M",
    joinedDate: "Mar 2023"
  },
  {
    id: "DIST003",
    name: "Gloss Masters India",
    contact: "Raj Patel",
    email: "raj@glossmasters.in",
    phone: "+91 22 1234 5678",
    country: "India",
    region: "Asia",
    status: "active",
    shops: 52,
    revenue: "$1.8M",
    joinedDate: "Jun 2022"
  },
  {
    id: "DIST004",
    name: "Shine Pro Australia",
    contact: "James Wilson",
    email: "james@shinepro.au",
    phone: "+61 2 9876 5432",
    country: "Australia",
    region: "Oceania",
    status: "pending",
    shops: 0,
    revenue: "$0",
    joinedDate: "Oct 2024"
  },
  {
    id: "DIST005",
    name: "DetailWorks Germany",
    contact: "Hans Mueller",
    email: "hans@detailworks.de",
    phone: "+49 30 1234 5678",
    country: "Germany",
    region: "Europe",
    status: "active",
    shops: 42,
    revenue: "$1.5M",
    joinedDate: "Aug 2022"
  }
];

export function ManageDistributors() {
  const [distributors, setDistributors] = useState<Distributor[]>(mockDistributors);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    country: "",
    region: ""
  });

  const filteredDistributors = distributors.filter((dist) => {
    const matchesSearch = 
      dist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || dist.status === filterStatus;
    const matchesRegion = filterRegion === "all" || dist.region === filterRegion;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const handleAddDistributor = () => {
    if (!formData.name || !formData.email || !formData.contact) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newDistributor: Distributor = {
      id: `DIST${String(distributors.length + 1).padStart(3, "0")}`,
      name: formData.name,
      contact: formData.contact,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      region: formData.region,
      status: "pending",
      shops: 0,
      revenue: "$0",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
    };

    setDistributors([...distributors, newDistributor]);
    setShowAddModal(false);
    setFormData({ name: "", contact: "", email: "", phone: "", country: "", region: "" });
    toast.success("Distributor added successfully!");
  };

  const handleEditDistributor = () => {
    if (!selectedDistributor) return;

    const updatedDistributors = distributors.map((dist) =>
      dist.id === selectedDistributor.id
        ? { ...dist, ...formData }
        : dist
    );

    setDistributors(updatedDistributors);
    setShowEditModal(false);
    setSelectedDistributor(null);
    setFormData({ name: "", contact: "", email: "", phone: "", country: "", region: "" });
    toast.success("Distributor updated successfully!");
  };

  const handleDeleteDistributor = (id: string) => {
    setDistributors(distributors.filter((dist) => dist.id !== id));
    toast.success("Distributor removed successfully!");
  };

  const handleStatusChange = (id: string, newStatus: "active" | "pending" | "inactive") => {
    const updatedDistributors = distributors.map((dist) =>
      dist.id === id ? { ...dist, status: newStatus } : dist
    );
    setDistributors(updatedDistributors);
    toast.success("Status updated successfully!");
  };

  const openEditModal = (distributor: Distributor) => {
    setSelectedDistributor(distributor);
    setFormData({
      name: distributor.name,
      contact: distributor.contact,
      email: distributor.email,
      phone: distributor.phone,
      country: distributor.country,
      region: distributor.region
    });
    setShowEditModal(true);
  };

  const regions = Array.from(new Set(distributors.map((d) => d.region)));

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
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-[#272727]">Manage Distributors</h1>
              <p className="text-[#666666]">Add, edit, or remove distributor relationships and access</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <Card className="skygloss-card p-3 sm:p-4 rounded-xl sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-[#666666]">Total</p>
                <p className="text-xl sm:text-2xl text-[#272727]">{distributors.length}</p>
              </div>
              <Building2 className="w-8 sm:w-10 h-8 sm:h-10 text-[#0EA0DC] opacity-20" />
            </div>
          </Card>
          <Card className="skygloss-card p-3 sm:p-4 rounded-xl sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-[#666666]">Active</p>
                <p className="text-xl sm:text-2xl text-green-600">
                  {distributors.filter((d) => d.status === "active").length}
                </p>
              </div>
              <CheckCircle className="w-8 sm:w-10 h-8 sm:h-10 text-green-600 opacity-20" />
            </div>
          </Card>
          <Card className="skygloss-card p-3 sm:p-4 rounded-xl sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-[#666666]">Pending</p>
                <p className="text-xl sm:text-2xl text-yellow-600">
                  {distributors.filter((d) => d.status === "pending").length}
                </p>
              </div>
              <AlertCircle className="w-8 sm:w-10 h-8 sm:h-10 text-yellow-600 opacity-20" />
            </div>
          </Card>
          <Card className="skygloss-card p-3 sm:p-4 rounded-xl sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-[#666666]">Shops</p>
                <p className="text-xl sm:text-2xl text-[#272727]">
                  {distributors.reduce((acc, d) => acc + d.shops, 0)}
                </p>
              </div>
              <MapPin className="w-8 sm:w-10 h-8 sm:h-10 text-[#0EA0DC] opacity-20" />
            </div>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className="skygloss-card p-6 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
              <Input
                placeholder="Search distributors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-[#0EA0DC]/30"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px] rounded-xl border-[#0EA0DC]/30">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-full md:w-[200px] rounded-xl border-[#0EA0DC]/30">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#0EA0DC] text-white hover:bg-[#0B7FB3] rounded-xl whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Distributor
            </Button>
          </div>
        </Card>

        {/* Distributors List */}
        <div className="space-y-4">
          {filteredDistributors.map((distributor, index) => (
            <motion.div
              key={distributor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="skygloss-card p-4 sm:p-6 rounded-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 sm:gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA0DC]/20 to-[#0EA0DC]/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-[#0EA0DC]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg text-[#272727] mb-2">{distributor.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge
                            className={
                              distributor.status === "active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : distributor.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {distributor.status}
                          </Badge>
                          <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20">
                            {distributor.id}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#666666] mb-3">{distributor.contact}</p>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-[#666666]">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{distributor.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span>{distributor.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{distributor.country} · {distributor.region}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
                      <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[#0EA0DC]/5">
                        <p className="text-xs text-[#666666] mb-0.5">Shops</p>
                        <p className="text-base sm:text-lg text-[#272727]">{distributor.shops}</p>
                      </div>
                      <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[#0EA0DC]/5">
                        <p className="text-xs text-[#666666] mb-0.5">Revenue</p>
                        <p className="text-base sm:text-lg text-[#272727]">{distributor.revenue}</p>
                      </div>
                      <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[#0EA0DC]/5">
                        <p className="text-xs text-[#666666] mb-0.5">Joined</p>
                        <p className="text-base sm:text-lg text-[#272727]">{distributor.joinedDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 sm:gap-3 lg:min-w-[160px]">
                    <Select
                      value={distributor.status}
                      onValueChange={(value) =>
                        handleStatusChange(distributor.id, value as "active" | "pending" | "inactive")
                      }
                    >
                      <SelectTrigger className="w-full h-11 rounded-xl border-[#0EA0DC]/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => openEditModal(distributor)}
                      className="w-full h-11 rounded-xl border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteDistributor(distributor.id)}
                      className="w-full h-11 rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {(showAddModal || showEditModal) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setFormData({ name: "", contact: "", email: "", phone: "", country: "", region: "" });
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl"
              >
                <Card className="skygloss-card p-8 rounded-3xl relative">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setFormData({ name: "", contact: "", email: "", phone: "", country: "", region: "" });
                    }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-[#272727]" />
                  </button>

                  <h2 className="text-[#272727] mb-6">
                    {showAddModal ? "Add New Distributor" : "Edit Distributor"}
                  </h2>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Company Name *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter company name"
                          className="rounded-xl border-[#0EA0DC]/30"
                        />
                      </div>
                      <div>
                        <Label>Contact Person *</Label>
                        <Input
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          placeholder="Enter contact name"
                          className="rounded-xl border-[#0EA0DC]/30"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="rounded-xl border-[#0EA0DC]/30"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 234 567 8900"
                          className="rounded-xl border-[#0EA0DC]/30"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Country</Label>
                        <Input
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          placeholder="Enter country"
                          className="rounded-xl border-[#0EA0DC]/30"
                        />
                      </div>
                      <div>
                        <Label>Region</Label>
                        <Select
                          value={formData.region}
                          onValueChange={(value) => setFormData({ ...formData, region: value })}
                        >
                          <SelectTrigger className="rounded-xl border-[#0EA0DC]/30">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="North America">North America</SelectItem>
                            <SelectItem value="South America">South America</SelectItem>
                            <SelectItem value="Europe">Europe</SelectItem>
                            <SelectItem value="Asia">Asia</SelectItem>
                            <SelectItem value="Africa">Africa</SelectItem>
                            <SelectItem value="Oceania">Oceania</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={showAddModal ? handleAddDistributor : handleEditDistributor}
                        className="flex-1 bg-[#0EA0DC] text-white hover:bg-[#0B7FB3] rounded-xl"
                      >
                        {showAddModal ? "Add Distributor" : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddModal(false);
                          setShowEditModal(false);
                          setFormData({ name: "", contact: "", email: "", phone: "", country: "", region: "" });
                        }}
                        className="flex-1 border-[#0EA0DC]/30 text-[rgb(255,255,255)] hover:bg-gray-50 rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
