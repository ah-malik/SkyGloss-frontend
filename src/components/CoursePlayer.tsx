import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Play, CheckCircle, ChevronRight, Download, MessageSquare, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface CoursePlayerProps {
  onBack: () => void;
}

const course = {
  id: 1,
  title: "SkyGloss Shield - Complete Application Guide",
  description: "Master the complete application process for SkyGloss Shield clear coating",
  instructor: "Carlos Martinez, Master Trainer",
  duration: "2h 30m",
  lessons: [
    {
      id: 1,
      title: "Introduction to SkyGloss Shield",
      duration: "8:24",
      type: "video",
      completed: true,
      description: "Overview of the product, its benefits, and what you'll learn"
    },
    {
      id: 2,
      title: "Safety and Preparation",
      duration: "12:15",
      type: "video",
      completed: true,
      description: "Essential safety protocols and workspace preparation"
    },
    {
      id: 3,
      title: "Surface Decontamination",
      duration: "15:30",
      type: "video",
      completed: false,
      description: "Step-by-step surface cleaning and preparation techniques"
    },
    {
      id: 4,
      title: "Panel Wiping Technique",
      duration: "10:45",
      type: "video",
      completed: false,
      description: "Proper panel preparation using IPA solution"
    },
    {
      id: 5,
      title: "Application Method - Cross-Hatch Pattern",
      duration: "18:20",
      type: "video",
      completed: false,
      description: "Master the professional cross-hatch application technique"
    },
    {
      id: 6,
      title: "Leveling and Buffing",
      duration: "14:35",
      type: "video",
      completed: false,
      description: "Achieve perfect finish through proper leveling"
    },
    {
      id: 7,
      title: "Common Mistakes and Fixes",
      duration: "16:50",
      type: "video",
      completed: false,
      description: "Troubleshooting high spots, streaking, and other issues"
    },
    {
      id: 8,
      title: "Curing Process",
      duration: "9:15",
      type: "video",
      completed: false,
      description: "Understanding cure times and post-application care"
    },
    {
      id: 9,
      title: "Customer Communication",
      duration: "11:40",
      type: "video",
      completed: false,
      description: "How to educate customers on maintenance and care"
    },
    {
      id: 10,
      title: "Technical Data Sheet Review",
      duration: "7:30",
      type: "document",
      completed: false,
      description: "Deep dive into technical specifications"
    }
  ]
};

export function CoursePlayer({ onBack }: CoursePlayerProps) {
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
                <div className="aspect-video bg-[#272727] flex items-center justify-center">
                  <Play className="w-20 h-20 text-white opacity-70" />
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
                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                          currentLesson === l.id
                            ? "bg-[#0EA0DC] text-white"
                            : completedLessons.includes(l.id)
                            ? "bg-green-50 hover:bg-green-100"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {completedLessons.includes(l.id) ? (
                              <CheckCircle className={`w-4 h-4 ${
                                currentLesson === l.id ? "text-white" : "text-green-600"
                              }`} />
                            ) : (
                              <Play className={`w-4 h-4 ${
                                currentLesson === l.id ? "text-white" : "text-[#666666]"
                              }`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm mb-1 ${
                              currentLesson === l.id ? "text-white" : "text-[#272727]"
                            }`}>
                              {l.id}. {l.title}
                            </div>
                            <div className={`text-xs ${
                              currentLesson === l.id ? "text-white/80" : "text-[#666666]"
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
