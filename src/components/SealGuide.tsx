import { useState, useEffect } from "react";
import api from "../api/axios";
import {
    ArrowLeft,
    CheckCircle,
    ChevronRight,
    Droplets,
    Zap,
    BookOpen,
    Info,
    RefreshCw
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import SealPdf from "../assets/pdf/Seal.pdf";

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
            { id: "clean", title: "1. Surface Decontamination" },
            { id: "residue", title: "2. Residue Removal" },
            { id: "conditions", title: "3. Working Conditions" }
        ]
    },
    {
        id: "application",
        title: "SEAL Protocol",
        subsections: [
            { id: "apply", title: "Phase 4: Apply SEAL" }
        ]
    },
    {
        id: "aftercare",
        title: "Terminal Strategy",
        subsections: [
            { id: "maintenance", title: "Aftercare & Reactivation" }
        ]
    }
];

export function SealGuide({ onBack }: { onBack: () => void }) {
    const [activeSub, setActiveSub] = useState("clean");
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
            setCompletedSteps([...completedSteps, id]);
            try {
                await api.patch('/users/me/course-progress', { courseName: 'SEAL', stepId: id });
            } catch (err) {
                console.error("Failed to save course progress", err);
            }
        }
    };

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await api.get('/auth/profile');
                const progress = response.data.courseProgress?.SEAL || [];
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
                                <Droplets className="w-64 h-64 text-[#0EA0DC]" />
                            </div>
                            <div className="relative z-10">
                                <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 mb-4 px-3 py-1 font-bold">
                                    PROFESSIONAL SEAL APPLICATION GUIDE
                                </Badge>
                                <h1 className="text-4xl sm:text-5xl font-bold text-[#272727] mb-4 tracking-tighter italic uppercase">
                                    <span className="text-[#0EA0DC]">SEAL</span> Professional Guide
                                </h1>
                                <p className="text-[#666666] text-lg max-w-2xl mb-8 font-medium">
                                    Achieve enhanced hydrophobicity and long-lasting protection with the SkyGloss SEAL sprayable hydrophobic sealant.
                                </p>
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <RefreshCw className="w-4 h-4 text-[#0EA0DC]" />
                                        Reactivation Tech
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <Zap className="w-4 h-4 text-[#0EA0DC]" />
                                        Sprayable Shield
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
                            <div id="clean" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        1. Ensure Vehicle is Clean and Free from Contamination
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                        Ensure Vehicle is Clean and Free from <span className="text-[#0EA0DC]">Contamination</span>
                                    </h2>
                                    <div className="space-y-6 mb-10">
                                        {[
                                            "If applying after FUSION, wait at least 12 hours before proceeding.",
                                            "Thoroughly wash the vehicle to remove all dirt, grease, and debris.",
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0EA0DC] font-bold text-xs shadow-sm shrink-0">{i + 1}</div>
                                                <p className="text-sm text-[#666666] font-medium leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('clean')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('clean') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('clean') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>  <div id="residue" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        2. Remove Residue if Necessary
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                        Remove Residue if <span className="text-[#0EA0DC]">Necessary</span>
                                    </h2>
                                    <div className="space-y-6 mb-10">
                                        {[
                                            "If any wax, silicone, or other residues are present, strip them off using a degreasing agent.",
                                            "The surface must be completely clean for optimal bonding and performance.",
                                            "Clean surface with IPA before application if needed."
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
                            </div>  <div id="conditions" className="scroll-mt-32 mt-8">
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




                        </div>

                        <div id="apply" className="scroll-mt-32 space-y-12 mt-8">
                            {/* <div className="text-center space-y-4 mt-8 mb-8">
                                    <Badge variant="outline" className="border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 uppercase tracking-[0.4em] px-6 py-1 font-bold text-[10px]">Matrix_Phase_03</Badge>
                                    <h2 className="text-4xl font-bold text-[#272727] tracking-tighter uppercase italic">RESIN COAT Deployment</h2>
                                </div> */}

                            <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <div className="md:w-[40%] flex flex-col justify-between h-full">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">
                                            Apply SEAL</h3>

                                        <div className="p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                            <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                1. Shake the bottle well before use.</p>
                                            <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                2. Spray a liberal amount of SEAL directly onto a section of the vehicle</p>
                                            <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                3. Using 2 clean microfibers, with the first microfiber spread around and work into the panel, with
                                                the second microfiber, wipe dry with a until clear and streak-free.</p>
                                            <p className="text-xs text-[#666666] font-medium leading-relaxed italic">
                                                4. Continue section-by-section until the entire vehicle is treated.</p>

                                        </div>
                                        <h6>You’ve now completed the SkyGloss SEAL application — enhancing hydrophobicity and
                                            revitalizing your SkyGloss coating for superior water-repellency and shine.
                                        </h6>
                                    </div>

                                    <div className="flex justify-end mt-8">
                                        <Button
                                            onClick={() => markComplete('apply')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('apply') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                        >
                                            {completedSteps.includes('apply') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                            <Card id="maintenance" className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC] mt-8">
                                <div className="flex flex-col  gap-8">
                                    <div className="md:w-[40%] flex flex-col justify-between h-full">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#272727] mb-3 uppercase tracking-tighter italic">
                                                Aftercare</h3>

                                            <h6>SEAL can be applied whenever hydrophobicity and sleekness is lost.
                                            </h6>
                                        </div>

                                        <div className="flex justify-end mt-8">
                                            <Button
                                                onClick={() => markComplete('maintenance')}
                                                className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('maintenance') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                            >
                                                {completedSteps.includes('maintenance') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            </Card>

                        </div>

                        {/* Completion Footer */}
                        <div className="mt-8">
                            <Card className="p-4 rounded-lg border-none bg-[#f8fafc] text-center space-y-10 relative overflow-hidden border border-gray-100 shadow-inner">
                                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto shadow-2xl transform rotate-6 border border-gray-100">
                                    <CheckCircle className="w-10 h-10 text-[#0EA0DC]" />
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <h2 className="text-4xl font-bold italic uppercase tracking-tighter leading-none text-[#272727]">Standard Operation Complete</h2>
                                    <p className="text-[#666666] max-w-xl mx-auto font-medium leading-relaxed italic">
                                        You’ve now completed the SkyGloss SEAL application — enhancing hydrophobicity and revitalizing your coating for superior water-repellency and shine.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
                                    <Button
                                        onClick={async () => {
                                            try {
                                                await api.patch('/users/me/complete-course', { courseName: 'SEAL' });
                                            } catch (err) {
                                                console.error("Failed to mark course as complete", err);
                                            }
                                            onBack();
                                        }}
                                        className="rounded-xl p-4 px-12 h-14 bg-[#272727] text-white font-bold hover:bg-[#0EA0DC] shadow-xl text-xs uppercase tracking-widest transition-all"
                                    >
                                        Finished
                                    </Button>
                                    <Button variant="outline" className="rounded-xl p-4 px-12 h-14 bg-[#272727] text-white font-bold hover:bg-[#0EA0DC] shadow-xl text-xs uppercase tracking-widest transition-all" onClick={() => window.open(SealPdf, '_blank')}>
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
