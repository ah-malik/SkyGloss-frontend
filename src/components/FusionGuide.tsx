import { useState, useEffect } from "react";
import api from "../api/axios";
import {
    ArrowLeft,
    CheckCircle,
    ChevronRight,
    ShieldAlert,
    Zap,
    Wind,
    BookOpen,
    Clock
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "../AuthContext";
import { SmartVideoPlayer } from "./SmartVideoPlayer";


import FusionPdf from "../assets/pdf/Fusion.pdf";

// Replaced local VideoPlayer with global SmartVideoPlayer for translation support

interface Section {
    id: string;
    title: string;
    subsections?: { id: string; title: string }[];
}

const sections: Section[] = [
    {
        id: "fusion_overview",
        title: "Section A: Product Overview",
        subsections: [
            { id: "fusion_intro", title: "What is FUSION?" },
            { id: "fusion_safety", title: "Safety Summary" }
        ]
    },
    {
        id: "fusion_technical",
        title: "Section B: Technical Product Data",
        subsections: [
            { id: "fusion_data", title: "Data Matrix" },
            { id: "fusion_storage", title: "Storage & Shelf Life" }
        ]
    },
    {
        id: "fusion_prep",
        title: "Section C: Vehicle Preparation",
        subsections: [
            { id: "fusion_step1", title: "Step 1: Light Wash" },
            { id: "fusion_step2", title: "Step 2: Vehicle Inspection" },
            { id: "fusion_step3", title: "Step 3: Remove Attachments" },
            { id: "fusion_step4", title: "Step 4: Exfoliate" },
            { id: "fusion_step5", title: "Step 5: FINAL Wash" },
            { id: "fusion_step6", title: "Step 6: Etch" },
            { id: "fusion_step7", title: "Step 7: Taping" }
        ]
    },
    {
        id: "fusion_application",
        title: "Section D: Fusion Application",
        subsections: [
            { id: "fusion_step8", title: "Step 8: Mixing Fusion" },
            { id: "fusion_step9", title: "Step 9: First Pour" },
            { id: "fusion_step10", title: "Step 10: Tack Cloth" },
            { id: "fusion_step11", title: "Step 11: Apply Fusion" },
            { id: "fusion_step12", title: "Step 12: Quality Check" },
            { id: "fusion_step13", title: "Step 13: Clean Bottle" }
        ]
    },
    {
        id: "fusion_extra_videos",
        title: "Additional FUSION Application Videos",
        subsections: [
            { id: "fusion_extra_bmw", title: "BLUE BMW SUV" },
            { id: "fusion_application_videos", title: "FUSION APPLICATION VIDEOS" }
        ]
    },
    {
        id: "fusion_aftercare",
        title: "Section E: Aftercare",
        subsections: [
            { id: "fusion_care", title: "Aftercare Instructions" }
        ]
    },
    // {
    //     id: "fusion_troubleshooting",
    //     title: "Section F: Troubleshooting",
    //     subsections: [
    //         { id: "fusion_removal", title: "Removing FUSION" },
    //         { id: "fusion_issues", title: "Application Issues" }
    //     ]
    // }
];

export function FusionGuide({ onBack }: { onBack: () => void }) {
    const { user, setUser } = useAuth();
    const [activeSub, setActiveSub] = useState("fusion_intro");
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

    const vehicleVideoSets = [
        {
            id: "fusion_extra_bmw",
            label: "BLUE BMW SUV",
            description: "Additional application videos for the Blue BMW SUV project.",
            videos: [
                { name: "BMW SUV - Hood.mp4", url: "" },
                { name: "BMW SUV - Front Bumper.mp4", url: "" },
                { name: "BMW SUV - Fender.mp4", url: "" },
                { name: "BMW SUV - Door.mp4", url: "" },
                { name: "BMW SUV - Quarter Panel.mp4", url: "" },
                { name: "BMW SUV - Trunk.mp4", url: "" },
                { name: "BMW SUV - Roof.mp4", url: "" }
            ]
        },
        {
            id: "fusion_application_videos",
            label: "FUSION Application Videos",
            description: "Detailed application and after-shot videos.",
            videos: [
                { name: "Roof After Shot", url: "https://drive.google.com/file/d/1w7PfWwt2GN--cQuATlyz_EFrdAfHfRw4/preview", isEmbed: true },
                { name: "Passenger Side After Shot", url: "https://drive.google.com/file/d/1KkHlAw6sL8r4j34Bu17rouD7K3-3aaiB/preview", isEmbed: true },
                { name: "Hood Before Shot", url: "https://drive.google.com/file/d/1Aj6KbpIhAPvLEPVC9lGgTJe6aQhikqCl/preview", isEmbed: true },
                { name: "Hood After Shot", url: "https://drive.google.com/file/d/1iGk2sq-YPuTpPcPQ2RJq-ErZdzT_w_aF/preview", isEmbed: true },
                { name: "Hood After Shot 2", url: "https://drive.google.com/file/d/1VcPutgURxnmJPZl_IXC9uIFZOpAzLrTR/preview", isEmbed: true },
                { name: "Roof Application", url: "https://drive.google.com/file/d/1OPEFLbL3T-hBzIX1VRLrMI6dYIjAZccd/preview", isEmbed: true },
                { name: "Rear Hatch Application", url: "https://drive.google.com/file/d/1phIaNTfw8PMX1aETegY-FTZMC-b4i_z6/preview", isEmbed: true },
                { name: "Passenger Side Application", url: "https://drive.google.com/file/d/1Ie8tXhcLVbnPcJPgDQACvJ6M_wsjcjJE/preview", isEmbed: true },
                { name: "Hood Application", url: "https://drive.google.com/file/d/194f1pOAnwDLIi_M-E6DqaJxiRsTzrhuN/preview", isEmbed: true },
                { name: "Front Fender Application", url: "https://drive.google.com/file/d/1uOZZ0QfBlfRcBown6Kyq7jnTIG0-PSZA/preview", isEmbed: true },
                { name: "Door Application", url: "https://drive.google.com/file/d/1nUT0d4GhmFQLYOfF_-H6zjjeNEWx3vL_/preview", isEmbed: true },
                { name: "Bumper Application", url: "https://drive.google.com/file/d/1PRnv4RrMDffwdFEjQu2HvjRLOU4NB8Fi/preview", isEmbed: true },
                { name: "Full Vehicle After Shot", url: "https://drive.google.com/file/d/1RluzLYA4N_2QQSrF8RJIF2MqkiNAEiUG/preview", isEmbed: true }
            ]
        }
    ];

    const totalSteps = sections.reduce((acc, s) => acc + (s.subsections?.length || 0), 0);
    const progress = Math.min(100, (completedSteps.length / totalSteps) * 100);

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

    const markComplete = async (id: string) => {
        if (!completedSteps.includes(id)) {
            const newSteps = [...completedSteps, id];
            setCompletedSteps(newSteps);

            // Update local user state for immediate UI feedback on dashboard
            if (user) {
                const updatedUser = {
                    ...user,
                    courseProgress: {
                        ...user.courseProgress,
                        'FUSION': newSteps
                    }
                };
                setUser(updatedUser);
            }

            try {
                await api.patch('/users/me/course-progress', { courseName: 'FUSION', stepId: id });
            } catch (err) {
                console.error("Failed to save course progress", err);
            }
        }
    };

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await api.get('/auth/profile');
                const progress = response.data.courseProgress?.FUSION || [];
                setCompletedSteps(progress);
            } catch (err) {
                console.error("Failed to fetch course progress", err);
            }
        };
        fetchProgress();
    }, []);

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
                                <h1 className="text-4xl sm:text-5xl font-bold text-[#272727] mb-4 tracking-tighter uppercase">
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
                        <div id="fusion_intro" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                    SECTION A: PRODUCT OVERVIEW
                                </Badge>
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase">
                                    FUSION is a 2-part chemical product
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-[#0EA0DC] mb-3">What FUSION Does</h4>
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

                                <div className=" p-8 rounded-2xl mb-12 relative overflow-hidden">
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


                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('fusion_intro')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_intro') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('fusion_intro') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* Safety Summary */}
                        <div id="fusion_safety" className="scroll-mt-32">
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

                            <div className="mt-8 flex justify-end mb-8">
                                <Button
                                    onClick={() => markComplete('fusion_safety')}
                                    className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_safety') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                >
                                    {completedSteps.includes('fusion_safety') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                </Button>
                            </div>
                        </div>

                        {/* SECTION B: TECHNICAL PRODUCT DATA */}
                        <div id="fusion_data" className="scroll-mt-32">
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

                                <div id="fusion_storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <h4 className="font-bold text-sm text-[#272727] mb-3">Storage</h4>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Shelf life (unopened) from the date of purchase is 1 years.</li>
                                        <li>• Shelf life (opened) from the date of opening is 2 months.</li>
                                        <li>• Storage temperature: 50°F and 75°F (10℃ and 24℃).</li>
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
                                        onClick={() => markComplete('fusion_data')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_data') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('fusion_data') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />

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
                            <div id="fusion_step1" className="scroll-mt-32">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 1: INITIAL WASH</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> This step is required to start the cleaning and decontamination process. Every step of the way gets you closer. We call this step INITIAL WASH because it's not about getting a perfectly clean surface but clean enough to see what is going on and examine if there are special steps that are needed or if you can treat the vehicle as normal. Because the vehicle will go through other processes that will dirty the surface again there's no point in getting a perfectly clean vehicle this step.
                                    </p>

                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">What You Are Trying to Achieve</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• A clean enough vehicle that there's no more dirt or debris stuck to the vehicle</li>
                                            <li>• You can clearly see the damage and condition of the original clearcoat</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• 3-5 clean blue microfibers</li>
                                            <li>• Alkaline degreaser or heavy dish soap, with little to no fragrances, dye or silicones.</li>
                                            <li>• Alcohol</li>
                                            <li>• Spray or pump bottle</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className=" pl-5 mb-4 text-sm text-[#666666]">
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

                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/1cbiEUe-_ie-vtoC0vFvw2fkd6QNjpDBp/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Step 1: Light Wash"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step1')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step1') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step1') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 2: VEHICLE INSPECTION */}
                            <div id="fusion_step2" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 2: VEHICLE INSPECTION</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> FUSION is a chemical reaction and if the clearcoat underneath does not have a chemical resistance, there's a chance that FUSION will not level out or even melt the clearcoat making things worse. This process allows us to get a good understanding of the chemical resistance and stability of the original clearcoat."
                                    </p>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Inspection Goals</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• To find out if there are any panels that may not be suitable for FUSION</li>
                                            <li>• To find out if there are any panels that need special attention</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Paper towel</li>
                                            <li>• Etch</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Using Etch on a folded paper towel, check sections of panels around the vehicle for a chemical reaction.</li>
                                            <li>• Rub the soaked paper towel and see if you see any reaction taking place where that the clearcoat is heating up and become tacky or is scratches very, very easy.</li>
                                            <li>• This indicates that there is very little to know resistance to that particular panel.</li>
                                            <li>• Always make sure to do this on areas that are low and not visually easy to see by the eye because if you do have a chemical reaction, it can strip the clearcoat even strip the paint. This is rare and only poorly repaints typically cause this, but it is something you want to watch out for.</li>
                                        </ol>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Pass / Fail Criteria</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Pass looks like no tackiness or major scratching took place. This indicates that it's fine to move forward with the next steps.</li>
                                            <li>• Fail looks like a heavily scratched area or very tacky to the touch. It can also start to discolor or melt the clearcoat. If it's light tackiness or discoloration, then you want to be careful on the Etch step and use minimal pressure and minimal amount of material. If it's heavy, scratching or tackiness, then that panel is better off being polished, and explained to the customer that there was not enough integrity on this panel to be able to rebuild it. Don't take the risks cautious on poorly repainted and lower integrity. Paint finishes.</li>
                                            <li>• It's also important to keep in mind that during application, if there is integrity issues on the panel, your applicator will stick and not flow as there are some application techniques to overcome this, but it comes through experience.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• You're testing too large of an area and potentially causing noticeable issues. Always small areas not anything large.</li>
                                            <li>• You check one panel or two panels thinking the whole car is okay but you didn't see the few panels that were poorly repainted and during application process if it becomes problematic. Make sure to look at all panels equally and assess them properly.</li>
                                        </ul>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-[#666666] uppercase tracking-wider">Current Condition Clearcoat</p>
                                            <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                                <iframe
                                                    src="https://drive.google.com/file/d/1Zj7N0AA0MiW7g1SlwbnS-79OXTFy8vVr/preview"
                                                    className="w-full h-full"
                                                    allow="autoplay"
                                                    title="Current Condition Clearcoat"
                                                />
                                            </div>

                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-[#666666] uppercase tracking-wider">Chemical Test</p>
                                            <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100"
                                            >

                                                <iframe
                                                    src="https://drive.google.com/file/d/1OUDmd-IK7KFKFv6gazTVL_65a1Vs0Bgf/preview"
                                                    className="w-full h-full aspect-video rounded-2xl"
                                                    allow="autoplay"
                                                    title="Chemical Test"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step2')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step2') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step2') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 3: REMOVE ATTACHMENTS */}
                            <div id="fusion_step3" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 3: REMOVE ATTACHMENTS</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> Not having emblems or certain moldings around a vehicle can create a cleaner, less contaminated, finish and easier to apply not having to go around tricky obstacles. Removing attachments can be faster and perform better results, but it also can be a liability if the attachments are weak or brittle and prone to break when removing. Often times it's much faster to leave the attachments on. But another strategy is a lot of customers are happy removing attachments, and either replacing them with new fresh ones or just leaving them off entirely. In the Customer Intake Form that you fill out with a customer there is a section asking if they want their attachments removed. We strongly recommend removing attachments that the customers are okay leaving off."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Fishing line</li>
                                            <li>• Adhesive remover</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Using fishing line or any other strategy to remove attachments carefully</li>
                                            <li>• Using adhesive remover or any other product that works well to remove the extra glue and adhesive that has been stuck on the panel.</li>
                                            <li>• Put all license plate and attachments on the front drivers floorboard to ensure that you never forget to put the items back on the vehicle.</li>
                                        </ol>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Not communicating clearly with the customer on what they want and what they don't want to miss an opportunity to remove attachments they don't care of leave off.</li>
                                            <li>• Removing attachments that are brittle and breaking, therefore having to replace them at your expense, rather than the customer's.</li>
                                            <li>• Not gluing the attachments back on properly and risking them falling off later.</li>
                                            <li>• Range Rovers in particular with the individual lettering on the hood or the Porsche lettering in the back are always better to remove. When you have individual letters that you have to go around, it is at this time that it becomes much faster and a better results removing them.</li>
                                            <li>• Not having an organized shop and losing the attachments or pieces.</li>
                                        </ul>
                                    </div>

                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center relative group">
                                        <video
                                            className="w-full h-full object-cover"
                                            controls
                                            src="https://res.cloudinary.com/dknnqrpgv/video/upload/v1771411479/Step_3_Remove_Attachments_re64pv.mp4"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step3')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step3') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step3') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 4: EXFOLIATE */}
                            <div id="fusion_step4" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 4: EXFOLIATE</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> Using a 3000, 5000 or 6000 sanding disc, this levels out the paint and removes contaminants that are stuck onto the clearcoat. This decontaminating process helps levels the paint for a clean and consistent application.
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• 3mm DA (dual action) sander</li>
                                            <li>• 5'' or 6'' backing plate</li>
                                            <li>• 5'' or 6'' interface pad</li>
                                            <li>• 3000, 5000, 6000 3M Trizact (or similar) sanding disc</li>
                                            <li>• Spray bottle with 90% water and 10% alcohol solution.</li>
                                            <li>• Blue microfibers</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Using a DA sanding with a 5mm or 8mm throw, panel by panel sand even and consistently</li>
                                            <li>• With water and alcohol solution and microfiber wipe clean the panel before you go to the next panel.</li>
                                            <li>• No need to get it perfect just wipe off most of the sanding residue to make the next step easier.</li>
                                            <li>• For areas that you cannot get your sander in when you're finished, remove the sanding disc and by hand go around the whole car to sand areas that we're not able to be done with the machine.</li>
                                        </ol>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Technique Notes</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Pressure: Medium pressure is all that's needed. If you don't use enough pressure it won't sand properly and if you use too much pressure, you're sanding disk will be used up too quickly.</li>
                                            <li>• Speed: Slow, consistent speed will get an even consistent finish.</li>
                                            <li>• Edge Precautions: All edges on modern, clear coats are thin. Do not put much pressure on edges and go over them quickly to avoid burn through. FUSION will not fix burn through.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Visual Confirmation</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• The whole entire vehicle should have a dull, even consistent finish.</li>
                                            <li>• If there are some deeper scratches that are clearly visible and white and you're wondering if they're going to cover with FUSION, you can use Etch and a paper towel to see if the scratch pops through. Before Etch flashes off, this will give you an indication of how FUSION will cover the area.</li>
                                            <li>• Deep scratches through the paint will need to be touched up with actual paint. But deeper clearcoat scratches can be further sanded to fix them.</li>
                                            <li>• To do this, you are going to need to take 2000 sandpaper and a backing plate and lightly sand the scratch by hand without burning through the clearcoat. This will help break down the 2000 scratch and have FUSION repair it better.</li>
                                            <li>• Once done with 2000 you will need to use a 3000 disc to remove the 2000 sanding marks.</li>
                                            <li>• Once you've done that you will need to take the 5000 or 6000  to remove the 3000 sanding marks.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• The vehicle needed two sanding discs, because of the size or the hardness of the original clear coat. Sanding disc wear down, and most of the time you can use one disc per vehicle, but the sanding disk is no longer working as it should you will need to use a second disc.</li>
                                            <li>• Skipping areas and not sanding thoroughly.</li>
                                            <li>• Too much pressure on edges and burning through the clearcoat. FUSION will not fix burn through and will have to be repainted.</li>
                                            <li>• Sanding areas that shouldn't be like moldings or trim pieces. If you concern about getting the sander too close to these areas, use some masking tape temporarily to avoid touching these areas and then peel the masking tape off when you're done.</li>
                                            <li>• If using a 2000 sanding disc, you don't properly remove the 2000 marks and bring it back up to a 5000. You will see the sanding marks popping through if you don't do this thoroughly.</li>
                                            <li>• While going panel to panel, clean each panel as you go to remove most of the sanding residue, it doesn't have to be perfectly clean, but this helps prepare you for the next step. It helps the sanding residue be removed more easily during step five and not etch into the paint.</li>
                                        </ul>
                                    </div>

                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/12lkcXGt8DjNLqbmyRvjnBTVC4qhdcnmE/preview"
                                            className="w-full h-full aspect-video rounded-2xl"
                                            allow="autoplay"
                                            title="Chemical Test"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step4')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step4') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step4') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 5: HEAVY WASH */}
                            <div id="fusion_step5" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 5: HEAVY WASH</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        Purpose: We are now completely done with the dirty work. Everything from here on out is getting the vehicle completely clean using the same materials as the Initial Wash Step you are now going to do a Initial Wash. This is where every door jam, every window, every wheel well should be cleaned and free from debris, the vehicle will have a sanded look to it but completely clean."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className="pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• 3-5 clean blue microfibers</li>
                                            <li>• 50% water with 50% alcohol solution.</li>
                                            <li>• Alcohol</li>
                                            <li>• Spray or pump bottle</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className="pl-5 mb-4 text-sm text-[#666666]">
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
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Not thoroughly washing wheel wells, windows, or moldings, and having contamination get into the application. Do a thorough and complete wash.</li>
                                            <li>• Not opening up door jams, and not paying attention to the small details of cleaning in edges and hard to reach spots.</li>
                                        </ul>
                                    </div>

                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/1kNYe9qHgPvOGi2b8vrEKVeIl_JFCa_nC/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Step 5: Final Wash"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step5')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step5') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step5') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 6: ETCH */}
                            <div id="fusion_step6" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 6: ETCH</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> For FUSION to adhere properly a chemical reaction needs to take place. Etch does two very important things. 1, it continues to remove debris from the pour of the clearcoat and get the surface extremely clean, and 2, it starts to heat up the original clearcoat to be ready for FUSION application. The Etch process helps promote bonding and is a critical process that can not be done haphazardly.
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
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
                                        <ol className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Fold 3-5 paper towel sections into handheld square</li>
                                            <li>• Mix Etch (90% alcohol 10% acetone)</li>
                                            <li>• Panel by panel with heavy pressure and a good amount of Etch and evenly from top to bottom side to side, wipe the panel down.</li>
                                            <li>• Flip your towel every section you pass flip the paper towel to a clean section.</li>
                                            <li>• You're wiping off the panel just like you would be cleaning a table</li>
                                            <li>• You should use around 400 mL of product per vehicle.</li>
                                            <li>• Before performing the final full-vehicle prep wipe, complete an Edge Prep process. Fold a clean paper towel into a firm edge and thoroughly clean all panel gaps, edges, emblems, trim lines, door jambs, and tight areas. Follow with a clean microfiber to ensure these areas are completely free of residue. Edges and gaps often trap compound dust, polish residue, and contaminants. If not properly cleaned, these materials can later be pulled back onto the panel during application, increasing the risk of contamination in the finish. Taking the extra time to properly clean these areas significantly reduces the chance of debris being reintroduced to the surface. Only after completing Edge Prep should you proceed with the standard final prep wipe of the entire vehicle using Etch and a clean microfiber.</li>
                                        </ol>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Missing areas, door jams, and corners. These are actually the areas that you want to make sure to get the most as they are the ones that trapped the most contaminants and dirt that can cause an application issues.</li>
                                            <li>• Not using enough Etch and having the panels truly get a chemical reaction.</li>
                                            <li>• Using light pressure not aggressively using Etch how it should be.</li>
                                            <li>• Using Etch on panels with major integrity issues and causing reaction. If there's a light reaction, just use alcohol with no acetone. If there's a heavy reaction that panel may not be suitable and should be just polished.</li>
                                        </ul>
                                    </div>

                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/1FtekQX-s6ICBnptbziQVseW2pOVHYqWJ/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Step 6"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step6')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step6') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step6') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 7: MASK */}
                            <div id="fusion_step7" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 7: TAPING</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> Although we're not spraying anything into the air, moldings and trim pieces are not something that you want FUSION to get on. Running a piece of tape along these areas will help guide your application. You never want to purposely touch tape with FUSION because that will cause a chemical reaction and put some contaminants onto your applicator that then can go onto your panel. But it is there to help guide you and protect areas that you might accidentally hit."
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• High-quality bodyshop masking tape</li>
                                            <li>• Razor blade / utility knife</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Areas to Mask</h4>
                                        <p className="text-sm text-[#666666] mb-4">• All areas that might be prone to getting FUSION on during application</p>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• The moldings or trim pieces have too much silicone, and the tape is not sticking. Use a little alcohol on the trim pieces and it will help remove silicone or waxes there, prohibiting the tape to stick.</li>
                                            <li>• Not clean lines with your tape and having the tape touch areas that you actually want FUSION on. Make sure to be clean and have straight lines when masking.</li>
                                        </ul>
                                    </div>
                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/14pZjbv9t78iKhbpTxzkW3R9Pb9bFAY1m/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Step 7"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step7')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step7') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step7') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />

                        {/* SECTION D: FUSION APPLICATION */}
                        <div className="space-y-12 ">
                            <div className="text-center mb-8 mt-8">
                                <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">
                                    SECTION D: FUSION APPLICATION
                                </Badge>
                            </div>

                            {/* STEP 8: MIXING FUSION */}
                            <div id="fusion_step8" className="scroll-mt-32">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 8: MIXING FUSION</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> Fusion needs to be mixed 10 minutes prior to when you will be ready to apply. While getting everything ready and going to the next step mix FUSION and put a timer on it for 10 minutes.
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Mix Ratio</h4>
                                        <p className="text-sm text-[#666666] mb-2">• 1:1 with Element and Aether.</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Pot Life Reminder</h4>
                                        <p className="text-sm text-[#666666] mb-4">• Good for 2 hours after mixing</p>
                                    </div>

                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/1dynV63p_E-hTcQ7sGO7sXhG8LXNpWFkm/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Step 8"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step8')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step8') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step8') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 9: FIRST POUR */}
                            <div id="fusion_step9" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 9: FIRST POUR</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> You want to soak your applicator on all edges because you want to make sure that there are no dry spots that will cause dry spots in your application.
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Applicator</h4>
                                        <p className="text-sm text-[#666666] mb-2">Using the approved SkyGloss Applicator, pour (0.5 – 1 oz) 15 mL – 30 mL of FUSION evenly on your applicator covering all corners.</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Replacement Rules</h4>
                                        <p className="text-sm text-[#666666]">2 - 3 applicators are needed per vehicle. Your applicator will get dirty if you did not do a good preparation job. Never apply to a panel with a dirty or contaminated applicator if the applicator gets dropped or picks up contamination throw it out and get a new one.</p>
                                    </div>

                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/1lsnJkz89FG6fb5RcsXWlR7QTuKbsh04V/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Step 9"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step9')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step9') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step9') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 10: TACK CLOTH */}
                            <div id="fusion_step10" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 10: TACK CLOTH</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> To remove the last bit of fallen lint and debris right before application.
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <p className="text-sm text-[#666666] mb-2">Every 2 to 3 panels, right before application, use a bunched-up tack cloth to lightly go over the edges, jams molding and full panels.</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <p className="text-sm text-[#666666]">• Pressing too much with the tack cloth can actually leave residue onto the panel. There should be a very light pass over the panel as you pick up the remaining amount of dirt and debris.</p>
                                    </div>

                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/1Q5h3-g18K6dM4MSLq4CuVK67sBUyYtJn/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Step 10"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step10')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step10') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step10') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 11: APPLY FUSION */}
                            <div id="fusion_step11" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 11: APPLY FUSION</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> To apply a thick completely leveled out layer of FUSION on the panels intended to build and repair clearcoat.
                                    </p>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Insight: </strong> <br /> Although FUSION can be applied in a wide range of different temperatures, you will notice that application behavior ranges based upon humidity and temperature. Sometimes it requires you to move faster or apply more product or move slower and apply less product. Once you get comfortable applying you will notice that these different movements are intuitive. It's not so much about an exact scientific way to apply it is about the behavior of FUSION being applied and achieving the desired results. After 20 vehicles, you start to realize these behavior differences, and you will notice the feel of the applications is just as important as the look of the application. There's a learning curve to this so don't get discouraged as it will become second nature the more you do it.
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Environment Conditions</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Lighting Requirements: You must have adequate lighting whether it be mobile lights or a very well-lit environment. Without proper lighting you will miss small and even larger sections and not see drips and lines that you would've otherwise been able to easily correct during the application. Not having good lighting can create a lot of unnecessary work later on.</li>
                                            <li>• Climate: FUSION cannot be applied outdoors or an environment with lots of air movement. Always turn off any type of air circulation during application to ensure a smooth application and everything will level out properly. Make sure your panel temperature is between (60°F - 95°F) 16°C - 35°C for best results and ease of application.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Application Order</h4>
                                        <ol className=" pl-5 mb-4 text-sm text-[#666666]">
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
                                        <p className="text-sm text-[#666666] mb-2">You will overlap your lines at least 50% as you work your way through the panel. Do not overlap sections that have already started curing or you will leave streaks.</p>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>Dry spots in your applicator. Make sure when you apply product to your applicator your getting all corners.</li>
                                            <li>Working too fast will always result in a thinner application. Do not try and speed up your application so you always have a thick proper layer.</li>
                                            <li>Leaving a panel that has issues thinking that it's going to disappear tomorrow. It is true that leveling application can correct its own mistakes like drips or lines that aren't completely leveled out. But after 30 minutes, if it doesn't have a desirable result, you must strip down the panel and redo it. Those mistakes will not go away and you will spend more time fixing the next day.</li>
                                            <li>Yes you can correct certain mistakes the next day. Like slight imperfections like little contamination issues, dry spots, absorption, or miss spots. But unless they're minor, do not think that it's going to be easier to fix the next day. Strip the panel immediately and redo it. It will always be faster.</li>
                                            <li>After 3 hours - do not remove FUSION. If there is an issue that you see hours later, or the next day, these issues can be corrected, but you'll have to refer to the troubleshooting section below and they are often tedious, and time-consuming. This is why it's critically important to check your work every single panel before you go onto the next panel.</li>
                                            <li className="font-bold text-red-600">DO NOT LEAVE MISTAKES TO CURE!</li>
                                        </ul>
                                    </div>
                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/1r6KdoTu5TD6rLpA39bAX_UqJcEXhXhXa/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Step 11"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step11')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step11') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step11') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* ADDITIONAL FUSION APPLICATION VIDEOS */}
                            <div id="fusion_extra_videos" className="scroll-mt-32 mt-8">
                                <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        New Content
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-4 leading-[1.1] tracking-tighter uppercase">
                                        Additional FUSION Application Videos
                                    </h2>
                                    <p className="text-[#666666] mb-8 font-medium">
                                        In this section, users will find additional application videos to help them further develop their skills and continue mastering the FUSION application process. This collection will grow over time with more vehicle types.
                                    </p>
                                    <a href="https://drive.google.com/drive/folders/1LrGi8r7i9YKEZ6R7MngNXEHzsZsej3PD">
                                        <button className="inline-block items-center justify-center gap-2 whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive px-4 py-2 has-[>svg]:px-3 w-full bg-[#0EA0DC] text-white hover:bg-[#272727] transition-colors h-12 rounded-xl font-bold shadow-lg shadow-[#0EA0DC]/20" >Additional FUSION Application Videos
                                        </button></a>
                                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                        {vehicleVideoSets.map((set) => (
                                            <button
                                                key={set.id}
                                                onClick={() => setSelectedVehicle(selectedVehicle === set.id ? null : set.id)}
                                                className={`p-6 rounded-2xl border-2 transition-all text-left group ${selectedVehicle === set.id ? 'border-[#0EA0DC] bg-[#0EA0DC]/5' : 'border-gray-100 hover:border-[#0EA0DC]/30 hover:bg-gray-50'}`}
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-[#272727] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <Zap className="w-6 h-6 text-[#0EA0DC]" />
                                                </div>
                                                <h4 className="font-bold text-[#272727] mb-2 uppercase tracking-tight">{set.label}</h4>
                                                <p className="text-xs text-[#666666] leading-relaxed">
                                                    {set.videos.length} training videos available
                                                </p>
                                            </button>
                                        ))}
                                    </div> */}

                                    {selectedVehicle && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="h-px flex-1 bg-gray-100"></div>
                                                <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em]">Video Collection</span>
                                                <div className="h-px flex-1 bg-gray-100"></div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-8">
                                                {vehicleVideoSets.find(s => s.id === selectedVehicle)?.videos.map((video, idx) => (
                                                    <div key={idx} className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="font-bold text-[#272727] uppercase text-sm tracking-tight">
                                                                {video.name}
                                                            </h5>
                                                        </div>
                                                        <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center relative group border border-gray-100">
                                                            {video.url ? (
                                                                <SmartVideoPlayer
                                                                    url={(video as any).isEmbed ? video.url.replace('/file/d/', '/uc?export=download&id=').replace('/preview', '') : video.url}
                                                                />
                                                            ) : (
                                                                <div className="text-center p-8">
                                                                    <Zap className="w-12 h-12 text-[#0EA0DC]/20 mx-auto mb-4" />
                                                                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest">Video Pending Upload</p>
                                                                    <p className="text-white/30 text-[10px] mt-2">Filename: {video.name}</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end mt-12 pt-8 border-t border-gray-100">
                                        <Button
                                            onClick={() => markComplete('fusion_extra_videos')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_extra_videos') ? 'bg-[#0EA0DC] text-white shadow-lg shadow-[#0EA0DC]/20' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_extra_videos') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 12: QUALITY CHECK */}
                            <div id="fusion_step12" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 12: QUALITY CHECK</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        "<strong>Purpose: </strong> <br /> Once FUSION cures it is a permanent bond. You have maximum 3 hours to remove FUSION should you see an issue. This is why it's critical to check your work before you go onto the next panel. You will want to be checking your application after each panel, and after each section and a complete check once you finish the entire vehicle."
                                    </p>

                                    <p className="text-sm text-[#666666] font-bold mb-4">NEVER, leave a poor application or an application issue for another day. Remove it immediately assess the problem and redo it. This is a lot quicker than trying to fix it later.</p>

                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/1O3sit6QeOAHYBJCOOGTBjS4l4HlLxzlW/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Step 12"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step12')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step12') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step12') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* STEP 13: CLEAN APPLICATOR BOTTLE */}
                            <div id="fusion_step13" className="scroll-mt-32 mt-8">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">STEP 13: CLEAN APPLICATOR BOTTLE</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        <strong>Purpose: </strong> <br /> It's critically important to thoroughly clean the applicator bottle with acetone and multiple rinsing if you plan to use it again. We recommend never using an applicator bottle more than 10 times because no matter how clean you get it there is always potential for contamination breaking down in a used applicator bottle. The cleaning of the applicator bottle is not just critical for the inside but the outside as well every time you clean it if you do a thorough job, it should look brand new or close to it.
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Tools & Materials</h4>
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Gloves</li>
                                            <li>• Acetone</li>
                                            <li>• Paper towel</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Dump all remaining FUSION out.</li>
                                            <li>• Put (1oz) 15 mL of acetone into the bottle. Put cap on</li>
                                            <li>• Shake and pour out. Repeat 3 times</li>
                                            <li>• Fold paper towel with acetone and clean outside multiple times flipping the paper towel to new sections each time until fully clean</li>
                                            <li>• Turn bottle upside down on a clean table and let dry</li>
                                        </ol>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Common Mistakes</h4>
                                        <p className="text-sm text-[#666666]">• Not doing a thorough job leaving the inside and outside building up FUSION particles each time. Once it is not cleaned good once, it will never recover. Always clean thoroughly each and every time.</p>
                                    </div>
                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/1zu1Hv0_SEM7EI9cC7yNaBqsY7c9skr9b/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Step 13"
                                        />
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_step13')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_step13') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_step13') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />

                        {/* SECTION E: AFTERCARE */}
                        <div id="fusion_care" className="scroll-mt-32 mt-8">
                            <div className="text-center mb-8 mt-8">
                                <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">
                                    SECTION E: AFTERCARE
                                </Badge>
                            </div>
                            <Card className="p-6 rounded-2xl border-l-4 border-l-green-500">
                                <p className="text-sm font-bold mb-4">CARE INSTRUCTIONS</p>
                                <div className="bg-gray-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-sm text-[#272727] mb-2">Immediate Aftercare</h4>
                                    <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                        <li>After 12 hours, always apply SEAL for a breathable sealant during full 2-week cure. This will keep water and dirt off.</li>
                                        <li>Do not wash for 2-weeks after application</li>
                                    </ul>
                                </div>

                                <p className="text-sm text-[#666666]">Aftercare Handout: Make sure to give this to your customer to get the most out of their SkyGloss Service.</p>
                                <a href="https://drive.google.com/file/d/1ebN3aN0JS90KizRVNjvG_zhrhVZjA2DD/view?usp=drive_link" className="text-xl font-bold text-[#272727] mb-2  bg-[#0ea0dc] text-white p-2 rounded-xl inline-block w-full text-center">Download Care Instructions</a>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-[#666666] uppercase tracking-wider">Curing</p>
                                        <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                            <iframe
                                                src="https://drive.google.com/file/d/1HEWFMX5VINQ4sgd4yCEQ9mphInHUHXw3/preview"
                                                className="w-full h-full"
                                                allow="autoplay"
                                                title="Curing"
                                            />
                                        </div>

                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-[#666666] uppercase tracking-wider">Applying Seal</p>
                                        <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                            <iframe
                                                src="https://drive.google.com/file/d/16WFVva96Se-MfMNQVovO5WNXXJXVefZ-/preview"
                                                className="w-full h-full"
                                                allow="autoplay"
                                                title="Applying Seal"
                                            />
                                        </div>

                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('fusion_care')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_care') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('fusion_care') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
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
                            <div id="fusion_removal" className="scroll-mt-32">
                                <Card className="p-6 rounded-2xl border-l-4">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">REMOVING FUSION</h3>

                                    <p className="text-sm text-[#666666] mb-4">
                                        FUSION can be removed 2 different ways. In the 2 hours before it is too cured with chemicals or 2-weeks after full cure by sanding it off.
                                    </p>
                                    <p className="text-sm text-[#666666] mb-4">
                                        It is always best if you must sand off FUSION that it is fully cured as it is going to sand more consistently and not gum up your sanding discs.
                                    </p>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Removing FUSION before 2 Hour:</h4>
                                        <h5 className="font-bold text-xs text-[#666666] mb-1">Tools & Materials</h5>
                                        <ul className=" pl-5 mb-3 text-sm text-[#666666]">
                                            <li>• Gloves</li>
                                            <li>• ETCH</li>
                                            <li>• Paper towel</li>
                                            <li>• White microfiber</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h5 className="font-bold text-xs text-[#666666] mb-1">Process</h5>
                                        <ol className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Being careful not to touch your other panels and only the panel you want to remove FUSION, fold up paper towel and load up ETCH.</li>
                                            <li>• Making 1 pass at a time and firm pressure wipe off FUSION.</li>
                                            <li>• Each wipe you must flip your paper towel to a new section otherwise you will put FUSION right back on the panel.</li>
                                            <li>• After it is all wiped off you will still see some slight amount of haze and residue, with a clean white microfiber and a little ETCH on the microfiber, remove all the extra haze - wiping the panel clean. Discard the microfiber as any amount of FUSION will never be able to wash out of it.</li>
                                        </ol>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Removing FUSION after 2 weeks:</h4>
                                        <h5 className="font-bold text-xs text-[#666666] mb-1">Tools & Materials</h5>
                                        <ul className=" pl-5 mb-3 text-sm text-[#666666]">
                                            <li>• 1,500 sanding discs</li>
                                            <li>• 3,000 sanding discs</li>
                                            <li>• 5,000 sanding discs</li>
                                            <li>• Water and spray bottle</li>
                                            <li>• Cleaning microfibers</li>
                                        </ul>
                                    </div>

                                    <div className="aspect-video bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                        <iframe
                                            src="https://drive.google.com/file/d/12Ahwele5mp5CjHT72mvc7tW849pOIuvD/preview"
                                            className="w-full h-full"
                                            allow="autoplay"
                                            title="Removal"
                                        />
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h5 className="font-bold text-xs text-[#666666] mb-1">Process</h5>
                                        <ol className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>• Section by section starting with 1,500 grit sand off FUSION. Do not go too deep or you will risk burn through.</li>
                                            <li>• Then follow it with 3,000 and then 5,000</li>
                                            <li>• You can reapply FUSION after.</li>
                                            <li>• If this is your first time doing this, contact our Technical Team to get even more tips as this can be a long and tedious process. If not done correctly, you can sand through the original paint.</li>
                                        </ol>
                                    </div>


                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_removal')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_removal') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_removal') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>


                            {/* Correcting Application Issues Starts  Section*/}
                            <div id="fusion_issues" className="scroll-mt-32">
                                <Card className="p-6 rounded-2xl border-l-4">
                                    <h3 className="text-xl font-bold text-[#272727] mb-2">Correcting Application Issues</h3>

                                    <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                        <li>You can reapply FUSION over FUSION as many times as you want if it is cured before applying the next layer.</li>
                                        <li>Depending on the substrate condition, you can apply two coats of FUSION, the first one will act as a base coat and the second one will act as a finish coat.</li>
                                        <li>Full cure is 2-weeks. However, a curing lamp can speed up the process and you can apply right after you cured it. 30 mins at 60-70C on the surface of the panel and leave it to completely cool down, and it will be ready to reapply. Make sure to get all sections of the panel so FUSION is evenly cured.</li>
                                    </ul>
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h4 className="font-bold text-sm text-[#272727] mb-2">Process</h4>
                                        <ol className=" pl-5 mb-4 text-sm text-[#666666]">
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
                                        <ul className=" pl-5 mb-4 text-sm text-[#666666]">
                                            <li>This is due to the clearcoat underneath being too soft or not chemical resistant to FUSION.</li>
                                            <li>If the panels clearcoat is weak, using ETCH can soften up the panel and cause FUSION to reaction during application.</li>
                                            <li>This will cause the applicator to stick to the panel.</li>
                                            <li>If the reaction is light, you can load up more product and try and create a Barrier between the two surfaces for it to slide over easier and hope to level out.</li>
                                            <li>If this is not working, you will have to cure the panel and try again or remove FUSION and just polish that panel as FUSION will not be able to be applied to as there is just not enough chemical resistance for FUSION to set up correctly.</li>
                                        </ul>
                                    </div>




                                    {/* <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_issues')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_issues') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_issues') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                        </Button>
                                    </div> */}
                                    <div id="fusion_correcting_application_issues" className="scroll-mt-32">

                                        {/* <h3 className="text-xl font-bold text-[#272727] mb-2">
                                        Correcting Application Issues
                                    </h3> */}

                                        {/* Overview */}
                                        <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                                            <h4 className="font-bold text-sm mb-2">Overview</h4>
                                            <p className="text-sm text-[#666666] leading-relaxed">
                                                Application errors are a normal part of the learning process.
                                                The goal is not just to fix them—but to understand why they happened and improve control moving forward.
                                            </p>

                                            <div className="mt-4">
                                                <p className="text-sm font-bold text-[#272727] mb-2">Severity Levels:</p>
                                                <ul className="text-sm text-[#666666] space-y-1">
                                                    <li>• Light</li>
                                                    <li>• Medium</li>
                                                    <li>• Heavy</li>
                                                </ul>
                                            </div>

                                            <p className="text-sm text-[#666666] mt-4">
                                                Correction depends on severity and cure stage of FUSION.
                                            </p>
                                        </div>

                                        {/* Cure Timing Rules */}
                                        <div className="bg-blue-50 p-6 rounded-2xl mb-6">
                                            <h4 className="font-bold text-sm mb-3">Cure Timing Rules</h4>

                                            <ul className="text-sm text-[#666666] space-y-2">
                                                <li>
                                                    <strong>Light Errors:</strong> Can typically be corrected the next day
                                                </li>
                                                <li>
                                                    <strong>Medium / Heavy Errors:</strong> Require full cure (~2 weeks) OR accelerated cure (heat lamp)
                                                </li>
                                            </ul>

                                            <div className="mt-4 p-4 bg-white rounded-xl border border-blue-100">
                                                <p className="text-sm font-bold text-[#272727]">
                                                    Critical Rule:
                                                </p>
                                                <p className="text-sm text-[#666666] mt-1">
                                                    Do not attempt aggressive correction before proper cure—this will make the issue worse.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Why Issues Happen */}
                                        <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                                            <h4 className="font-bold text-sm mb-3">Why Application Issues Happen</h4>

                                            <p className="text-sm font-bold text-[#272727] mb-2">1. Surface-Related</p>
                                            <ul className="text-sm text-[#666666] mb-4 space-y-1">
                                                <li>• Repainted or compromised clearcoat</li>
                                                <li>• Soft, reactive or uneven surfaces</li>
                                            </ul>

                                            <p className="text-sm font-bold text-[#272727] mb-2">2. Application Technique (Most Common)</p>
                                            <ul className="text-sm text-[#666666] space-y-1">
                                                <li>• Too much product → runs, drips</li>
                                                <li>• Too little product → streaking, light spots</li>
                                            </ul>

                                            <p className="text-sm text-[#272727] mt-4 font-medium">
                                                Core Principle: Apply as thick as possible without creating defects
                                            </p>
                                        </div>

                                        {/* Light Errors */}
                                        <div className="bg-green-50 p-6 rounded-2xl mb-6">
                                            <h4 className="font-bold text-sm mb-2">Light Errors</h4>

                                            <p className="text-sm text-[#666666] mb-2">
                                                Examples:
                                            </p>
                                            <ul className="text-sm text-[#666666] mb-3 space-y-1">
                                                <li>• Light streaking</li>
                                                <li>• Minor texture</li>
                                                <li>• Slight absorption</li>
                                            </ul>

                                            <p className="text-sm font-bold text-[#272727]">Correction:</p>
                                            <ul className="text-sm text-[#666666] mt-1">
                                                <li>• Next day correction</li>
                                                <li>• Light polish</li>
                                            </ul>
                                            <div className="aspect-video mt-8 bg-[#272727] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                                                <iframe
                                                    src="https://drive.google.com/file/d/1Hso8Q2q4dbu2E_4F86IY5MmetuUSUMDy/preview"
                                                    className="w-full h-full"
                                                    allow="autoplay"
                                                    title="Issues"
                                                />
                                            </div>
                                        </div>

                                        {/* Medium Errors */}
                                        <div className="bg-yellow-50 p-6 rounded-2xl mb-6">
                                            <h4 className="font-bold text-sm mb-2">Medium Errors</h4>

                                            <p className="text-sm text-[#666666] mb-2">Examples:</p>
                                            <ul className="text-sm text-[#666666] mb-3 space-y-1">
                                                <li>• Visible streaks</li>
                                                <li>• Light lines</li>
                                                <li>• Uneven finish</li>
                                            </ul>

                                            <p className="text-sm font-bold text-[#272727] mb-2">Correction Process:</p>
                                            <ol className="text-sm text-[#666666] space-y-1">
                                                <li>1. Allow proper cure</li>
                                                <li>2. Sand</li>
                                                <li>3. Refine</li>
                                                <li>4. Polish</li>
                                            </ol>
                                        </div>

                                        {/* Heavy Errors */}
                                        <div className="bg-red-50 p-6 rounded-2xl mb-6">
                                            <h4 className="font-bold text-sm mb-2">Heavy Errors</h4>

                                            <p className="text-sm text-[#666666] mb-2">Examples:</p>
                                            <ul className="text-sm text-[#666666] mb-3 space-y-1">
                                                <li>• Runs</li>
                                                <li>• Drips</li>
                                                <li>• Heavy buildup</li>
                                            </ul>

                                            <p className="text-sm font-bold text-[#272727] mb-2">Correction Process:</p>
                                            <ol className="text-sm text-[#666666] space-y-1">
                                                <li>1. Full cure or lamp cure</li>
                                                <li>2. Sand and level</li>
                                                <li>3. Refine surface</li>
                                                <li>4. Reapply and blend FUSION</li>
                                            </ol>
                                        </div>

                                        {/* Critical Rule */}
                                        <div className="bg-[#272727] p-6 rounded-2xl text-white mb-6">
                                            <h4 className="font-bold text-sm mb-2">Critical Rule</h4>

                                            <p className="text-sm text-white/80 leading-relaxed">
                                                The best way to avoid application issues is to check your work and never leave a panel to cure overnight.
                                                If issues occur, strip and reapply—this will always save time and energy.
                                            </p>
                                        </div>

                                        {/* Complete Button */}
                                        <div className="flex justify-end mt-8">
                                            <Button
                                                onClick={() => markComplete('fusion_correcting_application_issues')}
                                                className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_correcting_application_issues') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                            >
                                                {completedSteps.includes('fusion_correcting_application_issues') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                            </Button>
                                        </div>

                                    </div>
                                </Card>
                            </div>

                            {/* =========================
    CORRECTING APPLICATION ISSUES (NEW CLIENT CONTENT)
========================= */}


                            {/* Correcting Application Issues END  Section*/}
                            <div id="fusion_sticky_panels" className="scroll-mt-32">
                                <Card className="p-6 rounded-2xl border-l-4 border-l-[#0EA0DC]">

                                    <h3 className="text-xl font-bold text-[#272727] mb-2">
                                        Sticky Panels
                                    </h3>

                                    {/* Overview */}
                                    <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                                        <p className="text-sm text-[#666666] leading-relaxed">
                                            Sticky panels are not an application mistake—they are a surface compatibility issue.
                                        </p>
                                    </div>

                                    {/* Why It Happens */}
                                    <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                                        <h4 className="font-bold text-sm mb-3">Why It Happens</h4>

                                        <p className="text-sm font-bold text-[#272727] mb-2">Clearcoat Issues:</p>
                                        <ul className="text-sm text-[#666666] mb-4 space-y-1">
                                            <li>• Too soft</li>
                                            <li>• Not chemically resistant</li>
                                        </ul>

                                        <p className="text-sm font-bold text-[#272727] mb-2">Paint System Reaction:</p>
                                        <ul className="text-sm text-[#666666] mb-4 space-y-1">
                                            <li>• Weak or unstable paint systems react with FUSION</li>
                                        </ul>

                                        <p className="text-sm font-bold text-[#272727] mb-2">ETCH Impact:</p>
                                        <ul className="text-sm text-[#666666] space-y-1">
                                            <li>• Excessive or aggressive ETCH</li>
                                            <li>• Can soften the panel</li>
                                            <li>• Can trigger unwanted reaction during application</li>
                                        </ul>
                                    </div>

                                    {/* What You'll Notice */}
                                    <div className="bg-yellow-50 p-6 rounded-2xl mb-6">
                                        <h4 className="font-bold text-sm mb-2">What You’ll Notice</h4>

                                        <ul className="text-sm text-[#666666] space-y-1">
                                            <li>• Applicator dragging or sticking</li>
                                            <li>• Product not flowing properly</li>
                                            <li>• Surface feels “grabby” during install</li>
                                        </ul>
                                    </div>

                                    {/* Correction Options */}
                                    <div className="bg-blue-50 p-6 rounded-2xl mb-6">
                                        <h4 className="font-bold text-sm mb-3">Correction Options</h4>

                                        <div className="mb-4">
                                            <p className="text-sm font-bold text-[#272727] mb-1">Option 1: Adjust Application</p>
                                            <ul className="text-sm text-[#666666] space-y-1">
                                                <li>• Use more product</li>
                                                <li>• Work faster</li>
                                                <li>• Create a slight barrier between applicator and surface</li>
                                            </ul>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm font-bold text-[#272727] mb-1">Option 2: Stop and Reassess</p>
                                            <p className="text-sm text-[#666666] mb-1">If sticking continues:</p>
                                            <ol className="text-sm text-[#666666] space-y-1">
                                                <li>1. Allow panel to cure fully</li>
                                                <li>2. Retry application</li>
                                            </ol>
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold text-[#272727] mb-1">Option 3: Remove & Abandon FUSION</p>
                                            <p className="text-sm text-[#666666] mb-1">If surface is not compatible:</p>
                                            <ol className="text-sm text-[#666666] space-y-1">
                                                <li>1. Remove FUSION</li>
                                                <li>2. Polish panel</li>
                                                <li>3. Do not reapply</li>
                                            </ol>
                                        </div>
                                    </div>

                                    {/* Key Point */}
                                    <div className="bg-[#272727] p-6 rounded-2xl text-white mb-6">
                                        <h4 className="font-bold text-sm mb-2">Key Point</h4>

                                        <p className="text-sm text-white/80 leading-relaxed">
                                            Some paint systems simply do not have enough chemical resistance for FUSION to perform correctly.
                                        </p>
                                    </div>

                                    {/* Complete Button */}
                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('fusion_sticky_panels')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('fusion_sticky_panels') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('fusion_sticky_panels') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
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
                                    SkyGloss is fully committed to providing technical support. Should you need it and when you need it. Please contact your Partner immediately if you have any technical questions or need some support navigating through anything that you're experiencing in your shop.
                                </p>
                                <p className="text-sm text-[#666666] mb-4">
                                    Also keep in mind, it is not whether FUSION works or doesn't work it's whether it was prepared properly and the clearcoat has integrity enough to get the results desired. You never have to oversell what FUSION can do or be concerned by the outcome because FUSION is consistent but clearcoat finishes vary. Because every vehicle needs more clearcoat, FUSION is always building integrity back to the vehicle no matter the starting point of the paint finish.
                                </p>
                                {completedSteps.length >= totalSteps && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col items-center justify-center text-center">
                                        <CheckCircle className="w-16 h-16 text-green-500 mb-3" />
                                        <h3 className="text-2xl font-extrabold text-[#272727]">Course Completed ✓</h3>
                                        <p className="text-sm text-[#666666] mt-2">You have successfully completed the FUSION Professional Application Guide.</p>
                                    </div>
                                )}
                            </Card>
                            {/* additional training resources.  */}
                            {/* <Card className="p-6 rounded-2xl bg-[#0ea0dc]" style={{ backgroundColor: '#0ea0dc26' }}>
                                <h3 className="text-lg font-bold text-[#272727] mb-4">Additional Training Resources.</h3>
                                <p className="text-sm text-[#666666] mb-4">
                                    orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </p>

                                {completedSteps.length >= totalSteps && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col items-center justify-center text-center">
                                        <CheckCircle className="w-16 h-16 text-green-500 mb-3" />
                                        <h3 className="text-2xl font-extrabold text-[#272727]">Course Completed ✓</h3>
                                        <p className="text-sm text-[#666666] mt-2">You have successfully completed the FUSION Professional Application Guide.</p>
                                    </div>
                                )}
                            </Card> */}
                        </div>

                        {/* Completion Footer */}
                        <div className="py-12">
                            <Card className="p-12 rounded-2xl bg-[#272727] text-white text-center">
                                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle className="w-10 h-10 text-[#0EA0DC]" />
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-bold mb-10">Congratulations! You have completed this course!</h2>
                                <div className="flex justify-center">
                                    <Button
                                        onClick={async () => {
                                            try {
                                                await api.patch('/users/me/complete-course', { courseName: 'FUSION' });
                                            } catch (err) {
                                                console.error("Failed to mark course as complete", err);
                                            }
                                            onBack();
                                        }}
                                        className="bg-white text-[#272727] hover:bg-gray-100 rounded-xl px-16 py-6 h-auto text-lg font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all duration-300"
                                    >
                                        Finish
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
                                                                className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded text-xs transition-colors ${isActive ? 'bg-[#0EA0DC] text-white' : 'hover:bg-gray-100 text-[#666666]'}`}
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
                                <a href="/support">
                                    <Button className="w-full bg-white text-[#0EA0DC] hover:bg-gray-100 text-xs h-8">
                                        Contact Support
                                    </Button>
                                </a>
                            </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
