import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Mail, MessageSquare, Phone, Loader2, Send, ArrowLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import api from "../api/axios";
import { useAuth } from "../AuthContext";
import { format } from "date-fns";

interface SupportPageProps {
  onBack?: () => void;
}

export function SupportPage({ onBack }: SupportPageProps = {}) {
  const { user, refreshUnreadCount, setIsChatOpen } = useAuth();

  // Mark notifications as read on mount
  useEffect(() => {
    const markRead = async () => {
      try {
        await api.patch('/notifications/mark-my-chat-read');
        refreshUnreadCount(); // Update the global badge
      } catch (err) {
        console.error("Failed to mark notifications as read", err);
      }
    };
    markRead();
  }, [refreshUnreadCount]);

  // My Tickets State
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.email) {
      api.get(`/support/user/${user.email}`).then(res => {
        setMyTickets(res.data);
      }).catch(err => console.error("Failed to fetch user tickets:", err));
    }
  }, [user]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [openTicketId, myTickets]);

  // Ticket Form State
  const [name, setName] = useState(user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "");
  const [email, setEmail] = useState(user?.email || "");
  const [userType, setUserType] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [message, setMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    if (!email.trim()) { toast.error("Please enter your email"); return; }
    if (!userType) { toast.error("Please select a User Type"); return; }
    if (!issueCategory) { toast.error("Please select an Issue Category"); return; }
    if (!message.trim()) { toast.error("Please enter your message"); return; }

    setIsSubmitting(true);
    try {
      await api.post('/support', { name, email, userType, issueCategory, message });
      setTicketSubmitted(true);
      toast.success("Support ticket submitted!", {
        description: "Our team will contact you within 24 hours"
      });
      // Refresh tickets
      if (user?.email) {
        api.get(`/support/user/${user.email}`).then(res => setMyTickets(res.data));
      }
      setMessage("");
    } catch (error) {
      console.error("Failed to submit ticket:", error);
      toast.error("Failed to submit ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendChatMessage = async (ticketId: string) => {
    if (!chatMessage.trim() || sendingChat) return;
    setSendingChat(true);
    try {
      const res = await api.post(`/support/${ticketId}/messages`, {
        sender: 'user',
        content: chatMessage.trim(),
        senderEmail: user?.email,
      });
      setMyTickets(prev => prev.map(t => t._id === ticketId ? res.data : t));
      setChatMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message");
    } finally {
      setSendingChat(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent, ticketId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage(ticketId);
    }
  };

  // Build chat messages (backward compatible)
  const getChatMessages = (ticket: any) => {
    if (!ticket) return [];
    if (ticket.messages && ticket.messages.length > 0) return ticket.messages;
    const msgs: any[] = [];
    if (ticket.message) msgs.push({ sender: 'user', content: ticket.message, timestamp: ticket.createdAt });
    if (ticket.adminReply) msgs.push({ sender: 'admin', content: ticket.adminReply, timestamp: ticket.adminReplyDate || ticket.updatedAt });
    return msgs;
  };

  const openTicket = myTickets.find(t => t._id === openTicketId);

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20">
            Support Center
          </Badge>
          <h1 className="text-4xl text-[#272727] mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Get quick answers from our <a href="https://skygloss.com/faq/" target="_blank" rel="noopener noreferrer" className="text-[#0EA0DC] hover:underline font-medium">FAQ</a> or submit a support ticket
          </p>
        </motion.div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="skygloss-card p-6 rounded-2xl text-center h-full flex flex-col">
              <Mail className="w-10 h-10 mx-auto mb-3 text-[#0EA0DC]" />
              <h3 className="text-[#272727] mb-2">Email Support</h3>
              <p className="text-sm text-[#666666] mb-4 flex-grow">support@skygloss.com</p>
              <Button
                size="sm"
                variant="outline"
                className="border-[#0EA0DC]/30 text-[#0EA0DC] hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                onClick={() => window.location.href = "mailto:support@skygloss.com"}
              >
                Send Email
              </Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="skygloss-card p-6 rounded-2xl text-center h-full flex flex-col">
              <Phone className="w-10 h-10 mx-auto mb-3 text-[#0EA0DC]" />
              <h3 className="text-[#272727] mb-4">Phone Support</h3>
              <div className="space-y-3 mb-4 flex-grow">
                <div>
                  <p className="text-xs text-[#0EA0DC] mb-1">Technical Support</p>
                  <a href="tel:+13604414886" className="text-sm text-[#0EA0DC] hover:underline transition-all">
                    +1 (360) 441-4886
                  </a>
                </div>
                <div>
                  <p className="text-xs text-[#0EA0DC] mb-1">Ordering Support</p>
                  <a href="tel:+16027844113" className="text-sm text-[#0EA0DC] hover:underline transition-all">
                    +1 (602) 784-4113
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="skygloss-card p-6 rounded-2xl text-center h-full flex flex-col">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-[#0EA0DC]" />
              <h3 className="text-[#272727] mb-2">Live Chat</h3>
              <p className="text-sm text-[#666666] mb-4 flex-grow">Average response: 2 min</p>
              <Button
                size="sm"
                onClick={() => setIsChatOpen(true)}
                className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)]"
              >
                Start Chat
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Support Ticket Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          <Card className="skygloss-card p-8 rounded-2xl">
            <div className="text-center mb-6">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-[#0EA0DC]" />
              <h3 className="text-xl text-[#272727]">
                Submit a Ticket
              </h3>
            </div>

            {!ticketSubmitted ? (
              <form onSubmit={handleSubmitTicket} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-[#272727] mb-2">
                    Name   <span className="text-red-500">*</span>
                  </label>
                  <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="border-[#0EA0DC]/30 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm text-[#272727] mb-2">
                    Email   <span className="text-red-500">*</span>
                  </label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="border-[#0EA0DC]/30 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm text-[#272727] mb-2">
                    User Type   <span className="text-red-500">*</span>
                  </label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger className="border-[#0EA0DC]/30 rounded-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="shop">Shop</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-[#272727] mb-2">
                    Issue Category   <span className="text-red-500">*</span>
                  </label>
                  <Select value={issueCategory} onValueChange={setIssueCategory}>
                    <SelectTrigger className="border-[#0EA0DC]/30 rounded-lg">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="login">Login Issue</SelectItem>
                      <SelectItem value="product">Product Question</SelectItem>
                      <SelectItem value="training">Training Access</SelectItem>
                      <SelectItem value="order">Order Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-[#272727] mb-2">
                    Your Message...   <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue..."
                    className="border-[#0EA0DC]/30 rounded-lg min-h-[120px]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full col-span-2 bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-11 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Ticket"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0EA0DC]/10 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-[#0EA0DC]" />
                </div>
                <h4 className="text-lg text-[#272727] mb-2">
                  Ticket Submitted!
                </h4>
                <p className="text-sm text-[#666666] mb-4">
                  Our support team will contact you within 24 hours.
                </p>
                <Button
                  onClick={() => setTicketSubmitted(false)}
                  variant="outline"
                  size="sm"
                  className="border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                >
                  Submit Another
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* My Tickets Section */}
        {user && myTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-7xl mx-auto mt-12"
          >
            <h3 className="text-2xl text-[#272727] mb-6 font-bold flex items-center gap-2">
              <MessageSquare className="text-[#0EA0DC]" /> My Support Tickets
            </h3>

            {/* Ticket Chat View */}
            {openTicket ? (
              <Card className="skygloss-card rounded-2xl overflow-hidden flex flex-col" style={{ height: '500px' }}>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setOpenTicketId(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft size={18} className="text-slate-600" />
                  </button>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 capitalize text-sm">{openTicket.issueCategory} Issue</h4>
                    <p className="text-xs text-slate-500">
                      {format(new Date(openTicket.createdAt), 'MMM dd, yyyy HH:mm')}
                      <span className="mx-2">·</span>
                      <Badge className={`text-[10px] px-1.5 py-0 ${
                        openTicket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                        openTicket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                        openTicket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {openTicket.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                  {getChatMessages(openTicket).map((msg: any, idx: number) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'user'
                          ? 'bg-[#0EA0DC] text-white rounded-br-sm'
                          : 'bg-white border border-emerald-200 text-slate-800 rounded-bl-sm shadow-sm'
                      }`}>
                        {msg.sender === 'admin' && (
                          <p className="text-[10px] font-bold text-emerald-600 mb-1">SkyGloss Support</p>
                        )}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                          {msg.timestamp ? format(new Date(msg.timestamp), 'MMM dd, HH:mm') : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Message Input */}
                <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => handleChatKeyDown(e, openTicket._id)}
                      placeholder="Type your message..."
                      rows={1}
                      className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA0DC]/20 max-h-[100px]"
                      style={{ minHeight: '44px' }}
                    />
                    <button
                      onClick={() => sendChatMessage(openTicket._id)}
                      disabled={!chatMessage.trim() || sendingChat}
                      className="h-11 w-11 shrink-0 rounded-xl bg-[#0EA0DC] hover:bg-[#0b86b8] text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              /* Ticket List */
              <div className="space-y-3">
                {myTickets.map((ticket, idx) => {
                  const msgs = getChatMessages(ticket);
                  const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
                  return (
                    <Card
                      key={idx}
                      className="skygloss-card p-4 rounded-2xl cursor-pointer hover:border-[#0EA0DC]/30 hover:shadow-md transition-all"
                      onClick={() => { setOpenTicketId(ticket._id); setChatMessage(""); }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-[#0EA0DC]/10 flex items-center justify-center">
                          <MessageSquare size={18} className="text-[#0EA0DC]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-slate-800 capitalize text-sm">{ticket.issueCategory} Issue</h4>
                            <Badge className={`text-[10px] px-1.5 py-0 ${
                              ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                              ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                              ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {ticket.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          {lastMsg && (
                            <p className="text-xs text-slate-500 truncate">
                              <span className="font-medium">{lastMsg.sender === 'user' ? 'You' : 'Support'}:</span>{' '}
                              {lastMsg.content}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <span className="text-[10px] text-slate-400">
                            {ticket.createdAt ? format(new Date(ticket.createdAt), 'MMM dd') : ''}
                          </span>
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
