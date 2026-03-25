// Last Updated: 2026-01-26
import { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Image,
  FolderOpen,
  ExternalLink,
  Search,
  Filter,
  X,
  Briefcase,
  Palette,
  ChevronRight,
  Home,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SmartVideoPlayer } from "./SmartVideoPlayer";
import { VIDEO_SUBTITLES } from "../data/videoSubtitles";

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
  bgImage?: string;
}


const resourceCategories: ResourceCategory[] = [
  {
    id: "branding",
    title: "Branding & Visual Assets",
    description: "Official SkyGloss logos, color palettes, typography, and brand guidelines",
    icon: Palette,
    files: [],
    filterType: "branding",
    driveUrl: "https://drive.google.com/drive/folders/1dCMBekDy7HTlWZP0kxsGM7f64zL3HNlk",
    bgImage: "resource_branding_bg.png",
  },
  {
    id: "photography",
    title: "Product Media",
    description: "High-resolution product images, lifestyle shots, and application photos",
    icon: Image,
    files: [],
    filterType: "images",
    driveUrl: "https://drive.google.com/drive/folders/1bH8uyvV4rI1x4yBKeXDYSVJbTZC9flpk",
    bgImage: "resource_media_bg.png",
  },
  {
    id: "marketing",
    title: "Marketing Collaterals",
    description: "Official SkyGloss product catalogs and brochures",
    icon: FileText,
    files: [],
    filterType: "marketing",
    driveUrl: "https://drive.google.com/drive/folders/1WDd-UIiG6lmSCEGi9ur4x0gkSOPX-eKq",
    bgImage: "resource_marketing_bg.png",
  },
  {
    id: "shop_documents",
    title: "Shop Documents",
    description: "SkyGloss corporate and master distributor presentations",
    icon: Briefcase,
    files: [],
    filterType: "documents",
    driveUrl: "https://drive.google.com/drive/folders/1YMeEukEF5WEy14Kb414ykWc6N5GRn78E",
    bgImage: "resource_documents_bg.png",
  },
  {
    id: "support",
    title: "Support Resources",
    description: "Technical support, FAQs, and dealer assistance materials",
    icon: Briefcase,
    files: [],
    filterType: "documents",
    driveUrl: "https://drive.google.com/drive/folders/1IvqoGF2kknjkONEQzhrB9xprkJaQXwgG",
    bgImage: "resource_support_bg.png",
  },
  {
    id: "main_drive",
    title: "Main Resource Drive",
    description: "Access all SkyGloss resources, dealer assets, and marketing materials",
    icon: FolderOpen,
    files: [],
    filterType: "all",
    driveUrl: "https://drive.google.com/drive/folders/1lClixrZVE7zDQnVK2ivwoRTxWG5Ep_ny?usp=drive_link",
    bgImage: "resource_drive_bg.png",
  },
];

interface ResourcesPageProps {
  onBack?: () => void;
}


export function ResourcesPage({ onBack: _onBack }: ResourcesPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedCategory, _setSelectedCategory] = useState<ResourceCategory | null>(null);
  const [_hoveredFile, _setHoveredFile] = useState<string | null>(null);

  const filteredCategories = resourceCategories.filter((category) => {
    const matchesSearch = category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || category.filterType === filterType;
    return matchesSearch && matchesFilter;
  });


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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card
                className="skygloss-card p-0 rounded-[32px] h-full rounded-2xl flex flex-col group cursor-pointer overflow-hidden border-0 shadow-lg relative min-h-[300px]"
                onClick={() => window.open(category.driveUrl, "_blank")}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: category.bgImage ? `url(/${category.bgImage})` : 'none',
                      backgroundColor: '#272727'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:bg-black/60 transition-all duration-300" />
                </div>

                <div className="relative z-10 p-8 flex flex-col h-full " style={{ backgroundColor: '#00000085' }} >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 group-hover:bg-[#0EA0DC] transition-all duration-300 border border-white/20">
                    <category.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {category.title}
                  </h3>

                  <p className="text-gray-300 mb-8 flex-1 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white" style={{ borderColor: '#0EA0DC' }}>
                    <span className="text-sm font-bold text-white tracking-wider uppercase">
                      Open Drive
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#0EA0DC] flex items-center justify-center text-white transform group-hover:translate-x-1 transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
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
                <a href="/support" className="text-[#0EA0DC] hover:underline transition-all duration-200">
                  Contact support
                </a>
                {" "}for assistance or request additional resources
              </p>
            </div>
          </Card>
        </motion.div>

        {/* SkyGloss Resources Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="skygloss-card p-8 rounded-3xl border-0 shadow-2xl relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0EA0DC]/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0EA0DC]/10 rounded-2xl flex items-center justify-center text-[#0EA0DC]">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#272727]">SkyGloss Training Videos</h2>
                  <p className="text-sm text-[#666666]">Professional application techniques and product walkthroughs</p>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <SmartVideoPlayer
                  url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411487/Step_1_Light_Wash_nszzj0.mp4"
                  subtitles={VIDEO_SUBTITLES["Step_1_Light_Wash"]}
                />
              </div>

              <div className="mt-8 p-4 bg-[#0EA0DC]/5 rounded-2xl border border-[#0EA0DC]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0EA0DC] rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-[#272727]">Translation Mode Enabled</span>
                </div>
                <p className="text-xs text-[#666666]">Click the Globe icon in the player to translate subtitles to your language.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>



    </div>
  );
}
