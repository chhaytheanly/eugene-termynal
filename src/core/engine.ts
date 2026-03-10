import { commands } from "./commands";

/* 
     Simple Logic to run commands based on user input. 
    It checks if the command exists in the `commands` object and executes it, returning the output.
    If the command is not found, it returns a default message.
 */

export function runCommand(input: any) {
    const cmd = input.trim().toLowerCase();

    if (!cmd) return "";

    if (commands[cmd]) {
        return commands[cmd].run();
    }

    return `Command not found: ${cmd}
Type "help" to see available commands.`;
}
