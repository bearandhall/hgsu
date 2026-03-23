import React, { useState } from "react";
import { Link } from "react-router-dom";
import initialWorksData from "./data/works.json";

function AdminList() {
  // 데이터를 상태로 관리해야 추가/삭제가 즉시 화면에 반영됩니다.
  const [worksData, setWorksData] = useState(initialWorksData);

  // 1. 새로운 호(Issue) 추가 (예: issue3)
  const addNewIssue = () => {
    const nextIssueNum = Object.keys(worksData).length + 1;
    const newIssueKey = `issue${nextIssueNum}`;
    
    if (worksData[newIssueKey]) {
      alert("이미 존재하는 호수입니다.");
      return;
    }

    setWorksData({
      ...worksData,
      [newIssueKey]: {
        title: `${nextIssueNum}호`,
        works: []
      }
    });
  };

  // 2. 특정 호에 새 작품 추가
  const addNewWork = (issueKey) => {
    const newWork = {
      id: `work${Date.now()}`, // 중복 방지를 위해 타임스탬프 ID 사용
      title: "새 작품 제목",
      author: "작가명",
      authorBio: "작가 소개를 입력하세요.",
      body: []
    };

    const newData = { ...worksData };
    newData[issueKey].works.push(newWork);
    setWorksData(newData);
  };

  // 3. 변경된 전체 데이터를 JSON으로 다운로드
  const handleDownload = () => {
    const jsonString = JSON.stringify(worksData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "works.json";
    a.click();
    alert("새로운 works.json을 다운로드했습니다. src/data 폴더에 덮어씌우세요!");
  };

  return (
    <div className="max-w-5xl mx-auto p-10 box-border">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <h1 className="text-3xl font-black text-gray-900">HGSU 관리 콘솔</h1>
        <div className="flex gap-4">
          <button 
            onClick={addNewIssue}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100"
          >
            + 새 호(Issue) 추가
          </button>
          <button 
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow-md"
          >
            전체 저장 및 다운로드
          </button>
          <Link to="/" className="text-sm text-gray-400 hover:text-black flex items-center">← 홈으로</Link>
        </div>
      </div>

      {Object.keys(worksData).map((issueKey) => (
        <div key={issueKey} className="mb-12 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              {issueKey} ({worksData[issueKey].works.length}개의 작품)
            </h2>
            <button 
              onClick={() => addNewWork(issueKey)}
              className="text-xs font-bold bg-white border border-blue-200 text-blue-500 px-3 py-1.5 rounded-md hover:bg-blue-50"
            >
              + 이 호에 작품 추가
            </button>
          </div>

          <div className="grid gap-3">
            {worksData[issueKey].works.map((work) => (
              <div key={work.id} className="flex justify-between items-center p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all">
                <div>
                  <div className="font-bold text-gray-800 text-lg">{work.title || "제목 없음"}</div>
                  <div className="text-sm text-gray-400 italic">작가: {work.author}</div>
                </div>
                <Link 
                  to={`/admin/edit/${issueKey}/${work.id}`}
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  본문 편집
                </Link>
              </div>
            ))}
            {worksData[issueKey].works.length === 0 && (
              <div className="text-center py-10 text-gray-300 border-2 border-dashed rounded-xl">
                작품이 없습니다. 작품을 추가해주세요.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminList;