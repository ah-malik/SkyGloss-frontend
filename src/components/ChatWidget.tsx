import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { X, Send, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import api from '../api/axios';

interface Message {
    _id?: string;
    senderName: string;
    senderType: 'user' | 'admin';
    message: string;
    createdAt?: string;
}

interface ChatWidgetProps {
    userName: string;
    userEmail: string;
    userType?: string;
    userId?: string;
    onClose?: () => void;
    isFullPage?: boolean;
}

export function ChatWidget({ userName, userEmail, userType = 'guest', userId, onClose, isFullPage = false }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(!isFullPage);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [roomId, setRoomId] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Determine if the local user is acting as an admin/support
    const isAdminRole = ['admin', 'master_partner', 'regional_partner', 'partner'].includes(userType.toLowerCase());
    const currentSenderType = isAdminRole ? 'admin' : 'user';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        let isMounted = true;

        if ((isOpen || isFullPage) && !socketRef.current) {
            connectToChat(() => isMounted);
        }
        return () => {
            isMounted = false;
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [isOpen, isFullPage]);

    const connectToChat = async (getIsMounted: () => boolean) => {
        setIsConnecting(true);
        try {
            // Create or get chat room
            const response = await api.post('/chat/room', {
                userId,
                userName,
                userEmail,
                userType,
            });

            if (!getIsMounted()) return;

            const room = response.data;
            const rid = room._id.toString();
            setRoomId(rid);

            // Connect to Socket.IO
            const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://skygloss-backend-production-3b96.up.railway.app';
            const newSocket = io(socketUrl, { 
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5
            });

            if (!getIsMounted()) {
                newSocket.disconnect();
                return;
            }

            socketRef.current = newSocket;
            
            // Mark notifications from this specific user/admin as read
            const triggeredById = isAdminRole ? userId : 'admin';
            if (triggeredById) {
                try {
                    await api.patch(`/notifications/mark-chat-read/${triggeredById}`);
                } catch (err) {
                    console.error('Failed to mark chat as read:', err);
                }
            }

            const joinRoom = () => {
                if (newSocket.connected) {
                    console.log('Emitting join_room for', rid);
                    newSocket.emit('join_room', { roomId: rid });
                }
            };

            newSocket.on('connect', () => {
                console.log('Connected to chat server');
                joinRoom();
            });

            // If already connected (re-render), join immediately
            if (newSocket.connected) joinRoom();

            newSocket.on('chat_history', (history: Message[]) => {
                setMessages(history);
            });

            newSocket.on('new_message', (message: Message) => {
                setMessages((prev) => {
                    // Prevent duplicate appends if multiple listeners fired
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
            });

            newSocket.on('user_typing', () => {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000);
            });
        } catch (error) {
            console.error('Failed to connect to chat:', error);
        } finally {
            if (getIsMounted()) setIsConnecting(false);
        }
    };

    const sendMessage = () => {
        if (!inputMessage.trim() || !socketRef.current || !roomId) return;

        socketRef.current.emit('send_message', {
            roomId: roomId.toString(),
            senderName: userName,
            senderType: currentSenderType,
            message: inputMessage,
        });

        setInputMessage('');
    };

    const handleTyping = () => {
        if (socketRef.current && roomId) {
            socketRef.current.emit('typing', { roomId: roomId.toString(), userName });
        }
    };

    const openInNewTab = () => {
        const url = `/live-chat?userId=${userId || ''}&roomId=${roomId || ''}`;
        window.open(url, '_blank');
        setIsOpen(false);
        onClose?.();
    };

    if (!isOpen && !isFullPage) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-[#0EA0DC] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-50"
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        );
    }

    return (
        <Card 
            className={isFullPage ? "chat-widget-full-page flex flex-col h-full w-full border-0 shadow-none" : "!fixed !bottom-6 !right-6 w-96 h-[500px] flex flex-col shadow-2xl z-50 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"}
        >
            {/* Header */}
            <div className={`bg-[#0EA0DC] text-white p-4 flex items-center justify-between ${isFullPage ? 'hidden' : ''}`}>
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">Live Chat</span>
                </div>
                <div className="flex items-center gap-1">
                    {!isFullPage && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-white hover:bg-white/20"
                            onClick={openInNewTab}
                            title="Open in new tab"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </Button>
                    )}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onClose?.();
                        }}
                        className="hover:bg-white/20 rounded p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 ${isFullPage ? 'rounded-t-3xl' : ''}`}>
                {isConnecting ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-[#0EA0DC]" />
                            <p className="text-sm text-gray-500 font-medium">Connecting to secure chat...</p>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm mt-12">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-8 h-8 opacity-30 text-[#0EA0DC]" />
                        </div>
                        <p className="font-bold text-[#272727] text-base mb-1">No messages yet</p>
                        <p className="text-gray-400">Ask a question to start the conversation.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={msg._id || idx}
                            className={`flex ${msg.senderType === currentSenderType ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className="flex flex-col gap-1 max-w-[80%] md:max-w-[70%]">
                                <div
                                    className={`px-4 py-2.5 rounded-2xl ${msg.senderType === currentSenderType
                                        ? 'bg-gradient-to-br from-[#0EA0DC] to-[#0A85B8] text-white rounded-br-none shadow-md'
                                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                </div>
                                <span className={`text-[10px] text-gray-400 ${msg.senderType === currentSenderType ? 'text-right mr-1' : 'ml-1'}`}>
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </span>
                            </div>
                        </div>
                    ))

                )}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-[#0EA0DC]/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                <span className="w-2 h-2 bg-[#0EA0DC]/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 bg-[#0EA0DC]/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 bg-white border-t border-gray-100 flex gap-2 items-center ${isFullPage ? 'rounded-b-3xl' : ''}`}>
                <Input
                    value={inputMessage}
                    onChange={(e) => {
                        setInputMessage(e.target.value);
                        handleTyping();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder="Type your message here..."
                    className="flex-1 rounded-xl bg-gray-50 border-transparent focus:bg-white transition-all py-6"
                />
                <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isConnecting}
                    size="icon"
                    className="h-12 w-12 rounded-xl bg-[#0EA0DC] hover:bg-[#0EA0DC]/90 shadow-lg shadow-[#0EA0DC]/20 shrink-0"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </div>
        </Card>
    );
}
