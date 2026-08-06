import { useState, useEffect } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  Smartphone, 
  Ban, 
  Anchor, 
  Github, 
  Server, 
  Globe, 
  Share2, 
  Rocket, 
  X, 
  ExternalLink, 
  MessageSquare 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PUBLISH_SERVICES = [
  {
    name: "네이버 블로그",
    url: "https://section.blog.naver.com/",
    icon: Share2,
    accentColor: "bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900 border-emerald-200/80",
    iconBg: "bg-emerald-600 text-white",
    badge: "🟢 네이버",
    desc: "네이버 블로그 관리 홈"
  },
  {
    name: "Google Blogger",
    url: "https://www.blogger.com/",
    icon: Globe,
    accentColor: "bg-amber-50 hover:bg-amber-100/90 text-amber-950 border-amber-200/80",
    iconBg: "bg-amber-500 text-white",
    badge: "🟠 구글",
    desc: "구글 Blogger 콘솔"
  },
  {
    name: "Threads",
    url: "https://www.threads.net/",
    icon: Share2,
    accentColor: "bg-slate-900 hover:bg-slate-800 text-white border-slate-800",
    iconBg: "bg-slate-800 text-white",
    badge: "⚫ 스레드",
    desc: "메타 스레드 채널 이동"
  }
];

const MANAGEMENT_SERVICES = [
  {
    name: "GitHub",
    url: "https://github.com/",
    icon: Github,
    accentColor: "bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200",
    iconBg: "bg-slate-900 text-white",
    badge: "🐙 GitHub",
    desc: "코드/Pages 연동"
  },
  {
    name: "Render",
    url: "https://render.com/",
    icon: Server,
    accentColor: "bg-cyan-50 hover:bg-cyan-100/90 text-cyan-950 border-cyan-200",
    iconBg: "bg-cyan-600 text-white",
    badge: "🔷 Render",
    desc: "클라우드 대시보드"
  },
  {
    name: "Gemini AI Studio",
    url: "https://aistudio.google.com/",
    icon: Sparkles,
    accentColor: "bg-indigo-50 hover:bg-indigo-100/90 text-indigo-950 border-indigo-200",
    iconBg: "bg-indigo-600 text-white",
    badge: "✨ Gemini",
    desc: "구글 AI 프롬프트"
  },
  {
    name: "ChatGPT",
    url: "https://chatgpt.com/",
    icon: MessageSquare,
    accentColor: "bg-teal-50 hover:bg-teal-100/90 text-teal-950 border-teal-200",
    iconBg: "bg-teal-600 text-white",
    badge: "💬 ChatGPT",
    desc: "OpenAI 워크스페이스"
  }
];

export default function WonyoungIntro() {
  const [isQuickLaunchOpen, setIsQuickLaunchOpen] = useState(false);

  // Keyboard shortcut listener to close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsQuickLaunchOpen(false);
      }
    };
    if (isQuickLaunchOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isQuickLaunchOpen]);

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

        {/* Quick Launch Hub Badge Container */}
        <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-indigo-100 shadow-sm max-w-sm w-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Anchor className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-extrabold text-slate-800 tracking-wider">BLODOCK CONNECT HUB</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>

          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            원클릭으로 주요 블로그 발행 서비스 및 운영 관리 플랫폼을 바로 실행할 수 있는 Quick Launch 모드를 제공합니다.
          </p>

          <button
            type="button"
            onClick={() => setIsQuickLaunchOpen(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Rocket className="w-4 h-4 text-amber-300 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
            <span>🚀 Quick Launch</span>
          </button>
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

      {/* Quick Launch Modal */}
      <AnimatePresence>
        {isQuickLaunchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsQuickLaunchOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full p-6 sm:p-8 z-10 overflow-hidden text-left"
            >
              {/* Modal Header: 2-line layout with font-semibold */}
              <div className="flex items-start justify-between pb-4 mb-6 border-b border-slate-100">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xs shrink-0 mt-0.5">
                    <Rocket className="w-5.5 h-5.5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                      BLODOCK CONNECT HUB
                    </h3>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      Quick Launch · 원하는 서비스를 클릭하면 새 탭에서 바로 이동합니다.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickLaunchOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100/80 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-7">
                {/* ══════════════════════════
                    📤 콘텐츠 발행
                   ══════════════════════════ */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📤</span>
                      <h4 className="text-sm font-semibold text-slate-900">
                        콘텐츠 발행
                      </h4>
                    </div>
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
                      3개
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {PUBLISH_SERVICES.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <a
                          key={item.name}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 ease-out shadow-2xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between h-full ${item.accentColor}`}
                        >
                          <div className="flex items-center justify-between mb-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs ${item.iconBg}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <ExternalLink className="w-4 h-4 opacity-35 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold opacity-70 block mb-0.5 uppercase tracking-wider">{item.badge}</span>
                            <h5 className="text-sm font-semibold leading-normal">{item.name}</h5>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed opacity-90">{item.desc}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* 섹션 얇은 구분선 */}
                <div className="border-t border-slate-100"></div>

                {/* ══════════════════════════
                    ⚙ 운영 관리
                   ══════════════════════════ */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚙</span>
                      <h4 className="text-sm font-semibold text-slate-900">
                        운영 관리
                      </h4>
                    </div>
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
                      4개
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {MANAGEMENT_SERVICES.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <a
                          key={item.name}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group relative p-4 rounded-2xl border transition-all duration-200 ease-out shadow-2xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between h-full ${item.accentColor}`}
                        >
                          <div className="flex items-center justify-between mb-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs ${item.iconBg}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <ExternalLink className="w-4 h-4 opacity-35 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold opacity-70 block mb-0.5 uppercase tracking-wider">{item.badge}</span>
                            <h5 className="text-xs font-semibold leading-normal">{item.name}</h5>
                            <p className="text-[11px] text-slate-500 font-normal mt-1 leading-relaxed truncate opacity-90">{item.desc}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 font-normal">
                <span>원하는 서비스를 선택하여 새 탭에서 실행됩니다.</span>
                <span className="text-[11px] text-slate-400">
                  ESC 키 또는 바깥 영역 클릭 시 닫힙니다.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

