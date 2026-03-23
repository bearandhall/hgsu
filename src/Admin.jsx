import React, { useState } from "react";
import worksData from "./data/works.json";

function Admin() {
  const [data, setData] = useState(worksData);

  // 1. 새로운 호(Issue) 추가 함수
  const addNewIssue = () => {
    const nextIssueNum = Object.keys(data).length + 1;
    const newIssueKey = `issue${nextIssueNum}`;
    
    const newData = {
      ...data,
      [newIssueKey]: {
        cover: "/cover_sample.jpg",
        coverArtist: "작가 이름 @인스타",
        works: []
      }
    };
    setData(newData);
  };

  // 2. 특정 호에 새로운 작품(Work) 추가 함수
  const addNewWork = (issueKey) => {
    const newWork = {
      id: `work-${Date.now()}`, // 중복 방지를 위한 임시 ID
      title: "새 작품 제목",
      author: "작가 이름",
      authorBio: "작가 소개 및 @인스타",
      // 기본적으로 2호 방식(body)으로 생성
      body: [
        { type: "text", value: "내용을 입력하세요.", align: "left", bold: false }
      ]
    };

    const newData = { ...data };
    newData[issueKey].works.push(newWork);
    setData(newData);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "works.json";
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">웹진 관리자 모드</h1>
          <button 
            onClick={addNewIssue}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-colors"
          >
            + 새로운 호(Issue) 추가
          </button>
        </div>
        <button
          onClick={downloadJSON}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg transition-all"
        >
          변경사항 저장 (JSON 다운로드)
        </button>
      </div>

      <div className="space-y-12">
        {Object.keys(data).map((issueKey) => (
          <section key={issueKey} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                {issueKey.toUpperCase()} 설정
              </h2>
              <button 
                onClick={() => addNewWork(issueKey)}
                className="px-3 py-1 bg-gray-800 text-white rounded text-xs hover:bg-black"
              >
                + 이 호에 작품 추가
              </button>
            </div>
            
            {/* ... (이전의 cover, coverArtist 입력창 로직 동일) ... */}

            <h3 className="text-xl font-bold mb-4 text-gray-800">작품 목록</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                {/* ... (이전의 table header 로직 동일) ... */}
                <tbody>
                  {data[issueKey].works.map((work, idx) => (
                    <tr key={work.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 border-b align-top">
                        <input
                          className="w-full mb-2 p-2 border rounded font-bold"
                          value={work.title}
                          placeholder="제목 입력"
                          onChange={(e) => {
                            const newData = { ...data };
                            newData[issueKey].works[idx].title = e.target.value;
                            setData(newData);
                          }}
                        />
                        <input 
                          className="text-xs text-gray-400 w-full p-1 border-none"
                          value={work.id}
                          onChange={(e) => {
                            const newData = { ...data };
                            newData[issueKey].works[idx].id = e.target.value;
                            setData(newData);
                          }}
                        />
                      </td>
                      <td className="p-4 border-b align-top">
                        <input
                          className="w-full mb-2 p-2 border rounded"
                          value={work.author}
                          placeholder="작가명"
                          onChange={(e) => {
                            const newData = { ...data };
                            newData[issueKey].works[idx].author = e.target.value;
                            setData(newData);
                          }}
                        />
                        <textarea
                          className="w-full p-2 border rounded text-sm h-20"
                          value={work.authorBio}
                          placeholder="작가 소개"
                          onChange={(e) => {
                            const newData = { ...data };
                            newData[issueKey].works[idx].authorBio = e.target.value;
                            setData(newData);
                          }}
                        />
                      </td>
                      <td className="p-4 border-b align-top text-right">
                         <button 
                           onClick={() => {
                             if(window.confirm("정말 삭제하시겠습니까?")) {
                               const newData = { ...data };
                               newData[issueKey].works.splice(idx, 1);
                               setData(newData);
                             }
                           }}
                           className="text-red-400 hover:text-red-600 text-xs"
                         >
                           삭제
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default Admin;