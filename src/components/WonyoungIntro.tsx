import { Sparkles, HelpCircle, Smartphone, Ban, Anchor, Github, Server, Globe, Share2 } from "lucide-react";

export default function WonyoungIntro() {
  return (
    <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-slate-50 border border-indigo-100/80 rounded-3xl p-6 md:p-8 mb-8 shadow-xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          {/* Slogan Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-100/80 text-indigo-900 rounded-full text-xs font-bold mb-3 border border-indigo-200/60 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>작성부터 발행 · 배포까지</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
            BLODOCK <span className="text-indigo-600 font-bold text-xl md:text-2xl">(블독)</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            <strong className="text-slate-800 font-semibold">Blog + Dock</strong>의 합성어로, AI 기반 원스톱 블로그 작성부터 <span className="text-indigo-700 font-medium underline decoration-indigo-200 underline-offset-4">GitHub, Render, Blogger, 네이버 블로그</span> 등 원하는 플랫폼으로 바로 연동·배포하는 스마트 통합 Hub입니다.
          </p>
        </div>

        {/* Dock Platform Connections Badge (MD3 Container) */}
        <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-indigo-100 shadow-sm max-w-sm w-full">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Anchor className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-extrabold text-slate-800 tracking-wider">BLODOCK CONNECT HUB</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium">
              <Github className="w-3.5 h-3.5 text-slate-800" />
              <span>GitHub Pages</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium">
              <Server className="w-3.5 h-3.5 text-purple-600" />
              <span>Render / Cloud</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>Blogger / 구글</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium">
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>네이버 / 스레드</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Grid - MD3 Style Tonal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-indigo-100/60">
        <div className="flex gap-3 bg-white/70 p-3.5 rounded-2xl border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0 font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">1. 직관적인 스토리텔링</h4>
            <p className="text-xs text-slate-500 leading-normal mt-1">
              독자가 단숨에 이해하도록 쉽고 명쾌한 일상의 어조로 블로그 콘텐츠를 도킹합니다.
            </p>
          </div>
        </div>

        <div className="flex gap-3 bg-white/70 p-3.5 rounded-2xl border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">2. 모바일 퍼스트 레이아웃</h4>
            <p className="text-xs text-slate-500 leading-normal mt-1">
              스마트폰 독자 환경에 맞춘 여유 있는 단락 구성과 스크롤 피로도 최소화 design.
            </p>
          </div>
        </div>

        <div className="flex gap-3 bg-white/70 p-3.5 rounded-2xl border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">3. 호환성 최적화 순수 텍스트</h4>
            <p className="text-xs text-slate-500 leading-normal mt-1">
              어느 블로그 플랫폼에 붙여넣어도 특수기호 깨짐이 없는 클린 포맷을 지원합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

