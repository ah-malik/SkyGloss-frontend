import { useState, useEffect } from "react";
import {
    ArrowLeft,
    CheckCircle,
    ChevronRight,
    ShieldAlert,
    ShieldCheck,
    Wrench,
    Info,
    Droplets,
    Zap,
    Wind,
    BookOpen,
    Check,
    MessageSquare,
    Clock,
    AlertTriangle
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const VideoPlayer = ({ url }: { url: string }) => (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 mb-8 border border-gray-100 group shadow-lg">
        <video
            src={url}
            controls
            className="w-full h-full object-cover"
        >
            Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
);

interface Section {
    id: string;
    title: string;
    subsections?: { id: string; title: string }[];
}

const sections: Section[] = [
    {
        id: "overview",
        title: "Section A: Product Overview",
        subsections: [
            { id: "intro", title: "What is FUSION?" },
            { id: "safety", title: "Safety Summary" }
        ]
    },
    {
        id: "technical",
        title: "Section B: Technical Product Data",
        subsections: [
            { id: "data", title: "Data Matrix" },
            { id: "storage", title: "Storage & Shelf Life" }
        ]
    },
    {
        id: "prep",
        title: "Section C: Vehicle Preparation",
        subsections: [
            { id: "step1", title: "Step 1: Light Wash" },
            { id: "step2", title: "Step 2: Vehicle Inspection" },
            { id: "step3", title: "Step 3: Remove Attachments" },
            { id: "step4", title: "Step 4: Exfoliate" },
            { id: "step5", title: "Step 5: Heavy Wash" },
            { id: "step6", title: "Step 6: Etch" },
            { id: "step7", title: "Step 7: Mask" }
        ]
    },
    {
        id: "application",
        title: "Section D: Fusion Application",
        subsections: [
            { id: "step8", title: "Step 8: Mixing Fusion" },
            { id: "step9", title: "Step 9: First Pour" },
            { id: "step10", title: "Step 10: Tack Cloth" },
            { id: "step11", title: "Step 11: Apply Fusion" },
            { id: "step12", title: "Step 12: Quality Check" },
            { id: "step13", title: "Step 13: Clean Bottle" }
        ]
    },
    {
        id: "aftercare",
        title: "Section E: Aftercare",
        subsections: [
            { id: "care", title: "Aftercare Instructions" }
        ]
    },
    {
        id: "troubleshooting",
        title: "Section F: Troubleshooting",
        subsections: [
            { id: "removal", title: "Removing FUSION" },
            { id: "issues", title: "Application Issues" }
        ]
    }
];

export function FusionGuide({ onBack }: { onBack: () => void }) {
    const [activeSub, setActiveSub] = useState("intro");
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

    const totalSteps = sections.reduce((acc, s) => acc + (s.subsections?.length || 0), 0);
    const progress = (completedSteps.length / totalSteps) * 100;

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveSub(id);
        }
    };

    const markComplete = (id: string) => {
        if (!completedSteps.includes(id)) {
            setCompletedSteps([...completedSteps, id]);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSub(entry.target.id);
                    }
                });
            },
            { threshold: 0.5, rootMargin: "-100px 0px -50% 0px" }
        );

        sections.forEach(s => s.subsections?.forEach(sub => {
            const el = document.getElementById(sub.id);
            if (el) observer.observe(el);
        }));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-white pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-8">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5 rounded-xl"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Courses
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <main className="lg:col-span-2 space-y-12">
                        {/* Hero Section */}
                        <div className="bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-100 relative overflow-hidden group mb-3">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Zap className="w-64 h-64 text-[#0EA0DC]" />
                            </div>
                            <div className="relative z-10">
                                <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 mb-4 px-3 py-1 font-bold">
                                    FUSION PROFESSIONAL APPLICATION GUIDE
                                </Badge>
                                <h1 className="text-4xl sm:text-5xl font-bold text-[#272727] mb-4 tracking-tighter italic uppercase">
                                    <span className="text-[#0EA0DC]">FUSION</span> Professional Guide
                                </h1>
                                <p className="text-[#666666] text-lg max-w-2xl mb-8 font-medium">
                                    FUSION is a professional product. If not used correctly, fixing mistakes can be time consuming, and potentially damaging. Do not use FUSION without a full proper understanding of its intended purpose and training.
                                </p>
                                <p className="text-[#666666] text-lg max-w-2xl mb-8 font-medium">
                                    FUSION is a foundation product and does not need to be oversold. The results of FUSION will vary based on the original clearcoat condition. The more damage the paint finish has the more FUSION has to repair.
                                </p>
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <BookOpen className="w-4 h-4 text-[#0EA0DC]" />
                                        SkyGloss • Product Name: FUSION
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <Clock className="w-4 h-4 text-[#0EA0DC]" />
                                        Clearcoat Fusion Technology
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        {completedSteps.length}/{totalSteps} modules verified
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-3">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-[#272727] uppercase tracking-wider">Course Progress</span>
                                <span className="text-sm font-bold text-[#0EA0DC]">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2.5 bg-gray-100" />
                        </div>

                        {/* SECTION A: PRODUCT OVERVIEW */}
                        <div id="intro" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                    SECTION A: PRODUCT OVERVIEW
                                </Badge>
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                    FUSION is a 2-part chemical product
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-[#0EA0DC] mb-3 italic">What FUSION Does</h4>
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            FUSION is designed to fuses an extremely high grade clearcoat, just like the manufacturer uses, into an automotive paint finish relying on a chemical adhesion to permanently bond and weld itself into the original finish. FUSION can only be applied to clearcoat with integrity.
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-[#272727] mb-3">What FUSION Is NOT</h4>
                                        <p className="text-sm text-[#666666] font-medium leading-relaxed">
                                            FUSION will not bond or fix failing or broken clearcoat. FUSION is only as good as the foundation underneath. This is why it's critical to use FUSION to educate the market that this is something you do before your clearcoat develops and integrity issues set in. FUSION will almost always improve a vehicle appearance and in a lot of cases if you manage expectations your customers would be happy with what you are delivering. However, severely damaged paint finishes that FUSION is applied to will not last.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-900 p-8 rounded-2xl mb-12 relative overflow-hidden">
                                    {/* <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <ShieldCheck className="w-24 h-24" />
                                    </div> */}
                                    <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-[#0EA0DC] mb-4">Intended User</h4>
                                    <ul className="space-y-4 relative z-10">
                                        <li className="text-sm font-medium flex gap-3 ">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#0EA0DC] mt-2 shrink-0" />
                                            You must be trained and SkyGloss Certified to use FUSION.
                                        </li>
                                        <li className="text-sm font-medium flex gap-3 ">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#0EA0DC] mt-2 shrink-0" />
                                            Your shop environment must be clean, free from silicon and contamination in the air, have good lighting and applied in a climate-controlled environment.
                                        </li>
                                        <li className="text-sm font-medium flex gap-3 ">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#0EA0DC] mt-2 shrink-0" />
                                            Controlled installation are the only way to achieve professional quality results.
                                        </li>
                                    </ul>
                                </div>

                                <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411487/Step_1_Light_Wash_nszzj0.mp4" />

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('intro')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('intro') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('intro') ? <><CheckCircle className="w-5 h-5 mr-2" /> Protocol Verified</> : 'Verify Standard'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* Safety Summary */}
                        <div id="safety" className="scroll-mt-32">
                            <div className="flex items-center gap-4 mb-8 mt-6">
                                <div className="h-[1px] flex-1 bg-gray-200" />
                                <h3 className="text-xs font-bold text-[#0EA0DC] uppercase tracking-[0.3em] flex items-center gap-3">
                                    <ShieldAlert className="w-4 h-4" /> Safety Summary
                                </h3>
                                <div className="h-[1px] flex-1 bg-gray-200" />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <Card className="p-6 rounded-2xl border-gray-100 bg-white">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 text-[#0EA0DC]">
                                        <Wind className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-sm text-[#272727] mb-2">Respirator</h4>
                                    <p className="text-xs text-[#666666] font-medium">
                                        Technicians while applying FUSION should always use an approved PPE vapor respirator. Because we're not aspirating anything into the air the only thing that we're concerned is vapor and smell.
                                    </p>
                                </Card>

                                <Card className="p-6 rounded-2xl border-gray-100 bg-white">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 text-[#0EA0DC]">
                                        <Wind className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-sm text-[#272727] mb-2">Gloves</h4>
                                    <p className="text-xs text-[#666666] font-medium">
                                        Never get FUSION on your hands. Always wear nitrile gloves.
                                    </p>
                                </Card>

                                <Card className="p-6 rounded-2xl border-gray-100 bg-white">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 text-[#0EA0DC]">
                                        <Wind className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-sm text-[#272727] mb-2">Ventilation</h4>
                                    <p className="text-xs text-[#666666] font-medium">
                                        Never apply FUSION without air flow and ventilation. Do not apply FUSION if there is major air movement on the surface of the vehicle as this will cause FUSION to dry up too quickly.
                                    </p>
                                </Card>

                                <Card className="p-6 rounded-2xl border-gray-100 bg-white">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 text-[#0EA0DC]">
                                        <Wind className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-sm text-[#272727] mb-2">Safety Warnings</h4>
                                    <p className="text-xs text-[#666666] font-medium">
                                        Please refer to the Safety Data Sheet (SDS) should FUSION get your skin, eyes or has been ingested.
                                    </p>
                                </Card>
                            </div>

                            <div className="mt-4 flex justify-end mb-8">
                                <Button
                                    onClick={() => markComplete('safety')}
                                    className={`rounded-xl px-8 h-10 font-bold text-xs uppercase tracking-widest transition-all ${completedSteps.includes('safety') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                >
                                    {completedSteps.includes('safety') ? 'Safety Verified' : 'Confirm Safety'}
                                </Button>
                            </div>
                        </div>

                        {/* SECTION B: TECHNICAL PRODUCT DATA */}
                        <div id="data" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">
                                <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                    SECTION B: TECHNICAL PRODUCT DATA
                                </Badge>

                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h4 className="font-bold text-sm text-[#272727] mb-4">Product Components</h4>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between text-sm">
                                                <span className="text-[#666666]">Component A:</span>
                                                <span className="font-medium text-[#272727]">Element</span>
                                            </li>
                                            <li className="flex justify-between text-sm">
                                                <span className="text-[#666666]">Component B:</span>
                                                <span className="font-medium text-[#272727]">Aether</span>
                                            </li>
                                            <li className="flex justify-between text-sm">
                                                <span className="text-[#666666]">Mixing Ratio:</span>
                                                <span className="font-medium text-[#272727]">1:1</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-sm text-[#272727] mb-4">Application Volume</h4>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between text-sm">
                                                <span className="text-[#666666]">Small Vehicle:</span>
                                                <span className="font-medium text-[#272727]">(5-6 oz) 148-177 mL</span>
                                            </li>
                                            <li className="flex justify-between text-sm">
                                                <span className="text-[#666666]">Medium Vehicle:</span>
                                                <span className="font-medium text-[#272727]">(6-7 oz) 177-207 mL</span>
                                            </li>
                                            <li className="flex justify-between text-sm">
                                                <span className="text-[#666666]">Large Vehicle:</span>
                                                <span className="font-medium text-[#272727]">(7-8 oz) 207-237 mL</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="font-bold text-sm text-[#272727] mb-2">Pot Life</h4>
                                    <p className="text-sm text-[#666666] mb-1">You must wait 10 minutes after mixing the two components before applying to a vehicle.</p>
                                    <p className="text-sm text-[#666666]">Once mixed, FUSION is good for 2 hours before you must discard.</p>
                                </div>

                                <div id="storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <h4 className="font-bold text-sm text-[#272727] mb-3">Storage</h4>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Shelf life (unopened) from the date of purchase is 2 years.</li>
                                        <li>• Shelf life (opened) from the date of opening is 2 months.</li>
                                        <li>• Storage temperature: (50°F-85°F) 10°C-30°C.</li>
                                        <li>• Always store FUSION in a cooler lower humidity environment.</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-sm text-[#272727] mb-3">Environmental Requirements</h4>
                                    <p className="text-sm text-[#666666] mb-2">Temperature of the panel you are applying needs to be between (60°F - 95°F) 16°C - 35°C.</p>
                                    <p className="text-sm text-[#666666]">A vehicle must be left indoors for 12 hours at a minimum temperature (65°F) 19°C before it is ready for the outdoor elements. The higher the temperature after application faster FUSION will cure.</p>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('data')}
                                        className={`rounded-xl px-10 h-12 font-bold transition-all duration-500 ${completedSteps.includes('data') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                    >
                                        {completedSteps.includes('data') ? 'Data Verified' : 'Verify Technical Data'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <Separator className="bg-gray-100" />

                        {/* SECTION C: VEHICLE PREPARATION */}
                        <div className="space-y-12 mt-8">
                            <div className="text-center space-y-4">
                                <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">
                                    SECTION C: VEHICLE PREPARATION
                                </Badge>
                                <p className="text-[#666666] text-sm max-w-xl mx-auto">
                                    The entire preparation is predicated on getting the vehicle as clean and raw as possible. Cleaning, leveling, exfoliating and chemically getting etched in debris out of the pores of the clearcoat. This allows for the best application and adhesion of FUSION.
                                </p>
                            </div>

                            {/* STEP 1: LIGHT WASH */}
                            <div id="step1" className="scroll-mt-32">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 1: LIGHT WASH</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: This step is required to start the cleaning and decontamination process. Every step of the way gets you closer. We call this step LIGHT WASH because it's not about getting a perfectly clean surface but clean enough to see what is going on and examine if there are special steps that are needed or if you can treat the vehicle as normal. Because the vehicle will go through other processes that will dirty the surface again there's no point in getting a perfectly clean vehicle this step."
                                    </p>

                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">What You Are Trying to Achieve</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• A clean enough vehicle that there's no more dirt or debris stuck to the vehicle</li>
                                            <li>• You can clearly see the damage and condition of the original clearcoat</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• 3-5 clean blue microfibers</li>
                                            <li>• Degreaser or heavy dish soap, with little to no fragrances, dye or silicones.</li>
                                            <li>• Alcohol</li>
                                            <li>• Spray or pump bottle</li>
                                            <li>• Mix in a spray or pump bottle, three cap full of degreaser, 90% water, and 10% alcohol</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Divide the vehicle into 3 or 4 sections at a time</li>
                                            <li>• Soak one section at a time and leave for 2-3 minutes</li>
                                            <li>• Wipe clean and dry with microfibers</li>
                                            <li>• Repeat with all section of the vehicle</li>
                                        </ol>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Visual Indicators of Correct Completion</h4>
                                        <p className="text-sm text-[#666666] mb-4">• The vehicle is clean and you can clearly see the condition of the clearcoat underneath.</p>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <p className="text-sm text-[#666666] mb-4">• If the vehicle was extremely dirty, it might be best to do a heavy power wash.</p>
                                    </div>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411487/Step_1_Light_Wash_nszzj0.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step1')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step1') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step1') ? 'Completed' : 'Verify Step 1'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 2: VEHICLE INSPECTION */}
                            <div id="step2" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 2: VEHICLE INSPECTION</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: FUSION is a chemical reaction and if the clearcoat underneath does not have a chemical resistance, there's a chance that FUSION will not level out or even melt the clearcoat making things worse. This process allows us to get a good understanding of the chemical resistance and stability of the original clearcoat."
                                    </p>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Inspection Goals</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• To find out if there are any panels that may not be suitable for FUSION</li>
                                            <li>• To find out if there are any panels that need special attention</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Paper towel</li>
                                            <li>• Acetone</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Using acetone on a folded paper towel, check sections of panels around the vehicle for a chemical reaction.</li>
                                            <li>• Rub the soaked paper towel and see if you see any reaction taking place where that the clearcoat is heating up and become tacky or is scratches very, very easy.</li>
                                            <li>• This indicates that there is very little to know resistance to that particular panel.</li>
                                            <li>• Always make sure to do this on areas that are low and not visually easy to see by the eye because if you do have a chemical reaction, it can strip the clearcoat even strip the paint. This is rare and only poorly repaints typically cause this, but it is something you want to watch out for.</li>
                                        </ol>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Pass / Fail Criteria</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Pass looks like no tackiness or major scratching took place. This indicates that it's fine to move forward with the next steps.</li>
                                            <li>• Fail looks like a scratched panel or very tacky to the touch. If it's light tackiness, then you want to be careful on the Etch step and use minimal pressure and minimal amount of material. If it's heavy, scratching or tackiness, then that panel is better off being polished, and explained to the customer that there was not enough integrity on this panel to be able to rebuild it. Don't take the risks cautious on poorly repainted and lower integrity paint finishes.</li>
                                            <li>• It's also important to keep in mind that during application, if there is integrity issues on the panel, your applicator will stick and not flow as there are some application techniques to overcome this, but it comes through experience.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• You're testing too large of an area and potentially causing noticeable issues. Always small areas not anything large.</li>
                                            <li>• You check one panel or two panels thinking the whole car is okay but you didn't see the few panels that were poorly repainted and during application process if it becomes problematic. Make sure to look at all panels equally and assess them properly.</li>
                                        </ul>
                                    </div>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411487/Step_2_Vehicle_Inspectioin_stbz7x.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step2')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step2') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step2') ? 'Completed' : 'Verify Step 2'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 3: REMOVE ATTACHMENTS */}
                            <div id="step3" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 3: REMOVE ATTACHMENTS</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: Not having emblems or certain moldings around a vehicle can create a cleaner, less contaminated, finish and easier to apply not having to go around tricky obstacles. Removing attachments can be faster and perform better results, but it also can be a liability if the attachments are weak or brittle and prone to break when removing. Often times it's much faster to leave the attachments on. But another strategy is a lot of customers are happy removing attachments, and either replacing them with new fresh ones or just leaving them off entirely. In the Customer Intake Form that you fill out with a customer there is a section asking if they want their attachments removed. We strongly recommend removing attachments that the customers are okay leaving off."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Fishing line</li>
                                            <li>• Adhesive remover</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Using fishing line or any other strategy to remove attachments carefully</li>
                                            <li>• Using adhesive remover or any other product that works well to remove the extra glue and adhesive that has been stuck on the panel.</li>
                                            <li>• Put all license plate and attachments on the front drivers floorboard to ensure that you never forget to put the items back on the vehicle.</li>
                                        </ol>

                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Not communicating clearly with the customer on what they want and what they don't want to miss an opportunity to remove attachments they don't care of leave off.</li>
                                            <li>• Removing attachments that are brittle and breaking, therefore having to replace them at your expense, rather than the customer's.</li>
                                            <li>• Not gluing the attachments back on properly and risking them falling off later.</li>
                                            <li>• Range Rovers in particular with the individual lettering on the hood or the Porsche lettering in the back are always better to remove. When you have individual letters that you have to go around, it is at this time that it becomes much faster and a better results removing them.</li>
                                            <li>• Not having an organized shop and losing the attachments or pieces.</li>
                                        </ul>
                                    </div>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411479/Step_3_Remove_Attachments_re64pv.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step3')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step3') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step3') ? 'Completed' : 'Verify Step 3'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 4: EXFOLIATE */}
                            <div id="step4" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 4: EXFOLIATE</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: Using a 4000, 5000 or 6000 sanding disc, this levels out the paint and removes contaminants that are stuck onto the clearcoat. This decontaminating process helps levels the paint for a clean and consistent application."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• 3mm DA (dual action) sander</li>
                                            <li>• 5'' or 6'' backing plate</li>
                                            <li>• 5'' or 6'' interface pad</li>
                                            <li>• 4000, 5000, 6000 3M Trizact (or similar) sanding disc</li>
                                            <li>• Degreaser</li>
                                            <li>• Blue microfibers</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Using a DA sanding with a 3 mm throw, panel by panel sand even and consistently</li>
                                            <li>• With degreaser and microfiber wipe clean the panel before you go to the next panel.</li>
                                            <li>• No need to get it perfect just wipe off most of the sanding residue to make the next step easier.</li>
                                            <li>• For areas that you cannot get your sander in when you're finished, remove the sanding disc and by hand go around the whole car to sand areas that we're not able to be done with the machine.</li>
                                        </ol>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">


                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Technique Notes</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Pressure: Medium pressure is all that's needed. If you don't use enough pressure it won't sand properly and if you use too much pressure, you're sanding disk will be used up too quickly.</li>
                                            <li>• Speed: Slow, consistent speed will get an even consistent finish.</li>
                                            <li>• Edge Precautions: All edges on modern, clear coats are thin. Do not put much pressure on edges and go over them quickly to avoid burn through. FUSION will not fix burn through.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Visual Confirmation</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• The whole entire vehicle should have a dull, even consistent finish.</li>
                                            <li>• If there are some deeper scratches that are clearly visible and white and you're wondering if they're going to cover with FUSION, you can use Etch and a paper towel to see if the scratch pops through. Before Etch flashes off, this will give you an indication of how FUSION will cover the area.</li>
                                            <li>• Deep scratches through the paint will need to be touched up with actual paint. But deeper clearcoat scratches can be further sanded to fix them.</li>
                                            <li>• To do this, you are going to need to take 2000 sandpaper and a backing plate and lightly sand the scratch by hand without burning through the clearcoat. This will help break down the 2000 scratch and have FUSION repair it better.</li>
                                            <li>• Once done with 2000 you will need to use a 3000 disc to remove the 2000 sanding marks.</li>
                                            <li>• Once you've done that you will need to take the 5000 to remove the 3000 sanding marks.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• The vehicle needed two sanding discs, because of the size or the hardness of the original clear coat. Sanding disc wear down, and most of the time you can use one disc per vehicle, but the sanding disk is no longer working as it should you will need to use a second disc.</li>
                                            <li>• Skipping areas and not sanding thoroughly.</li>
                                            <li>• Too much pressure on edges and burning through the clearcoat. FUSION will not fix burn through and will have to be repainted.</li>
                                            <li>• Sanding areas that shouldn't be like moldings or trim pieces. If you concern about getting the sander too close to these areas, use some masking tape temporarily to avoid touching these areas and then peel the masking tape off when you're done.</li>
                                            <li>• If using a 2000 sanding disc, you don't properly remove the 2000 and bring it back up to a 5000. You will see the sanding marks popping through if you don't do this thoroughly.</li>
                                        </ul>
                                    </div>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411496/Step_4_Exfoliate_njuvqd.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step4')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step4') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step4') ? 'Completed' : 'Verify Step 4'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 5: HEAVY WASH */}
                            <div id="step5" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 5: HEAVY WASH</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: We are now completely done with the dirty work. Everything from here on out is getting the vehicle completely clean using the same materials as the Light Wash Step you are now going to do a Heavy Wash. This is where every door jam, every window, every wheel well should be cleaned and free from debris, the vehicle will have a sanded look to it but completely clean."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• 3-5 clean blue microfibers</li>
                                            <li>• Degreaser or heavy dish soap, with little to no fragrances, dye or silicones.</li>
                                            <li>• Alcohol</li>
                                            <li>• Spray or pump bottle</li>
                                            <li>• Mix in a spray or pump bottle, three cap full of degreaser, 90% water, and 10% alcohol</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Divide the vehicle into 3 or 4 sections</li>
                                            <li>• Soak one section at a time and leave for 2-3 minutes</li>
                                            <li>• Wipe clean and dry with microfibers removing all residue</li>
                                            <li>• Repeat with all section of the vehicle</li>
                                            <li>• Open door jams and clean</li>
                                            <li>• All windows should be clean and streak free</li>
                                            <li>• Moldings should be clean and residue free</li>
                                        </ol>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>

                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Not thoroughly washing wheel wells, windows, or moldings, and having contamination get into the application. Do a thorough and complete wash.</li>
                                            <li>• Not opening up door jams, and not paying attention to the small details of cleaning in edges and hard to reach spots.</li>
                                        </ul>
                                    </div>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411468/Step_5_Heavy_Wash_usilnv.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step5')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step5') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step5') ? 'Completed' : 'Verify Step 5'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 6: ETCH */}
                            <div id="step6" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 6: ETCH</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: For FUSION to adhere properly a chemical reaction needs to take place. Etch does two very important things. 1, it continues to remove debris from the pour of the clearcoat and get the surface extremely clean, and 2, it starts to heat up the original clearcoat to be ready for FUSION application. The Etch process helps promote bonding and is a critical process that can not be done haphazardly."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Paper towel</li>
                                            <li>• Alcohol</li>
                                            <li>• Acetone</li>
                                            <li>• Etch bottle</li>
                                            <li>• White edgeless microfiber</li>
                                            <li>• Gloves</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Fold 3-5 paper towel sections into handheld square</li>
                                            <li>• Mix Etch (90% alcohol 10% acetone)</li>
                                            <li>• Panel by panel with heavy pressure and a good amount of Etch and evenly from top to bottom side to side, wipe the panel down.</li>
                                            <li>• Flip your towel every 2 to 3 passes into a section</li>
                                            <li>• You're wiping off the panel just like you would be cleaning a table</li>
                                            <li>• You should use around 250 mL of product per vehicle.</li>
                                            <li>• After you've done the entire vehicle, you're going to take a clean white microfiber and do the same thing but not soaked the microfiber completely leaving it half dry and halfway with Etch. This is the final wipe. This is where you would get into edges and door jams and making sure every area is thoroughly clean.</li>
                                        </ol>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Missing areas, door jams, and corners. These are actually the areas that you want to make sure to get the most as they are the ones that trapped the most contaminants and dirt that can cause an application issues.</li>
                                            <li>• Not using enough Etch and having the panels truly get a chemical reaction.</li>
                                            <li>• Using light pressure not aggressively using Etch how it should be.</li>
                                            <li>• Using Etch on panels with major integrity issues and causing reaction. If there's a light reaction, just use alcohol with no acetone. If there's a heavy reaction that panel may not be suitable and should be just polished.</li>
                                        </ul>
                                    </div>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411482/Step_6_Etch_oscdyt.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step6')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step6') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step6') ? 'Completed' : 'Verify Step 6'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 7: MASK */}
                            <div id="step7" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 7: MASK</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: Although we're not spraying anything into the air, moldings and trim pieces are not something that you want FUSION to get on. Running a piece of tape along these areas will help guide your application. You never want to purposely touch tape with FUSION because that will cause a chemical reaction and put some contaminants onto your applicator that then can go onto your panel. But it is there to help guide you and protect areas that you might accidentally hit."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• PVC (electrical) tape</li>
                                            <li>• Razor blade / utility knife</li>
                                            <li >• We do not want to use electrical tape as there is no resistance to this can easily contaminate your applicator and panel.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Areas to Mask</h4>
                                        <p className="text-sm text-[#666666] mb-4">• All areas that might be prone to getting FUSION on during application</p>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• The moldings or trim pieces have too much silicone, and the tape is not sticking. Use a little alcohol on the trim pieces and it will help remove silicone or waxes there, prohibiting the tape to stick.</li>
                                            <li>• Not clean lines with your tape and having the tape touch areas that you actually want FUSION on. Make sure to be clean and have straight lines when masking.</li>
                                        </ul>

                                    </div>
                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411454/Step_12_Quality_Check_hf90jk.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step7')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step7') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step7') ? 'Completed' : 'Verify Step 7'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <Separator className="bg-gray-100" />

                        {/* SECTION D: FUSION APPLICATION */}
                        <div className="space-y-12 ">
                            <div className="text-center mb-8 mt-8">
                                <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">
                                    SECTION D: FUSION APPLICATION
                                </Badge>
                            </div>

                            {/* STEP 8: MIXING FUSION */}
                            <div id="step8" className="scroll-mt-32">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 8: MIXING FUSION</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: Fusion needs to be mixed 10 minutes prior to when you will be ready to apply. While getting everything ready and going to the next step mix FUSION and put a timer on it for 10 minutes."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Mix Ratio</h4>
                                        <p className="text-sm text-[#666666] mb-2">• 1:1 with Element and Aether.</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Pot Life Reminder</h4>
                                        <p className="text-sm text-[#666666] mb-4">• Good for 2 hours after mixing</p>
                                    </div>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411429/Step_8_Mixing_Fusion_qktbaz.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step8')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step8') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step8') ? 'Completed' : 'Verify Step 8'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 9: FIRST POUR */}
                            <div id="step9" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 9: FIRST POUR</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: You want to soak your applicator on all edges because you want to make sure that there are no dry spots that will cause dry spots in your application."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Applicator</h4>
                                        <p className="text-sm text-[#666666] mb-2">Using the approved SkyGloss Applicator, pour (0.5 – 1 oz) 15 mL – 30 mL of FUSION evenly on your applicator covering all corners.</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Replacement Rules</h4>
                                        <p className="text-sm text-[#666666]">2 - 3 applicators are needed per vehicle. Your applicator will get dirty if you did not do a good preparation job. Never apply to a panel with a dirty or contaminated applicator if the applicator gets dropped or picks up contamination throw it out and get a new one.</p>
                                    </div>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411427/Step_9_First_Pour_uduqeg.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step9')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step9') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step9') ? 'Completed' : 'Verify Step 9'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 10: TACK CLOTH */}
                            <div id="step10" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 10: TACK CLOTH</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: To remove the last bit of fallen lint and debris right before application."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <p className="text-sm text-[#666666] mb-2">Every 2 to 3 panels, right before application, use a bunched-up tack cloth to lightly go over the edges, jams molding and full panels.</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <p className="text-sm text-[#666666]">• Pressing too much with the tack cloth can actually leave residue onto the panel. There should be a very light pass over the panel as you pick up the remaining amount of dirt and debris.</p>
                                    </div>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411418/Step_10_Tack_Cloth_y9gzzx.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step10')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step10') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step10') ? 'Completed' : 'Verify Step 10'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 11: APPLY FUSION */}
                            <div id="step11" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 11: APPLY FUSION</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: To apply a thick completely leveled out layer of FUSION on the panels intended to build and repair clearcoat."
                                    </p>

                                    <p className="text-sm text-[#666666] mb-4">
                                        Insight: Although FUSION can be applied in a wide range of different temperatures, you will notice that application behavior ranges based upon humidity and temperature. Sometimes it requires you to move faster or apply more product or move slower and apply less product. Once you get comfortable applying you will notice that these different movements are intuitive. It's not so much about an exact scientific way to apply it is about the behavior of FUSION being applied and achieving the desired results. After 20 vehicles, you start to realize these behavior differences, and you will notice the feel of the applications is just as important as the look of the application. There's a learning curve to this so don't get discouraged as it will become second nature the more you do it.
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Environment Conditions</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Lighting Requirements: You must have adequate lighting whether it be mobile lights or a very well-lit environment. Without proper lighting you will miss small and even larger sections and not see drips and lines that you would've otherwise been able to easily correct during the application. Not having good lighting can create a lot of unnecessary work later on.</li>
                                            <li>• Climate: FUSION cannot be applied outdoors or an environment with lots of air movement. Always turn off any type of air circulation during application to ensure a smooth application and everything will level out properly. Make sure your panel temperature is between (60°F - 95°F) 16°C - 35°C for best results and ease of application.</li>
                                        </ul>

                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Application Order</h4>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Top surfaces (roof, hood and trunk lid)</li>
                                            <li>• Sides (right and left)</li>
                                            <li>• Bumpers (front and back)</li>
                                        </ol>

                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Application</h4>
                                        <p className="text-sm text-[#666666] mb-2">With a properly loaded applicator start from one top corner of the panel and work yourself all the way to the bottom catty-corner. You are using medium pressure and medium speed. If you have too much pressure, you won't put enough product on the vehicle. If you don't use enough pressure, your application will be sloppy and prone to application runs. If you go to fast you won't leave enough product on and if you go too slow, it's going to cure up on you and will not be able to get one continuous application for it to level out correctly.</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Overlap Rule</h4>
                                        <p className="text-sm text-[#666666] mb-2">You will overlap your lines 50% as you work your way through the panel. Do not overlap sections that have already started curing or you will leave streaks.</p>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>Dry spots in your applicator. Make sure when you apply product to your applicator your getting all corners.</li>
                                            <li>Working too fast will always result in a thinner application. Do not try and speed up your application so you always have a thick proper layer.</li>
                                            <li>Leaving a panel that has issues thinking that it's going to disappear tomorrow. It is true that leveling application can correct its own mistakes like drips or lines that aren't completely leveled out. But after 30 minutes, if it doesn't have a desirable result, you must strip down the panel and redo it. Those mistakes will not go away and you will spend more time fixing the next day.</li>
                                            <li>Yes you can correct certain mistakes the next day. Like slight imperfections like little contamination issues, dry spots, absorption, or miss spots. But unless they're minor, do not think that it's going to be easier to fix the next day. Strip the panel immediately and redo it. It will always be faster.</li>
                                            <li>After one hour - do not remove FUSION. If there is an issue that you see hours later, or the next day, these issues can be corrected, but you'll have to refer to the troubleshooting section below and they are often tedious, and time-consuming. This is why it's critically important to check your work every single panel before you go onto the next panel.</li>
                                            <li className="font-bold text-red-600">DO NOT LEAVE MISTAKES TO CURE!</li>
                                        </ul>
                                    </div>
                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411411/Step_11_Apply_Fusion_qjonbg.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step11')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step11') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step11') ? 'Completed' : 'Verify Step 11'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 12: QUALITY CHECK */}
                            <div id="step12" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-red-500">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 12: QUALITY CHECK</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: Once FUSION cures it is a permanent bond. You have maximum 1 hour to remove FUSION should you see an issue. This is why it's critical to check your work before you go onto the next panel. You will want to be checking your application after each panel, and after each section and a complete check once you finish the entire vehicle."
                                    </p>

                                    <p className="text-sm text-[#666666] font-bold mb-4">NEVER, leave a poor application or an application issue for another day. Remove it immediately assess the problem and redo it. This is a lot quicker than trying to fix it later.</p>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411454/Step_12_Quality_Check_hf90jk.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step12')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step12') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step12') ? 'Completed' : 'Verify Step 12'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 13: CLEAN APPLICATOR BOTTLE */}
                            <div id="step13" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 13: CLEAN APPLICATOR BOTTLE</h3>

                                    <p className="text-sm text-[#666666] mb-4 italic">
                                        "Purpose: It's critically important to thoroughly clean the applicator bottle with alcohol and multiple rinsing if you plan to use it again. We recommend never using an applicator bottle more than 10 times because no matter how clean you get it there is always potential for contamination breaking down in a used applicator bottle. The cleaning of the applicator bottle is not just critical for the inside but the outside as well every time you clean it if you do a thorough job, it should look brand new or close to it."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Gloves</li>
                                            <li>• ETCH</li>
                                            <li>• Paper towel</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Dump all remaining FUSION out.</li>
                                            <li>• Put (1oz) 15 mL of ETCH into the bottle. Put cap on</li>
                                            <li>• Shake and pour out. Repeat 3 times</li>
                                            <li>• Fold paper towel with ETCH and clean outside multiple times flipping the paper towel to new sections each time until fully clean</li>
                                            <li>• Turn bottle upside down on a clean table and let dry</li>
                                        </ol>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <p className="text-sm text-[#666666]">• Not doing a thorough job leaving the inside and outside building up FUSION particles each time. Once it is not cleaned good once, it will never recover. Always clean thoroughly each and every time.</p>
                                    </div>
                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411464/Step_13_Clean_Applicator_Bottle_yapl9s.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('step13')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('step13') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('step13') ? 'Completed' : 'Verify Step 13'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <Separator className="bg-gray-100" />

                        {/* SECTION E: AFTERCARE */}
                        <div id="care" className="scroll-mt-32 mt-8">
                            <div className="text-center mb-8 mt-8">
                                <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">
                                    SECTION E: AFTERCARE
                                </Badge>
                            </div>
                            <Card className="p-6 rounded-2xl border-l-4 border-l-green-500 ">



                                <p className="text-sm font-bold mb-4">DOWNLOAD CARE INSTRUCTIONS HANDOUT HERE</p>
                                <div className="bg-gray-50 p-6 rounded-2xl">


                                    <h4 className="font-bold text-sm text-[#272727] mb-2">Immediate Aftercare</h4>
                                    <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                        <li>After 12 hours, always apply SEAL for a breathable sealant during full 2-week cure. This will keep water and dirt off.</li>
                                        <li>Do not wash for 2-weeks after application</li>
                                    </ul>
                                </div>

                                <p className="text-sm text-[#666666]">Aftercare Handout: Make sure to give this to your customer to get the most out of their SkyGloss Service.</p>

                                <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411502/Aftercare_xjyv47.mp4" />

                                <div className="flex justify-end mt-4">
                                    <Button
                                        onClick={() => markComplete('care')}
                                        className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('care') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                    >
                                        {completedSteps.includes('care') ? 'Completed' : 'Verify Aftercare'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* SECTION F: TROUBLESHOOTING */}
                        <div className="space-y-8">
                            <div className="text-center mt-8 mb-8">
                                <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">
                                    SECTION F: TROUBLESHOOTING
                                </Badge>
                            </div>

                            {/* Removing FUSION */}
                            <div id="removal" className="scroll-mt-32">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-red-500">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">Removing FUSION</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        FUSION can be removed 2 different ways. In the first hour before it is too cured with chemicals or 2-weeks after full cure by sanding it off.
                                    </p>
                                    <p className="text-sm text-[#666666] mb-4">
                                        It is always best if you must sand off FUSION that it is fully cured as it is going to sand more consistently and not gum up your sanding discs.
                                    </p>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Removing FUSION before 1 Hour:</h4>
                                        <h5 className="font-bold text-xs text-[#666666] mb-1">Tools & Materials</h5>
                                        <ul className="list-disc pl-5 mb-3 text-sm text-[#666666]">
                                            <li>• Gloves</li>
                                            <li>• ETCH</li>
                                            <li>• Paper towel</li>
                                            <li>• White microfiber</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h5 className="font-bold text-xs text-[#666666] mb-1">Process</h5>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Being careful not to touch your other panels and only the panel you want to remove FUSION, fold up paper towel and load up ETCH.</li>
                                            <li>• Making 1 pass at a time and firm pressure wipe off FUSION.</li>
                                            <li>• Each wipe you must flip your paper towel to a new section otherwise you will put FUSION right back on the panel.</li>
                                            <li>• After it is all wiped off you will still see some slight amount of haze and residue, with a clean white microfiber and a little ETCH on the microfiber, remove all the extra haze - wiping the panel clean. Discard the microfiber as any amount of FUSION will never be able to wash out of it.</li>
                                        </ol>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Removing FUSION after 2 weeks:</h4>
                                        <h5 className="font-bold text-xs text-[#666666] mb-1">Tools & Materials</h5>
                                        <ul className="list-disc pl-5 mb-3 text-sm text-[#666666]">
                                            <li>• 1,500 sanding discs</li>
                                            <li>• 3,000 sanding discs</li>
                                            <li>• 5,000 sanding discs</li>
                                            <li>• Water and spray bottle</li>
                                            <li>• Cleaning microfibers</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h5 className="font-bold text-xs text-[#666666] mb-1">Process</h5>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Section by section starting with 1,500 grit sand off FUSION. Do not go too deep or you will risk burn through.</li>
                                            <li>• Then follow it with 3,000 and then 5,000</li>
                                            <li>• You can reapply FUSION after.</li>
                                            <li>• If this is your first time doing this, contact our Technical Team to get even more tips as this can be a long and tedious process. If not done correctly, you can sand through the original paint.</li>
                                        </ol>
                                    </div>
                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411491/Troubleshooting_Removing_Fusion_pn0itl.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('removal')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('removal') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('removal') ? 'Completed' : 'Verify Removal'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Correcting Application Issues */}
                            <div id="issues" className="scroll-mt-32">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-red-500">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">Correcting Application Issues</h3>

                                    <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                        <li>You can reapply FUSION over FUSION as many times as you want if it is cured before applying the next layer.</li>
                                        <li>Depending on the substrate condition, you can apply two coats of FUSION, the first one will act as a base coat and the second one will act as a finish coat.</li>
                                        <li>Full cure is 2-weeks. However, a curing lamp can speed up the process and you can apply right after you cured it. 20 min on with the lamp, 20 mins off, 20 mins on and then a 20 min cool down, and it will be ready to reapply. Make sure to get all sections of the panel so FUSION is evenly cured.</li>
                                    </ul>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className="list-decimal pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Wash vehicle</li>
                                            <li>• Hand sand with 5000 grit disc</li>
                                            <li>• Wash again</li>
                                            <li>• With a clean white microfiber do a light pass with ETCH</li>
                                            <li>• Tack cloth</li>
                                            <li>• Reapply</li>
                                        </ol>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <p className="text-sm text-[#666666] mb-4">• FUSION is not cured yet and it reactivates the first application. This will cause the panel to get sticky and mess up the application even more. Leave it be to fully cure.</p>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">

                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Sticky Application</h4>
                                        <ul className="list-disc pl-5 mb-4 text-sm text-[#666666]">
                                            <li>This is due to the clearcoat underneath being too soft or not chemical resistant to FUSION.</li>
                                            <li>If the panels clearcoat is weak, using ETCH can soften up the panel and cause FUSION to reaction during application.</li>
                                            <li>This will cause the applicator to stick to the panel.</li>
                                            <li>If the reaction is light, you can load up more product and try and create a Barrier between the two surfaces for it to slide over easier and hope to level out.</li>
                                            <li>If this is not working, you will have to cure the panel and try again or remove FUSION and just polish that panel as FUSION will not be able to be applied to as there is just not enough chemical resistance for FUSION to set up correctly.</li>
                                        </ul>
                                    </div>

                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411480/Troubleshooting_Correcting_Application_Issues_zasrj3.mp4" />
                                    <VideoPlayer url="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411468/Troubleshooting_Sticky_Application_vztdru.mp4" />

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={() => markComplete('issues')}
                                            className={`rounded-xl px-8 h-10 font-bold text-xs ${completedSteps.includes('issues') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                        >
                                            {completedSteps.includes('issues') ? 'Completed' : 'Verify Issues'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Final Note */}
                            <Card className="p-6 rounded-2xl bg-gray-50">
                                <h3 className="text-lg font-bold text-[#272727] mb-4">FINAL NOTE</h3>
                                <p className="text-sm text-[#666666] mb-4">
                                    Thank you for going through these instructions so carefully. This structure is intentional. Please do not simplify it. Follow every step every time, whether be a Suzuki or Bentley.
                                </p>
                                <p className="text-sm text-[#666666] mb-4">
                                    SkyGloss is fully committed to providing technical support. Should you need it and when you need it. Please contact your distributor immediately if you have any technical questions or need some support navigating through anything that you're experiencing in your shop.
                                </p>
                                <p className="text-sm text-[#666666] mb-4">
                                    Also keep in mind, it is not whether FUSION works or doesn't work it's whether it was prepared properly and the clearcoat has integrity enough to get the results desired. You never have to oversell what FUSION can do or be concerned by the outcome because FUSION is consistent but clearcoat finishes vary. Because every vehicle needs more clearcoat, FUSION is always building integrity back to the vehicle no matter the starting point of the paint finish.
                                </p>
                                <div className="text-xs text-[#666666] mt-4 pt-4 border-t border-gray-200">
                                    <p>skygloss.com</p>
                                    <p>SKYGLOSS, INC. 21575 N 11TH PL, UNIT 120, PHOENIX, AZ 85024 UNITED STATES. 602 705 3343. INFO@SKYGLOSS.COM. SKYGLOSS.COM</p>
                                </div>
                            </Card>
                        </div>

                        {/* Completion Footer */}
                        <div className="py-12">
                            <Card className="p-8 rounded-2xl bg-[#272727] text-white text-center">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-[#0EA0DC]" />
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Professional Deployment Complete</h2>
                                <p className="text-white/70 text-sm mb-8">
                                    "Integrity is the final product. Every vehicle restored represents a commitment to chemical excellence."
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button onClick={onBack} className="bg-white text-[#272727] hover:bg-gray-100">
                                        EXIT TERMINAL
                                    </Button>
                                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                                        DOWNLOAD PDF
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <Card className="p-4 rounded-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="w-4 h-4 text-[#0EA0DC]" />
                                    <h3 className="font-bold text-[#272727]">Guide Content</h3>
                                </div>
                                <ScrollArea className="h-[500px]">
                                    <div className="space-y-4">
                                        {sections.map((section) => (
                                            <div key={section.id} className="space-y-1">
                                                <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider px-2">
                                                    {section.title}
                                                </div>
                                                <div className="space-y-1">
                                                    {section.subsections?.map((sub) => {
                                                        const isCompleted = completedSteps.includes(sub.id);
                                                        const isActive = activeSub === sub.id;
                                                        return (
                                                            <button
                                                                key={sub.id}
                                                                onClick={() => scrollTo(sub.id)}
                                                                className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded text-xs transition-colors ${isActive ? 'bg-[#0EA0DC] text-white' : 'hover:bg-gray-100 text-[#666666]'
                                                                    }`}
                                                            >
                                                                {isCompleted ? (
                                                                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                                                                ) : (
                                                                    <ChevronRight className="w-3 h-3" />
                                                                )}
                                                                <span className="font-medium">{sub.title}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </Card>

                            <Card className="p-4 rounded-2xl bg-[#0EA0DC] text-white">
                                <h4 className="font-bold text-sm mb-2">Technical Support</h4>
                                <p className="text-xs text-white/80 mb-4">24/7 support for certified technicians</p>
                                <Button className="w-full bg-white text-[#0EA0DC] hover:bg-gray-100 text-xs h-8">
                                    <MessageSquare className="w-3 h-3 mr-2" />
                                    Contact Support
                                </Button>
                            </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}