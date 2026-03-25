import { useState, useEffect } from "react";
import api from "../api/axios";
import { ArrowLeft, CheckCircle, ChevronRight, BookOpen, Info, Shield, Target, Lightbulb, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "../AuthContext";
import UnderstandingPdf from "../assets/pdf/Understanding.pdf";

interface Section {
    id: string;
    title: string;
    subsections?: { id: string; title: string }[];
}

const sections: Section[] = [
    {
        id: "core-difference",
        title: "The Core Difference",
        subsections: [
            { id: "philosophy", title: "1. Sales Philosophy" },
            { id: "evolution", title: "2. Technology Evolution" }
        ]
    },
    {
        id: "reality",
        title: "Reality Explained",
        subsections: [
            { id: "physics", title: "1. Chemistry & Physics" },
            { id: "limitations", title: "2. Design Scope" }
        ]
    },
    {
        id: "strategy",
        title: "Sales Strategy",
        subsections: [
            { id: "process", title: "1. Education Process" },
            { id: "expectations", title: "2. Setting Expectations" }
        ]
    },
    {
        id: "fusion",
        title: "Permanence & Warranty",
        subsections: [
            { id: "permanence-logic", title: "1. FUSION Permanence" },
            { id: "do-dont", title: "2. Best Practices" }
        ]
    },
    {
        id: "standard",
        title: "The Standard",
        subsections: [
            { id: "the-standard", title: "1. Professional Standards" }
        ]
    }
];

export function UnderstandingSkyGloss({ onBack }: { onBack: () => void }) {
    const { user, setUser } = useAuth();
    const [activeSub, setActiveSub] = useState("philosophy");
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
                        'UNDERSTANDING_SKYGLOSS': newSteps
                    }
                };
                setUser(updatedUser);
            }

            try {
                await api.patch('/users/me/course-progress', {
                    courseName: 'UNDERSTANDING_SKYGLOSS',
                    stepId: id
                });
            } catch (err) {
                console.error("Failed to save course progress", err);
            }
        }
    };

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await api.get('/auth/profile');
                const progress = response.data.courseProgress?.UNDERSTANDING_SKYGLOSS || [];
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
                                <Target className="w-64 h-64 text-[#0EA0DC]" />
                            </div>
                            <div className="relative z-10">
                                <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 mb-4 px-3 py-1 font-bold">
                                    SKYGLOSS SALES PHILOSOPHY
                                </Badge>
                                <h1 className="text-4xl sm:text-5xl font-bold text-[#272727] mb-4 tracking-tighter uppercase">
                                    Understanding <span className="text-[#0EA0DC]">SkyGloss</span>
                                </h1>
                                <p className="text-[#666666] text-lg max-w-2xl mb-8 font-medium">
                                    How to Think About It. How to Articulate It. How to Sell It Correctly.
                                </p>
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <Lightbulb className="w-4 h-4 text-[#0EA0DC]" />
                                        Educate First
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <Shield className="w-4 h-4 text-[#0EA0DC]" />
                                        Paint Health Focus
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
                            {/* The Core Difference */}
                            <div id="philosophy" className="scroll-mt-32">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Section 01: The Core Difference
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase">
                                        Sales <span className="text-[#0EA0DC]">Philosophy</span>
                                    </h2>
                                    <div className="space-y-6 mb-10 text-[#666666]">
                                        <p className="font-medium leading-relaxed p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                            The automotive appearance industry has always evolved alongside technology.
                                            <br />
                                            For many years, the focus was naturally placed on improving how paint looks — because that was
                                            what the tools of the time allowed. As technology advances, our understanding of paint health,
                                            clearcoat integrity, and long-term preservation has evolved as well.
                                            <br />
                                            SkyGloss exists because we now have a better way.
                                            <br />
                                            Not because the past was wrong — but because what is possible today is more complete, more
                                            effective, and more honest for the customer.
                                            <br />
                                            Instead of leading with promises, SkyGloss leads with understanding.
                                            <br />
                                            Instead of focusing only on appearance, SkyGloss focuses on paint health.
                                            <br />
                                            <strong>
                                                This shift in perspective is our greatest advantage.
                                            </strong>
                                            <br />
                                            The most powerful thing about SkyGloss is that we never have to apologize for what it can’t do —
                                            because we explain reality clearly before any service is performed.
                                            <br />
                                            The question is never whether SkyGloss works.
                                            <br />
                                            The question is whether expectations are aligned from the start.
                                        </p>

                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('philosophy')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('philosophy') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white hover:bg-black'}`}
                                        >
                                            {completedSteps.includes('philosophy') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Verify Understanding'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            <div id="evolution" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Section 02: Evolution
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase">
                                        Reality, <span className="text-[#0EA0DC]">Clearly Explained</span>
                                    </h2>
                                    <div className="space-y-6 mb-10 text-[#666666] p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                        <p className="font-medium leading-relaxed">
                                            SkyGloss is a paint health and clearcoat optimization solution.
                                            <br />
                                            It is not magic — it is chemistry, physics, and process applied correctly.
                                            <br />
                                            Clearcoat is a finite material. Over time, it wears down, just like tires or engines. Once it is
                                            compromised beyond a certain point, no solution can override physics.
                                            <br />
                                            If a vehicle’s clearcoat is too far gone, SkyGloss cannot rebuild what no longer exists.
                                            That does not mean the process failed — it means the starting point defined the outcome.
                                            <br />
                                            SkyGloss is designed to:
                                            <br />
                                            <strong>
                                                This shift in perspective is our greatest advantage.
                                            </strong>

                                        </p>
                                        <ul>
                                            <li>• Restore and rebuild clearcoat</li>
                                            <li>• Optimize remaining clearcoat</li>
                                            <li>• Permanently fuse into viable factory finishes</li>
                                            <li>• Fix all kinds of clearcoat damage</li>
                                            <li>• Give the paint a factory fresh feel</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#0EA0DC]/10 border border-[#0EA0DC]/10 mb-6">
                                        <p>
                                            <strong>
                                                SkyGloss is not designed to:
                                            </strong>

                                        </p>
                                        <ul>
                                            <li>• Override structural paint failure</li>
                                            <li>• Guarantee longevity on compromised or poorly repainted panels</li>
                                            <li>• Produce identical results across vehicles with different histories</li>
                                        </ul>
                                    </div>
                                    <p>
                                        We explain this clearly and confidently.

                                    </p>
                                    <p>
                                        <strong>
                                            When customers understand the starting condition, they understand the result — and trust
                                            follows naturally.
                                        </strong>

                                    </p>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('evolution')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('evolution') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white hover:bg-black'}`}
                                        >
                                            {completedSteps.includes('evolution') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Reality Explained */}
                            <div id="physics" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Section 03: Next Evolution
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase">
                                        Why SkyGloss Is the <span className="text-[#0EA0DC]">Next Evolution</span>
                                    </h2>
                                    <div className="space-y-6 mb-10 text-[#666666] p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                        <p className="font-medium leading-relaxed">
                                            Historically, improving paint appearance meant removing material through polishing and cutting.
                                            <br />
                                            SkyGloss introduces a more advanced approach:

                                        </p>
                                        <ul>
                                            <li>• Cutting removes clearcoat</li>
                                            <li>• SkyGloss rebuilds it</li>
                                            <li>• Cutting shortens paint life</li>
                                            <li>• SkyGloss extends it</li>
                                        </ul>
                                        <p>
                                            For the first time, we can permanently add clearcoat back into a factory finish without repainting
                                            and long turnaround times — creating stronger, healthier paint that can be preserved long-term.
                                        </p>
                                        <p>SkyGloss does not replace existing services.</p>
                                        <p>It complements them — and elevates what is possible.</p>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('physics')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('physics') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white hover:bg-black'}`}
                                        >
                                            {completedSteps.includes('physics') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Verify Realism'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            <div id="limitations" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Section 04: Offer Second.
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase">
                                        Educate First.  <span className="text-[#0EA0DC]">Offer Second.</span>
                                    </h2>
                                    <div className="space-y-6 mb-10 text-[#666666] p-4 rounded-xl bg-[#0EA0DC]/10 border border-[#0EA0DC]/10 mb-6">
                                        <p className="font-medium leading-relaxed">
                                            SkyGloss never needs to be oversold. Because what we’re giving them always adds value, no
                                            matter what the condition of the vehicle.

                                            <br />
                                            The process is always:
                                        </p>
                                        <ul>
                                            <li>• Assess the vehicle</li>
                                            <li>• Educate the customer</li>
                                            <li>• Explain paint health and clearcoat condition</li>
                                            <li>• Define what can and cannot be improved</li>
                                            <li>• Align expectations with reality</li>
                                        </ul>
                                        <p>
                                            That is not a missed opportunity — it is professional responsibility.
                                        </p>
                                        <p>This approach builds long-term trust, stronger relationships, and a healthier brand.</p>

                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('limitations')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('limitations') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white hover:bg-black'}`}
                                        >
                                            {completedSteps.includes('limitations') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Sales Strategy */}
                            <div id="process" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Section 05: Satisfaction
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase">
                                        Expectations Create <span className="text-[#0EA0DC]">Satisfaction</span>
                                    </h2>
                                    <div className="space-y-6 mb-10 text-[#666666] p-4 rounded-xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 mb-6">
                                        <p className="font-medium leading-relaxed">
                                            When expectations are set correctly, satisfaction follows.

                                            <br />
                                            <strong>Customers are confident because:</strong>
                                        </p>
                                        <ul>
                                            <li>• They receive exactly what was explained</li>
                                            <li>• They understand why results vary from vehicle to vehicle</li>
                                            <li>• They are not sold something they believed to be something else</li>
                                            <li>• They trust the process and the professional delivering it</li>

                                        </ul>
                                        <p>
                                            SkyGloss customers are informed, not convinced.
                                        </p>


                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('process')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('process') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white hover:bg-black'}`}
                                        >
                                            {completedSteps.includes('process') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Verify Process'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            <div id="expectations" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Section 06: Results Vary
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase">
                                        Results Vary — <span className="text-[#0EA0DC]">By Design</span>
                                    </h2>
                                    <div className="space-y-6 mb-10 text-[#666666] p-4 rounded-xl bg-[#0EA0DC]/10 border border-[#0EA0DC]/10 mb-6">
                                        <p className="font-medium leading-relaxed">
                                            No two vehicles start at the same place.

                                            <br />
                                            Two vehicles can receive the same service and show different outcomes — and that is expected.
                                            <br />
                                            Starting condition determines finishing point, not product effectiveness.
                                            <br />
                                            SkyGloss does not promise identical results.
                                            <br />
                                            It promises the best possible outcome based on reality.
                                            <br />
                                            This clarity removes confusion, objections, and unrealistic comparisons.
                                        </p>


                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('expectations')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('expectations') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white hover:bg-black'}`}
                                        >
                                            {completedSteps.includes('expectations') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Permanence & Warranty */}
                            <div id="permanence-logic" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Section 07: Permanence & Warranty
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase">
                                        Permanence & <span className="text-[#0EA0DC]">Warranty</span>
                                    </h2>
                                    <div className="space-y-6 mb-10 text-[#666666] p-4 rounded-xl bg-[#0EA0DC]/10 border border-[#0EA0DC]/10 mb-6">
                                        <p className="font-medium leading-relaxed">
                                            How to Explain It Correctly
                                            <br />
                                            SkyGloss FUSION is a permanent restoration process — comparable to repainting a panel.

                                            <br />
                                            When done correctly:
                                            <br />
                                            It promises the best possible outcome based on reality.

                                        </p>
                                        <ul>
                                            <li>• The clearcoat permanently fuses into the existing finish</li>
                                            <li>• It will never delaminate</li>
                                            <li>• The repaired damage is permanently resolved</li>


                                        </ul>

                                        <p className="font-medium leading-relaxed">
                                            This does <strong>not</strong> mean new damage cannot occur in the future.
                                            <br />
                                            Clearcoat continues to wear over time — just like tires or engines.

                                            <br />
                                            SkyGloss restores health.
                                            <br />
                                            Maintenance and protection are choices made above and beyond FUSION.
                                            <br />
                                            SkyGloss does not guarantee results on compromised or poorly repainted panels. These are
                                            identified, marked, and disclosed during the intake process.

                                        </p>

                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('permanence-logic')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('permanence-logic') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white hover:bg-black'}`}
                                        >
                                            {completedSteps.includes('permanence-logic') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Verify Logic'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            <div id="do-dont" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Section 08: Do's and Don'ts
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase">
                                        How SkyGloss Should Be  <span className="text-[#0EA0DC]">Articulated</span>
                                    </h2>
                                    <div className="overflow-x-auto mb-10">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="py-4 font-bold text-[#0EA0DC] uppercase text-lg tracking-widest">Do</th>
                                                    <th className="py-4 font-bold text-rose-500 uppercase text-lg tracking-widest">Don't</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-xs text-[#666666] font-medium">
                                                {[
                                                    ["Lead with paint health, not shine", "Oversell or sensationalize outcomes"],
                                                    [`Explain starting condition before discussing results`, "Promise perfection"],
                                                    ["Frame SkyGloss as rebuilding, not coating", "Compare vehicles with different histories"],
                                                    ["Explain permanence accurately and calmly", "Hide limitations to close a sale"],
                                                    ["Be clear about limitation without hesitation", "Position SkyGloss as “just another coating”"]
                                                ].map((row, i) => (
                                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-4 pr-4">{row[0]}</td>
                                                        <td className="py-4">{row[1]}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('do-dont')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('do-dont') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white hover:bg-black'}`}
                                        >
                                            {completedSteps.includes('do-dont') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Mark Complete'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                            {/* The Standard */}
                            <div id="the-standard" className="scroll-mt-32 mt-8">
                                <Card className="skygloss-card p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                    <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                        Section 09: The Standard
                                    </Badge>
                                    <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase">
                                        The <span className="text-[#0EA0DC]">Standard</span>
                                    </h2>
                                    <div className="space-y-6 mb-10 text-[#666666] p-4 rounded-xl bg-[#0EA0DC]/10 border border-[#0EA0DC]/10 mb-6">
                                        <p className="font-medium leading-relaxed">
                                            SkyGloss does not rely on urgency, hype, or exaggerated promises.
                                            <br />
                                            SkyGloss relies on:
                                        </p>
                                        <ul>
                                            <li>• Education</li>
                                            <li>• Transparency</li>
                                            <li>• Clear expectations</li>
                                            <li>• Professional restraint</li>
                                            <li>• Confidence built through experience</li>
                                        </ul>

                                        <p className="font-medium leading-relaxed">
                                            This is why SkyGloss partners succeed.
                                            <br />
                                            This is why customers trust the process.
                                            <br />
                                            And this is why satisfaction lasts long after the service is complete.
                                            <br />

                                            <strong>
                                                The results of SkyGloss are stunning. Customers are always so excited. That’s why we never
                                                have to oversell or sensationalize.
                                            </strong>
                                        </p>

                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => markComplete('the-standard')}
                                            className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('the-standard') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white hover:bg-black'}`}
                                        >
                                            {completedSteps.includes('the-standard') ? <><CheckCircle className="w-5 h-5 mr-2" /> Verified</> : 'Verify Logic'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Completion Footer */}
                        <div className="py-20">
                            <Card className="p-8 rounded-lg border-none bg-[#f8fafc] text-center space-y-10 relative overflow-hidden border border-gray-100 shadow-inner">
                                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto shadow-2xl transform rotate-6 border border-gray-100">
                                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <h2 className="text-4xl font-bold uppercase tracking-tighter leading-none text-[#272727]">System Deployed</h2>
                                    <p className="text-[#666666] max-w-xl mx-auto font-medium leading-relaxed">
                                        You’ve now completed the full Understanding SkyGloss
                                        — forming a deep-gloss, self-healing, factory-grade finish.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
                                    <Button
                                        onClick={async () => {
                                            try {
                                                await api.patch('/users/me/complete-course', { courseName: 'UNDERSTANDING_SKYGLOSS' });
                                            } catch (err) {
                                                console.error("Failed to mark course as complete", err);
                                            }
                                            onBack();
                                        }}
                                        className="rounded-xl p-4 h-14 bg-[#272727] text-white font-bold hover:bg-[#0EA0DC] shadow-xl text-xs uppercase tracking-widest transition-all"
                                    >
                                        Finished
                                    </Button>
                                    <Button variant="outline" className="rounded-xl p-4 h-14 bg-[#272727] text-white font-bold hover:bg-[#0EA0DC] shadow-xl text-xs uppercase tracking-widest transition-all" onClick={() => window.open(UnderstandingPdf, '_blank')}>
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
                                    <h3 className="font-bold text-[#272727]">Module Navigation</h3>
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

                            <Card className="p-6 rounded-2xl bg-gradient-to-br from-[#272727] to-black text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="font-bold text-sm mb-2 uppercase tracking-tighter">Expert Insight</h4>
                                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                                        "The results of SkyGloss are stunning. Customers are always so excited. That's why we never have to oversell or sensationalize."
                                    </p>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Shield className="w-12 h-12" />
                                </div>
                            </Card>

                            <Card className="p-4 rounded-2xl flex items-center gap-4 border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0EA0DC]">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-[#272727] uppercase tracking-wider">Reference</h4>
                                    <p className="text-[10px] text-[#666666] font-medium">Sales Philosophy v1.0</p>
                                </div>
                            </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
