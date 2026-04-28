import { useState, useEffect } from "react";
import api from "../api/axios";
import {
    ArrowLeft,
    CheckCircle,
    ChevronRight,
    Zap,
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

// ONLY showing changed parts for clarity — baaki imports same rahenge

const sections: Section[] = [
    {
        id: "overview",
        title: "Section A: Product Overview",
        subsections: [
            { id: "intro_foundation", title: "A Different Starting Point" },
            { id: "data_core", title: "The Core Idea" },
            { id: "intro_replacement", title: "Foundation, Not Replacement" },
            { id: "data_fusion", title: "What is FUSION" },
            { id: "learning_curve", title: "Understanding the Learning Curve" }, // ✅ NEW
            { id: "intro_reality", title: "Speed, Consistency & Scalability" }, // ✅ UPDATED
            { id: "data_real_world", title: "Built for the Real World" },
            { id: "intro_opportunity", title: "A Universal Opportunity" },
            { id: "data_access", title: "What You’re Getting Access To" },
            { id: "intro_engine", title: "SkyGloss as a Growth Engine" },
            { id: "data_bigger_picture", title: "The Bigger Picture" },
            // { id: "data_next_steps", title: "Your Path Forward" },
            { id: "proper_perspective", title: "Proper Perspective" },
            { id: "new_craft", title: "This Is a New Craft" },
            { id: "professional_mindset", title: "Professional Mindset" },
            // { id: "mistakes_learning", title: "Mistakes Are Part of Learning" },
            { id: "payoff", title: "The Payoff" },
            { id: "intro_final", title: "Welcome to SkyGloss" }
        ]
    }
];

export function WelcomeToSkyGloss({ onBack }: { onBack: () => void }) {
    const { user, setUser } = useAuth();
    const [activeSub, setActiveSub] = useState("intro");
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

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
                                <p className="text-[#666666] text-lg max-w-2xl mb-6 font-medium">
                                    A Different Way to Think About Paint
                                </p>

                                <p className="text-[#666666] text-lg max-w-2xl mb-6 font-medium">
                                    Cut. Polish. Refine. Repeat.
                                    <br />
                                    That process works. It always has. Polishing is a real craft, and it will always have a need—especially on vehicles that are built for it. Take a show car for an example. They purposely get painted with extra layers of clearcoat so it can be polish down to perfection and have enough clearcoat to polish for every show for years to come.
                                    <br />
                                    But most vehicles today aren’t built that way.
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
                        <div id="intro_foundation" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                    SECTION A: Starting Point
                                </Badge>
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    A Different Starting Point
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            Cut. Polish. Refine. Repeat.
                                            <br />
                                            That process works. It always has. Polishing is a real craft, and it will always have a need—especially on vehicles that are built for it. Take a show car for an example. They purposely get painted with extra layers of clearcoat so it can be polish down to perfection and have enough clearcoat to polish for every show for years to come.
                                            <br />
                                            But most vehicles today aren’t built that way.
                                            <br />
                                            <br />
                                            Modern paint systems are thinner than they’ve ever been. Over the past two decades, overall film build has been reduced by nearly 50%.
                                            <br />
                                            <br />
                                            Clearcoat is the manufacturer’s primary line of protection. It’s what preserves the finish, maintains integrity, and keeps a vehicle looking factory over time.
                                            <br />
                                            <br />
                                            In the past, paint systems were able to last the life of the vehicle. Today, that is not true. Modern paint may be shinier—but it’s built with significantly less material behind it.
                                            <br />
                                            <br />
                                            But there’s another reality that matters just as much. It’s way more work to cut and polish a vehicle’s clearcoat then it is to build it up.
                                            <br />
                                            <br />
                                            Customers don’t value the hours it takes to polish a car.
                                            <br />
                                            They don’t see the passes.
                                            <br />
                                            They don’t understand the steps.
                                            <br />
                                            They don’t feel the physical effort behind it.
                                            <br />
                                            They see the result.
                                            <br />
                                            <br />
                                            That’s why most daily-driven vehicles never receive full correction—not because they don’t need it, but because the time, cost, and physical effort don’t align with what the market is willing to support.
                                            <br />
                                            <br />
                                            So, the industry has reached a crossroads.
                                            <br />
                                            Paint is thinner.
                                            <br />
                                            The work is harder.
                                            <br />
                                            The body takes more strain.
                                            <br />
                                            And the customer just wants the car to look right.
                                            <br />
                                            <br />
                                            Which leads to a very simple question:
                                            <br />
                                            <strong>

                                                Is removing material really the best way to maintain it?
                                            </strong>
                                            <br />
                                            Or is there a better, more practical way to get the same—or better—result?
                                            <br />
                                            <br />
                                            That’s where SkyGloss begins.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('intro_foundation')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('intro_foundation') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('intro_foundation') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>
                        <div id="data_fusion" className="scroll-mt-32">
                            <h2 className="text-4xl font-bold text-[#0EA0DC] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                WHERE FUSION FITS


                            </h2>
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    The Core of the System

                                </h2>

                                <div id="storage_details" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        FUSION is the flagship process within SkyGloss.
                                        <br />
                                        It represents the shift from always removing clearcoat…
                                        <br />
                                        to having the ability to build it back into the surface.
                                        <br />
                                        <br />
                                        It is:
                                        <br />
                                        • A foundational process
                                        <br />
                                        • A replacement for traditional first-step polishing in many cases
                                        <br />
                                        • A more consistent and scalable process compared to polishing
                                        <br />
                                        •  A method for creating a factory-fresh finish
                                        <br />
                                        <br />
                                        It is not:
                                        <br />
                                        •  A coating
                                        <br />
                                        •  A shortcut
                                        <br />
                                        •  A wipe-on solution
                                        <br />
                                        <br />
                                        It requires understanding, preparation, and proper application.
                                        <br />
                                        Because real processes require skill.
                                        <br />
                                        And skill creates value.
                                    </p>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('data_fusion')}
                                        className={`rounded-xl px-10 h-12 font-bold transition-all duration-500 ${completedSteps.includes('data_fusion') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                    >
                                        {completedSteps.includes('data_fusion') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>
                        {/* SECTION B: TECHNICAL PRODUCT DATA */}
                        <div id="data_core" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">

                                <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                    SECTION B: The Core Idea
                                </Badge>

                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    The Core Idea
                                </h2>
                                <h4 className="text-2xl font-bold text-[#0EA0DC] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    Build Instead of Remove

                                </h4>
                                <div id="storage_explanation" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        Clearcoat is the vehicle’s built-in protection system. It’s what manufacturers have relied on for decades to preserve and protect the paint finish.
                                        <br />
                                        <br />
                                        Everything else—coatings, sealants, films—are performance layers designed to enhance or complement that foundation. But the core protection has always been the clearcoat itself.
                                        <br />
                                        <br />
                                        That outer layer is what keeps a finish healthy, vibrant, and intact. The last thing we want to do is prematurely remove or weaken the very system designed to protect the vehicle.
                                        <br />
                                        <br />
                                        It determines:
                                        <br />
                                        •   Gloss
                                        <br />
                                        •   Durability
                                        <br />
                                        •   Resistance to wear
                                        <br />
                                        •   Chemical resistance
                                        <br />
                                        •   UV resistance
                                        <br />
                                        •   Long-term serviceability
                                        <br />
                                        <br />
                                        For over 75 years, improving paint meant cutting into that layer.
                                        <br />
                                        <br />
                                        SkyGloss introduces a new approach:
                                        <br />
                                        <br />
                                        <strong>
                                            Build clearcoat instead of always removing it.
                                        </strong>
                                    </p>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('data_core')}
                                        className={`rounded-xl px-10 h-12 font-bold transition-all duration-500 ${completedSteps.includes('data_core') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                    >
                                        {completedSteps.includes('data_core') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />
                        {/* SECTION A: Foundation */}
                        <div id="intro_replacement" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                    SECTION A: Foundation
                                </Badge>
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    Foundation, Not Replacement
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            SkyGloss is not here to replace what you already do.
                                            <br />
                                            It works with your existing services:
                                            <br />
                                            •  Ceramic coatings
                                            <br />
                                            •  Paint protection film
                                            <br />
                                            •  Existing shop workflows
                                            <br />
                                            <br />
                                            SkyGloss focuses on creating a better foundation so everything else performs at a higher level.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('intro_replacement')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('intro_replacement') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('intro_replacement') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />

                        <div id="learning_curve" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 uppercase tracking-tighter">
                                    Understanding the Learning Curve
                                </h2>

                                <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        Before applying FUSION, it’s important to understand:
                                        <br /><br />
                                        This is a process—not a wipe-on product.
                                        <br /><br />
                                        Just like sprayed clearcoat, incorrect application can create:
                                        <br /><br />
                                        •   Lines
                                        <br />
                                        •   High spots
                                        <br />
                                        •   Inconsistencies
                                        <br /><br />
                                        <strong style={{ color: "red" }}>

                                            That’s not product failure.
                                        </strong>
                                        <br />
                                        That’s part of the learning process.
                                        <br /><br />
                                        Every vehicle is different:
                                        <br /><br />
                                        •  Different paint systems
                                        <br />
                                        • Different conditions
                                        <br />
                                        • Different environments
                                        <br /><br />
                                        Over time, the process becomes intuitive.
                                        <br />
                                        You learn to adjust:
                                        <br /><br />
                                        •  Product amount
                                        <br />
                                        • Pressure
                                        <br />
                                        • Movement
                                        <br /><br />
                                        You’re not going to be faster than polishing on your first few cars.
                                        <br />
                                        That’s normal.
                                        <br /><br />
                                        But once you get through that early stage—somewhere around 5–10 vehicles—it starts to click.
                                        <br />
                                        And when it does:
                                        <br />
                                        <strong>


                                            It becomes significantly faster than polishing.
                                        </strong>
                                        <br />
                                        Less physical strain.
                                        <br />
                                        More consistent results.
                                        <br />
                                        More repeatable workflow.
                                        <br /><br />
                                        This is why it’s important to stick with it.
                                        <br />
                                        Learn it properly.
                                        <br />
                                        Because once you understand it, you won’t want to go back to doing things the hard way.
                                    </p>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('learning_curve')}
                                        className="rounded-xl px-10 h-14 bg-[#272727] text-white"
                                    >
                                        {completedSteps.includes('learning_curve') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>
                        <div className="h-px bg-gray-100 my-8" />
                        <div id="intro_reality" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 uppercase tracking-tighter">
                                    Speed, Consistency, and Scalability
                                </h2>

                                <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        Once the process is understood and your shop is set up properly:
                                        <br /><br />
                                        Everything changes.
                                        <br /><br />
                                        •   No more long polishing cycles
                                        <br />
                                        •  No more inconsistency
                                        <br />
                                        •  No more guessing
                                        <br /><br />
                                        FUSION allows for:
                                        <br /><br />
                                        •  3–4 hour processes
                                        <br />
                                        •  Repeatable workflow
                                        <br />
                                        •  Consistent, factory-level results
                                        <br /><br />
                                        This is where efficiency and scalability are unlocked.
                                    </p>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('intro_reality')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('intro_reality') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('intro_reality') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="data_real_world" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    Built for the Real World
                                </h2>

                                <div id="storage_environment" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        SkyGloss is designed for real vehicles—not just show cars.
                                        <br />
                                        It works across:
                                        <br />
                                        •   Daily drivers
                                        <br />
                                        •   High-use vehicles
                                        <br />
                                        •   Modern paint systems
                                        <br />
                                        <br />
                                        It is:
                                        <br />
                                        •   Practical
                                        <br />
                                        •   Scalable
                                        <br />
                                        •   Easy to integrate
                                        <br />
                                        •   Built to create real revenue
                                        <br />
                                        <br />
                                        Most vehicles don’t need perfection.
                                        <br />
                                        They need to look right.
                                        <br />
                                        SkyGloss gives you a way to deliver that.
                                    </p>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('data_real_world')}
                                        className={`rounded-xl px-10 h-12 font-bold transition-all duration-500 ${completedSteps.includes('data_real_world') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                    >
                                        {completedSteps.includes('data_real_world') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="intro_opportunity" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    A Universal Opportunity
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            SkyGloss is not limited to automotive.
                                            <br />
                                            It can be applied across:
                                            <br />
                                            •   Automotive
                                            <br />
                                            •   Aviation
                                            <br />
                                            •  Marine
                                            <br />
                                            •   Industrial
                                            <br />
                                            •   Commercial
                                            <br />
                                            <br />
                                            This is a versatile system.
                                            <br />
                                            And versatility creates opportunity.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('intro_opportunity')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('intro_opportunity') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('intro_opportunity') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="data_access" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    What You’re Getting Access To
                                </h2>

                                <div id="storage_access_points" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        SkyGloss is more than a product.
                                        <br />
                                        You now have access to:
                                        <br />
                                        •     Training
                                        <br />
                                        •     A complete service structure
                                        <br />
                                        •    Marketing resources
                                        <br />
                                        •     Technical understanding
                                        <br />
                                        •     Ongoing support
                                        <br />
                                        <br />
                                        This system is built to help you succeed.
                                    </p>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('data_access')}
                                        className={`rounded-xl px-10 h-12 font-bold transition-all duration-500 ${completedSteps.includes('data_access') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                    >
                                        {completedSteps.includes('data_access') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="intro_engine" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 uppercase tracking-tighter">
                                    SkyGloss as a Growth Engine
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            This is not just a tool—it’s an opportunity.
                                            <br />
                                            It helps you:
                                            <br />
                                            •    Solve real problems
                                            <br />
                                            •    Improve workflow
                                            <br />
                                            •    Increase efficiency
                                            <br />
                                            •   Create new revenue
                                            <br />
                                            <br />
                                            It also gives you a new way to communicate your services.
                                            <br />
                                            Customers may not understand all the details of paint correction.
                                            <br />
                                            But they understand: A fresh, healthy finish. Every. Single. Time. With SkyGloss.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('intro_engine')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('intro_engine') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('intro_engine') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="data_bigger_picture" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    The Bigger Picture
                                </h2>

                                <div id="storage_picture" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        SkyGloss is built on a simple idea:
                                        <br />
                                        •    Solve real problems
                                        <br />
                                        •    Keep it simple
                                        <br />
                                        •    Create real value
                                        <br />
                                        <br />
                                        This matters because it gives you direction.
                                        <br />
                                        In this industry, it’s easy to get pulled in a hundred different directions—new products, new claims, new systems that promise something better every few months. If you’re always chasing that, you never really build consistency.
                                        <br />
                                        <br />
                                        What we’re teaching here is different.
                                        <br />
                                        We focus on the foundation of the paint finish.
                                        <br />
                                        When you understand what clearcoat actually is and what its role is, your approach becomes much more straightforward. You’re no longer guessing, and you’re not relying on trends—you’re working from something that is fundamentally true about every vehicle.
                                        <br />
                                        <br />
                                        And this is where it becomes a really powerful concept.
                                        <br />
                                        There are a lot of great products in this industry. Different coatings, films, sealants—each with their own purpose. SkyGloss has its own line of protection products as well, and they all serve a role.
                                        <br />
                                        But the key is this:
                                        <br />
                                        FUSION is your starting point.
                                        <br />
                                        It’s the foundation that everything else can build on.
                                        <br />
                                        Because of that, it’s completely compatible with everything—whether it’s SkyGloss products or anything else you’re already using. You’re not replacing systems. You’re strengthening the base that those systems rely on.
                                        <br />
                                        <br />
                                        That’s what simplifies everything.
                                        <br />
                                        Instead of choosing between products, you’re creating a process.
                                        <br />
                                        That mindset is what allows you to scale, improve efficiency, and deliver results that make sense—both for you and for your customer.
                                        <br />
                                        The goal here isn’t to complicate what you’re doing.
                                        <br />
                                        It’s to simplify it—so you can focus on what actually matters.
                                    </p>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('data_bigger_picture')}
                                        className={`rounded-xl px-10 h-12 font-bold transition-all duration-500 ${completedSteps.includes('data_bigger_picture') ? 'bg-[#0EA0DC] text-white' : 'bg-[#272727] text-white'}`}
                                    >
                                        {completedSteps.includes('data_bigger_picture') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* <div className="h-px bg-gray-100 my-8" />
                        <div id="data_next_steps" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    Your Path Forward
                                </h2>

                                <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                        As you move through the portal, follow this process:
                                    </p>

                                    <ul className="space-y-2 text-sm text-[#666666] mt-4">
                                        <li>• Go through the courses and build your understanding</li>
                                        <li>• Familiarize yourself with the system and workflow</li>
                                        <li>• Connect with your regional representative with questions</li>
                                        <li>• Apply what you’re learning</li>
                                    </ul>

                                    <p className="text-sm text-[#272727] font-medium leading-relaxed mt-6">
                                        The final step is certification.
                                    </p>

                                    <p className="text-sm text-[#272727] font-medium leading-relaxed mt-4">
                                        Depending on your region, this may include:
                                    </p>

                                    <ul className="space-y-2 text-sm text-[#666666] mt-2">
                                        <li>• Live training events</li>
                                        <li>• A Master SkyGloss Trainer evaluation</li>
                                        <li>• In-person or virtual validation</li>
                                    </ul>

                                    <p className="text-sm text-[#272727] font-medium leading-relaxed mt-6">
                                        The goal is the same:
                                    </p>

                                    <p className="text-sm text-[#272727] font-medium leading-relaxed mt-2">
                                        Consistent, high-quality results across every certified shop.
                                    </p>

                                    <p className="text-sm text-[#272727] font-medium leading-relaxed mt-6">
                                        Polishing will always exist—for the few vehicles that can afford to lose clearcoat.
                                    </p>

                                    <p className="text-sm text-[#272727] font-medium leading-relaxed mt-2">
                                        The rest of the world now has another option.
                                    </p>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('data_next_steps')}
                                        className={`rounded-xl px-10 h-12 font-bold transition-all duration-500 ${completedSteps.includes('data_next_steps')
                                            ? 'bg-[#0EA0DC] text-white'
                                            : 'bg-[#272727] text-white'
                                            }`}
                                    >
                                        {completedSteps.includes('data_next_steps')
                                            ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</>
                                            : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div> */}
                        <div className="h-px bg-gray-100 my-8" />
                        <div id="proper_perspective" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                    Proper Perspective
                                </Badge>

                                <h2 className="text-3xl font-bold text-[#272727] mb-6 uppercase tracking-tighter">
                                    Proper Perspective
                                </h2>
                                <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                    This is one of the most important concepts.
                                    <br /><br />
                                    FUSION is not difficult.
                                    <br />
                                    But it is a skill.
                                    <br /><br />
                                    Most people give up too early.
                                    <br />
                                    After 5–10 cars, you understand it.
                                    <br />
                                    After more repetition, you master it.
                                    <br />
                                    But only if you give yourself the chance. Don’t sell yourself short. Once you learn it, you will never want to use anything else again. Everything else will just be a reminder of how tiring and time-consuming polishing is. Not because SkyGloss is better, but because SkyGloss is doing all the work rather than you and the machine.
                                </p>

                                <div className="flex justify-end mt-12">
                                    <Button
                                        onClick={() => markComplete('proper_perspective')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('proper_perspective') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('proper_perspective') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="new_craft" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <h2 className="text-3xl font-bold text-[#272727] mb-6 uppercase tracking-tighter">
                                    This Is a New Craft
                                </h2>
                                <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                    This is not just a product.
                                    <br />
                                    It’s a new way of working.
                                    <br />
                                    And like any craft, it requires:
                                    <br />
                                    • Time
                                    <br />
                                    • Repetition
                                    <br />
                                    • Intention
                                    <br />
                                    If you commit to it, you gain a skill that stays with you.
                                </p>

                                <div className="flex justify-end mt-12">
                                    <Button
                                        onClick={() => markComplete('new_craft')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('new_craft') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('new_craft') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="professional_mindset" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <h2 className="text-3xl font-bold text-[#272727] mb-6 uppercase tracking-tighter">
                                    Professional Product, Professional Mindset
                                </h2>
                                <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                    Think about clearcoat in a body shop.
                                    <br />
                                    If a painter makes a mistake, no one blames the clearcoat.
                                    <br />
                                    They fix the process.
                                    <br />
                                    <br />
                                    FUSION is the same.
                                    <br />
                                    If applied incorrectly, the issue is technique—not the product.
                                    <br />
                                    Take ownership.
                                    <br />
                                    Improve.
                                    <br />
                                    Get better.
                                </p>

                                <div className="flex justify-end mt-12">
                                    <Button
                                        onClick={() => markComplete('professional_mindset')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('professional_mindset') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('professional_mindset') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* <div className="h-px bg-gray-100 my-8" />
                        <div id="mistakes_learning" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <h2 className="text-3xl font-bold text-[#272727] mb-6 uppercase tracking-tighter">
                                    Mistakes Are Part of Learning
                                </h2>
                                <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                    Application issues can happen—especially early on.
                                    <br /><br />
                                    That’s normal.
                                    <br /><br />
                                    What matters is how you respond:
                                    <br /><br />
                                    • If something doesn’t look right, fix it immediately
                                    <br />
                                    • Strip the panel if needed
                                    <br />
                                    • Reapply correctly
                                    <br /><br />
                                    Do not leave application errors in the finish.
                                    <br /><br />
                                    It is always faster—and better—to redo it properly than to work around a mistake later.
                                </p>

                                <div className="flex justify-end mt-12">
                                    <Button
                                        onClick={() => markComplete('mistakes_learning')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('mistakes_learning') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('mistakes_learning') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div> */}

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="payoff" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <h2 className="text-3xl font-bold text-[#272727] mb-6 uppercase tracking-tighter">
                                    The Payoff
                                </h2>
                                <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                    Once you understand FUSION:
                                    <br />
                                    •     You work faster
                                    <br />
                                    •     You get better results
                                    <br />
                                    •     You reduce strain
                                    <br />
                                    •     You create a healthier finish
                                    <br />
                                    But only if you put in the reps.
                                </p>

                                <div className="flex justify-end mt-12">
                                    <Button
                                        onClick={() => markComplete('payoff')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('payoff') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('payoff') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />
                        <div id="intro_final" className="scroll-mt-32">
                            <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                    Final Thought
                                </h2>

                                <div className="space-y-6 mb-10">
                                    <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            Polishing will always exist.
                                            <br />
                                            But now, there is another option.
                                            <br />
                                            A more efficient one.
                                            <br />
                                            A more practical one.
                                            <br />
                                            A more natural way to maintain paint.
                                            <br />
                                            SkyGloss gives you that option.
                                            <br />
                                            Take the time to learn it.
                                            <br />
                                            Because once you understand it—
                                            <br />
                                            It will become one of your favorite new tools in your shop!
                                        </p>

                                        <br />
                                        <h3 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase ">
                                            WELCOME TO SKYGLOSS
                                        </h3>
                                        <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                            Let’s get started!
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={() => markComplete('intro_final')}
                                        className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes('intro_final') ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                    >
                                        {completedSteps.includes('intro_final') ? <><CheckCircle className="w-5 h-5 mr-2" /> Section Completed</> : 'Section Completed'}
                                    </Button>
                                </div>
                            </Card>
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
                                                await api.patch('/users/me/complete-course', { courseName: 'WELCOME_TO_SKYGLOSS' });
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