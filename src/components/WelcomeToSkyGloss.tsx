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

import FusionPdf from "../assets/pdf/Fusion.pdf";

// Replaced local VideoPlayer with global SmartVideoPlayer for translation support

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

export function WelcomeToSkyGloss({ onBack }: { onBack: () => void }) {
    const { user, setUser } = useAuth();
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
                        'WELCOME_TO_SKYGLOSS': newSteps
                    }
                };
                setUser(updatedUser);
            }

            try {
                await api.patch('/users/me/course-progress', { courseName: 'WELCOME_TO_SKYGLOSS', stepId: id });
            } catch (err) {
                console.error("Failed to save course progress", err);
            }
        }
    };

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await api.get('/auth/profile');
                const progress = response.data.courseProgress?.WELCOME_TO_SKYGLOSS || [];
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
                                    Introduction
                                </Badge>
                                <h1 className="text-4xl sm:text-5xl font-bold text-[#272727] mb-4 tracking-tighter uppercase">
                                    <span className="text-[#0EA0DC]">Welcome</span> to SkyGloss
                                </h1>
                                <p className="text-[#666666] text-lg max-w-2xl mb-8 font-medium">
                                    You’re not just learning a new product—you’re stepping into a different way of thinking about paint, restoration, and how your business operates.
                                </p>
                                <p className="text-[#666666] text-lg max-w-2xl mb-8 font-medium">
                                    SkyGloss exists to solve a simple problem:
                                    <br />
                                    For decades, the only way to improve paint was to remove it.
                                    <br />
                                    Now, there is another way.
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

                        {/* SECTION A: Starting Point */}
                        <div id="intro" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                    SECTION A: Starting Point
                                </Badge>
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    A Different Starting Point
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-[#0EA0DC] mb-3">The Old Way</h4>
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            For years, polishing has been the standard.
                                            <br />
                                            It works—but it works by removing clearcoat.
                                            <br />   <br />
                                            Modern paint systems are thinner than ever, which means:
                                            <br />
                                            <br />
                                            • Less room for correction
                                            <br />
                                            • Higher risk of damage
                                            <br />
                                            • Shorter lifespan of the finish

                                            <br />
                                            <br />
                                            <br />
                                            SkyGloss starts with a different question:
                                            <br />
                                            What if we didn’t have to remove clearcoat to improve appearance?
                                            <br />
                                            Instead of cutting material away, SkyGloss focuses on <strong>building the surface back up</strong>
                                        </p>
                                    </div>


                                </div>



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



                        {/* SECTION B: TECHNICAL PRODUCT DATA */}
                        <div id="data" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">
                                <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                    SECTION B: The Core Idea
                                </Badge>

                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    The Core Idea
                                </h2>



                                <div id="storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        Clearcoat is the protection system of a vehicle.
                                        <br />
                                        It determines:              <br />              <br />
                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Gloss</li>
                                        <li>• Durability</li>
                                        <li>• Resistance to wear</li>
                                        <li>• Long-term serviceability</li>
                                    </ul>
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">               <br />              <br />
                                        For over 75 years, improving paint meant cutting into that layer.
                                        <br /><br />
                                        SkyGloss introduces a new approach:
                                        <br /><br />
                                        <strong>
                                            Build clearcoat instead of removing it.
                                        </strong>
                                    </p>
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

                        <div className="h-px bg-gray-100 my-8" />
                        {/* SECTION A: Foundation */}
                        <div id="intro" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                    SECTION A: Foundation
                                </Badge>
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    Foundation, Not Replacement
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-[#0EA0DC] mb-3">The Old Way</h4>
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            SkyGloss is not here to replace what you already do.
                                            <br />
                                            It works with your existing services, not against them:
                                            <br /> <br />
                                            • Ceramic coatings
                                            <br />
                                            • Paint protection film
                                            <br />
                                            • Existing shop systems


                                            <br />
                                            <br />
                                            SkyGloss focuses on creating a better foundation for everything else to perform at its best.

                                        </p>
                                    </div>


                                </div>



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

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="data" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">


                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    What is FUSION
                                </h2>



                                <div id="storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        FUSION is the core SkyGloss service.
                                        <br />  <br />
                                        <strong>  It is:     </strong>               <br />
                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• GA foundational processloss</li>
                                        <li>• A replacement for traditional first-step polishing</li>
                                        <li>• Designed to build and restore clearcoat</li>
                                    </ul>
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">                        <br />
                                        <strong> It is not:</strong>


                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• A coating</li>
                                        <li>• A shortcut</li>

                                    </ul>

                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">                        <br />
                                        It requires proper preparation, understanding, and application.
                                        <br /><br />
                                        Because real services require skill—and skill creates value.
                                    </p>
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

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="intro" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">

                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    The Reality of FUSION (Speed &amp;
                                    Consistency)
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-[#0EA0DC] mb-3">The reality is—FUSION is faster.</h4>
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            There is a learning curve, and your shop needs to be set up properly.
                                            But once that’s done, everything changes.

                                            <br /> <br />
                                            • No more guessing
                                            <br />
                                            • No more inconsistent results
                                            <br />
                                            • No more long correction times




                                        </p>
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            Every vehicle becomes:

                                            <br /> <br />
                                            • 3–4 hours start to finish
                                            <br />
                                            • Repeatable process
                                            <br />
                                            • Consistent, factory-fresh results every time

                                            <br />This is where shops unlock real efficiency and scalability.

                                        </p>
                                    </div>


                                </div>



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

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="data" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">


                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    Built for the Real World
                                </h2>



                                <div id="storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        SkyGloss is designed for real vehicles, not just show cars.
                                        <br />  <br />
                                        <strong> It works across:   </strong>               <br />
                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Daily drivers</li>
                                        <li>• High-use vehicles</li>
                                        <li>• Modern, thinner paint systems</li>
                                    </ul>
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">                        <br />
                                        <strong> It is:</strong>


                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Practical</li>
                                        <li>• Scalable</li>
                                        <li>• Easy to integrate</li>
                                        <li>• Built to create new revenue in your shop</li>

                                    </ul>


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

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="intro" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">

                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    A Universal Opportunity
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">

                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            SkyGloss is designed to work across many surfaces and industries.
                                            <br />Be on the lookout for opportunities beyond just your standard services:
                                            <br />   <br />
                                            • Automotive
                                            <br />
                                            • Aviation
                                            <br />
                                            • Marine
                                            <br />
                                            • Industrial
                                            <br />
                                            • Commercial
                                            <br />
                                            <br />
                                        </p>
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            This is not limited to one lane.
                                            <br />

                                        </p>
                                    </div>


                                </div>



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

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="data" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">


                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    What You’re Getting Access To
                                </h2>



                                <div id="storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        SkyGloss is more than just a product.
                                        <br />  <br />
                                        <strong> You now have access to: </strong>               <br />
                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Technical training</li>
                                        <li>• Clear service structure (FUSION / RESIN / SHIELD)</li>
                                        <li>• Paint health understanding</li>
                                        <li>• Customer communication guidance</li>
                                        <li>• Marketing support</li>
                                        <li>• Ongoing updates</li>
                                    </ul>
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">                        <br />   <br />
                                        This system is built to help you succeed—not just install a product.


                                    </p>


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

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="intro" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">

                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    SkyGloss is a Marketing Engine
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">

                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            SkyGloss is not just a new tool—it’s a new opportunity.
                                            <br />  <br /><strong>It will:</strong>
                                            <br />
                                            • Solve real problems inside your shop
                                            <br />
                                            • Improve your workflow
                                            <br />
                                            • Make your services more efficient
                                            <br />
                                            <br />
                                            <strong>But just as important:</strong>
                                            <br />
                                            It gives you a new way to market and reach a new pool of customers.
                                            <br />
                                            <br />
                                            <strong>Customers who:</strong>
                                            <br />
                                            • Haven’t heard this concept before
                                            <br />
                                            • Are tired of traditional options
                                            <br />
                                            • Are looking for something better and more logical
                                            <br />
                                            <br />
                                            <strong>We are constantly:</strong>
                                            <br />
                                            • Building new ideas
                                            <br />
                                            • Creating new offers
                                            <br />
                                            • Developing new ways to use SkyGloss
                                            <br />
                                            • Expanding globally
                                            <br />
                                            <br />
                                            <strong>You will be hearing from us often with:</strong>
                                            <br />
                                            • New strategies
                                            <br />
                                            • New opportunities
                                            <br />
                                            • Updates
                                            <br />
                                            • Ways to generate more revenue
                                            <br />
                                            <br />
                                            Be on the lookout for this and take advantage of it.
                                            <br />
                                            The shops that engage with this the most will win.
                                        </p>

                                    </div>


                                </div>



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


                        <div className="h-px bg-gray-100 my-8" />
                        <div id="data" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">


                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    The Bigger Picture
                                </h2>



                                <div id="storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        SkyGloss is built on a simple, powerful idea:
                                        <br />  <br />
                                        <strong> You now have access to: </strong>               <br />
                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• It solves a real problem</li>
                                        <li>• It is easy to understand</li>
                                        <li>• It creates real value for customers</li>

                                    </ul>
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">                       <br />
                                        When marketed properly, it becomes a no-brainer service for customers.
                                        <br />
                                        We are not chasing trends.
                                        <br />
                                        We are building something long-term.
                                        <br />
                                        <br />
                                        <strong>
                                            A brand built on:
                                        </strong>

                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Integrity</li>
                                        <li>• Simplicity</li>
                                        <li>• Real results</li>

                                    </ul>

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

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="data" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">


                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    What Happens Next
                                </h2>



                                <div id="storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">

                                        <strong>From here, your focus is simple: </strong>               <br />
                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Learn the process</li>
                                        <li>• Understand the system</li>
                                        <li>• Apply it correctly</li>

                                    </ul>
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">                       <br />

                                        <strong>
                                            We’ve designed this to be:
                                        </strong>

                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Easy to learn</li>
                                        <li>• Easy to implement</li>
                                        <li>• Easy to scale</li>

                                    </ul>

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

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="intro" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">

                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    Final Thought
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">

                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            Polishing will always exist—for the few vehicles that can afford to lose clearcoat.
                                            <br />
                                            The rest of the world now has SkyGloss.
                                        </p>

                                        <br />
                                        <h3>
                                            Welcome to SkyGloss
                                        </h3>
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            We’re excited to have you with us. Let’s dive into the rest of the training.
                                        </p>
                                    </div>


                                </div>



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

                        {/* Completion Footer */}
                        <div className="py-12">
                            <Card className="p-8 rounded-2xl bg-[#272727] text-white text-center">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-[#0EA0DC]" />
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Congratulations! You have completed training for FUSION.</h2>
                                <p className="text-white/70 text-sm mb-8">
                                    On site and advanced training are always available and recommended to sharpen your technical skills.
                                </p>
                                <a href="/support" className="text-[#0EA0DC] text-sm mb-8 block">
                                    Contact your distributor for more details.
                                </a>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        onClick={async () => {
                                            try {
                                                await api.patch('/users/me/complete-course', { courseName: 'FUSION' });
                                            } catch (err) {
                                                console.error("Failed to mark course as complete", err);
                                            }
                                            onBack();
                                        }}
                                        className="bg-white text-[#272727] hover:bg-gray-100"
                                    >
                                        Finished
                                    </Button>
                                    <Button variant="outline" className="border-white text-white hover:bg-[#0EA0DC]" onClick={() => window.open(FusionPdf, '_blank')}>
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