import React from "react";

export default function AuthorBio({ bio }) {
  if (!bio) return null;

  // 1. 공백과 줄바꿈을 모두 보존하면서 쪼개기 위해 정규표현식 (/(\s+)/) 사용
  const parts = bio.split(/(\s+)/);

  return (
    <p 
      // 2. flex를 제거하고 whitespace-pre-wrap을 추가합니다. 
      // leading-loose는 줄간격을 예쁘게 만들어줍니다.
      className="text-sm italic mt-1 whitespace-pre-wrap leading-loose text-gray-700"
    >
      {parts.map((part, i) => {
        // 인스타그램 아이디 처리
        if (part.startsWith("@")) {
          return (
            <a
              key={i}
              href={`https://instagram.com/${part.slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-2 py-0.5 mx-0.5 rounded-full bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition-colors shadow-sm"
            >
              {part}
            </a>
          );
        }
        
        // 블로그 등 URL 처리 (선택사항)
        if (part.startsWith("https://")) {
          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-1">
              {part}
            </a>
          );
        }

        // 3. 일반 텍스트 및 줄바꿈(\n) 출력
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}