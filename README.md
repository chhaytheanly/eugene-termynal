# Eugene Termynal (Terminal Portfolio)

A lightweight, React + TypeScript port of a terminal-like UI (Termynal).

This repository provides a small interactive terminal component and a collection of example commands and data used to showcase a personal site-style terminal. It is intended for embedding a styled terminal UI into a web page and customizing commands and content.

**How it looks like**

![demo](/public/image.png)

**Features**

- Simple, keyboard-driven terminal UI
- Predefined commands (about, contact, projects, help, etc.)
- Easy to extend with custom commands and data
- Built with Vite, React, and TypeScript

**Quick Start**

- Install dependencies:

  ```bash
  npm install
  ```

- Start development server:

  ```bash
  npm run dev
  ```

- Open http://localhost:5173 in your browser (Vite default).

**Build**

```bash
npm run build
npm run preview
```

**Usage / Integration**

- The terminal component lives at [src/components/ui/terminal.tsx](src/components/ui/terminal.tsx).
- The terminal's styling and small helpers are in [src/components/ui/style.tsx](src/components/ui/style.tsx).
- Commands are implemented under [src/core/commands](src/core/commands) — add new command modules exporting the same shape to extend functionality.
- Core logic for executing commands and managing history is in [src/core/engine.ts](src/core/engine.ts) and [src/core/history.ts](src/core/history.ts).

To add a command:

1. Create a new file in [src/core/commands](src/core/commands) exporting a command handler.
2. Export it from [src/core/commands/index.ts](src/core/commands/index.ts) so it becomes available to the engine.

**Project Structure**

- [src/components/ui](src/components/ui): UI components and terminal wrapper
- [src/core](src/core): Terminal engine, history, and command implementations
- [src/data](src/data): Example data and content displayed by commands
- [public/ascii.txt](public/ascii.txt): Optional ASCII art used by the greeting

**Customization**

- Replace or extend the command handlers to change responses and behavior.
- Swap or extend the `profile`, `projects`, and `contact` data under [src/data](src/data) to reflect your content.
- Styling can be adjusted in [src/components/ui/style.tsx](src/components/ui/style.tsx) and `index.css`.

**Development Notes**

- The app uses Vite for fast development and HMR. TypeScript configuration is in `tsconfig.json` and `tsconfig.app.json`.
- Tests are not included in this port; consider adding a small test harness if you need CI checks.

**Contributing**

- Contributions are welcome. Please open issues for bugs or feature requests, and submit PRs with focused changes.

**License**

- Check `package.json` for the license field. If absent, please contact the maintainer.

---

Made with love by Me ❤️💕
