// Last Updated: 2026-01-26
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Image,
  Download,
  FolderOpen,
  ExternalLink,
  Search,
  Filter,
  X,
  Eye,
  Video,
  Briefcase,
  Palette,
  FileSpreadsheet,
  ChevronRight,
  Home,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type FileType = "pdf" | "jpg" | "png" | "mp4" | "psd" | "ai" | "doc" | "xls";
type FilterType = "all" | "documents" | "images" | "videos" | "branding" | "marketing";

interface ResourceFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  lastModified: string;
  driveUrl?: string;
  assetPath?: string;
  previewUrl?: string;
}

interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  files: ResourceFile[];
  filterType: FilterType;
  driveUrl: string;
}

const mockFiles = {
  branding: [
    { id: "1", name: "SkyGloss Brand Guidelines", type: "pdf" as FileType, size: "2 MB", lastModified: "2025-01-10", assetPath: "/SkyGloss Resources/Branding & Visual Assets/SkyGloss Brand Guidelines.pdf" },
  ],
  marketing: [
    { id: "2", name: "2026 SkyGloss Catalog", type: "pdf" as FileType, size: "12 MB", lastModified: "2025-01-18", assetPath: "/SkyGloss Resources/Catalog/2026 SkyGloss Catalog_Presentation.pdf" },
  ],
  sales: [
    { id: "3", name: "Global Master Distributor Presentation", type: "pdf" as FileType, size: "22 MB", lastModified: "2025-01-20", assetPath: "/SkyGloss Resources/Presentation/SkyGloss Global Master Distributor Presentation.pdf" },
  ],
  training: [],
  technical: [],
  photography: [],
};

const resourceCategories: ResourceCategory[] = [
  {
    id: "branding",
    title: "Branding & Visual Assets",
    description: "Official SkyGloss logos, color palettes, typography, and brand guidelines",
    icon: Palette,
    files: mockFiles.branding,
    filterType: "branding",
    driveUrl: "https://drive.google.com/drive/folders/1dCMBekDy7HTlWZP0kxsGM7f64zL3HNlk?usp=drive_link",
  },
  {
    id: "marketing",
    title: "Catalog",
    description: "Official SkyGloss product catalogs and brochures",
    icon: FileText,
    files: mockFiles.marketing,
    filterType: "marketing",
    driveUrl: "https://drive.google.com/drive/folders/1lClixrZVE7zDQnVK2ivwoRTxWG5Ep_ny?usp=drive_link",
  },
  {
    id: "sales",
    title: "Presentation",
    description: "SkyGloss corporate and master distributor presentations",
    icon: Briefcase,
    files: mockFiles.sales,
    filterType: "documents",
    driveUrl: "https://drive.google.com/drive/folders/1v4xnxJ4qw0ZJzrDjBjgd13mo1Ui4r436?usp=drive_link",
  },
  {
    id: "training",
    title: "Training Media",
    description: "Training videos, installation guides, and best practices documentation",
    icon: Video,
    files: mockFiles.training,
    filterType: "videos",
    driveUrl: "#",
  },
  {
    id: "technical",
    title: "Technical Documents",
    description: "SDS, TDS, certifications, and technical specifications",
    icon: FileSpreadsheet,
    files: mockFiles.technical,
    filterType: "documents",
    driveUrl: "#",
  },
  {
    id: "photography",
    title: "Product Media",
    description: "High-resolution product images, lifestyle shots, and application photos",
    icon: Image,
    files: mockFiles.photography,
    filterType: "images",
    driveUrl: "https://drive.google.com/drive/folders/1bH8uyvV4rI1x4yBKeXDYSVJbTZC9flpk?usp=drive_link",
  },
];

const getFileIcon = (type: FileType) => {
  switch (type) {
    case "pdf":
    case "doc":
      return <FileText className="w-5 h-5 text-red-600" />;
    case "jpg":
    case "png":
    case "psd":
    case "ai":
      return <Image className="w-5 h-5 text-blue-600" />;
    case "mp4":
      return <Video className="w-5 h-5 text-purple-600" />;
    case "xls":
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    default:
      return <FileText className="w-5 h-5 text-gray-600" />;
  }
};

interface ResourcesPageProps {
  onBack?: () => void;
}

export function ResourcesPage({ onBack }: ResourcesPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);

  const filteredCategories = resourceCategories.filter((category) => {
    const matchesSearch = category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || category.filterType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (file: ResourceFile) => {
    if (file.assetPath) {
      const link = document.createElement("a");
      link.href = file.assetPath;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (file.driveUrl) {
      window.open(file.driveUrl, "_blank");
    }
  };

  const handleViewFile = (file: ResourceFile) => {
    if (file.assetPath) {
      window.open(file.assetPath, "_blank");
    } else if (file.driveUrl) {
      window.open(file.driveUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0EA0DC]">Resources</span>
            {selectedCategory && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#0EA0DC]">{selectedCategory.title}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Badge className="mb-4 bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 px-3 py-1">
            Resource Center
          </Badge>
          <h1 className="text-4xl text-[#272727] mb-3">
            SkyGloss Resources
          </h1>
          <p className="text-lg text-[#666666] max-w-3xl">
            Access official brand assets, technical documentation, marketing materials, and training media.
            All resources are organized for easy access and global consistency.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <Card className="skygloss-card p-6 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white rounded-xl border-[#0EA0DC]/30 h-12 text-base shadow-sm"
                />
              </div>

              {/* Filter */}
              <div className="relative mx-[0px] m-[0px] p-[0px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666] z-10" />
                <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                  <SelectTrigger className="pl-12 bg-white rounded-xl border-[#0EA0DC]/30 h-14 text-base shadow-sm">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="branding">Branding</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || filterType !== "all") && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#0EA0DC]/10">
                <span className="text-sm text-[#666666]">Active filters:</span>
                {searchQuery && (
                  <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-0 px-3 py-1">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-2 hover:text-[#0EA0DC]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filterType !== "all" && (
                  <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-0 px-3 py-1">
                    Type: {filterType}
                    <button
                      onClick={() => setFilterType("all")}
                      className="ml-2 hover:text-[#0EA0DC]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="skygloss-card p-6 rounded-2xl h-full flex flex-col group cursor-pointer"
                onClick={() => setSelectedCategory(category)}>
                <div className="w-16 h-16 rounded-xl bg-[#0EA0DC]/10 flex items-center justify-center mb-5 group-hover:bg-[#0EA0DC] transition-all duration-200">
                  <category.icon className="w-8 h-8 text-[#0EA0DC] group-hover:text-white transition-all duration-200" />
                </div>

                <h3 className="text-xl text-[#272727] mb-2">
                  {category.title}
                </h3>

                <p className="text-[#666666] mb-4 flex-1">
                  {category.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#0EA0DC]/10">
                  <span className="text-sm text-[#666666]">
                    {category.files.length} files
                  </span>
                  <Button
                    size="sm"
                    className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] transition-all duration-200 rounded-lg"
                  >
                    View Resources
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FolderOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666666] text-lg mb-2">No resources found</p>
            <p className="text-[#666666] text-sm">Try adjusting your search or filters</p>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl text-[#272727] mb-6">
            Quick Access Links
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto py-4 border-[#0EA0DC]/30 hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200 rounded-xl"
              onClick={() => window.open("#", "_blank")}
            >
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 rounded-lg bg-[#0EA0DC]/10 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-5 h-5 text-[#0EA0DC]" />
                </div>
                <div>
                  <div className="text-[rgb(255,255,255)] mb-1">Main Resource Drive</div>
                  <div className="text-xs text-[#666666]">Access all SkyGloss resources in one place</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-4 border-[#0EA0DC]/30 hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200 rounded-xl"
              onClick={() => window.open("https://drive.google.com/drive/folders/1lClixrZVE7zDQnVK2ivwoRTxWG5Ep_ny?usp=drive_link", "_blank")}
            >
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 rounded-lg bg-[#0EA0DC]/10 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-5 h-5 text-[#0EA0DC]" />
                </div>
                <div>
                  <div className="text-[rgb(255,255,255)] mb-1">Brand Guidelines Portal</div>
                  <div className="text-xs text-[#666666]">Official branding standards and usage guidelines</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-4 border-[#0EA0DC]/30 hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200 rounded-xl"
              onClick={() => window.open("https://drive.google.com/drive/folders/1bH8uyvV4rI1x4yBKeXDYSVJbTZC9flpk?usp=drive_link", "_blank")}
            >
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 rounded-lg bg-[#0EA0DC]/10 flex items-center justify-center flex-shrink-0">
                  <Image className="w-5 h-5 text-[#0EA0DC]" />
                </div>
                <div>
                  <div className="text-[rgb(255,255,255)] mb-1">Media Library</div>
                  <div className="text-xs text-[#666666]">High-resolution photos and videos</div>
                </div>
              </div>
            </Button>

            {/* <Button
              variant="outline"
              className="justify-start h-auto py-4 border-[#0EA0DC]/30 hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200 rounded-xl"
              onClick={() => window.open("#", "_blank")}
            >
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 rounded-lg bg-[#0EA0DC]/10 flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5 text-[#0EA0DC]" />
                </div>
                <div>
                  <div className="text-[rgb(255,255,255)] mb-1">Training Portal</div>
                  <div className="text-xs text-[#666666]">Video tutorials and learning materials</div>
                </div>
              </div>
            </Button> */}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="skygloss-card p-6 rounded-2xl bg-[#0EA0DC]/5 border-[#0EA0DC]/20">
            <div className="text-center">
              <p className="text-[#666666]">
                Can't find what you're looking for?{" "}
                <a href="#" className="text-[#0EA0DC] hover:underline transition-all duration-200">
                  Contact support
                </a>
                {" "}for assistance or request additional resources
              </p>
            </div>
          </Card>
        </motion.div>
      </div>



      {/* Category Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-start gap-4 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-[#0EA0DC]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <selectedCategory.icon className="w-6 h-6 text-[#0EA0DC]" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl text-[#272727] mb-2">
                      {selectedCategory.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-[#666666]">
                      {selectedCategory.description}
                    </DialogDescription>
                  </div>
                </div>

                {/* Breadcrumb in Modal */}
                <div className="flex items-center gap-2 text-sm text-[#666666] pt-4 border-t border-[#0EA0DC]/10">
                  <span>Resources</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-[#0EA0DC]">{selectedCategory.title}</span>
                </div>
              </DialogHeader>

              {/* Files List */}
              <div className="space-y-3 mt-6">
                {selectedCategory.files.length > 0 ? (
                  selectedCategory.files.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={() => setHoveredFile(file.id)}
                      onMouseLeave={() => setHoveredFile(null)}
                      className="group"
                    >
                      <Card className={`p-4 rounded-xl transition-all duration-200 ${hoveredFile === file.id
                        ? "skygloss-card shadow-lg"
                        : "border border-[#0EA0DC]/10 bg-gray-50"
                        }`}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              {getFileIcon(file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[#272727] truncate mb-1">
                                {file.name}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-[#666666]">
                                <span className="uppercase">{file.type}</span>
                                <span>•</span>
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>Modified {file.lastModified}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className={`flex items-center gap-2 transition-all duration-200 ${hoveredFile === file.id ? "opacity-0" : "opacity-0"
                            }`}>
                            {file.assetPath ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewFile(file)}
                                  className="h-9 px-3 rounded-lg border-[#0EA0DC]/30 hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleDownload(file)}
                                  className="h-9 px-3 rounded-lg bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] transition-all duration-200"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </>
                            ) : file.driveUrl ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewFile(file)}
                                className="h-9 px-3 rounded-lg border-[#0EA0DC]/30 hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Open in Drive
                              </Button>
                            ) : (
                              <span className="text-sm text-gray-400 italic">Resource not available</span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-[#0EA0DC]/20">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-[#666666]">No resources available yet.</p>
                  </div>
                )}
              </div>



              {/* Modal Footer */}
              <div className="mt-6 pt-6 border-t border-[#0EA0DC]/10 flex items-center justify-between">
                <p className="text-sm text-[#666666]">
                  {selectedCategory.files.length} files available
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedCategory.driveUrl, "_blank")}
                  className="border-[#0EA0DC]/30 hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200 rounded-lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Drive
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
