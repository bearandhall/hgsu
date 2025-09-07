import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import worksData from "./data/works.json";
import AuthorBio from "./AuthorBio";

// Header
function Header() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <header className="p-4 border-b flex justify-center">
      <Link to="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="로고"
          className={`object-contain h-auto ${isMobile ? "w-1/3" : "w-[10vw]"}`}
        />
      </Link>
    </header>
  );
}

// StyledLink
const StyledLink = ({ to, children }) => (
  <Link
    to={to}
    style={{
      borderRadius: "8px",
      border: "1px solid #ccc",
      padding: "0.25rem 0.75rem",
      color: "#000",
      display: "inline-block",
      textDecoration: "none",
      fontWeight: 400,
      transition: "all 0.2s",
      marginBottom: "0.5rem",
    }}
    className="hover:bg-blue-100 hover:border-blue-300"
  >
    {children}
  </Link>
);

// AutoInstagramLink
const AutoInstagramLink = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/\s+/);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith("@")) {
          return (
            <a
              key={idx}
              href={`https://instagram.com/${part.slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-2 py-1 m-1 text-blue-600 bg-blue-100 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {part}
            </a>
          );
        } else if (part.startsWith("https://blog.naver.com/")) {
          return (
            <a
              key={idx}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-2 py-1 m-1 text-blue-600 bg-blue-100 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {part}
            </a>
          );
        } else {
          return (
            <span key={idx} className="inline-block mr-1 text-black italic">
              {part}
            </span>
          );
        }
      })}
    </>
  );
};

// Home
function Home() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`p-8 ${isMobile ? "" : "grid grid-cols-2 gap-8"} max-w-[100vw] overflow-x-hidden`}>
      <div>
        <p className="mb-4">
          HGSU는 Hoarding Ghost System Unit의 약자로써 제도권에서 박탈되고 소외된 글들과 매체에 관심을 가지는 모두에게 열린 단체입니다.{" "}
          <a
            href={`https://instagram.com/hgsu_2024`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition-colors"
          >
            @hgsu_2024
          </a>
        </p>
        <StyledLink to="/issues/1">1호</StyledLink>
      </div>
      {!isMobile && (
        <div>
          <img
            src="/intro.jpg"
            alt="사이트 소개"
            className="w-full max-w-md rounded shadow object-contain"
          />
        </div>
      )}
    </div>
  );
}

// Issue
function Issue() {
  const { issue } = useParams();
  const issueKey = `issue${issue}`;
  const issueData = worksData[issueKey];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!issueData) return <p className="p-8">해당 호를 찾을 수 없습니다.</p>;

  const issueWorks = issueData.works;

  return (
    <div className="p-4 max-w-[100vw] overflow-x-hidden">
      {isMobile ? (
        <>
          <div className="flex flex-col items-center mb-4">
            <img
              src={issueData.cover}
              alt={`제${issue}호 표지`}
              className="w-2/3 rounded shadow object-contain"
            />
            <p className="text-sm text-gray-600 mt-2">
              표지 그림: <AuthorBio bio={issueData.coverArtist} />
            </p>
          </div>
          <div className="flex flex-col px-2">
            {issueWorks.map((work) => (
              <StyledLink key={work.id} to={`/issues/${issue}/works/${work.id}`}>
                {work.title} — <em>{work.author}</em>
              </StyledLink>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl mb-4">제{issue}호</h2>
            <ul className="space-y-4">
              {issueWorks.map((work) => (
                <li key={work.id}>
                  <StyledLink to={`/issues/${issue}/works/${work.id}`}>
                    {work.title} — <em>{work.author}</em>
                  </StyledLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <img
              src={issueData.cover}
              alt={`제${issue}호 표지`}
              className="w-full max-w-md h-auto rounded shadow object-contain"
            />
            <p className="mt-2 text-sm text-gray-600">
              표지 그림: <AuthorBio bio={issueData.coverArtist} />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// WorkDetail
function WorkDetail() {
  const { issue, id } = useParams();
  const issueKey = `issue${issue}`;
  const issueData = worksData[issueKey];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!issueData) return <p className="p-8">호 정보를 찾을 수 없습니다.</p>;
  const work = issueData.works.find((w) => w.id === id);
  if (!work) return <p className="p-8">작품을 찾을 수 없습니다.</p>;

  return (
    <div className="p-4 max-w-[100vw] overflow-x-hidden">
      <div className="mb-4">
        <Link
          to={`/issues/${issue}`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← 제{issue}호 목차로 돌아가기
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-2">{work.title}</h2>
      <p className="text-lg text-gray-700 mb-2"><em>{work.author}</em></p>
      <p className="text-sm italic mt-1">
        <AutoInstagramLink text={work.authorBio} />
      </p>

      {!isMobile && (
        <iframe
          src={`${work.pdf}#toolbar=0&navpanes=0&scrollbar=0`}
          title="" // 제목 숨김
          className="w-full h-[600px] border rounded mt-4"
        />
      )}

      <a
        href={work.pdf}
        download={`제${issue}호_${work.title}.pdf`}
        className="inline-block px-4 py-2 rounded-lg border border-gray-300 text-black font-medium transition-colors duration-200 hover:bg-blue-100 hover:border-blue-300 mt-4"
      >
        PDF 다운로드
      </a>
    </div>
  );
}

// Footer
function Footer() {
  return (
    <footer className="p-4 border-t text-center text-sm text-gray-600">
      ⓒ 각 원고 및 이미지의 저작권은 각 작가에게 있으며, 무단 복제 및 사용을 금합니다.
    </footer>
  );
}

// App
export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col max-w-[100vw] overflow-x-hidden">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/issues/:issue" element={<Issue />} />
            <Route path="/issues/:issue/works/:id" element={<WorkDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
