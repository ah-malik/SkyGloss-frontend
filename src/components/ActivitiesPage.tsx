import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Bell, CheckCircle2, GraduationCap, MessageSquare, Package, Clock, Loader2, CheckCheck } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import api from "../api/axios";
import { useAuth } from "../AuthContext";
import { formatDistanceToNow } from "date-fns";

export function ActivitiesPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/notifications/my');
      setActivities(res.data || []);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/mark-all-my-read');
      toast.success("All activities marked as read");
      // Refresh state
      setActivities(prev => prev.map(item => ({ ...item, isRead: true })));
    } catch (err) {
      console.error("Failed to mark read:", err);
      toast.error("Failed to mark activities as read");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TRAINING_COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'CERT_REQUEST':
        return <GraduationCap className="w-5 h-5 text-[#0EA0DC]" />;
      case 'CHAT_MESSAGE':
        return <MessageSquare className="w-5 h-5 text-amber-500" />;
      case 'ORDER_PLACED':
      case 'ORDER_PAID':
        return <Package className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#272727] flex items-center gap-2">
              <Bell className="text-[#0EA0DC] w-8 h-8" /> Recent Activity
            </h1>
            <p className="text-slate-500 text-sm mt-1">Stay updated on courses, network notifications, and new orders.</p>
          </div>

          {activities.some(a => !a.isRead) && (
            <Button
              onClick={handleMarkAllRead}
              variant="outline"
              className="border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5 rounded-xl gap-2 transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </motion.div>

        {/* Activity Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <Loader2 className="w-10 h-10 text-[#0EA0DC] animate-spin" />
            <p className="text-slate-400 font-medium tracking-wide">Fetching updates...</p>
          </div>
        ) : activities.length === 0 ? (
          <Card className="p-12 text-center rounded-3xl bg-white shadow-sm border-slate-100">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Activities Found</h3>
            <p className="text-sm text-slate-400">Updates regarding your courses and profile settings appear here.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <motion.div
                key={activity._id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card 
                  className={`p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 shadow-sm hover:shadow-md ${
                    !activity.isRead 
                      ? 'bg-[#0EA0DC]/5 border-[#0EA0DC]/30' 
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm shrink-0">
                    {getIcon(activity.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <h4 className="font-bold text-slate-800 text-base">{activity.title}</h4>
                      <div className="flex items-center gap-1 text-[#999999] shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">{activity.message}</p>
                    
                    {!activity.isRead && (
                      <div className="mt-2">
                        <Badge className="bg-[#0EA0DC] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">New</Badge>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
