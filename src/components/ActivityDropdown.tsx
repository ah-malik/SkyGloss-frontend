import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell, CheckCircle2, GraduationCap, MessageSquare, Package, Clock } from "lucide-react";
import { useAuth } from "../AuthContext";
import { formatDistanceToNow } from "date-fns";

export function ActivityDropdown() {
    const { recentActivities, refreshActivities, unreadMessages } = useAuth();

    const getIcon = (type: string) => {
        switch (type) {
            case 'TRAINING_COMPLETED':
                return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'CERT_REQUEST':
                return <GraduationCap className="w-4 h-4 text-[#0EA0DC]" />;
            case 'CHAT_MESSAGE':
                return <MessageSquare className="w-4 h-4 text-amber-500" />;
            case 'ORDER_PLACED':
            case 'ORDER_PAID':
                return <Package className="w-4 h-4 text-blue-500" />;
            default:
                return <Bell className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <DropdownMenu onOpenChange={(open) => open && refreshActivities()}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200">
                    <Bell className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Activity</span>
                    {unreadMessages > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white border-[#0EA0DC]/20 shadow-xl rounded-2xl overflow-hidden p-0">
                <DropdownMenuLabel className="px-4 py-3 bg-[#0EA0DC]/5 text-[#272727] font-bold flex items-center justify-between">
                    <span>Recent Activity</span>
                    {unreadMessages > 0 && (
                        <span className="text-[10px] bg-[#0EA0DC] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {unreadMessages} New
                        </span>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="m-0 bg-[#0EA0DC]/10" />
                <div className="max-h-[400px] overflow-y-auto">
                    {recentActivities.length === 0 ? (
                        <div className="px-4 py-8 text-center text-[#999999] text-sm">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            No recent activity
                        </div>
                    ) : (
                        recentActivities.map((activity, idx) => (
                            <DropdownMenuItem
                                key={activity._id || idx}
                                className="px-4 py-3 cursor-pointer hover:bg-[#0EA0DC]/5 transition-colors border-b border-[#0EA0DC]/5 last:border-0"
                                onClick={() => activity.link && (window.location.href = activity.link)}
                            >
                                <div className="flex gap-3 items-start w-full">
                                    <div className="mt-1 p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                        {getIcon(activity.type)}
                                    </div>
                                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#272727] truncate">{activity.title}</p>
                                        <p className="text-[11px] text-[#666666] line-clamp-2 leading-snug">{activity.message}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Clock className="w-3 h-3 text-[#999999]" />
                                            <span className="text-[10px] text-[#999999]">
                                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                {recentActivities.length > 0 && (
                    <>
                        <DropdownMenuSeparator className="m-0 bg-[#0EA0DC]/10" />
                        <div className="p-2 bg-gray-50 text-center">
                            {/* <Button variant="ghost" size="xs" className="text-[10px] text-[#0EA0DC] font-bold uppercase tracking-widest h-auto py-1 hover:bg-[#0EA0DC]/10">
                                View All Notifications
                            </Button> */}
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
