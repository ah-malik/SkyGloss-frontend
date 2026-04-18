import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../AuthContext';

export function useChatNotifications(userId: string | undefined, userName: string | undefined) {
    const socketRef = useRef<Socket | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshUnreadCount, setIsChatOpen } = useAuth();

    useEffect(() => {
        if (!userId) return;

        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://skygloss-backend-production-3b96.up.railway.app';
        const socket = io(socketUrl);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to notification socket');
            socket.emit('join_user_room', { userId });
        });

        socket.on('new_admin_message', (data: { roomId: string, message: string, senderName: string }) => {
            // Refresh unread count globally
            refreshUnreadCount();

            // Set chat to open directly
            setIsChatOpen(true);
            
            // Still show toast for extra visibility
            toast("New Message from Partner", {
                description: `${data.senderName}: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}`,
                duration: 5000,
            });

            
            // Play a subtle notification sound
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
                audio.play().catch(e => console.log('Audio play blocked:', e));
            } catch (e) {
                console.error('Failed to play notification sound', e);
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [userId, navigate, location.pathname, refreshUnreadCount, setIsChatOpen]);

    return socketRef.current;
}
