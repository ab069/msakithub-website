import { useEffect, useRef, useState } from 'react';
import ProjectBriefModal from './ProjectBriefModal.jsx';

const GREETING =
  "Hi! 👋 I'm the MSAK Assistant. Tell me about a project you have in mind — a website, an app, custom software — and I'll turn it into a full project brief you can edit and send to our team. Once you've described it, just hit “Create my project brief” anytime.";

const SUGGESTIONS = [
  'I need a website for my business',
  'Build a mobile app',
  'I have a custom software idea',
  'What services do you offer?',
];

// Fire-and-forget prewarm so the serverless function is initialized before
// the visitor's first message. Ignored on failure.
let warmedAt = 0
function prewarmApis() {
  const now = Date.now()
  if (now - warmedAt < 4 * 60 * 1000) return // Vercel functions stay warm ~5 min
  warmedAt = now
  try {
    fetch('/api/chat?warmup=1', { method: 'GET', keepalive: true }).catch(() => {})
    fetch('/api/draft?warmup=1', { method: 'GET', keepalive: true }).catch(() => {})
  } catch {}
}

// One conversational turn. Streams the reply via NDJSON and calls
// `onDelta(text)` with each chunk as it arrives. Resolves to
// { reply, readyToDraft } once the stream ends.
async function sendChat(messages, onDelta) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let reply = '';
  let readyToDraft = false;
  let streamError = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      let evt;
      try { evt = JSON.parse(line); } catch { continue; }
      if (evt.chunk) {
        reply += evt.chunk;
        onDelta?.(evt.chunk);
      } else if (evt.done) {
        readyToDraft = Boolean(evt.readyToDraft);
      } else if (evt.error) {
        streamError = evt.error;
      }
    }
  }

  if (streamError) throw new Error(streamError);
  return { reply: reply.trim(), readyToDraft };
}

// Turns the whole conversation into a structured project brief.
async function generateBrief(messages) {
  const res = await fetch('/api/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data.draft;
}

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M12 2l2.35 6.5L21 10.8l-6.65 2.3L12 20l-2.35-6.9L3 10.8l6.65-2.3z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="22" height="22">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  // chatting | thinking | drafting | done
  const [status, setStatus] = useState('chatting');
  const [draft, setDraft] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const busy = status === 'thinking' || status === 'drafting';

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status, open]);

  useEffect(() => {
    if (open) {
      prewarmApis();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  // Also prewarm as soon as the user hovers or focuses the launcher button —
  // by the time the panel opens, the function is often already ready.
  useEffect(() => {
    const launcher = document.querySelector('.msak-chat-launcher, .msak-chat-pill');
    if (!launcher) return;
    const warm = () => prewarmApis();
    launcher.addEventListener('pointerenter', warm, { once: false, passive: true });
    launcher.addEventListener('focus', warm, { once: false });
    return () => {
      launcher.removeEventListener('pointerenter', warm);
      launcher.removeEventListener('focus', warm);
    };
  }, []);

  async function buildBrief(convo) {
    if (status === 'drafting') return;
    setStatus('drafting');
    try {
      const result = await generateBrief(convo);
      setDraft(result);
      setStatus('done');
      setModalOpen(true);
      setMessages((m) => [
        ...m,
        { role: 'bot', text: '✅ Your project brief is ready — opening it now. Review, edit anything, then send it to our team.' },
      ]);
    } catch (err) {
      setStatus('chatting');
      setMessages((m) => [
        ...m,
        { role: 'bot', text: `⚠️ I couldn't build the brief: ${err.message}. You can also reach us at info@msakithub.com.` },
      ]);
    }
  }

  async function send(text) {
    const value = (text ?? input).trim();
    if (!value || busy || status === 'done') return;

    const convo = [...messages, { role: 'user', text: value }];
    setMessages(convo);
    setInput('');
    setStatus('thinking');

    // Placeholder bot bubble that grows as tokens stream in.
    let botStarted = false;
    let streamed = '';
    const startBotBubble = () => {
      botStarted = true;
      setStatus('chatting');
      setMessages((m) => [...m, { role: 'bot', text: '' }]);
    };
    const appendToBot = (delta) => {
      streamed += delta;
      setMessages((m) => {
        const copy = m.slice();
        const last = copy[copy.length - 1];
        if (last && last.role === 'bot') copy[copy.length - 1] = { role: 'bot', text: streamed };
        return copy;
      });
    };

    try {
      const { reply, readyToDraft } = await sendChat(convo, (delta) => {
        if (!botStarted) startBotBubble();
        appendToBot(delta);
      });
      // Safety net: if we somehow got no visible reply, show a warm default
      // so the visitor never sees an empty bubble.
      const finalReply = (streamed || reply || '').trim() ||
        "Hey! 👋 Tell me a bit about what you'd like to build — a website, an app, or something custom?";
      if (!botStarted) startBotBubble();
      const withReply = [...convo, { role: 'bot', text: finalReply }];
      setMessages(withReply);
      if (readyToDraft) {
        await buildBrief(withReply);
      } else {
        setStatus('chatting');
      }
    } catch (err) {
      setStatus('chatting');
      setMessages([
        ...convo,
        { role: 'bot', text: `⚠️ Sorry, something went wrong: ${err.message}. You can also reach us at info@msakithub.com.` },
      ]);
    }
  }

  function restart() {
    setMessages([{ role: 'bot', text: GREETING }]);
    setInput('');
    setStatus('chatting');
    setDraft(null);
    setModalOpen(false);
  }

  const showSuggestions = messages.length === 1 && status === 'chatting';

  return (
    <div className="msak-chat">
      {/* Launcher dock */}
      <div className={`msak-chat-dock ${open ? 'is-open' : ''}`}>
        {!open && <button className="msak-chat-pill" onClick={() => setOpen(true)}>Start a project</button>}
        <button className="msak-chat-launcher" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close chat' : 'Open chat'}>
          {!open && <span className="msak-chat-ring" />}
          {open ? <CloseIcon /> : <SparkleIcon />}
        </button>
      </div>

      {/* Panel */}
      <div className={`msak-chat-panel ${open ? 'open' : ''}`} role="dialog" aria-label="MSAK Assistant chat">
        <header className="msak-chat-head">
          <span className="msak-chat-head-icon"><SparkleIcon /></span>
          <div className="msak-chat-head-id">
            <p className="msak-chat-head-name">MSAK Assistant</p>
            <p className="msak-chat-head-sub"><span className="msak-chat-online" /> Online · builds your project brief</p>
          </div>
          <button className="msak-chat-head-close" onClick={() => setOpen(false)} aria-label="Close chat"><CloseIcon /></button>
        </header>

        <div className="msak-chat-body" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msak-msg ${m.role}`}>
              {m.role === 'bot' && <span className="msak-msg-av"><SparkleIcon /></span>}
              <div className="msak-msg-bubble">{m.text}</div>
            </div>
          ))}

          {status === 'thinking' && (
            <div className="msak-msg bot">
              <span className="msak-msg-av"><SparkleIcon /></span>
              <div className="msak-msg-bubble msak-typing"><span /><span /><span /></div>
            </div>
          )}
          {status === 'drafting' && (
            <div className="msak-msg bot">
              <span className="msak-msg-av"><SparkleIcon /></span>
              <div className="msak-msg-bubble msak-typing-label">Building your project brief<span className="msak-dots"><span /><span /><span /></span></div>
            </div>
          )}

          {showSuggestions && (
            <div className="msak-chat-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          {status === 'done' && (
            <div className="msak-chat-done">
              <button className="msak-chat-reopen" onClick={() => setModalOpen(true)}>Open project brief</button>
              <button className="msak-chat-restart" onClick={restart}>Start a new chat</button>
            </div>
          )}
        </div>

        {status === 'chatting' && messages.some((m) => m.role === 'user') && (
          <button className="msak-chat-cta" onClick={() => buildBrief(messages)}>
            <SparkleIcon /> Create my project brief
          </button>
        )}

        <form
          className="msak-chat-composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              status === 'done'
                ? 'Brief ready — start a new chat to begin again'
                : busy
                  ? 'One moment…'
                  : 'Describe your project, or ask a question…'
            }
            disabled={busy || status === 'done'}
          />
          <button type="submit" disabled={!input.trim() || busy || status === 'done'} aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
        <p className="msak-chat-foot">Powered by MSAK IT Hub · <a href="mailto:info@msakithub.com">info@msakithub.com</a></p>
      </div>

      {modalOpen && draft && (
        <ProjectBriefModal draft={draft} onSave={setDraft} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
