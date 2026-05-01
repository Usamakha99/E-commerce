import React from 'react';

/** Converts bare URLs in plain text into clickable links (marketplace product pages). */
export default function renderTextWithLinks(text) {
  if (!text) return text;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'rgb(0, 113, 133)',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.target.style.textDecoration = 'underline';
            e.target.style.color = 'rgb(0, 95, 115)';
          }}
          onMouseLeave={(e) => {
            e.target.style.textDecoration = 'none';
            e.target.style.color = 'rgb(0, 113, 133)';
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
