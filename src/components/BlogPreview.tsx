import { useState, useEffect, FormEvent } from "react";
import { GeneratedPost, VerificationReport, BlogImage } from "../types";
import { generateBlogImages, downloadImageFile, getPhotoByEnglishSearch, getExternalStockSearchUrls, StockProvider } from "../lib/imageUtils";
import { safeFetchJson } from "../lib/safeFetch";
import { generateFallbackVerificationReport } from "../lib/fallbackGenerator";
import { 
  Smartphone, 
  FileText, 
  Copy, 
  Check, 
  ShieldCheck, 
  Edit3, 
  RefreshCw, 
  Sparkles, 
  AlertCircle, 
  Bookmark,
  Download,
  Image as ImageIcon,
  BarChart3,
  Eye,
  Plus,
  Trash2,
  RefreshCcw,
  X,
  Code,
  Search,
  Globe,
  ExternalLink,
  Filter
} from "lucide-react";

interface BlogPreviewProps {
  post: GeneratedPost;
  onUpdatePost: (updatedPost: GeneratedPost) => void;
  onDeletePost?: (id: string) => void;
}

export default function BlogPreview({ post, onUpdatePost, onDeletePost }: BlogPreviewProps) {
  const [activeTab, setActiveTab] = useState<"mobile" | "editor" | "images" | "analysis">("mobile");
  const [copied, setCopied] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  // Initialize or get images
  const [images, setImages] = useState<BlogImage[]>(() => {
    return post.images && post.images.length > 0
      ? post.images
      : generateBlogImages(post.category, post.topic);
  });

  // Modal preview state
  const [previewImage, setPreviewImage] = useState<BlogImage | null>(null);
  const [copiedHtmlId, setCopiedHtmlId] = useState<string | null>(null);
  const [customKeywordInput, setCustomKeywordInput] = useState("");

  // Ensure post stays in sync when images or edits change
  useEffect(() => {
    setEditedTitle(post.title);
    setEditedContent(post.content);
    const initialImages = post.images && post.images.length > 0 
      ? post.images 
      : generateBlogImages(post.category, post.topic, post.imageSearchKeywordsEn);
    setImages(initialImages);
  }, [post.id]);

  // Stats calculation
  const charCountWithSpace = editedContent.length;
  const charCountWithoutSpace = editedContent.replace(/\s/g, "").length;
  const wordCount = editedContent.trim().split(/\s+/).filter(Boolean).length;
  const readTimeMin = Math.max(1, Math.round(charCountWithSpace / 400));

  const handleCopy = async () => {
    try {
      const fullText = `제목: ${editedTitle}\n\n${editedContent}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  const handleSaveEdit = () => {
    onUpdatePost({
      ...post,
      title: editedTitle,
      content: editedContent,
      images
    });
  };

  const handleDownloadSingleImage = async (img: BlogImage, index: number) => {
    const filename = `${post.topic.replace(/[^a-zA-Z0-9가-힣]/g, "_").slice(0, 15)}_${img.type}_${index + 1}.jpg`;
    await downloadImageFile(img.url, filename);
  };

  const handleDownloadAllImages = async () => {
    if (!images || images.length === 0) return;
    setDownloadingAll(true);
    try {
      for (let i = 0; i < images.length; i++) {
        await handleDownloadSingleImage(images[i], i);
        // Slight delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    } finally {
      setDownloadingAll(false);
    }
  };

  // Image loading fallback error handler
  const handleImageError = (imgId: string) => {
    setImages((prevImages) =>
      prevImages.map((img) => {
        if (img.id === imgId && img.fallbackUrl && img.url !== img.fallbackUrl) {
          console.warn(`[BLODOCK] Image loading failed for ${imgId}. Falling back to ${img.fallbackProvider || 'Stock Photo'}`);
          return {
            ...img,
            url: img.fallbackUrl,
            provider: img.fallbackProvider || 'Unsplash',
            source: `${img.fallbackProvider || 'Free Stock'} Photo (Automatic Fallback)`,
            caption: `${img.caption.split('(')[0].trim()} (${img.fallbackProvider || '무료스톡'} 대체)`
          };
        }
        return img;
      })
    );
  };

  // Provider search filter state (Defaults to Pollinations AI primary)
  const [selectedProvider, setSelectedProvider] = useState<StockProvider | 'all'>('Pollinations');

  // Primary English keyword for search links
  const primaryKwEn = post.imageSearchKeywordsEn?.[0] || `${post.category} ${post.topic}`;
  const extSearchUrls = getExternalStockSearchUrls(primaryKwEn);

  const handleRegenerateImages = () => {
    const newImgs = generateBlogImages(post.category, post.topic, post.imageSearchKeywordsEn, selectedProvider);
    setImages(newImgs);
    onUpdatePost({
      ...post,
      images: newImgs
    });
  };

  const handleSearchByCustomEnglishKeyword = (e: FormEvent) => {
    e.preventDefault();
    if (!customKeywordInput.trim()) return;
    const searchKw = customKeywordInput.trim();
    const photoResult = getPhotoByEnglishSearch(searchKw, post.category, selectedProvider);
    
    const newImage: BlogImage = {
      id: 'img_' + Math.random().toString(36).substr(2, 7),
      url: photoResult.url,
      type: 'photo',
      alt: photoResult.alt,
      caption: `[영문 검색 추가] '${searchKw}' (${photoResult.provider})`,
      source: photoResult.source,
      insertedParagraphIndex: images.length > 0 ? 2 : 1,
      englishKeyword: searchKw,
      provider: photoResult.provider,
      fallbackUrl: photoResult.fallbackUrl,
      fallbackProvider: photoResult.fallbackProvider
    };

    const updated = [...images, newImage];
    setImages(updated);
    onUpdatePost({ ...post, images: updated });
    setCustomKeywordInput("");
  };

  const handleReplaceSingleImageProvider = (imgId: string, newProvider: StockProvider) => {
    const targetImg = images.find(i => i.id === imgId);
    if (!targetImg) return;

    const kw = targetImg.englishKeyword || primaryKwEn;
    const newPhoto = getPhotoByEnglishSearch(kw, post.category, newProvider);

    const updated = images.map(img => {
      if (img.id === imgId) {
        return {
          ...img,
          url: newPhoto.url,
          alt: newPhoto.alt,
          source: newPhoto.source,
          provider: newPhoto.provider,
          fallbackUrl: newPhoto.fallbackUrl,
          fallbackProvider: newPhoto.fallbackProvider,
          caption: `[${newPhoto.provider} 생성/교체] ${post.topic} 고화질 이미지`
        };
      }
      return img;
    });

    setImages(updated);
    onUpdatePost({ ...post, images: updated });
  };

  const handleRemoveImage = (id: string) => {
    const updated = images.filter((i) => i.id !== id);
    setImages(updated);
    onUpdatePost({ ...post, images: updated });
  };

  const handleCopyHtmlSnippet = async (img: BlogImage) => {
    const htmlSnippet = `<div style="text-align: center; margin: 24px 0;">
  <img src="${img.url}" alt="${img.alt}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
  <p style="font-size: 13px; color: #64748b; margin-top: 8px;">${img.caption} (${img.source})</p>
</div>`;

    try {
      await navigator.clipboard.writeText(htmlSnippet);
      setCopiedHtmlId(img.id);
      setTimeout(() => setCopiedHtmlId(null), 2000);
    } catch (err) {
      console.error("HTML 복사 실패:", err);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      let report: VerificationReport;

      const result = await safeFetchJson<VerificationReport>("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editedTitle, content: editedContent })
      });
      
      if (result.ok && result.data) {
        report = result.data;
      } else {
        console.warn("[BlogPreview] /api/verify unavailable or non-JSON returned. Utilizing client fallback analyzer:", result.error);
        report = generateFallbackVerificationReport(editedTitle, editedContent);
      }
      
      onUpdatePost({
        ...post,
        score: report.score,
        verificationReport: report,
        images
      });
      
      setActiveTab("analysis");
    } catch (err: any) {
      console.warn("진단 처리 중 예외 발생 (클라이언트 분석기 구동):", err);
      const fallbackReport = generateFallbackVerificationReport(editedTitle, editedContent);
      onUpdatePost({
        ...post,
        score: fallbackReport.score,
        verificationReport: fallbackReport,
        images
      });
      setActiveTab("analysis");
    } finally {
      setVerifying(false);
    }
  };

  // Split content into clean paragraphs
  const rawParagraphs = editedContent
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden font-pretendard" id="blog-preview-container">
      {/* Header Info Bar */}
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            {post.platform && (
              <span className="text-xs font-bold text-slate-800 bg-slate-200/80 px-2.5 py-1 rounded-md">
                📌 {post.platform}
              </span>
            )}
            {post.tone && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                💬 {post.tone}
              </span>
            )}
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              {post.category}
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-slate-600" />
              이미지/차트 {images.length}개
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mt-2 tracking-tight">
            BLODOCK 발행 준비 완료: <span className="text-slate-900">{editedTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">생성 시간: {new Date(post.timestamp).toLocaleString("ko-KR")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download all images button */}
          <button
            onClick={handleDownloadAllImages}
            disabled={downloadingAll || images.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
            title="본문에 배치된 무료 이미지/차트를 내 컴퓨터에 다운로드합니다"
          >
            <Download className={`w-3.5 h-3.5 ${downloadingAll ? "animate-bounce" : ""}`} />
            {downloadingAll ? "다운로드 중..." : "이미지/차트 다운로드"}
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-indigo-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "복사 완료!" : "전체 복사"}
          </button>
          
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-xs font-medium transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? "animate-spin" : ""}`} />
            {verifying ? "진단 중..." : "BLODOCK SEO 진단"}
          </button>

          {onDeletePost && (
            <button
              onClick={() => onDeletePost(post.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-all"
              title="이 블로그 글 삭제"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>삭제</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Preview & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Navigation & Preview (Column 8) */}
        <div className="lg:col-span-8 p-6 border-r border-slate-100 flex flex-col">
          {/* Tab buttons */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 mb-6 self-start flex-wrap">
            <button
              onClick={() => setActiveTab("mobile")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "mobile" 
                  ? "bg-white text-emerald-700 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              스마트폰 미리보기
            </button>

            <button
              onClick={() => setActiveTab("images")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "images" 
                  ? "bg-white text-emerald-700 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              첨부 이미지 & 차트 ({images.length})
            </button>

            <button
              onClick={() => setActiveTab("editor")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "editor" 
                  ? "bg-white text-emerald-700 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              텍스트 편집기
            </button>

            {post.verificationReport && (
              <button
                onClick={() => setActiveTab("analysis")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "analysis" 
                    ? "bg-white text-emerald-700 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                BLODOCK SEO 진단결과
                <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md text-[10px]">
                  {post.score}점
                </span>
              </button>
            )}
          </div>

          {/* Tab 1: Smartphone Preview with Embedded Images/Charts */}
          {activeTab === "mobile" && (
            <div className="flex-1 flex justify-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              {/* Smartphone Frame */}
              <div className="w-full max-w-[360px] bg-white border-[8px] border-slate-800 rounded-[36px] shadow-lg overflow-hidden flex flex-col relative aspect-[9/18]">
                {/* Smartphone Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-600 rounded-full" />
                </div>

                {/* Header bar */}
                <div className="pt-6 px-4 pb-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>BLODOCK Hub</span>
                  <span>10:20 AM</span>
                </div>

                {/* Scrollable screen content with natural image/chart insertion */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-700 scrollbar-thin font-pretendard">
                  
                  {/* Article Title Header */}
                  <div className="pb-3 border-b border-slate-100">
                    <h1 className="text-sm font-bold text-slate-900 leading-snug font-pretendard">
                      {editedTitle || "제목을 입력해주세요."}
                    </h1>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-[10px] text-white flex items-center justify-center font-bold">
                          BD
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">작성자: BLODOCK Editor</span>
                      </div>
                      <span className="text-[9px] text-slate-400">읽기 ~{readTimeMin}분</span>
                    </div>
                  </div>

                  {/* Blog Body with Naturally Inserted Images */}
                  <div className="text-xs leading-relaxed space-y-5 font-pretendard">
                    {rawParagraphs.length === 0 ? (
                      <p className="text-slate-400">본문 내용이 없습니다.</p>
                    ) : (
                      rawParagraphs.map((para, idx) => {
                        // Determine if image 1 or image 2 should be placed after this paragraph
                        const isMidpoint = Math.floor(rawParagraphs.length * 0.35) === idx;
                        const isLaterpoint = Math.floor(rawParagraphs.length * 0.7) === idx;

                        const imgToInsert = images.find((img, imgIdx) => {
                          if (img.insertedParagraphIndex === idx) return true;
                          if (imgIdx === 0 && isMidpoint) return true;
                          if (imgIdx === 1 && isLaterpoint) return true;
                          return false;
                        });

                        return (
                          <div key={idx} className="space-y-4">
                            <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
                              {para}
                            </p>

                            {/* Naturally Placed Image Card */}
                            {imgToInsert && (
                              <div className="my-4 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs group relative">
                                {/* Type Badge */}
                                <div className="p-2 bg-slate-100/90 border-b border-slate-200/80 flex items-center justify-between text-[10px]">
                                  <span className="font-bold text-slate-700 flex items-center gap-1">
                                    {imgToInsert.type === 'chart' ? (
                                      <>
                                        <BarChart3 className="w-3 h-3 text-emerald-600" />
                                        요약 인포그래픽 차트
                                      </>
                                    ) : (
                                      <>
                                        <ImageIcon className="w-3 h-3 text-sky-600" />
                                        무료 고화질 스톡 이미지
                                      </>
                                    )}
                                  </span>
                                  <span className="text-[9px] text-slate-400">{imgToInsert.source}</span>
                                </div>

                                {/* Main Image */}
                                <div className="relative overflow-hidden bg-slate-100 min-h-[160px] flex items-center justify-center">
                                  <img 
                                    src={imgToInsert.url} 
                                    alt={imgToInsert.alt} 
                                    referrerPolicy="no-referrer"
                                    onError={() => handleImageError(imgToInsert.id)}
                                    className="w-full h-auto object-cover max-h-[220px]"
                                  />
                                  
                                  {/* Quick Download Overlay on Hover */}
                                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleDownloadSingleImage(imgToInsert, images.indexOf(imgToInsert))}
                                      className="px-2.5 py-1.5 bg-white text-slate-800 rounded-lg text-[10px] font-bold shadow-md flex items-center gap-1 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                                    >
                                      <Download className="w-3 h-3" />
                                      다운로드
                                    </button>
                                    <button
                                      onClick={() => setPreviewImage(imgToInsert)}
                                      className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-[10px] font-bold shadow-md flex items-center gap-1 hover:bg-slate-700 transition-all"
                                    >
                                      <Eye className="w-3 h-3" />
                                      크게 보기
                                    </button>
                                  </div>
                                </div>

                                {/* Caption & Download Bar */}
                                <div className="p-2.5 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
                                  <p className="text-[10px] text-slate-500 font-medium truncate flex-1">
                                    {imgToInsert.caption}
                                  </p>
                                  <button
                                    onClick={() => handleDownloadSingleImage(imgToInsert, images.indexOf(imgToInsert))}
                                    className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[10px] font-bold flex items-center gap-1 transition-all shrink-0"
                                  >
                                    <Download className="w-3 h-3" />
                                    다운로드
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                    - 블로그 글 끝 -
                  </div>
                </div>

                {/* Home Bar */}
                <div className="py-2 bg-white flex justify-center">
                  <div className="w-24 h-1 bg-slate-300 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Image & Chart Manager Gallery */}
          {activeTab === "images" && (
            <div className="space-y-6">
              <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      폴리네이션 AI 생성 우선 적용 ({images.length}개)
                    </h4>
                    <p className="text-[11px] text-purple-700 mt-0.5">
                      폴리네이션 AI(Pollinations)에서 맞춤형 고화질 이미지를 1차적으로 생성하며, 접속 차단 시 Unsplash / Pexels / Pixabay 무료 스톡으로 자동 안전 전환됩니다.
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleRegenerateImages}
                      className="px-3 py-1.5 bg-white text-purple-800 border border-purple-200 rounded-lg text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <RefreshCcw className="w-3 h-3" />
                      AI 이미지 / 차트 전체 재생성
                    </button>
                  </div>
                </div>

                {/* Stock provider filter chips */}
                <div className="pt-2 border-t border-purple-100 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    선호 엔진 / 사이트:
                  </span>
                  {(['Pollinations', 'all', 'Unsplash', 'Pexels', 'Pixabay'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setSelectedProvider(prov)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedProvider === prov
                          ? "bg-purple-700 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-purple-200 hover:bg-purple-100/60"
                      }`}
                    >
                      {prov === 'Pollinations' ? '✨ 폴리네이션 AI (우선)' : prov === 'all' ? '전체 엔진' : prov}
                    </button>
                  ))}
                </div>

                {/* Direct External Search Links Bar */}
                <div className="p-3 bg-white/80 border border-purple-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] font-medium text-slate-700">
                    💡 무료 스톡 사이트에서 직접 검색하기:
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <a
                      href={extSearchUrls.pexels}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all"
                    >
                      <span>Pexels 검색</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={extSearchUrls.unsplash}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all"
                    >
                      <span>Unsplash 검색</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={extSearchUrls.pixabay}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all"
                    >
                      <span>Pixabay 검색</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Custom English Search Form */}
                <form onSubmit={handleSearchByCustomEnglishKeyword} className="pt-1 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={customKeywordInput}
                      onChange={(e) => setCustomKeywordInput(e.target.value)}
                      placeholder="원하는 키워드를 영문으로 직접 입력해 AI 이미지 추가 (예: futuristic cyber desk, financial chart)"
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-pretendard"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold shrink-0 transition-all shadow-xs"
                  >
                    AI 이미지 생성 추가
                  </button>
                </form>
              </div>

              {/* Grid of Attached Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((img, idx) => (
                  <div key={img.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
                    <div>
                      {/* Image Preview Header */}
                      <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          {img.type === 'chart' ? (
                            <>
                              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                              요약 차트 #{idx + 1}
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                              {img.provider === 'Pollinations' ? 'AI 생성 이미지' : '스톡 사진'} #{idx + 1}
                            </>
                          )}
                        </span>
                        
                        {/* Provider Tag */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          img.provider === 'Pollinations'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200 font-black'
                            : img.provider === 'Pexels' 
                            ? 'bg-teal-100 text-teal-800' 
                            : img.provider === 'Pixabay'
                            ? 'bg-indigo-100 text-indigo-800'
                            : img.provider === 'Unsplash'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {img.provider || (img.type === 'chart' ? 'QuickChart' : 'Pollinations')}
                        </span>
                      </div>

                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden group">
                        <img 
                          src={img.url} 
                          alt={img.alt} 
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(img.id)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => setPreviewImage(img)}
                            className="px-3 py-1.5 bg-white text-slate-800 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 hover:bg-slate-100"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            확대 보기
                          </button>
                        </div>
                      </div>

                      {/* Caption & Info */}
                      <div className="p-3 space-y-1.5">
                        <p className="text-xs font-medium text-slate-700 leading-snug">
                          {img.caption}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {img.englishKeyword && (
                            <span className="text-[10px] text-purple-700 font-mono bg-purple-50 px-2 py-0.5 rounded inline-block">
                              프롬프트 키워드: "{img.englishKeyword}"
                            </span>
                          )}
                          {img.fallbackProvider && (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              대체 수단: {img.fallbackProvider}
                            </span>
                          )}
                        </div>

                        {/* Quick Provider Switch Buttons for photos */}
                        {img.type === 'photo' && (
                          <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px]">
                            <span className="font-semibold text-slate-500">엔진/사이트 변경:</span>
                            {(['Pollinations', 'Pexels', 'Unsplash', 'Pixabay'] as const).map(p => (
                              <button
                                key={p}
                                onClick={() => handleReplaceSingleImageProvider(img.id, p)}
                                className={`px-1.5 py-0.5 rounded font-bold border transition-all ${
                                  img.provider === p 
                                    ? "bg-purple-900 text-white border-purple-900" 
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {p === 'Pollinations' ? '✨폴리네이션' : p}
                              </button>
                            ))}
                          </div>
                        )}

                        <p className="text-[10px] text-slate-400">
                          대체 텍스트 (Alt): {img.alt}
                        </p>
                      </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCopyHtmlSnippet(img)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                        title="블로그 에디터(HTML 모드)에 바로 붙여넣을 <img> 코드 복사"
                      >
                        {copiedHtmlId === img.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">HTML 복사완료</span>
                          </>
                        ) : (
                          <>
                            <Code className="w-3.5 h-3.5 text-slate-500" />
                            <span>HTML 태그 복사</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDownloadSingleImage(img, idx)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          다운로드
                        </button>
                        
                        <button
                          onClick={() => handleRemoveImage(img.id)}
                          className="p-1.5 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded transition-all"
                          title="이미지 제거"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Text Editor View */}
          {activeTab === "editor" && (
            <div className="flex-1 flex flex-col space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  블로그 제목 편집
                </label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleSaveEdit}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-pretendard"
                  placeholder="제목을 편집해보세요"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    블로그 본문 편집
                  </label>
                  <span className="text-[11px] text-amber-600 font-medium">
                    ⚠️ 주의: 샵(#), 별표(*) 등 깨질 수 있는 마크다운 기호 사용을 금지합니다.
                  </span>
                </div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onBlur={handleSaveEdit}
                  className="w-full flex-1 min-h-[360px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed font-pretendard focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                  placeholder="여기에 원영이와 함께 다듬은 글이 나타납니다."
                />
              </div>

              {/* Bottom Image Mini Bar */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700">첨부된 무료 이미지 및 차트 {images.length}개</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadAllImages}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    전체 이미지 다운로드
                  </button>
                  <button
                    onClick={() => setActiveTab("images")}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-all"
                  >
                    이미지 관리
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Analysis View */}
          {activeTab === "analysis" && post.verificationReport && (
            <div className="space-y-6">
              {/* Score Indicator Banner */}
              <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">BLODOCK 발행 및 SEO 가능성 진단</h4>
                  <p className="text-xs text-slate-500 mt-1">네이버, 구글, Blogger 및 SNS 발행 가이드에 맞춰 평가한 점수입니다.</p>
                </div>
                <div className="flex items-center justify-center flex-col shrink-0">
                  <div className="text-3xl font-extrabold text-indigo-600 bg-white border border-indigo-200 w-16 h-16 rounded-full flex items-center justify-center shadow-xs">
                    {post.verificationReport.score}
                  </div>
                  <span className="text-[10px] text-indigo-700 font-bold mt-1">100점 만점</span>
                </div>
              </div>

              {/* Feedbacks */}
              <div className="space-y-4">
                {/* Markdown Warn */}
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    post.verificationReport.hasMarkdownAlert ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {post.verificationReport.hasMarkdownAlert ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">서식 깨짐 및 마크다운 기호 준수</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {post.verificationReport.markdownFeedback}
                    </p>
                  </div>
                </div>

                {/* Readability */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">모바일 가독성 및 비유 활용도</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {post.verificationReport.readabilityFeedback}
                    </p>
                  </div>
                </div>

                {/* SEO Improvement */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">구글 검색 SEO 가이드 최적화</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {post.verificationReport.seoFeedback}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cheer Message */}
              <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-xl relative overflow-hidden">
                <div className="absolute right-2 bottom-0 text-indigo-100 opacity-30 pointer-events-none text-6xl font-black">
                  BLODOCK
                </div>
                <h5 className="text-xs font-bold text-indigo-800 mb-1">⚓ BLODOCK 발행 메이트 어드바이스</h5>
                <p className="text-xs text-indigo-700 leading-relaxed italic">
                  "{post.verificationReport.wonyoungCheerMessage}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info & SEO Stats (Column 4) */}
        <div className="lg:col-span-4 p-6 bg-slate-50 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Download Summary Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-600" />
                블로그 이미지/차트 다운로드
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                본문에 들어간 무료 고화질 스톡 포토와 인포그래픽 차트 {images.length}개를 컴퓨터에 간편하게 저장해보세요.
              </p>

              <div className="space-y-2 pt-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => handleDownloadSingleImage(img, i)}
                    className="w-full p-2 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-medium text-slate-700 flex items-center justify-between transition-all group"
                  >
                    <span className="truncate max-w-[170px] text-left">
                      {i + 1}. {img.type === 'chart' ? '📊 차트' : '📷 사진'}: {img.alt}
                    </span>
                    <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 ml-1" />
                  </button>
                ))}
              </div>

              <button
                onClick={handleDownloadAllImages}
                disabled={downloadingAll || images.length === 0}
                className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                {downloadingAll ? "전체 다운로드 실행 중..." : "전체 이미지/차트 1초 다운로드"}
              </button>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">글쓰기 리포트</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 border border-slate-200 rounded-xl shadow-xs">
                  <span className="block text-[10px] text-slate-400 font-semibold">공백 포함 글자수</span>
                  <span className="text-lg font-bold text-slate-800">{charCountWithSpace}자</span>
                </div>
                <div className="bg-white p-3.5 border border-slate-200 rounded-xl shadow-xs">
                  <span className="block text-[10px] text-slate-400 font-semibold">공백 제외 글자수</span>
                  <span className="text-lg font-bold text-slate-800">{charCountWithoutSpace}자</span>
                </div>
                <div className="bg-white p-3.5 border border-slate-200 rounded-xl shadow-xs">
                  <span className="block text-[10px] text-slate-400 font-semibold">단어 수</span>
                  <span className="text-lg font-bold text-slate-800">{wordCount}개</span>
                </div>
                <div className="bg-white p-3.5 border border-slate-200 rounded-xl shadow-xs">
                  <span className="block text-[10px] text-slate-400 font-semibold">예상 독서 시간</span>
                  <span className="text-lg font-bold text-slate-800">~{readTimeMin}분</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">검색용 메타 설명 (Meta Description)</h3>
              <div className="bg-white p-3 border border-slate-200 rounded-xl text-xs text-slate-600 leading-normal">
                {post.metaDescription}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">포스트 검색 결과 아래에 나타나 노출률을 높이는 한 문장입니다.</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">자연스럽게 녹아든 키워드</h3>
              <div className="flex flex-wrap gap-1.5">
                {post.keywordsUsed && post.keywordsUsed.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg font-medium">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {post.wonyoungTip && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>BLODOCK 애드센스 비밀 수익 팁</span>
                </div>
                <p className="text-xs text-emerald-700 leading-normal">
                  {post.wonyoungTip}
                </p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200/60 text-center text-[11px] text-slate-400">
            구글 Blogger 업로드 전, 우측 상단의 <strong className="text-emerald-600">BLODOCK SEO 진단</strong> 버튼을 꼭 눌러보세요!
          </div>
        </div>

      </div>

      {/* Image Full Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              {previewImage.type === 'chart' ? (
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              ) : (
                <ImageIcon className="w-5 h-5 text-purple-600" />
              )}
              <h3 className="text-base font-bold text-slate-800">
                {previewImage.caption}
              </h3>
            </div>

            <div className="bg-slate-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center max-h-[380px]">
              <img 
                src={previewImage.url} 
                alt={previewImage.alt} 
                referrerPolicy="no-referrer"
                onError={() => handleImageError(previewImage.id)}
                className="max-h-[380px] w-auto object-contain"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-5 text-xs text-slate-600 space-y-1">
              <p><strong>출처:</strong> {previewImage.source}</p>
              <p><strong>대체 텍스트 (Alt):</strong> {previewImage.alt}</p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                닫기
              </button>
              <button
                onClick={() => handleDownloadSingleImage(previewImage, images.indexOf(previewImage))}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                고화질 원본 다운로드
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
