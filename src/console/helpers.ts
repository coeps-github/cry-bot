export function extractCommandValues(commands: string[], command: string): string[] {
  const commandSplit = command.split(' ');
  const commandValues = commandSplit.slice(1);
  return commands.includes(commandSplit[0]) ? commandValues : [];
}
