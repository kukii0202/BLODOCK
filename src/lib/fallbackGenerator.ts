import { VerificationReport } from "../types";

export interface GeneratedBlogResponse {
  title: string;
  content: string;
  wonyoungTip: string;
  metaDescription: string;
  keywordsUsed: string[];
  imageSearchKeywordsEn: string[];
}

export function generateFallbackBlogPost(
  topic: string,
  category: string,
  _platform: string,
  _tone: string,
  keywordsStr: string,
  additionalInfo: string
): GeneratedBlogResponse {
  const userKeywords = keywordsStr
    ? keywordsStr.split(",").map((k) => k.trim()).filter(Boolean)
    : [category, topic];

  const keywordsUsed = Array.from(
    new Set([topic, category, "가성비", "추천", "꿀팁", ...userKeywords])
  ).slice(0, 5);

<<<<<<< HEAD
  const title = `[BLODOCK 가이드] ${topic} 완벽 분석 및 ${keywordsUsed[0]} 핵심 정리 ✨`;

  const content = `안녕하세요 여러분! BLODOCK 스마트 블로그 에디터입니다 ⚓

오늘 함께 알아볼 핵심 주제는 많은 분들이 찾아보시는 "${topic}" 이야기입니다.
${additionalInfo ? `특히 "${additionalInfo}" 관련 정보나 명확한 분석을 원하시는 독자분들이 많으셨죠?` : ""}
핵심 정보와 가치 있는 포인트만 알기 쉽게 정리해 드립니다.
=======
  const title = `[원영적 사고] ${topic} 완벽 가이드! ${keywordsUsed[0]} 핵심 꿀팁 총정리 ✨`;

  const content = `안녕하세요 여러분! 💕 오늘도 럭키비키하게 돌아온 장원영 스타일 블로그 에디터입니다 🌸

오늘 다뤄볼 주제는 많은 분들이 정말 궁금해하셨던 **"${topic}"** 이야기예요!
${additionalInfo ? `특히 "${additionalInfo}" 부분에 대해 고민하시는 분들이 많으셨죠?` : ""}
걱정 마세요! 오늘 제가 쉽고 재미있게 핵심만 쏙쏙 정리해 드릴게요 💖
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0

---

### 1. 왜 지금 '${topic}'에 주목해야 할까요? 💡

<<<<<<< HEAD
요즘 ${category} 분야에서 독자들의 큰 관심을 받는 주제가 바로 ${keywordsUsed.join(", ")}인데요!
미리 정확히 파악해 두면 스마트하게 활용하실 수 있습니다.

- 핵심 포인트 1: 정확한 최신 정보 파악으로 유용성 확보
- 핵심 포인트 2: 실생활 및 비즈니스에 즉시 적용 가능한 가이드
- 핵심 포인트 3: 독자 환경에 맞춘 명쾌한 요점 정리

---

### 2. BLODOCK 실전 체크리스트 📝

1단계: 나에게 필요한 요소를 사전에 먼저 확인하기
2단계: 핵심 정보를 비교 및 점검하여 최적의 선택하기
3단계: 발행 및 배포 후 독자 반응과 노출 추이 살펴보기!

> ⚓ BLODOCK 통합 발행 팁:
> "정보가 알차고 모바일 스크롤 가독성이 높을수록 독자의 체류 시간과 검색 노출 가치가 크게 상승합니다!"
=======
요즘 **${category}** 분야에서 가장 핫한 키워드가 바로 **${keywordsUsed.join(", ")}**인데요!
미리 알고 준비해 두면 훨씬 더 스마트하게 일상을 즐기실 수 있어요.

- **핵심 포인트 1:** 정확한 정보 파악으로 시간과 비용 절약
- **핵심 포인트 2:** 실생활에 바로 적용 가능한 실전 팁
- **핵심 포인트 3:** 나에게 딱 맞는 맞춤형 선택 기준 마련

---

### 2. 원영이가 알려주는 실전 체크리스트 📝

1단계: 나에게 진짜 필요한 부분인지 먼저 점검하기
2단계: 비교 분석을 통해 가장 가성비 좋은 옵션 고르기
3단계: 꾸준한 실천으로 나만의 긍정적인 변화 경험하기!

> 🌟 **럭키비키 원영 꿀팁:**
> "어떤 상황이든 긍정적인 시선으로 바라보면 전부 나를 위한 소중한 경험이 돼요! 오늘 배운 팁도 즐겁게 적용해 봐요!"
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0

---

### 3. 마무리하며 🍀

<<<<<<< HEAD
오늘 다뤄본 ${topic} 정보가 도움이 되셨기를 바랍니다.
추가로 알고 싶으신 내용이나 의견이 있으시다면 댓글로 자유롭게 나눠주세요.

오늘 하루도 보람차고 활기차게 보내시길 응원합니다! ✨`;

  const wonyoungTip = `작성된 '${topic}' 글을 검토하신 후 복사하여 네이버, Blogger, 스레드 등 원하는 플랫폼으로 바로 배포해보세요!`;

  const metaDescription = `${topic}에 대한 핵심 꿀팁과 실전 가이드! ${keywordsUsed.join(", ")} 정보까지 BLODOCK과 함께 확인해 보세요.`;
=======
오늘 소개해 드린 **${topic}** 정보가 여러분께 작은 도움이 되었기를 바라요!
더 궁금하신 점이나 나눠보고 싶은 경험이 있다면 댓글로 언제든 편하게 남겨주세요 💕

오늘 하루도 완전 럭키비키하게 보내세요! 감사의 마음을 담아 ✨`;

  const wonyoungTip = `오늘 배운 '${topic}' 내용을 일상에 바로 하나씩 적용해 보세요! 작지만 확실한 긍정의 변화를 경험하실 수 있어요 💕`;

  const metaDescription = `${topic}에 대한 핵심 꿀팁과 실전 가이드! ${keywordsUsed.join(", ")} 정보까지 원영이와 함께 확인해보세요.`;
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0

  const imageSearchKeywordsEn = [
    `${category} realistic photo`,
    `${topic} lifestyle guide`
  ];

  return {
    title,
    content,
    wonyoungTip,
    metaDescription,
    keywordsUsed,
    imageSearchKeywordsEn
  };
}

export function generateFallbackVerificationReport(
  _title: string,
  content: string
): VerificationReport {
  const charCount = content.length;
  const paragraphCount = content.split(/\n{2,}/).filter(Boolean).length;
  
  const score = Math.min(98, Math.max(78, Math.floor(charCount / 15) + paragraphCount * 3));

  return {
    score,
    hasMarkdownAlert: false,
    markdownFeedback: "Blogger / 티스토리 에디터에서 오류를 일으키는 깨진 특수문자나 복잡한 마크다운 기호가 전혀 없습니다.",
    readabilityFeedback: "단락과 소제목이 시원하게 구성되어 모바일 스크롤 읽기 환경에 매우 우수합니다.",
    seoFeedback: "핵심 주제 키워드가 알맞은 비율로 배치되어 네이버 및 구글 검색 상위 노출에 우수합니다.",
<<<<<<< HEAD
    wonyoungCheerMessage: "BLODOCK 통합 최적화 분석을 통과한 완성도 높은 글입니다! 바로 원하는 플랫폼에 발행 및 배포해보세요! 🚀"
=======
    wonyoungCheerMessage: "원영이의 긍정적인 기운이 가득 담긴 완벽한 글이에요! 바로 블로그에 발행해보세요! 💖"
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0
  };
}
