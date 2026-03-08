export default {
  description: "Show help information",
  run: () => `
  ╔═══════════════════════════════════════════════════════════╗
  ║                   AVAILABLE COMMANDS                ║
  ╚═══════════════════════════════════════════════════════════╝

   📋  INFORMATION
   ────────────────────────────────────────────────────────────
   about         Show detailed information about me
   whoami        Quick identity check
   date          Display current date & time
   
   🎓  BACKGROUND
   ────────────────────────────────────────────────────────────
   education     Academic background & degrees
   skills        Technical skills & expertise
   experience    Professional work history
   
   💼  PORTFOLIO
   ────────────────────────────────────────────────────────────
   projects      Notable projects & achievements
   contact       Get in touch with me
   
   ⚙️  UTILITIES
   ────────────────────────────────────────────────────────────
   clear         Clear the terminal screen
   help          Show this help message
   
  ╔═══════════════════════════════════════════════════════════════╗
  ║  TIP: Use ↑ ↓ to navigate history · Tab to autocomplete  ║
  ╚═══════════════════════════════════════════════════════════════╝
`
}