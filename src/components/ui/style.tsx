import { useEffect, useRef, useState, useCallback } from "react";

// ─── Command Engine ────────────────────────────────────────────────────────────
const COMMANDS: Record<string, () => string> = {
  help: () => `
  ┌─────────────────────────────────────────────────────┐
  │                  Available Commands                  │
  └─────────────────────────────────────────────────────┘

   about        →  Who am I
   education    →  Academic background
   skills       →  Tech stack & expertise
   experience   →  Work history
   projects     →  Notable projects
   contact      →  Reach me
   whoami       →  Quick identity check
   date         →  Current date & time
   clear        →  Clear the terminal
   help         →  Show this message

  Tip: Use ↑ ↓ to navigate history · Tab to autocomplete
`,
  about: () => `
  ┌─────────────────────────────────────────────────────┐
  │                      About Me                        │
  └─────────────────────────────────────────────────────┘

   Name       LY Chhaythean (Eugene)
   Role       AI & Data Science Enthusiast
   Based      Phnom Penh, Cambodia 🇰🇭
   Status     Open to opportunities ✅

   I'm passionate about building intelligent systems that 
   bridge the gap between cutting-edge AI research and 
   real-world applications. I love clean code, clean data, 
   and clean terminal setups.
`,
  education: () => `
  ┌─────────────────────────────────────────────────────┐
  │                     Education                        │
  └─────────────────────────────────────────────────────┘

   🎓  B.Sc. Artificial Intelligence & Data Science
       Royal University of Phnom Penh
       2021 – 2025 · GPA: 3.8 / 4.0

   📚  Relevant Coursework
       · Machine Learning & Deep Learning
       · Natural Language Processing
       · Data Engineering & Pipelines
       · Statistical Modeling & Analysis
       · Computer Vision
`,
  skills: () => `
  ┌─────────────────────────────────────────────────────┐
  │                    Tech Stack                        │
  └─────────────────────────────────────────────────────┘

   Languages     Python · TypeScript · SQL · Bash · R
   ML / AI       PyTorch · TensorFlow · scikit-learn · HuggingFace
   Data          Pandas · Spark · dbt · Airflow · Kafka
   Backend       FastAPI · Node.js · PostgreSQL · Redis
   Frontend      React · Next.js · Tailwind CSS
   Cloud         AWS · GCP · Docker · Kubernetes
   Tools         Git · Vim · tmux · Jupyter · VS Code
`,
  experience: () => `
  ┌─────────────────────────────────────────────────────┐
  │                    Experience                        │
  └─────────────────────────────────────────────────────┘

   🏢  AI Engineer Intern · TechCambodia Ltd
       Jun 2024 – Present
       · Built NLP pipeline for Khmer text classification
       · Reduced model inference latency by 40%
       · Deployed ML models via FastAPI on AWS ECS

   🏢  Data Analyst Intern · FinanceKH
       Jan 2024 – May 2024
       · Designed ETL pipelines processing 2M+ records/day
       · Built executive dashboards in Metabase
       · Wrote complex SQL queries for financial reporting
`,
  projects: () => `
  ┌─────────────────────────────────────────────────────┐
  │                     Projects                        │
  └─────────────────────────────────────────────────────┘

   ⚡  KhmerLLM — Fine-tuned LLaMA-2 on Khmer corpus
       · 87% accuracy on downstream classification tasks
       · github.com/eugene/khmerllm

   📊  DataPipeline OS — Scalable Airflow orchestration
       · Handles 5M+ daily events, < 1s SLA breaches
       · github.com/eugene/datapipeline-os

   🎨  This Terminal — Interactive portfolio
       · React · TypeScript · Custom command engine
       · github.com/eugene/terminal-portfolio
`,
  contact: () => `
  ┌─────────────────────────────────────────────────────┐
  │                      Contact                         │
  └─────────────────────────────────────────────────────┘

   📧  Email      eugene.ly@email.com
   🐙  GitHub     github.com/eugene-ly
   💼  LinkedIn   linkedin.com/in/eugene-ly
   𝕏   Twitter    @eugenelydev
   🌐  Website    eugene.dev

   Available for freelance, internships & full-time roles.
   Response time: < 24 hours.
`,
  whoami: () => `  eugene — AI & Data Science Enthusiast · Phnom Penh, KH`,
  date: () =>
    `  ${new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    })}`,
};

const COMMAND_LIST = [...Object.keys(COMMANDS), "clear"];

const runCommand = (cmd: string): string => {
  const trimmed = cmd.trim().toLowerCase();
  if (trimmed === "clear") return "__CLEAR__";
  if (COMMANDS[trimmed]) return COMMANDS[trimmed]();
  return `  zsh: command not found: ${cmd}\n  Type "help" to see available commands.`;
};

// ─── ASCII Banner ──────────────────────────────────────────────────────────────
const BANNER = `
   ███████╗██╗   ██╗ ██████╗ ███████╗███╗   ██╗███████╗
   ██╔════╝██║   ██║██╔════╝ ██╔════╝████╗  ██║██╔════╝
   █████╗  ██║   ██║██║  ███╗█████╗  ██╔██╗ ██║█████╗  
   ██╔══╝  ██║   ██║██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  
   ███████╗╚██████╔╝╚██████╔╝███████╗██║ ╚████║███████╗
   ╚══════╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝

   LY Chhaythean  ·  AI & Data Science Enthusiast
   ────────────────────────────────────────────────
   Type "help" for commands  ·  Tab to autocomplete
`;

// ─── Types ─────────────────────────────────────────────────────────────────────
interface HistoryItem {
  id: number;
  input: string;
  output: string;
  isError?: boolean;
}

// ─── Prompt Component ──────────────────────────────────────────────────────────
function Prompt({ dim = false }: { dim?: boolean }) {
  return (
    <span className="flex items-center gap-0 select-none shrink-0">
      <span
        style={{ color: dim ? "#6c7086" : "#cba6f7" }}
        className="font-bold"
      >
        eugene
      </span>
      <span style={{ color: dim ? "#45475a" : "#6c7086" }}>@</span>
      <span
        style={{ color: dim ? "#585b70" : "#89b4fa" }}
        className="font-bold"
      >
        portfolio
      </span>
      <span style={{ color: dim ? "#45475a" : "#6c7086" }}> </span>
      {/* Git branch segment */}
      <span
        style={{
          background: dim ? "#313244" : "#89dceb22",
          color: dim ? "#585b70" : "#89dceb",
          borderRadius: "3px",
          padding: "0 5px",
          fontSize: "0.8em",
          border: `1px solid ${dim ? "#45475a33" : "#89dceb44"}`,
          marginRight: "4px",
        }}
      >
        {" "}
        main
      </span>
      {/* Arrow */}
      <span
        style={{ color: dim ? "#45475a" : "#a6e3a1" }}
        className="font-bold mr-1"
      >
        ❯
      </span>
    </span>
  );
}

// ─── Main Terminal ─────────────────────────────────────────────────────────────
export default function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 0, input: "", output: BANNER },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIdx, setSuggestionIdx] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const [bootDone, setBootDone] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(1);

  // Boot animation
  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, suggestions]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Tab autocomplete
      if (e.key === "Tab") {
        e.preventDefault();
        const q = input.toLowerCase().trim();
        if (!q) return;
        const matches = COMMAND_LIST.filter((c) => c.startsWith(q));
        if (matches.length === 0) return;
        if (matches.length === 1) {
          setInput(matches[0]);
          setSuggestions([]);
          return;
        }
        // Cycle through suggestions
        const nextIdx = (suggestionIdx + 1) % matches.length;
        setSuggestionIdx(nextIdx);
        setInput(matches[nextIdx]);
        setSuggestions(matches);
        return;
      }

      // Reset suggestion cycling on non-tab key
      if (e.key !== "Tab") {
        setSuggestionIdx(-1);
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
          setSuggestions([]);
        }
      }

      // Arrow up: history
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!cmdHistory.length) return;
        const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
        setHistoryIdx(newIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
        return;
      }

      // Arrow down: history
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIdx <= 0) {
          setHistoryIdx(-1);
          setInput("");
          return;
        }
        const newIdx = historyIdx - 1;
        setHistoryIdx(newIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
        return;
      }

      // Ctrl+C
      if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        const id = idCounter.current++;
        setHistory((h) => [...h, { id, input: "^C", output: "" }]);
        setInput("");
        setSuggestions([]);
        return;
      }

      // Ctrl+L = clear
      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setHistory([]);
        setInput("");
        setSuggestions([]);
        return;
      }

      // Enter
      if (e.key === "Enter") {
        const trimmed = input.trim();
        if (!trimmed) {
          const id = idCounter.current++;
          setHistory((h) => [...h, { id, input: "", output: "" }]);
          return;
        }

        const output = runCommand(trimmed);
        setCmdHistory((h) => [...h, trimmed]);
        setHistoryIdx(-1);
        setSuggestions([]);

        if (output === "__CLEAR__") {
          setHistory([]);
          setInput("");
          return;
        }

        const id = idCounter.current++;
        const isError = output.includes("command not found");
        setHistory((h) => [...h, { id, input: trimmed, output, isError }]);
        setInput("");
      }
    },
    [input, cmdHistory, historyIdx, suggestionIdx],
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .term-root {
          min-height: 100vh;
          width: 100%;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          position: relative;
          overflow: hidden;
        }

        /* Background noise texture */
        .term-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        .term-glow-1 {
          position: absolute;
          width: 700px; height: 700px;
          background: radial-gradient(circle, #89b4fa18 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-60%, -50%);
          pointer-events: none;
        }
        .term-glow-2 {
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, #cba6f712 0%, transparent 70%);
          top: 20%; right: 10%;
          pointer-events: none;
        }
        .term-glow-3 {
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, #a6e3a10a 0%, transparent 70%);
          bottom: 10%; left: 15%;
          pointer-events: none;
        }

        .term-window {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 900px;
          height: 88vh;
          max-height: 780px;
          display: flex;
          flex-direction: column;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #313244;
          box-shadow:
            0 0 0 1px #18182233,
            0 30px 80px -10px #000000cc,
            0 0 60px -20px #89b4fa22,
            inset 0 1px 0 #ffffff08;
          opacity: ${bootDone ? 1 : 0};
          transform: ${bootDone ? "scale(1) translateY(0)" : "scale(0.97) translateY(8px)"};
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* ── Title Bar ── */
        .term-titlebar {
          background: #1e1e2e;
          border-bottom: 1px solid #313244;
          padding: 11px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          user-select: none;
          flex-shrink: 0;
        }

        .term-dots {
          display: flex;
          gap: 7px;
          align-items: center;
        }

        .term-dot {
          width: 13px; height: 13px;
          border-radius: 50%;
          cursor: pointer;
          transition: filter 0.15s;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px;
          font-weight: 800;
          color: transparent;
          overflow: hidden;
        }
        .term-dot:hover { filter: brightness(1.2); color: rgba(0,0,0,0.6); }
        .term-dot.red { background: #f38ba8; box-shadow: 0 0 8px #f38ba840; }
        .term-dot.yellow { background: #f9e2af; box-shadow: 0 0 8px #f9e2af40; }
        .term-dot.green { background: #a6e3a1; box-shadow: 0 0 8px #a6e3a140; }

        .term-title {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          color: #6c7086;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .term-title-name {
          background: linear-gradient(90deg, #89b4fa, #cba6f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
          font-size: 12px;
        }
        .term-title-shell {
          color: #45475a;
        }

        .term-tabs {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .term-tab-pill {
          padding: 2px 10px;
          border-radius: 5px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .term-tab-pill.active {
          background: #313244;
          color: #cdd6f4;
          border: 1px solid #45475a55;
        }
        .term-tab-pill.inactive {
          background: transparent;
          color: #585b70;
          border: 1px solid transparent;
        }
        .term-tab-pill.inactive:hover {
          color: #a6adc8;
          border-color: #45475a44;
        }

        /* ── Content ── */
        .term-content {
          flex: 1;
          background: #181825;
          overflow-y: auto;
          padding: 18px 22px;
          position: relative;
          cursor: text;
        }
        .term-content::-webkit-scrollbar { width: 8px; }
        .term-content::-webkit-scrollbar-track { background: #13131d; }
        .term-content::-webkit-scrollbar-thumb {
          background: #313244;
          border-radius: 4px;
          border: 2px solid #181825;
        }
        .term-content::-webkit-scrollbar-thumb:hover { background: #45475a; }

        /* Scanlines */
        .term-content::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        .term-inner {
          position: relative;
          z-index: 1;
          min-height: 100%;
        }

        /* ── History items ── */
        .hist-item {
          margin-bottom: 2px;
          animation: termFadeIn 0.18s ease-out forwards;
        }
        @keyframes termFadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hist-prompt-row {
          display: flex;
          align-items: center;
          gap: 0;
          flex-wrap: wrap;
          line-height: 1.6;
          margin-bottom: 2px;
        }

        .hist-output {
          padding: 2px 0 10px 0;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.65;
          font-size: 13.5px;
          letter-spacing: 0.01em;
        }
        .hist-output.normal { color: #bac2de; }
        .hist-output.error { color: #f38ba8; }

        /* Input row */
        .input-row {
          display: flex;
          align-items: center;
          gap: 0;
          flex-wrap: nowrap;
          margin-top: 4px;
          line-height: 1.6;
        }
        .input-field-wrap {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #cdd6f4;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 500;
          caret-color: transparent; /* We render our own cursor */
          letter-spacing: 0.01em;
        }
        .input-field::selection { background: #45475a; color: #cdd6f4; }

        /* Custom blinking block cursor */
        .custom-cursor {
          display: inline-block;
          width: 9px;
          height: 1.15em;
          background: #cba6f7;
          vertical-align: text-bottom;
          margin-left: 1px;
          border-radius: 1px;
          box-shadow: 0 0 8px #cba6f799;
          transition: opacity 0.1s;
          flex-shrink: 0;
        }
        .custom-cursor.blink-off { opacity: 0; }
        .custom-cursor.unfocused {
          background: transparent;
          border: 2px solid #6c7086;
          box-shadow: none;
        }

        /* ── Suggestions ── */
        .suggestions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 6px 0 6px 0;
          padding-left: 4px;
          animation: termFadeIn 0.15s ease-out forwards;
        }
        .suggestion-chip {
          padding: 2px 10px;
          border-radius: 4px;
          font-size: 12px;
          border: 1px solid #45475a;
          background: #313244;
          color: #89b4fa;
          transition: all 0.12s;
          cursor: pointer;
        }
        .suggestion-chip:hover {
          background: #45475a;
          color: #cdd6f4;
          border-color: #585b70;
        }
        .suggestion-chip.active-sug {
          background: #45475a;
          color: #cba6f7;
          border-color: #cba6f7aa;
        }

        /* ── Status Bar ── */
        .term-statusbar {
          background: #1e1e2e;
          border-top: 1px solid #313244;
          padding: 5px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: #585b70;
          user-select: none;
          flex-shrink: 0;
          letter-spacing: 0.03em;
        }
        .status-left, .status-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 1px 8px;
          border-radius: 3px;
        }
        .status-badge.mode {
          background: #a6e3a122;
          color: #a6e3a1;
          border: 1px solid #a6e3a133;
        }
        .status-badge.branch {
          background: #cba6f718;
          color: #cba6f7;
          border: 1px solid #cba6f733;
        }
        .status-badge.ok {
          background: #89b4fa18;
          color: #89b4fa;
          border: 1px solid #89b4fa33;
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 6px currentColor;
        }
        .status-divider {
          color: #313244;
        }

        /* ── Utility ── */
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        pre { margin: 0; font-family: inherit; }

        @media (max-width: 600px) {
          .term-root { padding: 0; }
          .term-window {
            border-radius: 0;
            height: 100vh;
            max-height: none;
            border: none;
          }
          .term-title { display: none; }
        }
      `}</style>

      <div className="term-root" onClick={() => inputRef.current?.focus()}>
        {/* Ambient glows */}
        <div className="term-glow-1" />
        <div className="term-glow-2" />
        <div className="term-glow-3" />

        <div className="term-window">
          {/* ── Title Bar ── */}
          <div className="term-titlebar">
            <div className="term-dots">
              <div className="term-dot red">✕</div>
              <div className="term-dot yellow">−</div>
              <div className="term-dot green">+</div>
            </div>

            <div className="term-title">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#89b4fa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span className="term-title-name">eugene@portfolio</span>
              <span className="term-title-shell">— zsh</span>
            </div>

            <div className="term-tabs">
              <div className="term-tab-pill active">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                zsh
              </div>
              <div className="term-tab-pill inactive">+</div>
            </div>
          </div>

          {/* ── Terminal Content ── */}
          <div
            className="term-content"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="term-inner">
              {/* History */}
              {history.map((item, i) => (
                <div key={item.id} className="hist-item">
                  {item.input && (
                    <div className="hist-prompt-row">
                      <Prompt dim />
                      <span
                        style={{
                          color: item.isError ? "#f38ba8" : "#cdd6f4",
                          fontWeight: 500,
                          fontSize: "14px",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {item.input}
                      </span>
                    </div>
                  )}
                  {item.output && (
                    <pre
                      className={`hist-output ${item.isError ? "error" : "normal"}`}
                    >
                      {item.output}
                    </pre>
                  )}
                </div>
              ))}

              {/* Autocomplete suggestions */}
              {suggestions.length > 1 && (
                <div className="suggestions-row">
                  {suggestions.map((s, i) => (
                    <span
                      key={s}
                      className={`suggestion-chip ${i === suggestionIdx ? "active-sug" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setInput(s);
                        setSuggestions([]);
                        inputRef.current?.focus();
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Active input line */}
              <div className="input-row">
                <Prompt />
                <div className="input-field-wrap">
                  {/* Invisible real input */}
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="input-field"
                    placeholder=""
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                  {/* Rendered text + cursor overlay */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      pointerEvents: "none",
                      color: "#cdd6f4",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "14px",
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                      whiteSpace: "pre",
                    }}
                  >
                    <span style={{ opacity: input ? 1 : 0 }}>{input}</span>
                    {!input && (
                      <span style={{ color: "#45475a", opacity: 0.6 }}>
                        Type a command...
                      </span>
                    )}
                  </div>
                </div>
                {/* Custom cursor rendered outside input */}
                <div
                  className={`custom-cursor ${!cursorVisible && isFocused ? "blink-off" : ""} ${!isFocused ? "unfocused" : ""}`}
                />
              </div>

              <div ref={bottomRef} style={{ height: 20 }} />
            </div>
          </div>

          {/* ── Status Bar ── */}
          <div className="term-statusbar">
            <div className="status-left">
              <span className="status-badge mode">
                <span className="status-dot" />
                NORMAL
              </span>
              <span className="status-badge branch">⎇ main</span>
              <span className="status-divider">|</span>
              <span>
                Ln {history.length} · Col {input.length + 1}
              </span>
            </div>
            <div className="status-right">
              <span className="status-badge ok">✓ zsh 5.9</span>
              <span className="status-divider">|</span>
              <span>UTF-8</span>
              <span className="status-divider">|</span>
              <LiveClock />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Live Clock ────────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );
  useEffect(() => {
    const t = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return <span>{time}</span>;
}
