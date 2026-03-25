import { useState, useEffect } from "react";
import api from "../api/axios";
import {
    ArrowLeft,
    CheckCircle,
    ChevronRight,
    BookOpen,
    Settings,
    Layout
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "../AuthContext";

interface Section {
    id: string;
    title: string;
    subsections?: { id: string; title: string }[];
}

const sections: Section[] = [
    {
        id: "profile",
        title: "Section A: Shop Profile",
        subsections: [
            { id: "business-info", title: "Business Information" },
            { id: "contact-details", title: "Contact Details" }
        ]
    },

];

export default function SkyGlossShopSetup({ onBack }: { onBack: () => void }) {
    const { user, setUser } = useAuth();
    const [activeSub, setActiveSub] = useState("business-info");
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

    const totalSteps = sections.reduce((acc, s) => acc + (s.subsections?.length || 0), 0);
    const progress = (completedSteps.length / totalSteps) * 100;

    const COURSE_KEY = 'SKYGLOSS_SHOP_SETUP';

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
                        [COURSE_KEY]: newSteps
                    }
                };
                setUser(updatedUser);
            }

            try {
                await api.patch('/users/me/course-progress', { courseName: COURSE_KEY, stepId: id });
            } catch (err) {
                console.error("Failed to save course progress", err);
            }
        }
    };

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await api.get('/auth/profile');
                const progress = response.data.courseProgress?.[COURSE_KEY] || [];
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
                                <Settings className="w-64 h-64 text-[#0EA0DC]" />
                            </div>
                            <div className="relative z-10">
                                <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 mb-4 px-3 py-1 font-bold">
                                    Course Module
                                </Badge>
                                <h1 className="text-4xl sm:text-5xl font-bold text-[#272727] mb-4 tracking-tighter italic uppercase">
                                    SkyGloss <span className="text-[#0EA0DC]">Shop Setup</span>
                                </h1>
                                <p className="text-[#666666] text-lg max-w-2xl mb-8 font-medium">
                                    Setting up your professional shop environment ensures you're ready to deliver the high-standard automotive restoration SkyGloss is known for.
                                </p>
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <BookOpen className="w-4 h-4 text-[#0EA0DC]" />
                                        SkyGloss • Essentials
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666] font-medium">
                                        <Layout className="w-4 h-4 text-[#0EA0DC]" />
                                        Infrastructure & Setup
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
                                <span className="text-sm font-bold text-[#272727] uppercase tracking-wider">Setup Progress</span>
                                <span className="text-sm font-bold text-[#0EA0DC]">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2.5 bg-gray-100" />
                        </div>

                        {/* Sections Placeholder */}
                        {sections.map((section) => (
                            <div key={section.id} className="space-y-8">
                                {section.subsections?.map((sub) => (
                                    <div key={sub.id} id={sub.id} className="scroll-mt-32">
                                        <Card className="p-8 sm:p-12 rounded-[32px] border-l-4 border-l-[#0EA0DC]">
                                            <Badge variant="outline" className="mb-6 border-[#0EA0DC]/30 text-[#0EA0DC] bg-[#0EA0DC]/5 px-4 py-1.5 font-bold rounded-xl uppercase tracking-widest text-[10px]">
                                                {section.title}
                                            </Badge>
                                            <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                                Required Items
                                            </h2>

                                            <div className="space-y-6 mb-10">
                                                <div className="p-6 rounded-2xl bg-[#0EA0DC]/5 border border-[#0EA0DC]/10">
                                                    <h4 className="font-bold text-sm uppercase tracking-wider text-[#0EA0DC] mb-3 italic">Environment First (Read This Before Anything Else)</h4>
                                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">
                                                        Lighting and climate control are critical to achieving proper results.
                                                    </p>
                                                    <p className="text-sm text-[#272727] font-medium leading-relax">  <br />
                                                        <strong>• Lighting:</strong>
                                                        <br />
                                                        Any high-quality lighting works — overhead or rolling — as long as you can clearly
                                                        identify imperfections and see exactly what you’re doing.
                                                        <br />
                                                        If you can’t clearly see the surface, you can’t properly correct or apply.
                                                        <br />

                                                        <br />
                                                        <strong>• Temperature:</strong>
                                                        <br />
                                                        Ideal working range: 65°F – 75°F
                                                        <br />
                                                        Acceptable range: 60°F – 90°F
                                                        <br />  <br />
                                                        <strong>• Environment:</strong>
                                                        <br />
                                                        Low dust
                                                        <br />
                                                        Controlled workspace
                                                        <br />Your results are directly tied to your environment. Control it first.
                                                    </p>

                                                </div>
                                            </div>

                                            <div className="flex justify-end mt-8">
                                                <Button
                                                    onClick={() => markComplete(sub.id)}
                                                    className={`rounded-xl px-10 h-14 font-bold transition-all duration-500 ${completedSteps.includes(sub.id) ? 'bg-[#0EA0DC] text-white shadow-lg' : 'bg-[#272727] text-white hover:bg-black shadow-md'}`}
                                                >
                                                    {completedSteps.includes(sub.id) ? <><CheckCircle className="w-5 h-5 mr-2" /> Protocol Verified</> : 'Verify Standard'}
                                                </Button>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="h-px bg-gray-100 my-8" />
                        <div id="data" className="scroll-mt-32">
                            <Card className="p-8 rounded-lg border-gray-100 bg-white">


                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                    Restoration &amp; Protection Products
                                </h2>



                                <div id="storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">


                                        <strong>     These are the items you will receive directly from SkyGloss     </strong>               <br />
                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• FUSION 250</li>
                                        <li>• FUSION 500</li>
                                        <li>• FUSION 2000</li>
                                        <li>• Applicators</li>
                                        <li>• FUSION 2000</li>
                                        <li>• Applicator Bottle</li>
                                        <li>• Edge Blade</li>
                                        <li>• Paint Pen</li>
                                        <li>• Resin Film</li>
                                        <li>• Shine</li>
                                        <li>• Matte</li>
                                        <li>• Seal</li>
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


                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                    Consumables
                                </h2>



                                <div id="storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">


                                        <strong>   These are the items you will want to source from a reliable local supplier.   </strong>               <br />
                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Gloves (100+, large minimum)</li>
                                        <li>• Edgeless Microfibers (50+ each: blue, white, black)</li>

                                        <li>• Plastic Blades (10+)</li>
                                        <li>• Metal Blades (10+)</li>
                                        <li>• Tar Removere</li>
                                        <li>• Unscented, low-dye dish soap</li>
                                        <li>• Isopropyl Alcohol</li>
                                        <li>• Denatured Alcohol</li>
                                        <li>• Acetone</li>
                                        <li>• High-quality masking tape (10+)</li>
                                        <li>• Tack cloths (5+)</li>
                                        <li>• Pump sprayers (2+)</li>
                                        <li>• Utility knives (2+)</li>
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


                                <h2 className="text-3xl font-bold text-[#272727] mb-8 leading-[1.1] tracking-tighter uppercase italic">
                                    Equipment
                                </h2>



                                <div id="storage" className="bg-gray-50 p-6 rounded-2xl mb-8">
                                    <p className="text-sm text-[#272727] font-medium leading-relaxed">


                                        <strong>   Most shops will already have many of these items, but make sure your shop is fully equipped
                                            before getting started.   </strong>               <br />
                                    </p>
                                    <ul className="space-y-2 text-sm text-[#666666]">
                                        <li>• Climate-controlled environment</li>
                                        <li>• Adequate lighting or rolling lighting racks</li>

                                        <li>• Clean floors</li>
                                        <li>• DA Sander (5” or 6”) ×2</li>
                                        <li>• Sanding discs (1500, 3000, 5000 grit)</li>
                                        <li>• DA Polisher (5” or 6”)</li>
                                        <li>• 3” cordless DA polisher (optional)</li>
                                        <li>• Extension cords</li>
                                        <li>• Cordless drilll</li>
                                        <li>• Screwdriver set</li>
                                        <li>• Socket set</li>
                                        <li>• Rubber wheel</li>
                                        <li>• Fishing line</li>
                                        <li>• 3-section microfiber hampers (2)</li>
                                        <li>• System for washing microfibers</li>
                                        <li>• Carts or cabinet/workbench</li>
                                        <li>• Interface pads (5” or 6”)</li>
                                        <li>• 3-stage polishing compounds</li>
                                        <li>• 3-stage polishing pads</li>
                                        <li>• 1500 sanding discs (10+)</li>
                                        <li>• 3000 sanding discs (20+)</li>
                                        <li>• 5000 sanding discs (30+)</li>
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
                        {/* Completion Footer */}
                        <div className="py-12">
                            <Card className="p-8 rounded-2xl bg-[#272727] text-white text-center">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-[#0EA0DC]" />
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Congratulations! You have completed the SkyGloss Shop Setup.</h2>
                                <p className="text-white/70 text-sm mb-8">
                                    Your shop environment is now configured according to SkyGloss professional standards. You are ready to proceed with advanced training modules.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        onClick={async () => {
                                            try {
                                                await api.patch('/users/me/complete-course', { courseName: COURSE_KEY });
                                            } catch (err) {
                                                console.error("Failed to mark course as complete", err);
                                            }
                                            onBack();
                                        }}
                                        className="bg-white text-[#272727] hover:bg-gray-100"
                                    >
                                        Finished
                                    </Button>
                                    <Button variant="outline" className="border-white text-white hover:bg-[#0EA0DC]" onClick={() => window.open('https://portal.skygloss.com/support', '_blank')}>
                                        CONTACT SUPPORT
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
                                <Button
                                    onClick={() => window.open('https://portal.skygloss.com/support', '_blank')}
                                    className="w-full bg-white text-[#0EA0DC] hover:bg-gray-100 text-xs h-8"
                                >
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