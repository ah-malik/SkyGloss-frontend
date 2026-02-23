import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
    ArrowLeft,
    CheckCircle,
    ChevronRight,
    ShieldAlert,
    Wrench,
    Info,
    Droplets,
    Zap,
    Wind,
    BookOpen,
    MessageSquare,
    Clock,
    Sparkles,
    Flame,
    PenTool,
    ShieldCheck
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import ShinePdf from "../assets/pdf/Shine.pdf";

interface Section {
    id: string;
    title: string;
    subsections?: { id: string; title: string }[];
}

const sections: Section[] = [
    {
        id: "prep",
        title: "Substrate Preparation",
        subsections: [
            { id: "wash", title: "1. Wash & Decontaminate" },
            { id: "residue", title: "2. Residue Removal" },
            { id: "conditions", title: "3. Working Conditions" }
        ]
    },
    {
        id: "application",
        title: "SHINE Protocol",
        subsections: [
            { id: "step1-apply", title: "Phase 1: Apply SHINE" },
            { id: "step2-cure", title: "Phase 2: Drying & Hardening" }
        ]
    },
    {
        id: "aftercare",
        title: "Terminal Maintenance",
        subsections: [
            { id: "protection", title: "Aftercare & Protection" }
        ]
    }
];

export function ShineGuide({ onBack }: { onBack: () => void }) {
    const [activeSub, setActiveSub] = useState("wash");
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
                            className="bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-100 relative overflow-hidden group mb-3"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <ShieldCheck className="w-64 h-64 text-[#0EA0DC]" />
                            </div>
                            <div className="relative z-10">
                                <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 mb-4 px-3 py-1 font-bold">
                                    1 LAYER SYSTEM
                                </Badge>
                                <h1 className="text-4xl sm:text-5xl font-bold text-[#272727] mb-4 tracking-tighter italic uppercase">
                                    Professional <span className="text-[#0EA0DC]">SHINE</span> Guide
                                </h1>
                                <p className="text-[#666666] text-lg max-w-2xl mb-8">
                                    Achieve a flawless, factory-fresh finish by following these
                                    precise application steps for the SkyGloss Shine System.                                </p>
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <BookOpen className="w-4 h-4 text-[#0EA0DC]" />
                                        Advanced Protection
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <Sparkles className="w-4 h-4 text-[#0EA0DC]" />
                                        Ultra-Gloss Aesthetics
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        {completedSteps.length}/{totalSteps} modules verified
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Progress Bar */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-3">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-[#272727] uppercase tracking-wider">Course Progress</span>
                                <span className="text-sm font-bold text-[#0EA0DC]">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2.5 bg-gray-100" />
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-16">
                            {/* Prep Section */}
                            <div id="wash" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        1. Wash & Decontaminate

                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                        Wash & <span className="text-[#0EA0DC]">Decontaminate</span>
                                    </h2>
                                    <div className="space-y-6 mb-10">
                                        {[
                                            "Thoroughly wash the vehicle to remove all dirt, grease, and debris.",
                                            "Polish the surface if necessary to eliminate oxidation or fine scratches.",
                                            " Towel-dry completely — no moisture should remain before coating."
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0EA0DC] font-bold text-xs shadow-sm shrink-0">{i + 1}</div>
                                                <p className="text-sm text-[#666666] font-medium leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('wash')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('wash') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('wash') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            <div id="residue" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        2. Remove Wax & Silicone Residue
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                        Remove Wax & <span className="text-[#0EA0DC]">Silicone Residue</span>
                                    </h2>
                                    <div className="space-y-6 mb-10">
                                        {[
                                            "If previous wax or silicone products were used, strip them off using a degreasing agent.",
                                            "The surface must be completely clean and residue-free for proper bonding.",
                                            "Clean surface with IPA before application."
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0EA0DC] font-bold text-xs shadow-sm shrink-0">{i + 1}</div>
                                                <p className="text-sm text-[#666666] font-medium leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('residue')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('residue') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('residue') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                            <div id="conditions" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        3. Ideal Working Conditions
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                        Ideal Working <span className="text-[#0EA0DC]">Conditions</span>
                                    </h2>
                                    <div className="space-y-6 mb-10">
                                        {[
                                            "Apply indoors or in a controlled, dust-free environment.",
                                            "Avoid direct sunlight, wind, or high humidity.",
                                            "Ensure the engine is cool — heat from a running engine can affect leveling and curing."
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0EA0DC] font-bold text-xs shadow-sm shrink-0">{i + 1}</div>
                                                <p className="text-sm text-[#666666] font-medium leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('conditions')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('conditions') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('conditions') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>






                            <div id="step1-apply" className="scroll-mt-32 space-y-12 mt-8">
                                {/* <div className="text-center space-y-4 mt-8 mb-8">
                                    <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">Matrix_Phase_03</Badge>
                                    <h2 className="text-4xl font-bold text-[#272727] tracking-tighter uppercase italic">RESIN COAT Deployment</h2>
                                </div> */}

                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <div className="flex flex-col  gap-8">
                                        <div className="md:w-[40%]">
                                            <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">Step 1 – Apply SHINE (1 Layer only)</h3>
                                            <h6>You may put 2 layers if needed (optional)
                                            </h6>
                                            <div className="p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    1. Shake the bottle well before use.</p>
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    2. Apply 5–7 drops of SHINE COAT onto the microfiber applicator pad.</p>
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    3. Spread evenly using straight, overlapping motions — work in sections of 50–70 cm² at a time.</p>
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    4. Allow the coating to flash for 2–4 minutes.</p>
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    5. Buff gently with the provided microfiber cloth until clear and streak-free</p>
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    6. Continue panel-by-panel until the entire vehicle is coated.</p>
                                            </div>
                                            <h6>Pro Tip: Maintain consistent lighting to easily spot high or uneven spots during application.
                                            </h6>
                                        </div>

                                    </div>
                                </Card>
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC] mt-8">
                                    <div className="flex flex-col  gap-8">
                                        <div className="md:w-[40%]">
                                            <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">
                                                Step 2 – Drying & Hardening</h3>
                                            <div className="p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    • Infrared lamps may be used to accelerate curing</p>
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    • Full curing occurs within 14 days</p>

                                            </div>
                                            <h6>You’ve now completed the full SkyGloss SHINE System — forming a deep-gloss, factory-grade
                                                finish.</h6>
                                        </div>

                                    </div>
                                </Card>
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC] mt-8">
                                    <div className="flex flex-col  gap-8">
                                        <div className="md:w-[40%]">
                                            <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">
                                                Aftercare – Protect the Perfection</h3>
                                            <div className="p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    • Avoid water contact or washing for 24 hours after application.</p>
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    Full curing occurs within 14 days.
                                                    <br />◦ Do not use automatic car washes.
                                                    <br />◦ Avoid detergents with strong alkalis or harsh chemicals.</p>

                                            </div>

                                        </div>

                                    </div>
                                </Card>
                            </div>

                            {/* Aftercare */}

                        </div>

                        {/* Completion Footer */}
                        <div className="py-20">
                            <Card className="p-8 rounded-lg border-none bg-[#f8fafc] text-center space-y-10 relative overflow-hidden border border-gray-100 shadow-inner">
                                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto shadow-2xl transform rotate-6 border border-gray-100">
                                    <CheckCircle className="w-10 h-10 text-emerald-500 rounded-xl flex items-center justify-center text-[#0EA0DC] shrink-0" />
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <h2 className="text-4xl font-bold italic uppercase tracking-tighter leading-none text-[#272727]">System Complete</h2>
                                    <p className="text-[#666666] max-w-xl mx-auto font-medium leading-relaxed italic">
                                        You’ve now completed the full SkyGloss SHINE System — achieving a flawless, mirror-grade protectant layer.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
                                    <Button onClick={onBack} className="rounded-xl p-4 h-14 bg-[#272727] text-white font-bold hover:bg-[#0EA0DC] shadow-xl text-xs uppercase tracking-widest transition-all">
                                        Finished
                                    </Button>
                                    <Button variant="outline" className="rounded-xl p-4 h-14 bg-[#272727] text-white font-bold hover:bg-[#0EA0DC] shadow-xl text-xs uppercase tracking-widest transition-all" onClick={() => window.open(ShinePdf, '_blank')}>
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
                                                                    ? "bg-[#0EA0DC] text-white shadow-md shadow-[#0EA0DC]/20"
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
                                                                        <div className="text-[9px] text-white/70 font-medium tracking-tight">Active Step</div>
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

                            {/* Technical Help Card */}
                            <Card className="skygloss-card p-6 rounded-2xl bg-gradient-to-br from-[#0EA0DC] to-[#0c80b3] border-none text-white overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-24 h-24" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Gloss Maintenance</h4>
                                    <p className="text-[11px] text-white/80 mb-6 leading-relaxed">Achieve longevity by using specialized SkyGloss silica-based maintenance sprays.</p>
                                    <Button className="w-full bg-white text-[#0EA0DC] hover:bg-gray-50 font-bold py-2 rounded-xl text-[10px] uppercase tracking-widest h-10 border-none shadow-lg">
                                        <Info className="w-3.5 h-3.5 mr-2" /> Maintenance Wiki
                                    </Button>
                                </div>
                            </Card>

                            {/* Help Resource */}
                            <Card className="skygloss-card p-6 rounded-2xl flex items-center gap-4 border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0EA0DC]">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-[#272727] uppercase">Technical Support</h4>
                                    <p className="text-[10px] text-[#272727]/50 font-medium">Certified Support Channel.</p>
                                </div>
                            </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
