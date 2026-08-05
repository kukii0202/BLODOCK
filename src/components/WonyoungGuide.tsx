import { BookOpen, ShieldAlert, CheckCircle, Info } from "lucide-react";

export default function WonyoungGuide() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-emerald-600" />
        <h3 className="text-base font-bold text-slate-800">원영이의 2026 구글 애드센스 승인 비책</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 p-4 rounded-xl text-xs sm:text-sm text-slate-600 leading-relaxed border border-slate-100">
          <p className="font-semibold text-slate-700 mb-1">💡 구글 애드센스가 가장 좋아하는 글이란?</p>
          복잡한 정보의 단순한 짜깁기가 아닌, <span className="font-semibold text-emerald-600">독창적인 개인의 해석과 쉬운 해설</span>이 포함된 글입니다. 
          어려운 IT 전문 용어나 금융 용어를 마치 일기장이나 친근한 편지처럼 친절하게 설명하는 글이 수익성이 가장 높습니다.
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">독자 중심의 쉬운 용어:</strong> 
              "금리 인상으로 자금 유동성이..." 보다는 "은행 이자가 올라 지갑 사정이 가벼워진..." 처럼 직관적인 표현을 사용하세요.
            </span>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">모바일 가독성 1순위:</strong> 
              대부분의 클릭은 스마트폰에서 일어납니다. 한 단락은 최대 3문장을 넘지 않게 조절하고, 문단 사이 공백을 크게 넓혀 스크롤이 쉽도록 배려하세요.
            </span>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">기호 노출 금지 (금기):</strong> 
              일반 에디터로 옮겨질 때 <code className="px-1 bg-rose-50 text-rose-600 rounded">**굵은 글씨**</code>나 <code className="px-1 bg-rose-50 text-rose-600 rounded">### 제목</code> 기호가 튀어나오면 기계가 쓴 자동 완성 글로 간주될 수 있으니 피하세요.
            </span>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex gap-2 text-amber-800 mb-1">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold">초보 블로거를 위한 애드센스 승인 체크리스트</span>
          </div>
          <ul className="text-[11px] sm:text-xs text-amber-700 space-y-1 list-disc list-inside">
            <li>하나의 주제에 깊이 있게 몰입하여 작성했는가?</li>
            <li>글에 인공지능이 쓴 것 같은 무미건조한 용어가 없는가?</li>
            <li>블로그 본문 내에 불필요한 빈 기호나 특수문자가 없는가?</li>
            <li>모바일 화면에서 줄 간격이 답답하진 않은가?</li>
          </ul>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-100">
          <Info className="w-3.5 h-3.5" />
          <span>본 에디터는 구글의 최신 2026년 검색 핵심 알고리즘 가이드를 준수합니다.</span>
        </div>
      </div>
    </div>
  );
}
