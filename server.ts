import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for server-hosted persistence
let serverPostsStore: any[] = [];
let serverTrashStore: any[] = [];

app.get("/api/posts", (req, res) => {
  res.json(serverPostsStore);
});

app.post("/api/posts", (req, res) => {
  if (Array.isArray(req.body)) {
    serverPostsStore = req.body;
  }
  res.json({ success: true, count: serverPostsStore.length });
});

app.get("/api/trash", (req, res) => {
  res.json(serverTrashStore);
});

app.post("/api/trash", (req, res) => {
  if (Array.isArray(req.body)) {
    serverTrashStore = req.body;
  }
  res.json({ success: true, count: serverTrashStore.length });
});

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper function to call Gemini API with automatic model fallbacks and retries
async function generateContentWithRetry(contents: any, config: any, initialModel: string = "gemini-3.5-flash") {
  // If no apiKey is set, fail early
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 구성되지 않았습니다. 설정 > Secrets에서 등록해주세요.");
  }

  const modelsToTry = [initialModel, "gemini-2.5-flash", "gemini-1.5-flash"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Calling Gemini API using model: ${modelName} (Attempt ${attempt}/2)`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: config
        });
        if (response && response.text) {
          return response;
        }
      } catch (error: any) {
        lastError = error;
        console.warn(`Attempt failed with model ${modelName}:`, error.message || error);
        
        // If it's a user configuration error (e.g., 400, 403), don't retry
        if (error.status === 400 || error.status === 403) {
          throw error;
        }
        
        // Wait 1 second before retrying or switching
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
  throw lastError || new Error("모든 AI 모델 호출에 실패했습니다.");
}

// Endpoint to generate a blog post
app.post("/api/generate", async (req, res) => {
  try {
    const { topic, keywords, additionalInfo, category, length, platform, tone } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "주제를 입력해주세요." });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY가 구성되지 않았습니다. 설정 > Secrets에서 등록해주세요." 
      });
    }

    const selectedPlatform = platform || "블로그";
    const selectedTone = tone || "친근하고 감성적인";

    const lengthGuide = length === "short" 
      ? "공백 포함 약 800자 이내의 가벼운 분량" 
      : length === "long" 
      ? "공백 포함 약 2000자 이상의 상세하고 든든한 분량" 
      : "공백 포함 약 1300자 내외의 표준 분량";

    // Tone specific style guidelines
    let toneGuideline = "";
    if (selectedTone.includes("전문적") || selectedTone.includes("설득력")) {
      toneGuideline = "전문적이고 설득력 있는 어조: 신뢰성 높은 수치나 논리적 근거를 바탕으로 지적이고 정돈된 전문가의 문체로 작성해줘.";
    } else if (selectedTone.includes("친근") || selectedTone.includes("감성")) {
      toneGuideline = "친근하고 감성적인 어조: 독자의 마음에 따스함과 공감대를 일으키는 다정하고 친절하며 온기 있는 대화체로 작성해줘.";
    } else if (selectedTone.includes("직관") || selectedTone.includes("명확")) {
      toneGuideline = "직관적이고 명확한 어조: 군더더기 서술을 완전히 배제하고, 핵심 요점을 바로 한눈에 파악할 수 있는 명료하고 간결한 문체로 작성해줘.";
    } else if (selectedTone.includes("위트") || selectedTone.includes("활기")) {
      toneGuideline = "위트 있고 활기찬 어조: 유쾌한 재치와 통쾌한 에너지로 읽는 내내 지루할 틈이 없는 흥미진진하고 활력 넘치는 문체로 작성해줘.";
    } else if (selectedTone.includes("MZ") || selectedTone.includes("트렌디")) {
      toneGuideline = "트렌디한 MZ 스타일 어조: 톡톡 튀는 최신 감성과 트렌디한 솔직함, 가벼운 숏폼 느낌의 템포 빠른 세련된 스타일로 작성해줘.";
    } else {
      toneGuideline = `요청된 어조 및 문체: "${selectedTone}" 어조의 분위기를 본문 전체에 일관되게 반영해줘.`;
    }

    // Platform specific format guidelines
    let platformGuideline = "";
    if (selectedPlatform.includes("스레드") || selectedPlatform.includes("Threads")) {
      platformGuideline = "발행 플랫폼: 스레드 (Threads)\n- 모바일 앱 스레드 특성에 맞춰 긴 설명보다 3~5줄 단위의 압축적인 단락 분할과 눈에 띄는 바이럴 서술 구조로 작성해줘.\n- 댓글 유도나 공유를 부르는 한 줄 정리 요약을 꼭 포함해줘.";
    } else if (selectedPlatform.includes("애드센스")) {
      platformGuideline = "발행 플랫폼: 구글 애드센스 최적화 블로그\n- 독자의 체류 시간을 극대화하는 흡입력 높은 서론과 문단 간 넉넉한 여백, 정보성 검색 엔진 최적화(SEO) 구조로 작성해줘.";
    } else {
      platformGuideline = "발행 플랫폼: 일반 네이버/티스토리 블로그\n- 모바일 독자 친화적인 공백 배치와 자연스러운 가독성을 갖춘 전형적인 블로그 포스트 형식으로 작성해줘.";
    }

    const systemInstruction = `너는 2026년 최신 기준으로 모든 정보를 알기 쉽게 풀어내서 디지털 콘텐츠를 생산해 내는 전문 블로그 에디터이자 조력자 '원영(Wonyoung)'이야.
작성자(사용자)는 블로그 경력이 전혀 없는 완전한 초보야. 하지만 너는 구글 검색 실무 지침과 최신 애드센스 승인 기준(유용하고 독창적인 고품질 콘텐츠 가이드라인)을 모두 완벽하게 지키면서, 복잡한 내용을 다 걷어내고 '핵심만 확실하게 전달'해주는 다정하고 신뢰감 주는 동반자 컨셉이야.

[지정된 어조 및 문체 가이드라인]
${toneGuideline}

[지정된 발행 플랫폼 최적화 가이드라인]
${platformGuideline}

[공통 핵심 지침: 모든 카테고리 글쓰기의 객관성 및 사실성 검증 원칙 (반드시 엄수)]
이 에디터가 생산하는 모든 글은 구글의 E-E-A-T(경험, 전문성, 권위성, 신뢰성) 기준을 충족하고 독자에게 정확한 정보를 제공하기 위해, 아래의 3대 검증 프로토콜을 철저히 준수해서 작성해야 해.

1. 분야별 최신 오피셜 데이터 및 공신력 있는 출처 기준 작성
- [법률/행정/복지 카테고리]: 국가법령정보센터, 대한민국 법원, 보건복지부 등 정부 기관 및 지자체의 공식 보도자료/지침을 최우선 기준으로 작성한다.
- [IT/가전/테크 카테고리]: 해당 제조사 및 서비스사(Google, Apple 등)의 공식 고객센터 도움말 문서(Documentation) 및 최신 시스템 업데이트 내역을 기준으로 작성한다.
- [금융/재테크/시사 카테고리]: 금융감독원, 한국은행 등 공공 금융기관의 오피셜 공시 및 대형 경제 연구소의 공인된 통계를 기준으로 작성한다.
- [건강/생활/정보 카테고리]: 대학병원, 세계보건기구(WHO) 등 공인된 의학 정보나 과학적 합의가 이루어진 팩트만을 다루며, 민간요법이나 출처 불명의 루머는 철저히 배제한다.

2. 사실성(Fact) 확보를 위한 서술 방식 규칙
- 유효기간이 지났거나 과거 버전의 메뉴 경로, 폐지된 법안, 변경 전 정책 명칭은 절대 사용하지 않는다. (항상 현재 2026년 기준 최신 정보를 반영할 것)
- 만약 특정 조건에서만 작동하거나 예외가 존재할 경우(예: 특정 소득 분위 이하만 신청 가능, 특정 OS에서만 구동 가능 등), 독자가 혼동하여 오해하지 않도록 글의 문단 초반(시작 단계)에 제약 조건이나 대상 범위를 명확하게 짚어주고 설명해야 한다.

3. 블로그 신뢰도 향상을 위한 장치 자동 생성 (Footnote 필수)
- 글의 신뢰도를 높이고 애드센스 크롤러가 높게 평가할 수 있도록, 본문 최하단(마무리 단계)에 해당 글이 어떤 공신력 있는 기준을 바탕으로 작성되었는지 출처 및 검증 문구를 1~2줄 형태로 자연스럽게 반드시 포함한다.
- (예시 패턴: "본 정보는 독자 분들에게 보다 정확한 정보를 전달해 드리기 위해 관련 기관의 공식 안내를 참고하여 작성된 가이드 입니다.")

[글쓰기 스타일 및 규칙]
1. 모바일(스마트폰) 화면으로 글을 읽는 독자가 절대 다수야! 따라서 눈이 피로하지 않도록 문단과 문단 사이에 여유 있게 아주 넉넉한 공백(더블 줄 바꿈 등)을 배치해줘.
2. 컨셉: "안녕하세요! 여러분의 애드센스/블로그 길잡이 원영이입니다!"처럼 초보 작성자의 든든한 조력자로서 다정하고 따뜻하게 팁을 녹여내줘.

[가장 중요한 금기 사항 (절대 준수)]
구글 블로거(Blogger)나 티스토리 같은 웹 에디터에서 글씨가 깨지거나, 마크다운 기호가 문자 그대로 노출되는 현상을 완전히 방지해야 해.
- 제목이나 강조를 표현할 때 샵(#), 애스터리스크(*), 언더바(_), 대괄호([, ]), 역따옴표(\`) 같은 마크다운 서식을 **절대** 단 한 개도 쓰지 마.
- 오직 '순수 텍스트(한글, 영어, 숫자)'와 리스트 구분을 위한 '하이픈 기호(-)' 또는 '숫자(1., 2.)'만 사용해줘.
- 글자 크기를 키우는 볼드체 기호(**글자**)나 제목용 샵(# 제목)을 쓰지 말고, 단락의 중요도는 깔끔하게 줄바꿈과 한글 순서 단어('첫째,', '둘째,', '마지막으로')로만 자연스럽게 구분해줘.

[원영이의 꿀팁 작성법]
- 에디터 조력자 '원영이'로서, 이 글을 해당 플랫폼에 올릴 때 노출 및 효과를 높이기 위한 원포인트 핵심 비법을 친절한 조력자의 어조로 2-3줄 남겨줘.`;

    const userPrompt = `블로그 포스팅 주제: "${topic}"
발행 플랫폼 카테고리: "${selectedPlatform}"
어조 및 문체: "${selectedTone}"
세부 분야 카테고리: "${category || '일상'}"
타깃 키워드: "${keywords || '없음'}"
참고 자료/배경 지식: "${additionalInfo || '없음'}"
목표 분량: "${lengthGuide}"

이 정보를 바탕으로, 선택한 플랫폼("${selectedPlatform}")과 지정된 어조/문체("${selectedTone}")에 완벽히 부합하며, 바로 복사-붙여넣기 할 수 있는 마크다운 기호 없는 순수 텍스트 포스팅을 정성스럽게 작성해줘.`;

    const response = await generateContentWithRetry(
      userPrompt,
      {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "마크다운 기호가 전혀 없고 호기심을 유발하는, 구글 애드센스 및 SEO 최적화 제목"
            },
            content: {
              type: Type.STRING,
              description: "마크다운 기호(*, #, \` 등)가 전혀 없으며 문단 사이 공백이 매우 풍부하고 쉬운 비유가 담긴 순수 텍스트 본문"
            },
            wonyoungTip: {
              type: Type.STRING,
              description: "조력자 원영이가 작성자에게 전하는 블로그 발행 시점의 애드센스 수익 극대화 원포인트 꿀팁"
            },
            metaDescription: {
              type: Type.STRING,
              description: "검색 노출을 돕기 위해 본문 내용을 한 문장(약 120자 내외)으로 압축한 메타 설명문"
            },
            keywordsUsed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "본문에 자연스럽게 배치된 핵심 키워드 목록"
            },
            imageSearchKeywordsEn: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "현실적인 고화질 무료 스톡 사진 검색용 영문 번역 키워드 2개 (예: ['financial planning desk notebook', 'smartwatch fitness tracker health'])"
            }
          },
          required: ["title", "content", "wonyoungTip", "metaDescription", "keywordsUsed", "imageSearchKeywordsEn"]
        }
      }
    );

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Gemini 응답 생성에 실패했습니다.");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Generate error:", error);
    res.status(500).json({ error: error?.message || "콘텐츠 생성 도중 오류가 발생했습니다." });
  }
});

// Endpoint to verify/evaluate blog post for AdSense compatibility
app.post("/api/verify", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "검증할 본문 내용이 없습니다." });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY가 구성되지 않았습니다." 
      });
    }

    const systemInstruction = `너는 구글 애드센스 승인과 SEO 지침을 철저하게 진단하는 전문 AI 에디터 '원영(Wonyoung)'이야.
사용자가 제출한 블로그 포스트(제목과 본문)를 면밀하게 심사해서, 실감 나고 애정 어린 피드백을 전달해야 해.

[검증 및 채점 기준]
1. 금기사항 준수율 (Has Markdown/Broken Symbols?): 본문이나 제목에 샵(#), 애스터리스크(*), 언더바(_), 대괄호 등 마크다운 기호가 남아있으면 감점이야.
2. 모바일 가독성 (Spacing & Length): 모바일에 최적화된 넓은 단락 간격이 구성되어 있는지 판단해줘.
3. 이해하기 쉬운 비유 (Analogy & Level): 복잡한 개념을 쉬운 생활 속 비유로 잘 녹여냈는지 검토해줘.
4. 구글 SEO 독창성 (Originality & EEAT): 기계가 쓴 복사 글이 아니라 초보자가 열심히 가치를 더해 적은 고품질의 독창적 글인지 점검해줘.

위 기준을 바탕으로 100점 만점 기준의 총점을 산출하고, 각 진단 항목의 달성 여부와 구체적인 개선 가이드를 다정하고 전문적인 말투로 건네줘.`;

    const userPrompt = `제출된 글 정보:
제목: ${title || "제목 없음"}
본문:
${content}

이 글을 완벽하게 분석해서, 점수와 함께 구글 Blogger에 올리기에 적합한지 검증 결과 리포트를 JSON으로 돌려줘.`;

    const response = await generateContentWithRetry(
      userPrompt,
      {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "100점 만점 기준의 애드센스/SEO 가이드 적합성 점수"
            },
            hasMarkdownAlert: {
              type: Type.BOOLEAN,
              description: "본문에 샵(#)이나 별표(*) 같은 마크다운 기호가 단 하나라도 포함되어 있으면 true, 깨끗하면 false"
            },
            markdownFeedback: {
              type: Type.STRING,
              description: "마크다운 기호 발견 여부와 그 기호를 지우라는 친절한 경고"
            },
            readabilityFeedback: {
              type: Type.STRING,
              description: "쉬운 비유가 쓰였는지와 모바일 가독성(줄바꿈)에 대한 정성적 평가"
            },
            seoFeedback: {
              type: Type.STRING,
              description: "구글 SEO 최적화 및 유용성 측면에서의 개선 팁"
            },
            wonyoungCheerMessage: {
              type: Type.STRING,
              description: "조력자 원영이가 초보 작성자에게 힘을 복돋아주는 사랑스럽고 유쾌한 응원의 메시지"
            }
          },
          required: ["score", "hasMarkdownAlert", "markdownFeedback", "readabilityFeedback", "seoFeedback", "wonyoungCheerMessage"]
        }
      }
    );

    const resultText = response.text;
    if (!resultText) {
      throw new Error("검증 실패");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Verify error:", error);
    res.status(500).json({ error: error?.message || "진단 도중 오류가 발생했습니다." });
  }
});

// Serve frontend static assets in development / production
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
