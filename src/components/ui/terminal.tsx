import { useEffect, useRef, useState } from "react";
import { runCommand } from "../../core/engine";
import { commands } from "../../core/commands";

interface HistoryItem {
  input: string;
  output: string;
}

function Prompt({ dim = false }: { dim?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 select-none shrink-0">
      <span
        className={`font-semibold ${dim ? "text-zinc-600" : "text-purple-400"}`}
      >
        eugene
      </span>
      <span className={dim ? "text-zinc-700" : "text-zinc-500"}>@</span>
      <span
        className={`font-semibold ${dim ? "text-zinc-600" : "text-blue-400"}`}
      >
        portfolio
      </span>
      <span className={dim ? "text-zinc-700" : "text-zinc-600"}>:</span>
      <span
        className={`font-semibold ${dim ? "text-zinc-600" : "text-cyan-400"}`}
      >
        ~
      </span>
      <span className={`${dim ? "text-zinc-700" : "text-zinc-500"}`}>
        git:(
      </span>
      <span
        className={`font-semibold ${dim ? "text-zinc-600" : "text-emerald-400"}`}
      >
        main
      </span>
      <span className={`${dim ? "text-zinc-700" : "text-zinc-500"}`}>)</span>
      <span
        className={`ml-1 font-bold ${dim ? "text-zinc-600" : "text-pink-400"}`}
      >
        ❯
      </span>
    </span>
  );
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      input: "",
      output: runCommand("greeting"),
    },
  ]);

  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const commandNames = commands ? Object.keys(commands) : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex =
        historyIndex < commandHistory.length - 1
          ? historyIndex + 1
          : historyIndex;

      setHistoryIndex(newIndex);
      setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (!input.trim()) return;

      const matches = commandNames.filter((cmd) =>
        cmd.startsWith(input.toLowerCase()),
      );

      if (matches.length === 0) return;

      if (matches.length === 1) {
        setInput(matches[0] + " ");
        setSuggestions([]);
        return;
      }

      setSuggestions(matches);
      return;
    }

    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      setHistory((prev) => [...prev, { input: "^C", output: "" }]);
      setInput("");
      setSuggestions([]);
      return;
    }

    if (e.key === "Enter" && input.trim()) {
      const trimmed = input.trim();
      const output = runCommand(trimmed);

      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      if (output === "__CLEAR__") {
        setHistory([]);
        setInput("");
        setSuggestions([]);
        return;
      }

      setHistory((prev) => [...prev, { input: trimmed, output }]);
      setInput("");
      setSuggestions([]);
      return;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#09090f] via-[#0c0c14] to-[#070710] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-mono">
      {/* Ambient glow */}
      <div className="absolute w-[800px] h-[500px] bg-purple-500/[0.05] blur-[180px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Terminal Window */}
      <div className="relative z-10 w-full max-w-4xl h-[82vh] rounded-xl border border-zinc-800/70 flex flex-col overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_40px_120px_-20px_rgba(0,0,0,0.95),0_0_120px_-30px_rgba(139,92,246,0.25)] bg-[#11111b] backdrop-blur-md">
        {/* Title Bar */}
        <div className="bg-gradient-to-b from-zinc-900 to-[#0f0f14] px-4 py-2.5 flex items-center justify-between border-b border-zinc-800/70">
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110 transition" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-110 transition" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:brightness-110 transition" />
          </div>

          <div className="text-xs text-zinc-500 font-medium tracking-wider flex items-center gap-2">
            <span className="text-purple-400">eugene@portfolio</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-600">zsh</span>
          </div>

          <div className="w-16" />
        </div>

        {/* Terminal Content */}
        <div
          className="flex-1 bg-[#11111b] text-zinc-200 text-[14px] p-4 md:p-6 overflow-y-auto relative"
          onClick={() => inputRef.current?.focus()}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#313244 #11111b",
          }}
        >
          <div className="relative z-10">
            {history.map((item, index) => (
              <div
                key={index}
                className="mb-4 animate-[fadeIn_0.25s_ease-out_forwards]"
                style={{
                  opacity: 0,
                  animationDelay: `${Math.min(index * 30, 200)}ms`,
                }}
              >
                {item.input && (
                  <div className="flex gap-2 items-center mb-1">
                    <Prompt dim />
                    <span className="text-zinc-100 font-medium">
                      {item.input}
                    </span>
                  </div>
                )}

                <pre className="whitespace-pre-wrap pl-1 text-zinc-300 leading-[1.75] text-[13.5px] font-light tracking-wide overflow-x-auto">
                  {item.output}
                </pre>
              </div>
            ))}

            {suggestions.length > 0 && (
              <div className="ml-1 flex flex-wrap gap-2 mb-4 animate-[fadeIn_0.2s_ease-out]">
                {suggestions.map((cmd) => (
                  <span
                    key={cmd}
                    className="px-3 py-1 text-xs rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 cursor-pointer transition-all duration-200 font-medium tracking-wide"
                  >
                    {cmd}
                  </span>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2 items-center mt-3">
              <Prompt />

              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-zinc-100 caret-transparent font-medium tracking-wide placeholder:text-zinc-600"
                placeholder="Type a command..."
                spellCheck={false}
                autoComplete="off"
              />

              <span className="w-[9px] h-[18px] bg-gradient-to-b from-pink-400 to-purple-500 rounded-sm shadow-lg shadow-purple-500/40 animate-[blink_1s_steps(2,start)_infinite]" />
            </div>

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#0f0f14] px-4 py-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/70">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wide">
              READY
            </span>

            <span className="text-zinc-700">•</span>

            <span>
              Lines:{" "}
              <span className="text-purple-400 font-semibold">
                {history.length}
              </span>
            </span>

            <span className="text-zinc-700">•</span>

            <span className="text-emerald-400 font-semibold">main</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-600">
            ↑↓ History | Tab Autocomplete | Ctrl+C Cancel
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');

        *{
          font-family:'JetBrains Mono','Fira Code','Consolas',monospace;
          -webkit-font-smoothing:antialiased;
          -moz-osx-font-smoothing:grayscale;
          letter-spacing:0.01em;
        }

        @keyframes fadeIn{
          from{opacity:0;transform:translateY(6px)}
          to{opacity:1;transform:translateY(0)}
        }

        @keyframes blink{
          to{visibility:hidden}
        }

        .overflow-y-auto::-webkit-scrollbar{
          width:10px;
        }

        .overflow-y-auto::-webkit-scrollbar-track{
          background:#11111b;
          border-left:1px solid #313244;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb{
          background:#313244;
          border-radius:5px;
          border:2px solid #11111b;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover{
          background:#45475a;
        }
      `}</style>
    </div>
  );
}
