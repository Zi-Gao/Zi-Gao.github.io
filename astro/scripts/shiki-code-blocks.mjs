const languageNames = {
  cpp: 'C++', cxx: 'C++', 'c++': 'C++', ac: 'C++',
  js: 'JavaScript', javascript: 'JavaScript',
  ts: 'TypeScript', typescript: 'TypeScript',
  py: 'Python', python: 'Python',
  sh: 'Shell', bash: 'Bash', shell: 'Shell',
  plaintext: '纯文本', text: '纯文本', txt: '纯文本',
};

function languageName(language = 'text') {
  return languageNames[language.toLowerCase()] || language;
}

export default {
  name: 'blog-code-blocks',
  tokens(lines) {
    // Keep the theme's comments readable on the tinted code surface.
    for (const line of lines) {
      for (const token of line) {
        if (token.color?.toLowerCase() === '#6e7781') token.color = '#626e7a';
      }
    }
  },
  pre(node) {
    if (node.tagName !== 'pre') return;
    // Let the shared code surface own its background instead of the syntax theme.
    node.properties.style = String(node.properties.style || '').replace(/background-color:[^;]+;?/g, '');
    node.properties['aria-label'] = `${languageName(this.options.lang)}代码，可横向滚动`;
  },
  root(node) {
    const pre = node.children.find((child) => child.type === 'element' && child.tagName === 'pre');
    if (!pre) return;
    node.children = [{
      type: 'element', tagName: 'div', properties: { className: ['code-block'] },
      children: [{
        type: 'element', tagName: 'div', properties: { className: ['code-toolbar'] },
        children: [{
          type: 'element', tagName: 'span', properties: { className: ['code-language'] },
          children: [{ type: 'text', value: languageName(this.options.lang) }],
        }],
      }, pre],
    }];
  },
};
