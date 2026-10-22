// Luogu accepts $$formula$$ on a single line as display math. remark-math
// expects the closing display fence on its own line. Normalize only the
// parser input; the archived and imported Markdown files remain unchanged.
export function normalizeDisplayMath(markdown) {
  let fence = null;
  let mathPrefix = null;
  return markdown.split('\n').map((line) => {
    const marker = line.match(/^\s*(?:>\s*)*(`{3,}|~{3,})/);
    if (marker) {
      const token = marker[1];
      if (!fence) fence = token;
      else if (token[0] === fence[0] && token.length >= fence.length) fence = null;
      return line;
    }
    if (fence) return line;
    const delimiter = line.match(/^(\s*(?:>\s*)*)\$\$\s*$/);
    if (delimiter) {
      mathPrefix = mathPrefix === null ? delimiter[1] : null;
      return line;
    }
    // A blank line without `>` in a quoted Luogu formula must stay in the
    // blockquote; otherwise its closing $$ starts an unrelated math block.
    if (mathPrefix?.includes('>') && !line.trim()) return mathPrefix.trimEnd();
    const display = line.match(/^(\s*(?:>\s*)*)\$\$(.+?)\$\$\s*$/);
    if (!display) return line;
    const [, prefix, formula] = display;
    return `${prefix}$$\n${prefix}${formula}\n${prefix}$$`;
  }).join('\n');
}

export default function remarkLuoguMath() {
  const processor = this;
  return (tree, file) => {
    const original = String(file);
    const normalized = normalizeDisplayMath(original);
    const result = normalized === original ? tree : processor.parse(normalized);
    const labels = [];
    const text = (node) => typeof node.value === 'string' ? node.value : (node.children || []).map(text).join('');
    const visit = (node) => {
      if (node.type === 'heading' && [2, 3].includes(node.depth)) labels.push(text(node));
      for (const child of node.children || []) visit(child);
    };
    visit(result);
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.tocLabels = labels;
    return result;
  };
}
