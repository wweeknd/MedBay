import React, { useState } from 'react';
import { mockChatThreads, mockMessages } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import {
  MessageSquare, Send, Paperclip, Image, Search, Phone,
  Video, MoreVertical, CheckCheck, Clock
} from 'lucide-react';

const Messaging: React.FC = () => {
  const { user } = useAuth();
  const userThreads = mockChatThreads.filter(t => 
    t.participants.patientId === user?.uid || t.participants.doctorId === user?.uid
  );
  const [selectedThread, setSelectedThread] = useState(userThreads[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [showMobileThreads, setShowMobileThreads] = useState(true);

  const activeThread = userThreads.find(t => t.id === selectedThread);
  const threadMessages = mockMessages.filter(m => m.consultationId === activeThread?.consultationId);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    // In production, this would push to Firestore
    setMessageInput('');
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="page-inner" style={{ padding: 0, height: 'calc(100vh - var(--navbar-height))' }}>
      <div className="messaging-layout">
        {/* Thread List */}
        <div className={`messaging-threads ${showMobileThreads ? 'show' : ''}`}>
          <div className="messaging-threads-header">
            <h3><MessageSquare size={20} /> Messages</h3>
          </div>
          <div className="thread-search">
            <Search size={16} className="search-icon" />
            <input type="text" className="form-input" placeholder="Search conversations..." id="message-search" />
          </div>
          <div className="thread-list">
            {userThreads.length === 0 && (
              <div className="empty-state" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
                <MessageSquare size={32} />
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>No conversations yet</p>
              </div>
            )}
            {userThreads.map(thread => {
              const otherName = user?.uid === thread.participants.patientId
                ? thread.participants.doctorName
                : thread.participants.patientName;
              return (
                <button
                  key={thread.id}
                  className={`thread-item ${selectedThread === thread.id ? 'active' : ''}`}
                  onClick={() => { setSelectedThread(thread.id); setShowMobileThreads(false); }}
                  id={`thread-${thread.id}`}
                >
                  <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
                    {otherName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="thread-info">
                    <div className="thread-info-top">
                      <span className="thread-name">{otherName}</span>
                      <span className="thread-time">{formatDate(thread.lastMessageAt)}</span>
                    </div>
                    <div className="thread-info-bottom">
                      <span className="thread-preview">{thread.lastMessage}</span>
                      {thread.unreadCount > 0 && (
                        <span className="thread-unread">{thread.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="messaging-chat">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <button className="btn-icon mobile-back-btn" onClick={() => setShowMobileThreads(true)}>
                  ←
                </button>
                <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
                  {(user?.uid === activeThread.participants.patientId
                    ? activeThread.participants.doctorName
                    : activeThread.participants.patientName
                  ).split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="chat-header-info">
                  <h4>{user?.uid === activeThread.participants.patientId
                    ? activeThread.participants.doctorName
                    : activeThread.participants.patientName}</h4>
                  <span className="chat-status online">Online</span>
                </div>
                <div className="chat-header-actions">
                  <button className="btn-icon"><Phone size={18} /></button>
                  <button className="btn-icon"><Video size={18} /></button>
                  <button className="btn-icon"><MoreVertical size={18} /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {threadMessages.map(msg => (
                  <div key={msg.id} className={`chat-message ${msg.senderId === user?.uid ? 'sent' : 'received'}`}>
                    <div className="message-bubble">
                      <p>{msg.content}</p>
                      <div className="message-meta">
                        <span className="message-time">{formatTime(msg.createdAt)}</span>
                        {msg.senderId === user?.uid && (
                          msg.read
                            ? <CheckCheck size={14} style={{ color: 'var(--primary-400)' }} />
                            : <Clock size={14} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="chat-input-area">
                <button className="btn-icon"><Paperclip size={20} /></button>
                <button className="btn-icon"><Image size={20} /></button>
                <div className="chat-input-wrapper">
                  <input
                    type="text"
                    className="form-input chat-input"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    id="message-input"
                  />
                </div>
                <button className="btn btn-primary btn-icon send-btn" onClick={handleSend} id="send-message">
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ height: '100%' }}>
              <MessageSquare size={64} />
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;
