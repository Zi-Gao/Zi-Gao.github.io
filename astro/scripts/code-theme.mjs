// Fog blue / graphite palette, shared by every highlighted language.
export default {
  name: 'fog-blue-graphite-balanced',
  type: 'light',
  colors: { 'editor.background': '#ffffff', 'editor.foreground': '#39434d' },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#737d86' } },
    { scope: ['variable', 'punctuation'], settings: { foreground: '#39434d' } },
    { scope: ['keyword', 'storage', 'entity.name.tag'], settings: { foreground: '#355775', fontStyle: 'bold' } },
    { scope: ['entity.name.function', 'support.function'], settings: { foreground: '#705079' } },
    { scope: ['string', 'constant.other.symbol'], settings: { foreground: '#3e654b' } },
    { scope: ['constant.numeric', 'constant.language'], settings: { foreground: '#8d6038' } },
    { scope: ['entity.name.type', 'support.type', 'support.class', 'entity.other.attribute-name'], settings: { foreground: '#3c626b' } },
  ],
};
