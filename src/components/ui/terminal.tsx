import { useEffect, useRef, useState } from "react";
import { runCommand } from "../../core/engine";

interface HistoryItem {
  input: string;
  output: string;
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      input: "",
      output: ` Welcome to my terminal portfolio!
I am LY Chhaythean, an AI and Data Science Enthusiast.
Type "help" to see available commands.
Type "about" to learn more about me.
Type "clear" to clear the terminal.
`,
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

  const commandNames = [
    "help",
    "about",
    "education",
    "skills",
    "experience",
    "contact",
    "clear",
  ];

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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-zinc-900 to-neutral-900 flex items-center justify-center p-4 md:p-8">
      {/* Terminal Window */}
      <div className="w-full max-w-4xl h-[85vh] flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-700/50 backdrop-blur-sm">
        {/* Title Bar */}
        <div className="bg-zinc-800/90 px-4 py-3 flex items-center justify-between border-b border-zinc-700/50">
          <div className="flex items-center gap-2">
            {/* Window Controls */}
            <div className="flex gap-2">
              <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors shadow-sm" />
              <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors shadow-sm" />
              <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors shadow-sm" />
            </div>
          </div>
          {/* Title */}
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">Eugene-Port</span>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Terminal Content */}
        <div
          className="flex-1 bg-zinc-950/95 text-zinc-200 font-mono text-sm p-4 overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700"
          onClick={() => inputRef.current?.focus()}
        >
          {/* History */}
          {history.map((item, index) => (
            <div key={index} className="mb-3 animate-fadeIn">
              {item.input && (
                <div className="flex gap-2 items-center">
                  <span className="text-emerald-400 font-bold">❯</span>
                  <span className="text-zinc-100">{item.input}</span>
                </div>
              )}
              <pre className="whitespace-pre-wrap pl-5 text-zinc-400 leading-relaxed mt-1">
                {item.output}
              </pre>
            </div>
          ))}

          {/* Suggestions (Tab autocomplete) */}
          {suggestions.length > 0 && (
            <div className="mb-2 ml-6 flex flex-wrap gap-4 text-blue-400 text-xs">
              {suggestions.map((cmd) => (
                <span key={cmd}>{cmd}</span>
              ))}
            </div>
          )}

          {/* Input Line */}
          <div className="flex gap-2 items-center group">
            <span className="text-emerald-400 font-bold group-focus-within:text-emerald-300 transition-colors">
              ❯
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-zinc-100 caret-emerald-400 placeholder-zinc-600"
              placeholder="Type a command..."
              spellCheck={false}
              autoComplete="off"
            />
            <span className="w-2 h-5 bg-emerald-400/80 animate-pulse rounded-sm" />
          </div>

          <div ref={bottomRef} />
        </div>

        {/* Status Bar */}
        <div className="bg-zinc-800/90 px-4 py-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-700/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Ready
            </span>
            <span>Lines: {history.length}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>↑↓ History</span>
            <span>Tab Autocomplete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
