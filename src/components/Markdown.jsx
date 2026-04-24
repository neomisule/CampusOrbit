import React from "react";

// Lightweight markdown -> React renderer. Handles the common cases that come
// out of LLM responses: bold, italic, inline code, lists, headings, blockquotes,
// code blocks, links. Not meant to be a full CommonMark implementation.

function renderInline(text, keyPrefix = "") {
  if (!text) return null;
  const out = [];
  let i = 0;
  let key = 0;

  while (i < text.length) {
    // **bold**
    if (text[i] === "*" && text[i + 1] === "*") {
      const close = text.indexOf("**", i + 2);
      if (close > -1) {
        out.push(<strong key={`${keyPrefix}-${key++}`}>{renderInline(text.slice(i + 2, close), `${keyPrefix}-b${key}`)}</strong>);
        i = close + 2;
        continue;
      }
    }
    // *italic*
    if (text[i] === "*" && text[i + 1] !== "*") {
      const close = text.indexOf("*", i + 1);
      if (close > -1 && text[close - 1] !== " ") {
        out.push(<em key={`${keyPrefix}-${key++}`}>{renderInline(text.slice(i + 1, close), `${keyPrefix}-i${key}`)}</em>);
        i = close + 1;
        continue;
      }
    }
    // `inline code`
    if (text[i] === "`") {
      const close = text.indexOf("`", i + 1);
      if (close > -1) {
        out.push(<code key={`${keyPrefix}-${key++}`}>{text.slice(i + 1, close)}</code>);
        i = close + 1;
        continue;
      }
    }
    // [link](url)
    if (text[i] === "[") {
      const closeBracket = text.indexOf("]", i);
      if (closeBracket > -1 && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket);
        if (closeParen > -1) {
          const linkText = text.slice(i + 1, closeBracket);
          const url = text.slice(closeBracket + 2, closeParen);
          out.push(
            <a key={`${keyPrefix}-${key++}`} href={url} target="_blank" rel="noopener noreferrer">
              {renderInline(linkText, `${keyPrefix}-l${key}`)}
            </a>
          );
          i = closeParen + 1;
          continue;
        }
      }
    }
    // Plain text — collect until next special char
    let next = i;
    while (next < text.length && !["*", "`", "["].includes(text[next])) next++;
    if (next > i) {
      out.push(text.slice(i, next));
      i = next;
    } else {
      out.push(text[i]);
      i++;
    }
  }
  return out;
}

export default function Markdown({ children }) {
  if (!children) return null;
  const lines = children.split("\n");
  const blocks = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push(<pre key={key++}><code>{codeLines.join("\n")}</code></pre>);
      i++;
      continue;
    }

    // Heading
    if (/^#{1,3} /.test(line)) {
      const level = line.match(/^#+/)[0].length;
      const Tag = `h${level}`;
      const content = line.replace(/^#+\s*/, "");
      blocks.push(<Tag key={key++}>{renderInline(content, `h${key}`)}</Tag>);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push(<blockquote key={key++}>{renderInline(quoteLines.join(" "), `q${key}`)}</blockquote>);
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(line.trim())) {
      blocks.push(<hr key={key++} />);
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ul${key}-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ol${key}-${idx}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line — paragraph break
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-empty, non-special lines
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !/^#{1,3} /.test(lines[i]) &&
      !lines[i].startsWith("> ") &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^[-*_]{3,}$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push(<p key={key++}>{renderInline(paraLines.join(" "), `p${key}`)}</p>);
  }

  return <div className="markdown-content">{blocks}</div>;
}
