import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

interface MessagesPageProps {
  onBack: () => void;
  userEmail: string;
  userName: string;
}

const MESSAGES_KEY = 'messages';

function getMessages(userEmail: string): Message[] {
  try { return JSON.parse(localStorage.getItem(`${MESSAGES_KEY}:${userEmail}`) || '[]'); } catch { return []; }
}

function saveMessages(userEmail: string, messages: Message[]) {
  try { localStorage.setItem(`${MESSAGES_KEY}:${userEmail}`, JSON.stringify(messages)); } catch {}
}

export function MessagesPage({ onBack, userEmail, userName }: MessagesPageProps) {
  const [messages, setMessages] = useState<Message[]>(() => getMessages(userEmail));
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 대화 목록 생성
  const conversations: Conversation[] = (() => {
    const convMap = new Map<string, Conversation>();
    const sorted = [...messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    for (const msg of sorted) {
      const partnerId = msg.from === userEmail ? msg.to : msg.from;
      if (!convMap.has(partnerId)) {
        const unread = messages.filter(m => m.from === partnerId && !m.read).length;
        convMap.set(partnerId, {
          partnerId,
          partnerName: partnerId.split('@')[0] || '사용자',
          lastMessage: msg.text,
          lastTimestamp: msg.timestamp,
          unreadCount: unread,
        });
      }
    }
    return Array.from(convMap.values());
  })();

  // 선택된 대화의 메시지들
  const chatMessages = selectedPartner
    ? messages
        .filter(m => (m.from === selectedPartner && m.to === userEmail) || (m.from === userEmail && m.to === selectedPartner))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  // 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  // 메시지 읽음 처리
  useEffect(() => {
    if (!selectedPartner) return;
    const updated = messages.map(m =>
      m.from === selectedPartner && m.to === userEmail && !m.read
        ? { ...m, read: true }
        : m
    );
    setMessages(updated);
    saveMessages(userEmail, updated);
  }, [selectedPartner]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedPartner) return;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      from: userEmail,
      to: selectedPartner,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updated = [...messages, msg];
    setMessages(updated);
    saveMessages(userEmail, updated);
    setNewMessage("");
    toast.success("메시지를 보냈습니다");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── 대화 상세 ───
  if (selectedPartner) {
    const partnerName = conversations.find(c => c.partnerId === selectedPartner)?.partnerName || selectedPartner.split('@')[0];

    return (
      <div className="min-h-screen bg-[#fafaf7] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="max-w-md mx-auto px-5 h-14 flex items-center gap-3">
            <button onClick={() => setSelectedPartner(null)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} className="text-gray-800" />
            </button>
            <div className="flex-1">
              <h4 className="text-[15px] font-semibold text-gray-900">{partnerName}</h4>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {chatMessages.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400">메시지를 보내 대화를 시작하세요</p>
            </div>
          )}
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.from === userEmail ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.from === userEmail
                  ? 'bg-[#6b8e6f] text-white rounded-br-md'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.from === userEmail ? 'text-white/60' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-3 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
          <div className="max-w-md mx-auto flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요"
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:border-[#6b8e6f] focus:ring-2 focus:ring-[#6b8e6f]/20 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="w-10 h-10 bg-[#6b8e6f] text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-90 transition-all shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── 대화 목록 ───
  return (
    <div className="min-h-screen bg-[#fafaf7] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#6b8e6f]">
        <div className="max-w-md mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors">
              <ArrowLeft size={18} className="text-white" />
            </button>
            <h1 className="text-white text-lg font-bold">쪽지함</h1>
          </div>
          <p className="text-white/70 text-xs ml-12">사업자와 리뷰어 간 1:1 소통</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-4">
        {conversations.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-2xl flex items-center justify-center">
              <MessageCircle size={28} className="text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">쪽지가 없어요</h3>
            <p className="text-sm text-gray-400">체험단 활동 중 소통이 필요하면<br/>여기서 메시지를 주고받을 수 있어요</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(conv => (
              <button
                key={conv.partnerId}
                onClick={() => setSelectedPartner(conv.partnerId)}
                className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-left hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f5a145] to-[#e89535] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                    {conv.partnerName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-gray-900">{conv.partnerName}</span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(conv.lastTimestamp).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate pr-2">{conv.lastMessage}</p>
                      {conv.unreadCount > 0 && (
                        <span className="shrink-0 w-5 h-5 bg-[#f5a145] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
