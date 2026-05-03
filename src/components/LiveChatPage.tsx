import { useSearchParams } from 'react-router';
import { useAuth } from '../AuthContext';
import { ChatWidget } from './ChatWidget';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';

export function LiveChatPage() {
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get('roomId');
    const targetUserId = searchParams.get('userId');
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-2xl border border-white max-w-md w-full mx-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Lock className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-3xl font-black text-[#272727] mb-3 tracking-tight uppercase">Access Denied</h2>
                    <p className="text-slate-500 mb-8 font-medium">Please log in with your secure credentials to access the SkyGloss live support network.</p>
                    <Button onClick={() => navigate('/')} className="bg-[#0EA0DC] hover:bg-[#0EA0DC]/90 w-full h-14 rounded-2xl font-bold shadow-lg shadow-[#0EA0DC]/20 transition-all active:scale-95">
                        Return to Portal
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-100 font-sans">

            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.close()}
                        className="rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>

                    <div>
                        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Live Support
                        </h1>
                        <p className="text-xs text-slate-400">Secure Chat</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-slate-700">
                            {user.firstName} {user.lastName}
                        </p>
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-[#0EA0DC] text-white flex items-center justify-center font-bold">
                        {user.firstName?.[0] || 'U'}
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 flex overflow-hidden">

                <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto">

                    <Card className="flex-1 flex flex-col rounded-none sm:rounded-xl shadow-sm border overflow-hidden">
                        <ChatWidget
                            userName={`${user.firstName || ''} ${user.lastName || ''}`.trim() || "User"}
                            userEmail={user.email}
                            userType={user.role}
                            userId={targetUserId || user._id}
                            isFullPage={true}
                        />
                    </Card>

                </div>

            </main>

            {/* Footer */}
            <footer className="text-center py-2 text-xs text-slate-400">
                SkyGloss © {new Date().getFullYear()}
            </footer>
        </div>
    );
}
