const MENTION_PATTERN = /@\[([0-9a-f-]{36})\]/gi;

export function formatMention(employeeId: string, name: string) {
  return `@[${employeeId}]${name}`;
}

export function extractMentionIds(content: string) {
  const ids = new Set<string>();
  let match: RegExpExecArray | null;
  const pattern = new RegExp(MENTION_PATTERN.source, "gi");
  while ((match = pattern.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return Array.from(ids);
}

export function renderMentionContent(
  content: string,
  nameById: Record<string, string>,
) {
  return content.replace(
    /@\[([0-9a-f-]{36})\]([^\s@]*)/gi,
    (_, id: string, name: string) => {
      const display = nameById[id] ?? name ?? "member";
      return `@${display}`;
    },
  );
}
