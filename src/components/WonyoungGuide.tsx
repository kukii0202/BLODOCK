<<<<<<< HEAD
import { BookOpen, ShieldAlert, CheckCircle, Info, Anchor } from "lucide-react";

export default function WonyoungGuide() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Anchor className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-slate-800">BLODOCK 발행 및 SEO 통합 가이드</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 p-4 rounded-2xl text-xs sm:text-sm text-slate-600 leading-relaxed border border-slate-100">
          <p className="font-semibold text-slate-700 mb-1">💡 Blog + Dock 발행 허브 활용법</p>
          작성한 블로그 글을 복사하여 <span className="font-semibold text-indigo-600">Blogger, 네이버 블로그, 스레드, GitHub Pages, Render static site</span> 등 원하시는 플랫폼으로 손쉽게 내보내거나 배포하실 수 있습니다.
=======
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
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
<<<<<<< HEAD
              <strong className="text-slate-800">플랫폼 맞춤형 어조:</strong> 
              네이버, 티스토리, 스레드 등 각 커뮤니티의 모바일 독자에 최적화된 톤앤매너로 작성됩니다.
=======
              <strong className="text-slate-800">독자 중심의 쉬운 용어:</strong> 
              "금리 인상으로 자금 유동성이..." 보다는 "은행 이자가 올라 지갑 사정이 가벼워진..." 처럼 직관적인 표현을 사용하세요.
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0
            </span>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">모바일 가독성 1순위:</strong> 
<<<<<<< HEAD
              스크롤 화면에서의 높은 가독성을 위해 단락 구분선과 넉넉한 줄 간격을 자동으로 적용합니다.
=======
              대부분의 클릭은 스마트폰에서 일어납니다. 한 단락은 최대 3문장을 넘지 않게 조절하고, 문단 사이 공백을 크게 넓혀 스크롤이 쉽도록 배려하세요.
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0
            </span>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
<<<<<<< HEAD
              <strong className="text-slate-800">포맷 호환성 보장:</strong> 
              플랫폼에 붙여넣었을 때 불필요한 마크다운 기호나 문자가 깨지지 않도록 클린 HTML/Plain Text를 유지합니다.
=======
              <strong className="text-slate-800">기호 노출 금지 (금기):</strong> 
              일반 에디터로 옮겨질 때 <code className="px-1 bg-rose-50 text-rose-600 rounded">**굵은 글씨**</code>나 <code className="px-1 bg-rose-50 text-rose-600 rounded">### 제목</code> 기호가 튀어나오면 기계가 쓴 자동 완성 글로 간주될 수 있으니 피하세요.
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0
            </span>
          </div>
        </div>

<<<<<<< HEAD
        <div className="p-4 bg-amber-50/80 border border-amber-100 rounded-2xl">
          <div className="flex gap-2 text-amber-800 mb-1">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold">발행 및 배포 전 최종 체크리스트</span>
          </div>
          <ul className="text-[11px] sm:text-xs text-amber-700 space-y-1 list-disc list-inside">
            <li>핵심 주제와 관련 키워드가 자연스럽게 녹아들어 있는가?</li>
            <li>이미지가 모바일 스크롤에 맞게 적절한 위치에 자리잡았는가?</li>
            <li>배포하려는 블로그 타겟 플랫폼의 가이드라인에 부합하는가?</li>
=======
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
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0
          </ul>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-100">
<<<<<<< HEAD
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>BLODOCK은 구글 검색 알고리즘 및 2026 모바일 UX 표준을 준수합니다.</span>
=======
          <Info className="w-3.5 h-3.5" />
          <span>본 에디터는 구글의 최신 2026년 검색 핵심 알고리즘 가이드를 준수합니다.</span>
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0
