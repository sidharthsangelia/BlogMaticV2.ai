type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "list"; listType: "bullet" | "numbered"; items: string[] };

interface BlogJSON {
  title: string;
  metaDescription: string;
  slug: string;
  focusKeywords: string[];
  relatedKeywords: string[];
  content: Block[];
  conclusion: string;
}

export function blogJsonToHtml(data: BlogJSON) {
  // Add validation
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid blog data: not an object");
  }
  
  if (!data.content || !Array.isArray(data.content)) {
    throw new Error("Invalid blog data: content is missing or not an array");
  }
  
  const blocks = data.content
    .map((b) => {
      if (b.type === "paragraph") return `<p>${b.text}</p>`;
      if (b.type === "heading") return `<h${b.level}>${b.text}</h${b.level}>`;
      if (b.type === "list") {
        const tag = b.listType === "bullet" ? "ul" : "ol";
        const items = b.items.map((li) => `<li>${li}</li>`).join("");
        return `<${tag}>${items}</${tag}>`;
      }
      return "";
    })
    .join("");

  const html = `
    <h1>${data.title || 'Untitled'}</h1>
    ${blocks}
    <p>${data.conclusion || ''}</p>
  `;
  return html.trim();
}