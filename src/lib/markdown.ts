import { marked } from "marked";

export type AffiliateVendor = "rakuten" | "amazon" | "yahoo" | null;

const AFFILIATE_RULES: Array<{
  vendor: AffiliateVendor;
  match: (url: string) => boolean;
  label: string;
  logo: string;
  className: string;
}> = [
  {
    vendor: "rakuten",
    match: (url) => url.includes("rakuten.co.jp"),
    label: "楽天で見る",
    logo: "/brands/rakuten.svg",
    className: "rakuten"
  },
  {
    vendor: "amazon",
    match: (url) => url.includes("amazon.co.jp"),
    label: "Amazonで見る",
    logo: "/brands/amazon.svg",
    className: "amazon"
  },
  {
    vendor: "yahoo",
    match: (url) => url.includes("shopping.yahoo.co.jp"),
    label: "Yahooで見る",
    logo: "/brands/yahoo.svg",
    className: "yahoo"
  }
];

export function renderMarkdown(content: string) {
  const renderer = new marked.Renderer();

  renderer.link = (link) => {
    const href = link.href ?? "";
    const titleAttr = link.title ? ` title="${link.title}"` : "";
    const label =
      link.tokens && link.tokens.length > 0
        ? marked.Parser.parseInline(link.tokens)
        : (link as { text?: string }).text ?? href;

    if (!href) return label;
    const rule = AFFILIATE_RULES.find((item) => item.match(href));
    if (rule) {
      return `
        <a class="aff-button ${rule.className}" href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">
          <img src="${rule.logo}" alt="${rule.label}" />
          <span>${rule.label}</span>
        </a>
      `;
    }
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${label}</a>`;
  };

  marked.setOptions({ gfm: true, breaks: true });

  return marked.parse(content, { renderer }) as string;
}
