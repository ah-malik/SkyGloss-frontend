import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../AuthContext';

export function useChatNotifications(userId: string | undefined, userName: string | undefined) {
    const socketRef = useRef<Socket | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshUnreadCount, setIsChatOpen, refreshActivities } = useAuth();

    useEffect(() => {
        if (!userId) return;

        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://skygloss-backend-production-3b96.up.railway.app';
        const socket = io(socketUrl, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to notification socket');
            socket.emit('join_user_room', { userId });
        });

        socket.on('new_admin_message', (data: { roomId: string, message: string, senderName: string }) => {
            // Refresh unread count globally
            refreshUnreadCount();
            refreshActivities();

            // Open chat automatically
            setIsChatOpen(true);
            
            // Still show toast for extra visibility
            toast("New Message from Partner", {
                description: `${data.senderName}: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}`,
                duration: 5000,
                action: {
                    label: "Close",
                    onClick: () => {}
                }
            });

            // Play a subtle notification sound
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
                audio.play().catch(e => console.log('Audio play blocked:', e));
            } catch (e) {
                console.error('Failed to play notification sound', e);
            }
        });

        socket.on('new_notification', (notification: any) => {
            // Filter out self-triggered notifications
            if (notification.triggeredBy && notification.triggeredBy === userId) return;

            // Admin-only notification types that shouldn't be shown to regular users if they are global (no specific user assigned)
            const adminOnlyTypes = ['NEW_USER', 'CERT_REQUEST', 'CERT_PAID', 'SUPPORT_TICKET', 'CERT_VIDEO_UPLOADED', 'TRAINING_COMPLETED', 'ORDER_PLACED', 'ORDER_PAID'];
            if (!notification.user && adminOnlyTypes.includes(notification.type)) return;

            // Check if this notification belongs to the current user
            // In the backend, some notifications might not have a specific user field if they are global
            if (notification.user && notification.user !== userId) return;

            // Refresh unread count globally
            refreshUnreadCount();
            refreshActivities();

            // Show toast with Close option
            toast(notification.title || "New Notification", {
                description: notification.message,
                duration: 5000,
                action: {
                    label: "Close",
                    onClick: () => {}
                }
            });
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [userId, navigate, location.pathname, refreshUnreadCount, setIsChatOpen]);

    return socketRef.current;
}
