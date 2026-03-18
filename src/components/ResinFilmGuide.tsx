import { useState, useEffect } from "react";
import api from "../api/axios";
import { ArrowLeft, CheckCircle, ChevronRight, BookOpen, Info, Droplets, Zap, Flame } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "../AuthContext";
import ResinFilmPdf from "../assets/pdf/Resin_Film.pdf";

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
        id: "coat1",
        title: "RESIN COAT Protocol",
        subsections: [
            { id: "step1-apply", title: "Phase 1: Apply RESIN COAT" },
            { id: "step2-cure", title: "Phase 2: Drying & Hardening" }
        ]
    },
    {
        id: "coat2",
        title: "FILM COAT Protocol",
        subsections: [
            { id: "step3-apply", title: "Phase 3: Apply FILM COAT" }
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

export function ResinFilmGuide({ onBack }: { onBack: () => void }) {
    const { user, setUser } = useAuth();
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
                        'RESIN_FILM': newSteps
                    }
                };
                setUser(updatedUser);
            }

            try {
                await api.patch('/users/me/course-progress', { courseName: 'RESIN_FILM', stepId: id });
            } catch (err) {
                console.error("Failed to save course progress", err);
            }
        }
    };

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await api.get('/auth/profile');
                const progress = response.data.courseProgress?.RESIN_FILM || [];
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
                    {/* Main Content Area (Left 2 columns) */}
                    <main className="lg:col-span-2 space-y-12">
                        {/* Hero Section */}
                        <div className="bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-100 relative overflow-hidden group mb-3">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Flame className="w-64 h-64 text-[#0EA0DC]" />
                            </div>
                            <div className="relative z-10">
                                <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 mb-4 px-3 py-1 font-bold">
                                    PROFESSIONAL RESIN FILM APPLICATION GUIDE
                                </Badge>
                                <h1 className="text-4xl sm:text-5xl font-bold text-[#272727] mb-4 tracking-tighter italic uppercase">
                                    <span className="text-[#0EA0DC]">RESIN FILM</span> Professional Guide
                                </h1>
                                <p className="text-[#666666] text-lg max-w-2xl mb-8 font-medium">
                                    Master the dual-layer Resin Film system for ultimate depth, protection, and a self-healing elastic finish.
                                </p>
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <Zap className="w-4 h-4 text-[#0EA0DC]" />
                                        Advanced Elasticity
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <Droplets className="w-4 h-4 text-[#0EA0DC]" />
                                        Dual Layer Tech
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

                        {/* Content Sections */}
                        <div className="space-y-16">
                            {/* Prep Section */}
                            <div id="wash" className="scroll-mt-32">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Phase 01: Preparation
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
                                            className={`rounded - xl px - 10 h - 14 font - bold transition - all duration - 500 ${completedSteps.includes('wash') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'} `}
                                        >
                                            {completedSteps.includes('wash') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            <div id="residue" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-rose-500 bg-rose-50/5">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Phase 02: Residue removal
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                        Remove <span className="text-[#0EA0DC]">Wax & Silicone</span>
                                    </h2>
                                    <div className="space-y-6 mb-10">
                                        {[
                                            " If previous wax or silicone products were used, strip them off using a degreasing agent.",
                                            " The surface must be completely clean and residue-free for proper bonding.",
                                            "  Clean surface with IPA before application."
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
                                            className={`rounded - xl px - 10 h - 14 font - bold transition - all duration - 500 ${completedSteps.includes('residue') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727]  text-white hover:bg-[#0EA0DC] shadow-md'} `}
                                        >
                                            {completedSteps.includes('residue') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Verify Residue-Free'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            <div id="conditions" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-rose-500 bg-rose-50/5">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Phase 03: Ideal Working Conditions
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
                                            className={`rounded - xl px - 10 h - 14 font - bold transition - all duration - 500 ${completedSteps.includes('conditions') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727]  text-white hover:bg-[#0EA0DC] shadow-md'} `}
                                        >
                                            {completedSteps.includes('conditions') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                            {/* <div id="conditions" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-8 mt-8">
                                    <div className="h-[1px] flex-1 bg-gray-200" />
                                    <h3 className="text-xs font-bold text-[#0EA0DC] uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                        <Wind className="w-4 h-4 text-[#0EA0DC]" /> Environmental Control
                                    </h3>
                                    <div className="h-[1px] flex-1 bg-gray-200" />
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { title: "Atmosphere", desc: "Apply indoors or in a dust-free environment.", icon: Wind },
                                        { title: "Neutral Zone", desc: "Avoid direct sunlight, wind, or high humidity.", icon: PenTool },
                                        { title: "Thermal Audit", desc: "Ensure engine is cool — heat affects leveling.", icon: Clock }
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
                                <div className="mt-8 flex justify-end">
                                    <Button
                                        onClick={() => markComplete('conditions')}
                                        className={`rounded - xl px - 8 h - 12 font - bold text - xs uppercase tracking - widest transition - all ${ completedSteps.includes('conditions') ? 'bg-[#0EA0DC]   border border-emerald-200' : 'bg-[#272727]  text-[#64748b]' } `}
                                    >
                                        {completedSteps.includes('conditions') ? 'Conditions Verified' : 'Confirm Environment'}
                                    </Button>
                                </div>
                            </div> */}

                            <div className="h-px bg-gray-100 my-8" />

                            {/* Application Phase */}
                            <div id="step1-apply" className="scroll-mt-32 space-y-12">
                                {/* <div className="text-center space-y-4 mt-8 mb-8">
                                    <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">Matrix_Phase_03</Badge>
                                    <h2 className="text-4xl font-bold text-[#272727] tracking-tighter uppercase italic">RESIN COAT Deployment</h2>
                                </div> */}

                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <div className="flex flex-col  gap-8">
                                        <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                            Phase 04: Application
                                        </Badge>
                                        <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                            Step 1 – Apply <span className="text-[#0EA0DC]">RESIN COAT</span>
                                        </h2>
                                        <div className="space-y-6 mb-10">
                                            {[
                                                "Shake RESIN COAT well before use.",
                                                "Apply 5–7 drops onto a clean applicator pad.",
                                                "Spread evenly over a 50–70 cm² section of the vehicle.",
                                                "Wait 2–4 minutes for the coating to flash, then buff gently with a clean microfiber cloth.",
                                                "Repeat the process on all panels, ensuring complete coverage."
                                            ].map((step, i) => (
                                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0EA0DC] font-bold text-xs shadow-sm shrink-0">{i + 1}</div>
                                                    <p className="text-sm text-[#666666] font-medium leading-relaxed">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                onClick={() => markComplete('step1-apply')}
                                                className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('step1-apply') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                            >
                                                {completedSteps.includes('step1-apply') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC] mt-8">
                                    <div className="flex flex-col  gap-8">
                                        <div className=" flex flex-col justify-between h-full">
                                            <div>
                                                <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">
                                                    Step 2 – Drying & Hardening</h3>
                                                <div className="p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                                    <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                        • Allow the RESIN COAT layer to dry naturally for 2–4 hours depending on ambient temperature.</p>
                                                    <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                        • Infrared lamps may be used to accelerate curing — only on the first layer (RESIN COAT).</p>

                                                </div>
                                            </div>

                                            <div className="flex justify-end mt-8">
                                                <Button
                                                    onClick={() => markComplete('step2-cure')}
                                                    className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('step2-cure') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                                >
                                                    {completedSteps.includes('step2-cure') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                                </Button>
                                            </div>
                                        </div>

                                    </div>
                                </Card>
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC] mt-8">
                                    <div className="flex flex-col  gap-8">
                                        <div className=" flex flex-col justify-between h-full">
                                            <div>
                                                <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">
                                                    Step 3 – Apply FILM COAT (Top Layer)</h3>
                                                <div className="p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                                    <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                        1. Once the base layer is fully cured, proceed with FILM COAT.</p>
                                                    <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                        2. Shake well, then apply 5–7 drops to a clean applicator.</p>
                                                    <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                        3. Spread evenly in 50–70 cm² sections.</p>
                                                    <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                        4. Wait 2–4 minutes, then buff with a clean microfiber cloth.</p>
                                                    <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                        5. Repeat process on all panels.</p>
                                                </div>
                                                <h6>You’ve now completed the full SkyGloss RESIN FILM System — forming a deep-gloss,
                                                    self-healing, factory-grade finish.</h6>
                                            </div>

                                            <div className="flex justify-end mt-8">
                                                <Button
                                                    onClick={() => markComplete('step3-apply')}
                                                    className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('step3-apply') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                                >
                                                    {completedSteps.includes('step3-apply') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                                </Button>
                                            </div>
                                        </div>

                                    </div>
                                </Card>
                            </div>
                            <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC] mt-8">
                                <div className="flex flex-col  gap-8">
                                    <div className=" flex flex-col justify-between h-full">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">
                                                Aftercare – Protect the Perfection</h3>
                                            <div className="p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    Avoid water contact or washing for 24 hours after application.</p>
                                                <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                    Full curing occurs within 14 days (Self healing properties activate after full cure) — during this
                                                    period:
                                                    <br /> ◦ Do not use automatic car washes.
                                                    <br /> ◦ Avoid detergents with strong alkalis or harsh chemicals.</p>

                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-8">
                                            <Button
                                                onClick={() => markComplete('protection')}
                                                className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('protection') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                            >
                                                {completedSteps.includes('protection') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            </Card>

                            <div className="h-px bg-gray-100 my-8" />



                            {/* Aftercare */}

                        </div>

                        {/* Completion Footer */}
                        <div className="py-20">
                            <Card className="p-8 rounded-lg border-none bg-[#f8fafc] text-center space-y-10 relative overflow-hidden border border-gray-100 shadow-inner">
                                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto shadow-2xl transform rotate-6 border border-gray-100">
                                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <h2 className="text-4xl font-bold italic uppercase tracking-tighter leading-none text-[#272727]">System Deployed</h2>
                                    <p className="text-[#666666] max-w-xl mx-auto font-medium leading-relaxed italic">
                                        You’ve now completed the full SkyGloss RESIN FILM System — forming a deep-gloss, self-healing, factory-grade finish.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
                                    <Button
                                        onClick={async () => {
                                            try {
                                                await api.patch('/users/me/complete-course', { courseName: 'RESIN FILM' });
                                            } catch (err) {
                                                console.error("Failed to mark course as complete", err);
                                            }
                                            onBack();
                                        }}
                                        className="rounded-xl p-4 h-14 bg-[#272727] text-white font-bold hover:bg-[#0EA0DC] shadow-xl text-xs uppercase tracking-widest transition-all"
                                    >
                                        Finished
                                    </Button>
                                    <Button variant="outline" className="rounded-xl p-4 h-14 bg-[#272727] text-white font-bold hover:bg-[#0EA0DC] shadow-xl text-xs uppercase tracking-widest transition-all" onClick={() => window.open(ResinFilmPdf, '_blank')}>
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

                            {/* Technical Help Card matched with Fusion style */}
                            <Card className="p-4 rounded-2xl bg-[#0EA0DC] text-white">
                                <h4 className="font-bold text-sm mb-2">Technical Support</h4>
                                <p className="text-xs text-white/80 mb-4">24/7 support for certified technicians</p>
                                <a href="/support">
                                    <Button className="w-full bg-white text-[#0EA0DC] hover:bg-gray-100 text-xs h-8">
                                        Contact Support
                                    </Button>
                                </a>
                            </Card>

                            {/* Help Resource */}
                            <Card className="p-4 rounded-2xl flex items-center gap-4 border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0EA0DC]">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-[#272727] uppercase tracking-wider">Technical Data</h4>
                                    <p className="text-[10px] text-[#666666] font-medium">SOP Protocol V1.0</p>
                                </div>
                            </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
