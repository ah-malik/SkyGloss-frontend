import { motion } from "motion/react";
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
    PenTool,
    Wind,
    BookOpen,
    Check,
    MessageSquare,
    Clock
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

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
            { id: "care", title: "Technical Maintenance" }
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
                        const mainSection = sections.find(s =>
                            s.subsections?.some(sub => sub.id === entry.target.id)
                        );
                        if (mainSection) {
                            // Section highlighting logic preserved via sub-sections
                        }
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
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5 rounded-xl"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Courses
                    </Button>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area (Left 2 columns) */}
                    <main className="lg:col-span-2 space-y-12">
                        {/* Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-100 relative overflow-hidden group mb-3 mb-3"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Zap className="w-64 h-64 text-[#0EA0DC]" />
                            </div>
                            <div className="relative z-10">
                                <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 mb-4 px-3 py-1 font-bold">
                                    FUSION MASTERY ENGINE
                                </Badge>
                                <h1 className="text-4xl sm:text-5xl font-bold text-[#272727] mb-4 tracking-tighter italic uppercase">
                                    Professional <span className="text-[#0EA0DC]">FUSION</span> Guide
                                </h1>
                                <p className="text-[#666666] text-lg max-w-2xl mb-8">
                                    Complete molecular bonding protocol for certified master distributors. Absolute adherence to technical specifications is mandatory.
                                </p>
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <BookOpen className="w-4 h-4 text-[#0EA0DC]" />
                                        11 Technical Phases
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <Clock className="w-4 h-4 text-[#0EA0DC]" />
                                        Approx. 2.5 Hours
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        {completedSteps.length}/{totalSteps} modules verified
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Progress Bar (Standard Styled) */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-3">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-[#272727] uppercase tracking-wider">Course Progress</span>
                                <span className="text-sm font-bold text-[#0EA0DC]">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2.5 bg-gray-100" />
                        </div>

                        {/* Sections Rendering */}
                        <div className="space-y-16">
                            {/* Section A: Overview */}
                            <div id="intro" className="scroll-mt-32">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Section A: Product Overview
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                        Clearcoat <span className="text-[#0EA0DC]">Fusion</span> Technology
                                    </h2>
                                    <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl mb-8">
                                        <div className="flex items-start gap-4">
                                            <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-bold text-rose-700 uppercase mb-1 tracking-tight">Professional Requirement</h4>
                                                <p className="text-xs text-rose-600 font-medium leading-relaxed">
                                                    FUSION is a professional product. Incorrect use can cause time-consuming and potentially damaging issues. Training and certification are mandatory.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[#666666] mb-10 leading-relaxed text-lg italic">
                                        "FUSION fuses an extremely high grade clearcoat into an automotive paint finish relying on a chemical adhesion to permanently bond and weld itself into the original finish."
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-[#272727] mb-3">What FUSION Is</h4>
                                            <p className="text-xs text-[#666666] font-medium leading-relaxed">A foundation product that repairs and builds clearcoat integrity. Performance varies based on original clearcoat condition.</p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-[#272727] mb-3">What FUSION is NOT</h4>
                                            <p className="text-xs text-[#666666] font-medium leading-relaxed">It will not bond to failing or broken clearcoat. Integrity must be present for a permanent bond.</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('intro')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('intro') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('intro') ? <><CheckCircle className="w-5 h-5 mr-2" /> Overview Verified</> : 'Verify Standard'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            <div id="safety" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-8 mt-6">
                                    <div className="h-[1px] flex-1 bg-gray-200" />
                                    <h3 className="text-xs font-bold text-[#0EA0DC] uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                        <ShieldAlert className="w-4 h-4 text-[#0EA0DC]" /> Safety Summary
                                    </h3>
                                    <div className="h-[1px] flex-1 bg-gray-200" />
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { title: "PPE Respirator", desc: "Approved vapor respirator required — concerned with smell and vapors.", icon: Wind },
                                        { title: "Nitrile Barrier", desc: "Never get FUSION on your hands. Always wear gloves.", icon: Droplets },
                                        { title: "Air Dynamics", desc: "Air flow required, but avoid major movement on the surface during drying.", icon: Wind }
                                    ].map((item, i) => (
                                        <Card key={i} className="skygloss-card p-8 rounded-2xl border-gray-100 bg-white hover:border-[#0EA0DC]/30 transition-all duration-300">
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 border border-gray-100 text-[#0EA0DC]">
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <h4 className="font-bold text-sm text-[#272727] mb-3 uppercase tracking-wider">{item.title}</h4>
                                            <p className="text-xs text-[#666666] font-medium leading-relaxed">{item.desc}</p>
                                        </Card>
                                    ))}
                                </div>
                                <div className="mt-8 flex justify-end mb-8">
                                    <Button
                                        onClick={() => markComplete('safety')}
                                        className={`rounded-xl px-8 h-12 font-bold text-xs uppercase tracking-widest transition-all ${completedSteps.includes('safety') ? 'bg-[#0EA0DC] text-white border border-[#0EA0DC]' : 'bg-[#272727] text-white'}`}
                                    >
                                        {completedSteps.includes('safety') ? 'Safety Verified' : 'Confirm Safety'}
                                    </Button>
                                </div>
                            </div>

                            {/* Section B: Technical Data */}
                            <div id="data" className="scroll-mt-32">
                                <Card className="p-10 p-8 sm:p-14 rounded-[12px] rounded-lg border-gray-100 bg-white relative overflow-hidden shadow-sm">
                                    <div className="flex items-center justify-between mb-12">
                                        <div>
                                            <Badge className="bg-[#0EA0DC] text-white font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Section B: Specification Matrix</Badge>
                                            <h2 className="text-3xl font-bold text-[#272727] uppercase tracking-tighter italic">Technical Product Data</h2>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-[#0EA0DC]">1:1</div>
                                            <div className="text-[10px] font-bold text-[#94a3b8] uppercase">Mix Ratio (A:B)</div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                                        {[
                                            { label: "Components", items: [{ k: "Component A", v: "Element" }, { k: "Component B", v: "Aether" }] },
                                            { label: "Volume (mL)", items: [{ k: "Small", v: "148–177mL" }, { k: "Medium", v: "177–207mL" }, { k: "Large", v: "207–237mL" }] },
                                            { label: "Temporal", items: [{ k: "Wait Time", v: "10 Min" }, { k: "Pot Life", v: "2 Hours" }] }
                                        ].map((group, idx) => (
                                            <div key={idx} className="space-y-6">
                                                <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.3em] border-b border-gray-50 pb-3">{group.label}</h4>
                                                <div className="space-y-4">
                                                    {group.items.map((item, iidx) => (
                                                        <div key={iidx} className="flex items-center justify-between">
                                                            <span className="text-xs text-[#666666] font-medium">{item.k}</span>
                                                            <span className="text-xs font-bold text-[#272727] uppercase tracking-wider">{item.v}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 p-6 rounded-2xl bg-gray-50 border border-gray-100 mb- aggregation">
                                        <div id="storage" className="space-y-3">
                                            <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em]">Storage & Shelf Life</h4>
                                            <div className="text-xs text-[#272727] font-bold tracking-tight">Purchase: 2 Years | Opened: 2 Months</div>
                                            <div className="text-[11px] text-[#666666] italic leading-relaxed">Storage Temp: 10°C – 30°C (50°F – 85°F). Lower humidity preferred.</div>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em]">Environmental Requirements</h4>
                                            <div className="text-xs text-[#272727] font-bold tracking-tight">Panel Temp: 16°C – 35°C (60°F – 95°F)</div>
                                            <div className="text-[11px] text-[#666666] italic leading-relaxed">Minimum 12 hours indoors at 19°C (65°F) post-application.</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-8">
                                        <Button
                                            onClick={() => markComplete('data')}
                                            className="bg-[#0EA0DC] text-white hover:bg-[#0c80b3] shadow-lg rounded-xl px-10 h-14 font-bold"
                                        >
                                            Verify Technical Data
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            <Separator className="bg-gray-100" />

                            {/* Section C: Preparation */}
                            <div className="space-y-12">
                                <div className="text-center space-y-4 mt-8">
                                    <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">Section C: Substrate Preparation</Badge>
                                    <h2 className="text-4xl font-bold text-[#272727] tracking-tighter uppercase italic">Preparation Phase</h2>
                                    <p className="text-[#666666] text-sm max-w-xl mx-auto italic font-medium">Cleaning, leveling, exfoliating and chemically getting etched in debris out of the pores.</p>
                                </div>

                                {[
                                    {
                                        id: "step1",
                                        title: "STEP 1: LIGHT WASH",
                                        purpose: "Initial decontamination to examine clearcoat condition.",
                                        tools: ["Towel Set (3-5 Blue Microfibers)", "Degreaser/Dish Soap mix", "IPA"],
                                        process: ["Divide vehicle into sections", "Soak sections (2-3 min)", "Mechanical wipe and dry"],
                                        badge: "Phase 1"
                                    },
                                    {
                                        id: "step2",
                                        title: "STEP 2: VEHICLE INSPECTION",
                                        purpose: "Verify chemical resistance and stability of original clearcoat.",
                                        tools: ["Paper Towel", "Acetone Matrix"],
                                        process: ["Small section stress test", "Check for tackiness/scratching", "Pass/Fail audit per panel"],
                                        badge: "Critical Phase"
                                    },
                                    {
                                        id: "step3",
                                        title: "STEP 3: REMOVE ATTACHMENTS",
                                        purpose: "Eliminate obstacles for a seamless continuous application.",
                                        tools: ["Fishing Line", "Adhesive Remover"],
                                        process: ["Carefully remove emblems/moldings", "Clean residue with adhesive remover", "Organize parts for re-install"],
                                        badge: "Obstacle Clearance"
                                    },
                                    {
                                        id: "step4",
                                        title: "STEP 4: EXFOLIATE",
                                        purpose: "Level paint and remove embedded particulates.",
                                        tools: ["3mm DA Sander", "Interface Pad", "4000/5000/6000 Sanding Discs"],
                                        process: ["Consistent DA sanding (3mm throw)", "Hand sand unreachable areas", "Wipe clean with degreaser"],
                                        badge: "Leveling Phase"
                                    },
                                    {
                                        id: "step5",
                                        title: "STEP 5: HEAVY WASH",
                                        purpose: "Complete removal of all sanding residue and debris.",
                                        tools: ["Heavy Wash Setup", "Door Jam Cleaning Tools"],
                                        process: ["Full vehicle deep clean", "Open jams/windows/moldings", "Final lint-free verification"],
                                        badge: "Final Clean"
                                    },
                                    {
                                        id: "step6",
                                        title: "STEP 6: ETCH",
                                        purpose: "Promote chemical bonding by heating up original clearcoat.",
                                        tools: ["Etch Matrix (90% IPA, 10% Acetone)", "White Edgeless Microfiber", "Gloves"],
                                        process: ["Heavy pressure panel wipe", "Flip towels every 2-3 passes", "Final dry wipe with clean fiber"],
                                        badge: "Bonding Prep"
                                    },
                                    {
                                        id: "step7",
                                        title: "STEP 7: MASK",
                                        purpose: "Guide application and protect sensitive trim pieces.",
                                        tools: ["Masking Tape", "Razor Blade/Knife"],
                                        process: ["Tape off moldings/trim", "Ensure clean, straight lines", "Do not touch tape with FUSION"],
                                        badge: "Operational Shield"
                                    }
                                ].map((step, i) => (
                                    <div key={step.id} id={step.id} className="scroll-mt-32 mt-8">
                                        <Card className="skygloss-card p-8 rounded-[32px] border-l-4 border-l-[#0EA0DC]/20 hover:border-l-[#0EA0DC] transition-all duration-300">
                                            <div className="flex flex-col gap-8">
                                                <div className="w-full">
                                                    <Badge variant="outline" className="mb-4 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-widest text-[9px] font-bold px-3">{step.badge}</Badge>
                                                    {/* <div className="text-5xl font-bold text-gray-50 mb-2 tracking-tighter">0{i + 1}</div> */}
                                                    <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">{step.title}</h3>
                                                    <p className="text-sm text-[#666666] font-medium leading-relaxed italic mb-6">"{step.purpose}"</p>
                                                </div>
                                                <div className="flex-1 space-y-6">
                                                    <div className="grid sm:grid-cols-2 gap-6">
                                                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                            <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] mb-4">Required Materials</h4>
                                                            {step.tools.map((t, ti) => (
                                                                <div key={ti} className="text-[11px] text-[#666666] font-medium flex items-center gap-2 mb-1.5">
                                                                    <Wrench className="w-3 h-3 text-[#0EA0DC]" /> {t}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                            <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] mb-4">Operational Steps</h4>
                                                            {step.process.map((p, pi) => (
                                                                <div key={pi} className="text-[11px] text-[#666666] font-medium flex items-center gap-2 mb-1.5">
                                                                    <Check className="w-3 h-3 text-emerald-500" /> {p}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Button
                                                            onClick={() => markComplete(step.id)}
                                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes(step.id) ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                                        >
                                                            {completedSteps.includes(step.id) ? 'Phase Verified' : 'Verify Step'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>

                            <Separator className="bg-gray-100" />

                            {/* Section D: Application */}
                            <div className="space-y-12">
                                <div className="text-center space-y-4 mt-8">
                                    <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">Section D: FUSION Application</Badge>
                                    <h2 className="text-4xl font-bold text-[#272727] tracking-tighter uppercase italic text-[#0EA0DC] mb-8">Deployment Sequence</h2>
                                </div>

                                <div id="step8" className="scroll-mt-32">
                                    <Card className="p-8 rounded-lg border-l-4 border-l-amber-500">
                                        <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">STEP 8: MIXING FUSION</h3>
                                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                                            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                                                <h4 className="text-[10px] font-bold text-amber-600 uppercase mb-3">Ratio Activation</h4>
                                                <p className="text-xs text-amber-800 font-medium">Mix Element and Aether at a 1:1 ratio. Must be mixed 10 minutes prior to application.</p>
                                            </div>
                                            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                                                <h4 className="text-[10px] font-bold text-amber-600 uppercase mb-3">Pot Life Countdown</h4>
                                                <p className="text-xs text-amber-800 font-medium italic">FUSION is operational for 2 hours once mixed. Discard any remaining product after this window.</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button onClick={() => markComplete('step8')} className={`rounded-xl px-10 h-14 font-bold shadow-lg ${completedSteps.includes('step8') ? 'bg-[#0EA0DC]' : 'bg-[#272727]'}`}>Mix Established</Button>
                                        </div>
                                    </Card>
                                </div>

                                <div id="step9" className="scroll-mt-32">
                                    <Card className="p-8 rounded-lg mt-8 border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">STEP 9: FIRST POUR (SATURATION)</h3>
                                        <div className="flex items-start gap-4 mb-6">
                                            <Droplets className="w-8 h-8 text-[#0EA0DC] shrink-0" />
                                            <p className="text-sm text-[#666666] font-medium leading-relaxed italic">
                                                "Soak your applicator on all edges. Pour 15mL – 30mL (0.5 – 1 oz) of FUSION evenly, covering all corners to eliminate dry spots."
                                            </p>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button onClick={() => markComplete('step9')} variant="outline" className="rounded-xl px-10 h-14 font-bold">Applicator Saturated</Button>
                                        </div>
                                    </Card>
                                </div>

                                <div id="step10" className="scroll-mt-32 mt-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <Separator className="flex-1" />
                                        <Badge className="bg-[#272727] px-6 py-2 rounded-full uppercase tracking-[0.3em] font-bold text-[9px]">STEP 10: TACK CLOTH</Badge>
                                        <Separator className="flex-1" />
                                    </div>
                                    <p className="text-sm text-center text-[#666666] italic mb-10 max-w-xl mx-auto">"To remove the last bit of fallen lint and debris right before application. Light pass only — avoid leaving residue."</p>
                                    <div className="flex justify-center">
                                        <Button onClick={() => markComplete('step10')} className={`rounded-xl px-12 h-14 font-bold p-4 mb-8 ${completedSteps.includes('step10') ? 'bg-[#0EA0DC]' : 'bg-[#272727]'}`}>Surface Verified</Button>
                                    </div>
                                </div>

                                <div id="step11" className="scroll-mt-32">
                                    <Card className="p-8 sm:p-14 rounded-lg border-none bg-[#272727] text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                            <PenTool className="w-64 h-64 text-[#0EA0DC]" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-8 uppercase italic tracking-tighter text-[#0EA0DC]">STEP 11: Deployment Protocol</h3>
                                        <div className="grid md:grid-cols-2 gap-12 mb-10">
                                            <div className="space-y-6">
                                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                                    <h4 className="text-[10px] font-bold text-[#0EA0DC] uppercase tracking-widest mb-4 italic">The Overlap Rule</h4>
                                                    <p className="text-xs text-white/60 leading-relaxed font-bold uppercase italic tracking-tight">Overlap lines 50% continuously. Do not overlap sections that have started curing to avoid streaks.</p>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                                    <h4 className="text-[10px] font-bold text-[#0EA0DC] uppercase tracking-widest mb-4 italic">The Pressure/Speed Matrix</h4>
                                                    <p className="text-xs text-white/60 leading-relaxed">Medium pressure and medium speed. Too fast results in thin layers; too slow causes curing before leveling.</p>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="p-6 rounded-2xl bg-white/10 border border-white/20">
                                                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Sequence of Operations</h4>
                                                    <ol className="space-y-3 text-[11px] font-bold uppercase italic text-white/80">
                                                        <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-[#0EA0DC] flex items-center justify-center text-[10px]">1</span> Top surfaces (Roof, Hood, Trunk)</li>
                                                        <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-[#0EA0DC] flex items-center justify-center text-[10px]">2</span> Side Panels (Right and Left)</li>
                                                        <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-[#0EA0DC] flex items-center justify-center text-[10px]">3</span> Bumpers (Front and Back)</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-6">
                                            <Button onClick={() => markComplete('step11')} className="bg-[#0EA0DC] text-white hover:bg-[#0c80b3] p-4 rounded-xl px-12 h-16 font-bold text-xs uppercase tracking-widest shadow-2xl">Confirm Deployment</Button>
                                        </div>
                                    </Card>
                                </div>

                                <div id="step12" className="scroll-mt-32 mt-8 mb-8">
                                    <div className="p-10  pb-8 rounded-3xl  border border-gray-100 text-center relative overflow-hidden">
                                        <Badge className="bg-rose-500 text-white font-bold mb-4">CRITICAL CHECKPOINT</Badge>
                                        <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">STEP 12: QUALITY AUDIT</h3>
                                        <p className="text-xs text-[#666666] font-medium leading-relaxed max-w-2xl mx-auto italic mb-10">
                                            "You have a maximum of 1 hour to remove FUSION should you see an issue. Never leave a poor application to cure. Strip and redo immediately."
                                        </p>
                                        <div className="flex justify-center flex-wrap gap-4">
                                            <Button onClick={() => markComplete('step12')} className="bg-[#272727] text-white rounded-xl px-10 h-14 font-bold">Audit Complete</Button>
                                        </div>
                                    </div>
                                </div>

                                <div id="step13" className="scroll-mt-32">
                                    <Card className="p-8 rounded-lg border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#272727] mb-4 tracking-tighter italic uppercase">STEP 13: BOTTLE MAINTENANCE</h3>
                                        <div className="grid md:grid-cols-2 gap-8 text-xs font-medium text-[#666666]">
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3"><Wrench className="w-4 h-4 text-[#0EA0DC]" /> Dump all remaining FUSION out</li>
                                                <li className="flex items-center gap-3"><Wrench className="w-4 h-4 text-[#0EA0DC]" /> Rinse 3x with ETCH matrix</li>
                                            </ul>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3"><Wrench className="w-4 h-4 text-[#0EA0DC]" /> Clean outside with ETCH</li>
                                                <li className="flex items-center gap-3"><Wrench className="w-4 h-4 text-[#0EA0DC]" /> Dry upside down to avoid residue</li>
                                            </ul>
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <Button onClick={() => markComplete('step13')} variant="outline" className="rounded-xl px-10 h-14 font-bold">Maintenance Logged</Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <Separator className="bg-gray-100" />

                            {/* Section E: Aftercare */}
                            <div id="care" className="scroll-mt-32 mt-8">
                                <Card className="p-8 sm:p-14 rounded-lg border-none bg-emerald-50 relative overflow-hidden">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                                            <ShieldCheck className="w-8 h-8 text-[#0EA0DC]" />
                                        </div>
                                        <div>
                                            <Badge className="bg-[#0EA0DC] text-white font-bold mb-1">Section E: Protection</Badge>
                                            <h2 className="text-3xl font-bold text-emerald-900 tracking-tighter uppercase italic">Aftercare Protocol</h2>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                                        <div className="p-6 rounded-2xl bg-white border border-emerald-100 space-y-4">
                                            <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Immediate Guard</h4>
                                            <p className="text-xs text-emerald-800 leading-relaxed font-bold">Apply SEAL after 12 hours for a breathable sealant during the full 2-week technical cure.</p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-white border border-emerald-100 space-y-4">
                                            <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Washing Lockdown</h4>
                                            <p className="text-xs text-emerald-800 leading-relaxed">Do not wash for 2 weeks after application. Give customers the aftercare handout.</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <Button onClick={() => markComplete('care')} className="bg-[#272727] p-4 hover:bg-emerald-600 text-white rounded-xl px-12 h-14 font-bold shadow-lg">Lock Strategy</Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Section F: Troubleshooting */}
                            <div className="space-y-12 mt-8 mb-8">
                                <div className="text-center space-y-4">
                                    <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">Section F: Troubleshooting</Badge>

                                    <h2 className="text-4xl font-bold mb-3 text-[#272727] tracking-tighter uppercase italic text-rose-500">Operation Recovery</h2>
                                </div>

                                <div id="removal" className="scroll-mt-32">
                                    <Card className="skygloss-card p-8  rounded-lg mb-8 border-l-4 border-l-rose-500">
                                        <h3 className="text-xl font-bold text-rose-600 mb-6 uppercase tracking-tighter italic">Removing FUSION</h3>
                                        <div className="grid md:grid-cols-2 gap-10 text-xs text-[#666666] font-medium leading-relaxed italic">
                                            <div>
                                                <h4 className="text-[10px] font-bold text-[#272727] uppercase mb-4 tracking-widest">Method A: Within 1 Hour</h4>
                                                <p className="mb-4">Use firm pressure with ETCH-loaded paper towels. Wipe sections, flipping towels constantly to avoid re-depositing product.</p>
                                                <p>Final wipe with white microfiber and ETCH to remove haze. Discard microfiber.</p>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-bold text-[#272727] uppercase mb-4 tracking-widest">Method B: After 2 Weeks</h4>
                                                <p className="mb-4">Sequential sanding: 1k5, 3k, then 5k grit. Monitor depth closely to avoid burn through.</p>
                                                <p className="font-bold text-rose-700">Contact the technical team before sanding-off fully cured FUSION.</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <div id="issues" className="scroll-mt-32">
                                    <Card className="skygloss-card p-8 rounded-[32px] bg-gray-900 border-none  relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0EA0DC]/10 to-transparent" />
                                        <div className="relative z-10 space-y-8">
                                            <div className="flex items-center gap-4">
                                                <ShieldAlert className="w-10 h-10 text-[#0EA0DC]" />
                                                <h3 className="text-xl font-bold text-rose-600 mb-6 uppercase tracking-tighter italic">Sticky Application Mitigations</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-xs  leading-relaxed font-medium italic italic">"Due to soft or chemically weak clearcoat, the applicator may stick to the panel."</p>
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[11px] font-medium leading-relaxed ">
                                                    If reaction is light, load more FUSION to create a barrier and slide applicator over the surface. If heavy, cure fully, then re-assess or polish off.
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button onClick={() => markComplete('issues')} className="bg-[#0EA0DC] text-white hover:bg-gray-100 hover:text-[#0EA0DC] rounded-xl font-bold uppercase tracking-widest text-[10px] px-8 py-4 h-12">Confirm Review</Button>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        {/* Completion Footer */}
                        <div className="py-20">
                            <Card className="p-8 rounded-lg border-none bg-[#272727] text-white text-center space-y-10 relative overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA0DC]/20 to-transparent pointer-events-none" />
                                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto shadow-2xl transform rotate-6">
                                    <CheckCircle className="w-10 h-10 text-[#0EA0DC]" />
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <h2 className="text-4xl font-bold italic uppercase tracking-tighter leading-none">Professional <br />Deployment Complete</h2>
                                    <p className="text-white/50 max-w-xl mx-auto font-medium leading-relaxed italic">
                                        "Integrity is the final product. Every vehicle restored represents a commitment to chemical excellence."
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
                                    <Button onClick={onBack} className="rounded-xl p-4 h-14 bg-white text-[#272727] font-bold hover:bg-gray-100 shadow-xl text-xs uppercase tracking-widest transition-all">
                                        EXIT TERMINAL
                                    </Button>
                                    <Button variant="ghost" className="rounded-xl p-4  h-14 text-white hover:bg-white/10 font-bold border border-white/20 text-xs uppercase tracking-widest">
                                        DOWNLOAD PDF
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </main>

                    {/* Sidebar Area (Right 1 column) */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Course Navigation */}
                            <Card className="skygloss-card p-6 rounded-2xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <BookOpen className="w-5 h-5 text-[#0EA0DC]" />
                                    <h3 className="text-lg font-bold text-[#272727]">Guide Content</h3>
                                </div>
                                <ScrollArea className="h-[500px] pr-4">
                                    <div className="space-y-6">
                                        {sections.map((section) => (
                                            <div key={section.id} className="space-y-3">
                                                <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] px-2 mb-2">
                                                    {section.title}
                                                </div>
                                                <div className="space-y-1 relative">
                                                    <div className="absolute left-[15px] top-0 bottom-0 w-[1px] bg-gray-100" />
                                                    {section.subsections?.map((sub) => {
                                                        const isCompleted = completedSteps.includes(sub.id);
                                                        const isActive = activeSub === sub.id;
                                                        return (
                                                            <button
                                                                key={sub.id}
                                                                onClick={() => scrollTo(sub.id)}
                                                                className={`w-full group flex items-start gap-3 text-left py-2 px-3 rounded-lg transition-all duration-200 ${isActive
                                                                    ? "bg-[#0EA0DC] text-white shadow-md"
                                                                    : "hover:bg-gray-50 text-[#666666]"
                                                                    }`}
                                                            >
                                                                <div className={`mt-1 flex-shrink-0 transition-colors ${isActive ? "text-white" : isCompleted ? "text-emerald-500" : "text-[#94a3b8]"}`}>
                                                                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className={`text-xs font-bold ${isActive ? "text-white" : "text-[#272727]"}`}>
                                                                        {sub.title}
                                                                    </div>
                                                                    {isActive && (
                                                                        <div className="text-[9px] text-white/70 font-medium">Currently viewing</div>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </Card>

                            {/* Technical Wiki Card */}
                            <Card className="skygloss-card p-6 rounded-2xl bg-gradient-to-br from-[#0EA0DC] to-[#0c80b3] border-none  overflow-hidden group">
                                <div className="absolute  p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <Wrench className="w-24 h-24 text-[#0ea0dc26]" style={{ color: "#0ea0dc26" }} />
                                </div>
                                <div className="relative z-10">
                                    <h2 className="font-bold text-md uppercase tracking-wider mb-2">Technical Support</h2>
                                    <p className="text-sm  mb-6 leading-relaxed">Emergency technical support for certified master distributors.</p>
                                    <Button className="w-full bg-[#0EA0DC] text-white hover:bg-gray-50 hover:text-[#0EA0DC] font-bold py-2 rounded-xl text-[10px] uppercase tracking-widest h-10">
                                        <MessageSquare className="w-3.5 h-3.5 mr-2" /> Start Live Chat
                                    </Button>
                                </div>
                            </Card>

                            {/* Help Resource */}
                            <Card className="skygloss-card p-6 rounded-2xl flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0EA0DC]">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-[#272727] uppercase">Technical Wiki</h4>
                                    <p className="text-[10px] text-[#272727]/50 font-medium">Full database of reactivity charts.</p>
                                </div>
                            </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
