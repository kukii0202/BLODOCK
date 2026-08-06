import React, { useState, useEffect } from "react";
import WonyoungIntro from "./components/WonyoungIntro";
import WonyoungGuide from "./components/WonyoungGuide";
import BlogPreview from "./components/BlogPreview";
import { GeneratedPost } from "./types";
import { generateBlogImages } from "./lib/imageUtils";
import { safeFetchJson } from "./lib/safeFetch";
import { generateFallbackBlogPost } from "./lib/fallbackGenerator";
import { 
  PenTool, 
  BookOpen, 
  History, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  CheckCircle,
  FileText,
  Clock,
  Plus,
  AlertTriangle,
  X,
  RotateCcw,
  Anchor
} from "lucide-react";

const PLATFORMS = [
  { value: "블로그", label: "블로그 (네이버/티스토리)", badge: "표준 블로그" },
  { value: "구글 애드센스", label: "구글 애드센스", badge: "수익/체류시간" },
  { value: "스레드", label: "스레드 (Threads)", badge: "SNS 바이럴" },
];

const TONES = [
  "전문적이고 설득력 있는",
  "친근하고 감성적인",
  "직관적이고 명확한",
  "위트 있고 활기찬",
  "트렌디한 MZ 스타일"
];

const CATEGORIES = [
  { value: "일상/생활", label: "🏠 일상 및 생활 꿀팁 (리빙/집안일)" },
  { value: "재테크/금융", label: "💰 재테크 및 금융/부동산/주식" },
  { value: "IT/가전/테크", label: "💻 IT 기기 & 가전/AI/모바일" },
  { value: "건강/의학/헬스", label: "🏥 건강 정보 & 헬스/다이어트" },
  { value: "음식/맛집/요리", label: "🍳 맛집 추천 & 집밥 레시피/카페" },
  { value: "여행/레저/캠핑", label: "✈️ 국내외 여행 & 숙소/캠핑/취미" },
  { value: "뷰티/패션/스타일", label: "💄 뷰티 & 패션/코디/헤어" },
  { value: "문화/엔터/예술", label: "🎬 영화/드라마 & 도서/공연/게임" },
  { value: "자기계발/교육/커리어", label: "📚 자기계발 & 자격증/취업/어학" },
  { value: "육아/반려동물", label: "👶 육아 꿀팁 & 반려견/반려묘 케어" },
  { value: "시사/뉴스/트렌드", label: "📰 최신 시사/이슈 & 정책/지원금" },
  { value: "비즈니스/마케팅/부업", label: "💼 창업/부업 & 마케팅/N잡" },
  { value: "기타/자유주제 (Etc.)", label: "🌐 기타 / 종합 & 자유 주제 (Etc.)" },
];

const SUBCATEGORIES_MAP: Record<string, string[]> = {
  "일상/생활": ["생활 꿀팁", "자취/자취요리", "청소/수납", "인테리어/리빙", "절약/알뜰생활"],
  "재테크/금융": ["국내/해외 주식", "부동산/청약", "가계부/저축", "절세/지원금", "암호화폐/NFT", "연금/보험"],
  "IT/가전/테크": ["스마트폰/태블릿", "노트북/PC", "AI/인공지능", "소프트웨어/앱", "스마트가전/음향기기"],
  "건강/의학/헬스": ["홈트/운동", "다이어트/식단", "영양제/건강식품", "질환/의학정보", "멘탈케어/수면"],
  "음식/맛집/요리": ["전국 맛집 탐방", "초간단 집밥 레시피", "디저트/카페/베이커리", "밀키트/편의점", "홈파티/안주"],
  "여행/레저/캠핑": ["국내 여행지 추천", "해외 여행 가이드", "호텔/리조트/숙소", "캠핑/차박", "등산/액티비티"],
  "뷰티/패션/스타일": ["스킨케어/화장품", "데일리 패션 코디", "헤어/메이크업", "퍼스널컬러/스타일링"],
  "문화/엔터/예술": ["영화/OTT 드라마 리뷰", "베스트셀러/도서 추천", "음악/공연/전시", "모바일/PC 게임"],
  "자기계발/교육/커리어": ["자격증/시험 준비", "직장인 커리어/이직", "어학/영어 공부", "독서/생산성 툴"],
  "육아/반려동물": ["신생아/유아 육아팁", "아이 교육/교구", "반려견 건강/용품", "반려묘 케어/집사일기"],
  "시사/뉴스/트렌드": ["정부 지원금/정책", "최신 사회 이슈", "글로벌 경제 트렌드", "생활 법률/상식"],
  "비즈니스/마케팅/부업": ["직장인 부업/N잡", "온라인 쇼핑몰/스마트스토어", "SNS 마케팅/퍼스널브랜딩", "지식창업/PDF"],
  "기타/자유주제 (Etc.)": ["자유 블로그 포스팅", "종합 정보 큐레이션", "개인 수기/에세이", "리뷰/체험단", "기타 개별 주제"]
};

const SUGGESTED_TOPICS = [
  { category: "재테크/금융", topic: "사회초년생을 위한 소액 적금 추천 및 만기 달성법" },
  { category: "일상/생활", topic: "스마트폰 배터리 수명을 2배 오래 유지하는 하루 습관" },
  { category: "IT/가전/테크", topic: "2026년 가성비 태블릿 PC 구매 시 필수 확인 항목" },
  { category: "건강/의학/헬스", topic: "체지방 감소와 근손실 방지를 위한 효과적인 칼로리 식단" },
  { category: "음식/맛집/요리", topic: "10분 만에 완성하는 자취생 초간단 원팬 파스타 레시피" },
  { category: "여행/레저/캠핑", topic: "주말 당일치기 추천! 서울 근교 힐링 드라이브 코스 TOP 5" },
  { category: "비즈니스/마케팅/부업", topic: "퇴근 후 하루 1시간으로 시작하는 무자본 온라인 부업 가이드" },
  { category: "기타/자유주제 (Etc.)", topic: "2026년 꼭 알아야 할 주요 생활 혜택 및 유용한 정보 종합 총정리" }
];

// Safe Storage helper that works smoothly in any environment
// (e.g. Python static server, Flask, FastAPI, sandboxed iframes, cross-origin frames)
const memoryStorageCache: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      console.warn(`[SafeStorage] localStorage getItem failed for "${key}", using memory fallback:`, e);
    }
    return memoryStorageCache[key] || null;
  },
  setItem: (key: string, value: string): void => {
    memoryStorageCache[key] = value;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[SafeStorage] localStorage setItem failed for "${key}", using memory fallback:`, e);
    }
  },
  removeItem: (key: string): void => {
    delete memoryStorageCache[key];
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[SafeStorage] localStorage removeItem failed for "${key}":`, e);
    }
  }
};

export default function App() {
  const [platform, setPlatform] = useState("블로그");
  const [tone, setTone] = useState("친근하고 감성적인");
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("일상/생활");
  const [subCategory, setSubCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // Trash & Restore state
  const [deletedPosts, setDeletedPosts] = useState<GeneratedPost[]>([]);
  const [showTrashModal, setShowTrashModal] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showClearTrashConfirm, setShowClearTrashConfirm] = useState(false);

  // Load posts and trash from storage & server on mount
  useEffect(() => {
    // 1. Try safeStorage
    const saved = safeStorage.getItem("blodock_blog_drafts") || safeStorage.getItem("wonyoung_blog_drafts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
          setActivePostId(parsed[0].id);
        }
      } catch (err) {
        console.error("저장된 글을 불러오는 중 오류 발생:", err);
      }
    }

    const savedTrash = safeStorage.getItem("blodock_blog_trash") || safeStorage.getItem("wonyoung_blog_trash");
    if (savedTrash) {
      try {
        const parsedTrash = JSON.parse(savedTrash);
        if (Array.isArray(parsedTrash)) {
          setDeletedPosts(parsedTrash);
        }
      } catch (err) {
        console.error("휴지통을 불러오는 중 오류 발생:", err);
      }
    }

    // 2. Try background fetch from server (if hosted on fullstack server)
    safeFetchJson<GeneratedPost[]>("/api/posts").then((res) => {
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        setPosts(res.data);
        setActivePostId((prev) => prev || res.data![0].id);
      }
    });

    safeFetchJson<GeneratedPost[]>("/api/trash").then((res) => {
      if (res.ok && Array.isArray(res.data)) {
        setDeletedPosts((prev) => (prev.length > 0 ? prev : res.data!));
      }
    });
  }, []);

  // Save posts to storage and sync with server
  const savePostsToStorage = (updatedPosts: GeneratedPost[]) => {
    setPosts(updatedPosts);
    safeStorage.setItem("blodock_blog_drafts", JSON.stringify(updatedPosts));
    safeFetchJson("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPosts)
    });
  };

  // Save trash to storage and sync with server
  const saveTrashToStorage = (updatedTrash: GeneratedPost[]) => {
    setDeletedPosts(updatedTrash);
    safeStorage.setItem("blodock_blog_trash", JSON.stringify(updatedTrash));
    safeFetchJson("/api/trash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTrash)
    });
  };

  // Loading animation simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : 0));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadingMessages = [
    "어려운 개념을 아주 쉬운 생활 비유법으로 변환하는 중입니다...",
    "스마트폰 독자분들이 편하게 스크롤할 수 있도록 시원한 공백을 나누고 있습니다...",
    "Blogger 및 블로그 에디터에서 깨질 만한 마크다운 기호를 정성스레 지우고 있습니다...",
    "BLODOCK만의 플랫폼 맞춤형 최적화 노하우 팁을 아낌없이 녹여내고 있습니다..."
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    const effectiveCategory = subCategory.trim() 
      ? `${category} (${subCategory.trim()})` 
      : category;

    try {
      let postData: any = null;

      const result = await safeFetchJson<any>("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          category: effectiveCategory,
          platform,
          tone,
          keywords,
          additionalInfo,
          length
        })
      });

      if (result.ok && result.data) {
        postData = result.data;
      } else {
        console.warn("[App] API server unavailable or HTML response returned. Utilizing client fallback generator:", result.error);
        postData = generateFallbackBlogPost(
          topic,
          effectiveCategory,
          platform,
          tone,
          keywords,
          additionalInfo
        );
      }
      
      const generatedImages = generateBlogImages(effectiveCategory, topic, postData.imageSearchKeywordsEn);

      const newPost: GeneratedPost = {
        id: Math.random().toString(36).substr(2, 9),
        topic,
        category: effectiveCategory,
        platform,
        tone,
        title: postData.title,
        content: postData.content,
        wonyoungTip: postData.wonyoungTip,
        metaDescription: postData.metaDescription,
        keywordsUsed: postData.keywordsUsed,
        imageSearchKeywordsEn: postData.imageSearchKeywordsEn,
        timestamp: new Date().toISOString(),
        images: generatedImages
      };

      const updated = [newPost, ...posts];
      savePostsToStorage(updated);
      setActivePostId(newPost.id);
      
      // Auto-scroll to preview
      setTimeout(() => {
        const previewElement = document.getElementById("blog-preview-container");
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);

    } catch (err: any) {
      console.warn("AI 블로그 생성 처리 중 예외 발생 (클라이언트 가동 유지):", err);
      // Fallback post creation even if an unexpected error occurs
      const fallbackPostData = generateFallbackBlogPost(
        topic,
        category,
        platform,
        tone,
        keywords,
        additionalInfo
      );

      const fallbackImages = generateBlogImages(category, topic, fallbackPostData.imageSearchKeywordsEn);

      const newPost: GeneratedPost = {
        id: Math.random().toString(36).substr(2, 9),
        topic,
        category,
        platform,
        tone,
        title: fallbackPostData.title,
        content: fallbackPostData.content,
        wonyoungTip: fallbackPostData.wonyoungTip,
        metaDescription: fallbackPostData.metaDescription,
        keywordsUsed: fallbackPostData.keywordsUsed,
        imageSearchKeywordsEn: fallbackPostData.imageSearchKeywordsEn,
        timestamp: new Date().toISOString(),
        images: fallbackImages
      };

      const updated = [newPost, ...posts];
      savePostsToStorage(updated);
      setActivePostId(newPost.id);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = (updatedPost: GeneratedPost) => {
    const updated = posts.map((p) => (p.id === updatedPost.id ? updatedPost : p));
    savePostsToStorage(updated);
  };

  // Open confirmation modal for single post
  const handleRequestDeletePost = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = posts.find((p) => p.id === id);
    if (target) {
      setDeleteTarget({ id: target.id, title: target.title });
    }
  };

  // Execute single post delete after user confirmation (move to trash)
  const confirmDeleteSinglePost = () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    const targetPost = posts.find((p) => p.id === targetId);

    const updated = posts.filter((p) => p.id !== targetId);
    savePostsToStorage(updated);

    if (targetPost) {
      const updatedTrash = [targetPost, ...deletedPosts.filter((p) => p.id !== targetId)];
      saveTrashToStorage(updatedTrash);
    }
    
    if (activePostId === targetId) {
      setActivePostId(updated.length > 0 ? updated[0].id : null);
    }
    setDeleteTarget(null);
  };

  // Open confirmation modal for all posts
  const handleRequestDeleteAllPosts = () => {
    if (posts.length === 0) return;
    setShowDeleteAllConfirm(true);
  };

  // Execute delete all after user confirmation (move all to trash)
  const confirmDeleteAllPosts = () => {
    if (posts.length === 0) return;
    const updatedTrash = [...posts, ...deletedPosts];
    saveTrashToStorage(updatedTrash);
    savePostsToStorage([]);
    setActivePostId(null);
    setShowDeleteAllConfirm(false);
  };

  // Restore a single post from trash
  const handleRestoreSinglePost = (id: string) => {
    const targetPost = deletedPosts.find((p) => p.id === id);
    if (!targetPost) return;

    const updatedTrash = deletedPosts.filter((p) => p.id !== id);
    saveTrashToStorage(updatedTrash);

    const updatedPosts = [targetPost, ...posts.filter((p) => p.id !== id)];
    savePostsToStorage(updatedPosts);
    setActivePostId(targetPost.id);
  };

  // Restore all posts from trash
  const handleRestoreAllPosts = () => {
    if (deletedPosts.length === 0) return;
    const updatedPosts = [...deletedPosts, ...posts];
    savePostsToStorage(updatedPosts);
    saveTrashToStorage([]);
    if (updatedPosts.length > 0) {
      setActivePostId(updatedPosts[0].id);
    }
  };

  // Permanently delete a single item from trash
  const handlePermanentDeleteSinglePost = (id: string) => {
    const updatedTrash = deletedPosts.filter((p) => p.id !== id);
    saveTrashToStorage(updatedTrash);
  };

  // Request clear entire trash
  const handleRequestClearTrash = () => {
    if (deletedPosts.length === 0) return;
    setShowClearTrashConfirm(true);
  };

  // Confirm clear entire trash
  const confirmClearTrash = () => {
    saveTrashToStorage([]);
    setShowClearTrashConfirm(false);
  };

  const handleCreateNew = () => {
    setTopic("");
    setKeywords("");
    setAdditionalInfo("");
    setActivePostId(null);
  };

  const handleSelectSuggested = (suggested: typeof SUGGESTED_TOPICS[0]) => {
    setTopic(suggested.topic);
    setCategory(suggested.category);
  };

  const activePost = posts.find((p) => p.id === activePostId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Header Brand Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-indigo-100/80 py-3.5 px-6 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-indigo-200">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 tracking-tight">BLODOCK</span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">블독</span>
              </div>
              <span className="text-xs text-slate-500 font-medium tracking-tight block">작성부터 발행 · 배포까지 (Blog + Dock)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <div className="hidden sm:flex items-center gap-2 bg-indigo-50/80 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-xs">Hub: GitHub · Render · Blogger · Naver</span>
            </div>
            <span className="font-bold text-slate-700 hidden lg:inline">배포 허브 연결 완료</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Intro */}
        <WonyoungIntro />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Area (8 cols if no active post, otherwise split beautifully) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Main Editor Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-800">새 블로그 글 정보 설정</h3>
                </div>
                {activePostId && (
                  <button 
                    onClick={handleCreateNew}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    새 글 준비
                  </button>
                )}
              </div>

              <form onSubmit={handleGenerate} className="space-y-5">
                
                {/* 1. Platform Category Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    1. 게시할 매체 카테고리
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPlatform(p.value)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                          platform === p.value
                            ? "bg-emerald-50/80 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-xs font-extrabold block truncate">{p.value}</span>
                        <span className={`text-[10px] mt-1 block truncate font-medium ${
                          platform === p.value ? "text-emerald-700" : "text-slate-400"
                        }`}>
                          {p.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Tone & Style Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    2. 어조 및 문체 선택
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          tone === t
                            ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Topic */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    3. 어떤 주제의 글을 쓸까요? (필수)
                  </label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="예: 사회초년생 소액 재테크, 제주도 숨겨진 맛집 지도"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-800"
                  />
                </div>

                {/* 4. Grid: Field Category & Length */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        4. 분야 메인 카테고리
                      </label>
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setSubCategory("");
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-800"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        5. 글의 타깃 분량
                      </label>
                      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                        {(["short", "medium", "long"] as const).map((len) => (
                          <button
                            key={len}
                            type="button"
                            onClick={() => setLength(len)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                              length === len 
                                ? "bg-white text-emerald-700 shadow-xs" 
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {len === "short" ? "단문" : len === "long" ? "장문" : "표준"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Subcategory Tag Chips & Direct Input */}
                  <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <span>🏷️ 세부 분야 / 하위 카테고리 (선택)</span>
                        {subCategory && (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                            "{subCategory}" 선택됨
                          </span>
                        )}
                      </span>
                      {subCategory && (
                        <button
                          type="button"
                          onClick={() => setSubCategory("")}
                          className="text-[10px] text-slate-400 hover:text-slate-600 underline"
                        >
                          초기화
                        </button>
                      )}
                    </div>

                    {SUBCATEGORIES_MAP[category] && SUBCATEGORIES_MAP[category].length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {SUBCATEGORIES_MAP[category].map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => setSubCategory(subCategory === sub ? "" : sub)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                              subCategory === sub
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}

                    <input
                      type="text"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      placeholder="원하는 세부 분야를 직접 입력할 수 있습니다 (예: 2026 청년 정책, 오마카세 리뷰, 자유 서술 등)"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                    />
                  </div>
                </div>

                {/* 5. Target Keywords */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      6. 타깃 노출 키워드 (선택)
                    </label>
                    <span className="text-[10px] text-slate-400">컴마(,)로 구분</span>
                  </div>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="예: 사회초년생 재테크, 소액적금추천, 목돈만들기"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-800"
                  />
                </div>

                {/* 6. Additional Raw Info */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      7. 참고 뉴스 및 기본 지식 (선택)
                    </label>
                    <span className="text-[10px] text-emerald-600 font-semibold">팩트 정확도 상승!</span>
                  </div>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="관련된 핵심 팩트나 복사한 관련 기사/메모를 입력하세요. BLODOCK AI가 독자 친화적인 원스톱 블로그 콘텐츠로 정교하게 재가공해 드립니다."
                    className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700 resize-none"
                  />
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      BLODOCK AI 초집중 콘텐츠 작성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      BLODOCK 원스톱 글 생성하기
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Suggested Topics Box */}
            <div className="bg-slate-100/50 border border-slate-200/80 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">💡 영감이 필요하신가요? 인기 주제 추천</h4>
              <div className="space-y-2">
                {SUGGESTED_TOPICS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSuggested(item)}
                    className="w-full text-left bg-white p-3 border border-slate-200 rounded-xl text-xs font-medium hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-[10px] text-slate-500 rounded font-bold mr-2 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                        {item.category}
                      </span>
                      <span className="text-slate-700">{item.topic}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transform group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Saved History & Restore Trash Access */}
            {(posts.length > 0 || deletedPosts.length > 0) && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between gap-1.5 text-slate-800 font-bold text-sm mb-4">
                  <div className="flex items-center gap-1.5">
                    <History className="w-4 h-4 text-emerald-600" />
                    <h4>지금까지 작성한 글 ({posts.length})</h4>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Restore Trash Modal Toggle Button */}
                    <button
                      onClick={() => setShowTrashModal(true)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 border ${
                        deletedPosts.length > 0
                          ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 shadow-2xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                      title="삭제된 글 목록 확인 및 복원하기"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      <span>복원</span>
                      {deletedPosts.length > 0 && (
                        <span className="bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                          {deletedPosts.length}
                        </span>
                      )}
                    </button>

                    {posts.length > 0 && (
                      <button
                        onClick={handleRequestDeleteAllPosts}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1 rounded-lg transition-all flex items-center gap-1"
                        title="작성된 모든 글 삭제"
                      >
                        <Trash2 className="w-3 h-3" />
                        전체 삭제
                      </button>
                    )}
                  </div>
                </div>

                {posts.length > 0 ? (
                  <div className="space-y-2.5 max-h-[260px] overflow-y-auto scrollbar-thin">
                    {posts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setActivePostId(p.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 group ${
                          activePostId === p.id 
                            ? "bg-emerald-50/50 border-emerald-400 shadow-2xs ring-1 ring-emerald-400/30" 
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-1 flex-wrap">
                            {p.platform && (
                              <span className="inline-block px-1.5 py-0.5 bg-slate-200/80 text-slate-800 text-[9px] rounded font-bold">
                                {p.platform}
                              </span>
                            )}
                            <span className="inline-block px-1.5 py-0.5 bg-white border border-slate-200 text-slate-500 text-[9px] rounded font-bold">
                              {p.category}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-800 truncate leading-snug">
                            {p.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(p.timestamp).toLocaleDateString()} · {p.content.length}자
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {p.score !== undefined && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
                              {p.score}점
                            </span>
                          )}
                          <button
                            onClick={(e) => handleRequestDeletePost(p.id, e)}
                            className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-lg transition-all shadow-2xs"
                            title="이 글 삭제하기 (휴지통으로 이동)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-500 font-medium">현재 목록에 남아있는 글이 없습니다.</p>
                    {deletedPosts.length > 0 && (
                      <button
                        onClick={() => setShowTrashModal(true)}
                        className="mt-2 text-xs font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-200/80 px-3 py-1.5 rounded-lg border border-amber-300 transition-all inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                        휴지통에서 삭제된 글 {deletedPosts.length}개 복원하기
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
          </div>

          {/* Right Area - Display Preview, Guide or Loader (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {loading ? (
              /* Writing Loader Box */
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[480px]">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin flex items-center justify-center" />
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-black text-xs tracking-tighter animate-pulse">
                    BLODOCK
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">
                  "잠시만요! 플랫폼에 맞춘 완벽한 블로그 포스팅을 작성 중입니다!"
                </h3>
                
                {/* Simulated Writing Steps */}
                <div className="max-w-md w-full bg-slate-50 p-4 border border-slate-100 rounded-xl mt-4">
                  <p className="text-xs font-semibold text-indigo-600 tracking-wider uppercase mb-2">실시간 집필 공정</p>
                  <div className="space-y-2">
                    {loadingMessages.map((msg, i) => (
                      <div key={i} className="flex items-center gap-2 text-left text-xs text-slate-500">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          loadingStep > i 
                            ? "bg-indigo-600 text-white" 
                            : loadingStep === i 
                            ? "bg-indigo-100 text-indigo-700 font-bold animate-pulse" 
                            : "bg-slate-200 text-slate-400"
                        }`}>
                          {loadingStep > i ? "✓" : i + 1}
                        </div>
                        <span className={loadingStep === i ? "text-slate-800 font-medium" : "text-slate-500"}>
                          {msg}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-6">
                  선택하신 플랫폼 및 SEO 노출 최적화에 맞추어 정밀 작성 중입니다. 약 10~15초 소요될 수 있어요.
                </p>
              </div>
            ) : activePost ? (
              /* Active Generated Post Preview & Editor */
              <BlogPreview 
                post={activePost} 
                onUpdatePost={handleUpdatePost} 
                onDeletePost={(id) => handleRequestDeletePost(id)}
              />
            ) : (
              /* Empty State (Guides & Inspiration) */
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1.5">아직 생성된 블로그 글이 없습니다.</h3>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-5">
                    왼쪽 양식에 글의 핵심 주제를 적고 "BLODOCK 원스톱 글 생성하기" 버튼을 누르시면, BLODOCK AI가 독자와 검색 엔진 모두 감탄할 고품질 포스팅을 바로 작성해 드립니다!
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded bg-slate-50">
                      순수 텍스트 안전지대
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded bg-slate-50">
                      모바일 가독성 가이드 자동화
                    </span>
                  </div>
                </div>

                {/* Helpful Guidelines */}
                <WonyoungGuide />
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer info */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <p>© 2026 BLODOCK (블독). All Rights Reserved. Blog + Dock Integrated Publishing Hub.</p>
          <p className="mt-1 text-[11px] text-slate-300">
            검색엔진 가이드라인 및 플랫폼 정책을 성실히 준수하며 생성 시 어떠한 마크다운 서식 깨짐도 억제하여 순수한 콘텐츠 가치를 확보합니다.
          </p>
        </div>
      </footer>

      {/* 1. Single Post Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-rose-100 p-6 space-y-5 relative">
            <button 
              onClick={() => setDeleteTarget(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">블로그 글 삭제 안내</h3>
                <p className="text-xs text-slate-500 mt-0.5">선택한 글을 목록에서 제외합니다.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">삭제 대상</span>
              <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                "{deleteTarget.title}"
              </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-xl">
              <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <span>💡 안내: 삭제 후에도 복원이 가능합니다.</span>
              </p>
              <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                삭제된 글은 '휴지통'으로 이동하며, 언제든지 상단의 [복원] 버튼을 눌러 목록으로 다시 가져올 수 있습니다.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmDeleteSinglePost}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                휴지통으로 이동
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. All Posts Delete Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-rose-100 p-6 space-y-5 relative">
            <button 
              onClick={() => setShowDeleteAllConfirm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">전체 블로그 글 삭제 안내</h3>
                <p className="text-xs text-slate-500 mt-0.5">저장된 모든 글을 목록에서 지웁니다.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">삭제 항목 수</span>
              <p className="text-xs font-bold text-slate-800">
                총 <span className="text-rose-600 font-extrabold">{posts.length}개</span>의 작성 글
              </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-xl">
              <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <span>💡 안내: 휴지통에서 전체 복원 가능</span>
              </p>
              <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                모든 글이 휴지통으로 이동합니다. 실수로 누르셨더라도 상단 [복원] 버튼을 통해 언제든 복원하실 수 있습니다.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmDeleteAllPosts}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                전체 삭제 (휴지통 이동)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Restore / Trash Bin Popup Modal */}
      {showTrashModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-amber-100 p-6 space-y-5 relative max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setShowTrashModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">삭제된 글 복원하기 (휴지통)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  아까 지웠던 글들 중 복원하고 싶은 포스팅을 선택해 다시 불러올 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[180px] max-h-[380px] scrollbar-thin">
              {deletedPosts.length > 0 ? (
                deletedPosts.map((dp) => (
                  <div
                    key={dp.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-amber-300 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        {dp.platform && (
                          <span className="px-1.5 py-0.5 bg-slate-200 text-slate-800 text-[9px] font-bold rounded">
                            {dp.platform}
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-600 text-[9px] font-bold rounded">
                          {dp.category}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-800 truncate">
                        {dp.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        생성일: {new Date(dp.timestamp).toLocaleDateString()} · {dp.content.length}자
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleRestoreSinglePost(dp.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1"
                        title="이 글 다시 목록으로 복원하기"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        복원
                      </button>
                      <button
                        onClick={() => handlePermanentDeleteSinglePost(dp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-all"
                        title="휴지통에서 영구 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <RotateCcw className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">휴지통이 비어있습니다.</p>
                  <p className="text-[11px] text-slate-400 mt-1">지운 글이 여기에 보관됩니다.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              {deletedPosts.length > 0 ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRestoreAllPosts}
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    전체 복원 ({deletedPosts.length})
                  </button>
                  <button
                    onClick={handleRequestClearTrash}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold rounded-xl transition-all"
                  >
                    휴지통 비우기
                  </button>
                </div>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setShowTrashModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Clear Trash Confirmation Modal */}
      {showClearTrashConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-rose-100 p-6 space-y-5 relative">
            <button 
              onClick={() => setShowClearTrashConfirm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">휴지통 비우기</h3>
                <p className="text-xs text-slate-500 mt-0.5">휴지통에 보관된 모든 글을 영구 삭제합니다.</p>
              </div>
            </div>

            <div className="bg-rose-50 border-l-4 border-rose-500 p-3.5 rounded-r-xl">
              <p className="text-xs font-bold text-rose-800">
                ⚠️ 주의: 영구 삭제된 글은 복원할 수 없습니다.
              </p>
              <p className="text-[11px] text-rose-700 mt-1 leading-relaxed">
                휴지통의 {deletedPosts.length}개 항목이 완전히 삭제됩니다. 정말로 진행하시겠습니까?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearTrashConfirm(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmClearTrash}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                휴지통 완전히 비우기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
