import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
});

turndownService.addRule('removeScripts', {
  filter: 'script',
  replacement: () => '',
});

turndownService.addRule('removeStyles', {
  filter: 'style',
  replacement: () => '',
});

turndownService.addRule('removeComments', {
  filter: (node) => node.nodeType === 8,
  replacement: () => '',
});

export function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html);
}

export function extractImageUrls(markdown: string): string[] {
  const regex = /!\[[^\]]*\]\(([^)]+)\)/g;
  const urls: string[] = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }
  return urls;
}

export function replaceImageUrls(markdown: string, urlMap: Map<string, string>): string {
  return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    const newUrl = urlMap.get(url);
    if (newUrl) {
      return `![${alt}](${newUrl})`;
    }
    return match;
  });
}
