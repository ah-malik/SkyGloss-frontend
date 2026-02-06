import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Play, CheckCircle, ChevronRight, Download, MessageSquare, Clock, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface CoursePlayerProps {
  onBack: () => void;
  productName?: string;
}

const getCourseForProduct = (productName: string) => ({
  id: 1,
  title: `${productName} - Professional Mastery`,
  description: `Master the complete application process for ${productName}`,
  instructor: "Carlos Martinez, Master Trainer",
  duration: "2h 30m",
  writtenInstructions: `
    ### Professional Application Guide for ${productName}
    
    1. **Surface Preparation**: Ensure the surface is completely clean and decontaminated. Use SkyGloss surface prep solution.
    2. **Environment Control**: Optimal application temperature is between 15°C and 25°C. Avoid direct sunlight.
    3. **Application Technique**: Apply in small sections (50cm x 50cm). Use a cross-hatch pattern for even coverage.
    4. **Leveling**: Wait for the appropriate flash time (varies by humidity) before leveling with a clean microfiber towel.
    5. **Curing**: Allow the product to cure for at least 12 hours before exposing to moisture.
  `,
  lessons: [
    {
      id: 1,
      title: `Introduction to ${productName}`,
      duration: "0",
      type: "content",
      completed: true,
      description: "Overview of the product and its core benefits"
    },
    {
      id: 2,
      title: "Written Instructions & Theory",
      duration: "0",
      type: "document",
      completed: true,
      description: "Detailed step-by-step written guide for the product"
    },
    {
      id: 3,
      title: "Video Tutorial (Pro Application)",
      duration: "15:30",
      type: productName.toUpperCase().includes('FUSION') ? "video" : "content",
      completed: false,
      description: productName.toUpperCase().includes('FUSION')
        ? "Professional application video demonstrating the perfect technique"
        : "Video tutorials are currently only available for the FUSION system. Please refer to written instructions."
    }
  ]
});

export function CoursePlayer({ onBack, productName = "FUSION" }: CoursePlayerProps) {
  const course = getCourseForProduct(productName);
  const [currentLesson, setCurrentLesson] = useState(3); // Starting at lesson 3 (first incomplete)
  const [completedLessons, setCompletedLessons] = useState([1, 2]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      author: "Maria Santos",
      time: "2 days ago",
      text: "Great explanation of the cross-hatch pattern! Very helpful."
    },
    {
      author: "John Smith",
      time: "5 days ago",
      text: "Question: What if the temperature is slightly below 15°C?"
    }
  ]);

  const lesson = course.lessons[currentLesson - 1];
  const progress = (completedLessons.length / course.lessons.length) * 100;

  const handleMarkComplete = () => {
    if (!completedLessons.includes(currentLesson)) {
      setCompletedLessons([...completedLessons, currentLesson]);
      toast.success("Lesson marked as complete!");
    }
  };

  const handleNextLesson = () => {
    if (currentLesson < course.lessons.length) {
      setCurrentLesson(currentLesson + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePostComment = () => {
    if (comment.trim()) {
      setComments([
        { author: "You", time: "Just now", text: comment },
        ...comments
      ]);
      setComment("");
      toast.success("Comment posted!");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </motion.div>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-[#272727] mb-2">{course.title}</h1>
          <p className="text-[#666666] mb-4">{course.description}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20">
              {course.instructor}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-[#666666]">
              <Clock className="w-4 h-4" />
              {course.duration}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#666666]">
              <CheckCircle className="w-4 h-4" />
              {completedLessons.length}/{course.lessons.length} completed
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#666666]">Course Progress</span>
              <span className="text-sm text-[#0EA0DC]">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="skygloss-card overflow-hidden rounded-2xl">
                {lesson.type === "video" ? (
                  <div className="aspect-video bg-[#272727] flex items-center justify-center">
                    <Play className="w-20 h-20 text-white opacity-70" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#0EA0DC]/10 flex items-center justify-center mb-4">
                      {lesson.type === "document" ? (
                        <Download className="w-8 h-8 text-[#0EA0DC]" />
                      ) : (
                        <FileText className="w-8 h-8 text-[#0EA0DC]" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#272727] mb-2">{lesson.title}</h3>
                    <p className="text-[#666666] max-w-md">{lesson.description}</p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Written Instructions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="skygloss-card p-8 rounded-2xl border-l-4 border-l-[#0EA0DC]">
                <h3 className="text-xl font-bold text-[#272727] mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#0EA0DC]" />
                  Official Written Instructions
                </h3>
                <div className="prose prose-skygloss max-w-none text-[#666666] leading-relaxed">
                  {course.writtenInstructions.split('\n').map((line, i) => (
                    <p key={i} className={line.trim().startsWith('###') ? 'text-lg font-bold text-[#272727] mt-4 mb-2' : 'mb-3'}>
                      {line.replace('###', '').trim()}
                    </p>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Lesson Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="skygloss-card p-6 rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl text-[#272727] mb-2">
                      Lesson {currentLesson}: {lesson.title}
                    </h2>
                    <p className="text-[#666666] mb-4">{lesson.description}</p>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20">
                        {lesson.duration}
                      </Badge>
                      {completedLessons.includes(currentLesson) && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleMarkComplete}
                    disabled={completedLessons.includes(currentLesson)}
                    className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {completedLessons.includes(currentLesson) ? "Completed" : "Mark as Complete"}
                  </Button>
                  {currentLesson < course.lessons.length && (
                    <Button
                      onClick={handleNextLesson}
                      className="bg-[#272727] text-white hover:bg-[#272727]/90"
                    >
                      Next Lesson
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Downloads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="skygloss-card p-6 rounded-2xl">
                <h3 className="text-lg text-[#272727] mb-4">Downloadable Resources</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#0EA0DC]/30 hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                  >
                    <span className="text-[rgb(255,255,255)]">Lesson Notes (PDF)</span>
                    <Download className="w-4 h-4 text-[#0EA0DC]" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#0EA0DC]/30 hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                  >
                    <span className="text-[rgb(255,255,255)]">Application Checklist (PDF)</span>
                    <Download className="w-4 h-4 text-[#0EA0DC]" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#0EA0DC]/30 hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                  >
                    <span className="text-[rgb(255,255,255)]">Technical Data Sheet (PDF)</span>
                    <Download className="w-4 h-4 text-[#0EA0DC]" />
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="skygloss-card p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-[#0EA0DC]" />
                  <h3 className="text-lg text-[#272727]">Discussion</h3>
                </div>

                {/* Post Comment */}
                <div className="mb-6">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ask a question or share your thoughts..."
                    className="border-[#0EA0DC]/30 rounded-lg mb-3"
                  />
                  <Button
                    onClick={handlePostComment}
                    size="sm"
                    className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)]"
                  >
                    Post Comment
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((c, idx) => (
                    <div key={idx} className="pb-4 border-b border-[#0EA0DC]/10 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#0EA0DC]/10 flex items-center justify-center">
                          <span className="text-xs text-[#0EA0DC]">{c.author[0]}</span>
                        </div>
                        <div>
                          <div className="text-sm text-[#272727]">{c.author}</div>
                          <div className="text-xs text-[#666666]">{c.time}</div>
                        </div>
                      </div>
                      <p className="text-[#666666] ml-10">{c.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Course Curriculum */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <Card className="skygloss-card p-6 rounded-2xl">
                <h3 className="text-lg text-[#272727] mb-4">Course Curriculum</h3>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-2">
                    {course.lessons.map((l, idx) => (
                      <button
                        key={l.id}
                        onClick={() => setCurrentLesson(l.id)}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${currentLesson === l.id
                          ? "bg-[#0EA0DC] text-white"
                          : completedLessons.includes(l.id)
                            ? "bg-green-50 hover:bg-green-100"
                            : "bg-gray-50 hover:bg-gray-100"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {completedLessons.includes(l.id) ? (
                              <CheckCircle className={`w-4 h-4 ${currentLesson === l.id ? "text-white" : "text-green-600"
                                }`} />
                            ) : (
                              <Play className={`w-4 h-4 ${currentLesson === l.id ? "text-white" : "text-[#666666]"
                                }`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm mb-1 ${currentLesson === l.id ? "text-white" : "text-[#272727]"
                              }`}>
                              {l.id}. {l.title}
                            </div>
                            <div className={`text-xs ${currentLesson === l.id ? "text-white/80" : "text-[#666666]"
                              }`}>
                              {l.duration}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
