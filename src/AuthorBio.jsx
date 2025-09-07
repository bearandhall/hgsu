import React from "react";

export default function AuthorBio({ bio }) {
  const parts = bio.split(" ");

  return (
    <p className="text-sm italic mt-1 flex flex-wrap gap-2">
      {parts.map((part, i) =>
        part.startsWith("@") ? (
          <a
            key={i}
            href={`https://instagram.com/${part.slice(1)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition-colors shadow-sm"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}
