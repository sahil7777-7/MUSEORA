import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, HelpCircle } from 'lucide-react';
import { AI_CURATOR_KNOWLEDGE } from '../../data/museumData';
import { museumAudio } from '../../utils/audio';

export default function CuratorChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'curator',
      text: AI_CURATOR_KNOWLEDGE.welcome,
      timestamp: 'NOW'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (queryText) => {
    const textToUse = queryText || input;
    if (!textToUse.trim()) return;

    museumAudio.playClickSound();

    const newMsg = { sender: 'user', text: textToUse, timestamp: 'NOW' };
    setMessages((prev) => [...prev, newMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let matchResponse = "That is an intriguing question. MUSEORA's curatorial archives document that every masterpiece reflects the technological boundaries and spiritual philosophies of its era. Feel free to ask specifically about Rodin, Chola bronzes, Leonardo da Vinci, or our 3D tour!";

      const qLower = textToUse.toLowerCase();
      if (qLower.includes('thinker') || qLower.includes('rodin')) {
        matchResponse = AI_CURATOR_KNOWLEDGE.responses.thinker;
      } else if (qLower.includes('chola') || qLower.includes('bronze') || qLower.includes('nataraja') || qLower.includes('india')) {
        matchResponse = AI_CURATOR_KNOWLEDGE.responses.chola;
      } else if (qLower.includes('mona') || qLower.includes('lisa') || qLower.includes('sfumato') || qLower.includes('da vinci')) {
        matchResponse = AI_CURATOR_KNOWLEDGE.responses['mona lisa'];
      } else if (qLower.includes('wave') || qLower.includes('hokusai') || qLower.includes('japan')) {
        matchResponse = AI_CURATOR_KNOWLEDGE.responses['great wave'];
      } else if (qLower.includes('tour') || qLower.includes('navigate') || qLower.includes('map') || qLower.includes('3d')) {
        matchResponse = AI_CURATOR_KNOWLEDGE.responses.tour;
      }

      setIsTyping(false);

      // Create empty message placeholder
      setMessages((prev) => [
        ...prev,
        { sender: 'curator', text: '', timestamp: 'NOW' }
      ]);

      let currentText = "";
      let charIndex = 0;
      const interval = setInterval(() => {
        currentText += matchResponse.charAt(charIndex);
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.sender === 'curator') {
            lastMsg.text = currentText;
          }
          return updated;
        });

        charIndex++;
        if (charIndex >= matchResponse.length) {
          clearInterval(interval);
        }
      }, 10);
    }, 900);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '480px',
            zIndex: 9990,
            backgroundColor: 'rgba(21, 19, 15, 0.94)',
            backdropFilter: 'blur(24px)',
            borderLeft: '1px solid rgba(198, 165, 107, 0.35)',
            boxShadow: '-20px 0 50px rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(232, 224, 208, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(29, 26, 21, 0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(198, 165, 107, 0.2)',
                  border: '1px solid var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulseGlow 3s ease-in-out infinite',
                }}
              >
                <Sparkles style={{ width: '18px', height: '18px', color: 'var(--gold)' }} />
              </div>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '0.1em' }}>
                  SENIOR VIRTUAL CURATOR
                </h3>
                <span className="font-mono text-gold-pure" style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}>
                  AURA AI — ONLINE
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                museumAudio.playClickSound();
                onClose && onClose();
              }}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}
              data-cursor="click"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8rem' }}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: '0.75rem', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
              >
                {msg.sender === 'curator' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(198, 165, 107, 0.2)', border: '1px solid rgba(198, 165, 107, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot style={{ width: '14px', height: '14px', color: 'var(--gold)' }} />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '1rem',
                    borderRadius: '12px',
                    backgroundColor: msg.sender === 'user' ? 'var(--gold)' : 'var(--bg-panel)',
                    color: msg.sender === 'user' ? 'var(--bg-primary)' : 'var(--cream)',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(232, 224, 208, 0.12)',
                    fontWeight: msg.sender === 'user' ? 600 : 300,
                    lineHeight: 1.6,
                  }}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(232, 224, 208, 0.2)', border: '1px solid rgba(232, 224, 208, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User style={{ width: '14px', height: '14px', color: 'var(--cream)' }} />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                <Sparkles style={{ width: '14px', height: '14px', color: 'var(--gold)', animation: 'spinSlow 2s linear infinite' }} />
                <span>Curator is searching archives...</span>
              </div>
            )}
          </div>

          {/* Suggested Inquiries */}
          <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid rgba(232, 224, 208, 0.1)', backgroundColor: 'rgba(11, 10, 8, 0.6)' }}>
            <div className="font-mono text-gold-pure" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
              <HelpCircle style={{ width: '12px', height: '12px' }} />
              <span>SUGGESTED INQUIRIES</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }} className="no-scrollbar">
              {AI_CURATOR_KNOWLEDGE.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  onMouseEnter={() => museumAudio.playHoverSound()}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--bg-panel)',
                    border: '1px solid rgba(232, 224, 208, 0.15)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  data-cursor="click"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div style={{ padding: '1rem', borderTop: '1px solid rgba(232, 224, 208, 0.1)', backgroundColor: 'var(--bg-panel)' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the Curator about works, eras, or 3D navigation..."
                className="input-museo"
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                onMouseEnter={() => museumAudio.playHoverSound()}
                style={{
                  padding: '0.65rem 1rem',
                  backgroundColor: 'var(--gold)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                data-cursor="click"
              >
                <Send style={{ width: '16px', height: '16px' }} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
