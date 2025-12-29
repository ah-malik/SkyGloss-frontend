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
}

export function ChatWidget({ userName, userEmail, userType = 'guest', userId, onClose }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [roomId, setRoomId] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && !socketRef.current) {
            connectToChat();
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [isOpen]);

    const connectToChat = async () => {
        setIsConnecting(true);
        try {
            // Create or get chat room
            const response = await api.post('/chat/room', {
                userId,
                userName,
                userEmail,
                userType,
            });

            const room = response.data;
            setRoomId(room._id);

            // Connect to Socket.IO
            const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
            const newSocket = io(socketUrl);
            socketRef.current = newSocket;

            newSocket.on('connect', () => {
                console.log('Connected to chat server');
                newSocket.emit('join_room', { roomId: room._id });
            });

            newSocket.on('chat_history', (history: Message[]) => {
                setMessages(history);
            });

            newSocket.on('new_message', (message: Message) => {
                setMessages((prev) => [...prev, message]);
            });

            newSocket.on('user_typing', () => {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000);
            });
        } catch (error) {
            console.error('Failed to connect to chat:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const sendMessage = () => {
        if (!inputMessage.trim() || !socketRef.current || !roomId) return;

        socketRef.current.emit('send_message', {
            roomId,
            senderName: userName,
            senderType: 'user',
            message: inputMessage,
        });

        setInputMessage('');
    };

    const handleTyping = () => {
        if (socketRef.current && roomId) {
            socketRef.current.emit('typing', { roomId, userName });
        }
    };

    if (!isOpen) {
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
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] flex flex-col shadow-2xl z-50 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#0EA0DC] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">Live Chat</span>
                </div>
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                {isConnecting ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-[#0EA0DC]" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm mt-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={msg._id || idx}
                            className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[75%] px-4 py-2 rounded-2xl ${msg.senderType === 'user'
                                    ? 'bg-[#0EA0DC] text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                    }`}
                            >
                                <p className="text-sm">{msg.message}</p>
                            </div>
                        </div>
                    ))
                )}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t flex gap-2">
                <Input
                    value={inputMessage}
                    onChange={(e) => {
                        setInputMessage(e.target.value);
                        handleTyping();
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                />
                <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-[#0EA0DC] hover:bg-[#0EA0DC]/90"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
}
