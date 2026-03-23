import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import worksData from "./data/works.json";

function AdminEditor() {
  const { issue, id } = useParams();
  const navigate = useNavigate();
  
  // 1. 데이터 상태 관리
  const [fullData, setFullData] = useState(worksData);
  const issueKey = issue.startsWith('issue') ? issue : `issue${issue}`;
  
  // 해당 작품 찾기
  const issueData = fullData[issueKey];
  const workIdx = issueData ? issueData.works.findIndex(w => w.id === id) : -1;
  const work = workIdx !== -1 ? issueData.works[workIdx] : null;

  if (!work) return <div className="p-10">작품 데이터를 불러올 수 없습니다.</div>;

  // 2. 작품 데이터 업데이트 함수 (공통)
  const updateWork = (updatedFields) => {
setFullData(prevData => {
    const newData = { ...prevData };
    // 해당 이슈의 해당 작품을 찾아 교체
    newData[issueKey].works[workIdx] = { 
      ...newData[issueKey].works[workIdx], 
      ...updatedFields 
    };
    return newData;
  });
  };

  // 3. 핵심: 저장 및 분할 로직 (handleDownload)
  // AdminEditor.jsx 의 handleDownload 함수 부분

const handleDownload = () => {
  try {
    // 1. 데이터 깊은 복사 (상태 변화 방지)
    const dataToSave = JSON.parse(JSON.stringify(fullData));

    // 2. 각 작품의 본문 데이터 정리
    Object.keys(dataToSave).forEach(issue => {
      dataToSave[issue].works.forEach(work => {
        if (work.body) {
          work.body = work.body.map(block => {
            if (block.type === "text") {
              // 이미 배열로 쪼개져 있다면 하나로 합쳐서 '원본 문자열'로 만듭니다.
              // 그래야 JSON 저장 시 따옴표나 줄바꿈이 깨지지 않습니다.
              let val = block.value;
              if (Array.isArray(val)) {
                val = val.join('\n\n');
              }
              
              // [핵심] 제어문자만 제거하고 따옴표/줄바꿈은 그대로 둡니다.
              const cleanVal = (val || "").replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, "");
              
              return { ...block, value: cleanVal };
            }
            return block;
          });
        }
      });
    });

    // 3. JSON 변환 (여기서 " -> \" / 줄바꿈 -> \n 처리가 자동으로 일어납니다)
    const jsonString = JSON.stringify(dataToSave, null, 2);

    // 4. 다운로드 실행
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "works.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("✅ 따옴표와 줄바꿈이 안전하게 인코딩되었습니다!");
  } catch (error) {
    console.error("저장 중 오류:", error);
    alert("데이터 처리 중 오류가 발생했습니다.");
  }
};
  // 4. 블록 추가 함수
  const addBlock = (type) => {
    const newBlock = type === "text" 
      ? { type: "text", value: "", align: "left", bold: false }
      : type === "image" 
      ? { type: "image", src: "", caption: "" }
      : { type: "footnote", number: (work.body?.filter(b => b.type === "footnote").length || 0) + 1, value: "" };
    
    updateWork({ body: [...(work.body || []), newBlock] });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 pb-40 box-border bg-white min-h-screen">
      {/* 상단 컨트롤 바 */}
      <div className="flex justify-between items-center mb-12 sticky top-0 bg-white/80 backdrop-blur py-4 z-10 border-b">
        <button onClick={() => navigate("/admin")} className="text-gray-400 hover:text-black font-medium">← 목록으로</button>
        <button 
          onClick={handleDownload} 
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          저장 및 JSON 추출
        </button>
      </div>

      {/* 작품 정보 수정 */}
      <div className="space-y-6 mb-16">
        <input 
          className="w-full text-4xl font-bold border-none focus:ring-0 p-0 placeholder-gray-200" 
          placeholder="제목"
          value={work.title} 
          onChange={(e) => updateWork({ title: e.target.value })}
        />
        <input 
          className="w-full text-xl italic text-gray-500 border-none focus:ring-0 p-0" 
          placeholder="작가명"
          value={work.author} 
          onChange={(e) => updateWork({ author: e.target.value })}
        />
        <textarea 
          className="w-full text-sm text-gray-400 italic border-none focus:ring-0 p-0 resize-none h-20"
          placeholder="작가 소개"
          value={work.authorBio}
          onChange={(e) => updateWork({ authorBio: e.target.value })}
        />
      </div>

      <hr className="my-10 border-gray-100" />

      {/* 본문 에디터 */}
      <div className="space-y-12">
        <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest">Content Blocks</h3>
        
        {work.body?.map((block, bIdx) => (
          <div key={bIdx} className="group relative border-l-2 border-gray-100 pl-8 py-2 hover:border-blue-200 transition-colors">
            {/* 삭제 버튼 */}
            <button 
              className="absolute -left-3 top-2 bg-white border border-red-100 text-red-400 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
              onClick={() => {
                const newBody = [...work.body];
                newBody.splice(bIdx, 1);
                updateWork({ body: newBody });
              }}
            >×</button>

            {/* 텍스트 블록 편집기 */}
            {block.type === "text" && (
              <div className="space-y-4">
                <textarea 
                  className="w-full border-none focus:ring-0 p-0 text-lg leading-loose resize-none overflow-hidden min-h-[100px]"
                  placeholder="본문 내용을 입력하세요..."
                  spellCheck="false"
                  // 에디터에서는 보여주기 위해 다시 join('\n') 처리
                  value={Array.isArray(block.value) ? block.value.join('\n') : block.value}
                  onChange={(e) => {
                    const newBody = [...work.body];
                    newBody[bIdx].value = e.target.value; // 여기선 스트링으로 관리
                    updateWork({ body: newBody });
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                />
                <div className="flex gap-6 text-[10px] font-bold text-gray-400">
                  <select 
                    className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                    value={block.align} 
                    onChange={(e) => {
                      const newBody = [...work.body];
                      newBody[bIdx].align = e.target.value;
                      updateWork({ body: newBody });
                    }}
                  >
                    <option value="left">LEFT</option>
                    <option value="center">CENTER</option>
                    <option value="right">RIGHT</option>
                  </select>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={block.bold} 
                      onChange={(e) => {
                        const newBody = [...work.body];
                        newBody[bIdx].bold = e.target.checked;
                        updateWork({ body: newBody });
                      }}
                    /> BOLD
                  </label>
                </div>
              </div>
            )}

            {/* 이미지/각주 블록은 기존과 동일 (생략 가능하나 가독성을 위해 유지) */}
            {block.type === "image" && (
              <div className="space-y-2">
                <input 
                  className="w-full text-xs p-2 border rounded"
                  placeholder="이미지 경로 (/images/파일명.jpg)"
                  value={block.src}
                  onChange={(e) => {
                    const newBody = [...work.body];
                    newBody[bIdx].src = e.target.value;
                    updateWork({ body: newBody });
                  }}
                />
                <input 
                  className="w-full text-xs italic p-1 border-b"
                  placeholder="캡션"
                  value={block.caption}
                  onChange={(e) => {
                    const newBody = [...work.body];
                    newBody[bIdx].caption = e.target.value;
                    updateWork({ body: newBody });
                  }}
                />
              </div>
            )}

            {block.type === "footnote" && (
              <div className="flex gap-2">
                <span className="text-blue-500 font-bold">[{block.number}]</span>
                <input 
                  className="flex-1 text-sm border-b outline-none"
                  value={block.value}
                  onChange={(e) => {
                    const newBody = [...work.body];
                    newBody[bIdx].value = e.target.value;
                    updateWork({ body: newBody });
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {/* 블록 추가 버튼 */}
        <div className="flex gap-2 pt-10">
          {["text", "image", "footnote"].map(type => (
            <button 
              key={type}
              onClick={() => addBlock(type)} 
              className="flex-1 py-3 border border-dashed rounded-xl text-[10px] font-bold text-gray-400 hover:bg-gray-50 hover:text-blue-500"
            >
              + {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminEditor;