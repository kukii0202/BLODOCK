import { BlogImage } from "../types";

export type StockProvider = 'Pollinations' | 'Unsplash' | 'Pexels' | 'Pixabay' | 'QuickChart';

interface StockPhoto {
  url: string;
  alt: string;
  keyword: string;
  provider: Exclude<StockProvider, 'Pollinations' | 'QuickChart'>;
}

// Multi-provider high-res realistic stock photo database
const MULTI_PROVIDER_PHOTOS: Record<string, StockPhoto[]> = {
  finance: [
    {
      url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
      alt: "Piggy bank with coins representing financial planning and savings",
      keyword: "financial planning piggybank coins",
      provider: "Unsplash"
    },
    {
      url: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Calculators and savings piggy bank on office desk",
      keyword: "savings budget accountant desk",
      provider: "Pexels"
    },
    {
      url: "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg",
      alt: "Financial stock market chart monitor and investment trend",
      keyword: "stock investment chart trading monitor",
      provider: "Pixabay"
    },
    {
      url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
      alt: "Desk with financial calculator, budget planner and pen",
      keyword: "financial budget calculator desk",
      provider: "Unsplash"
    },
    {
      url: "https://images.pexels.com/photos/160107/pexels-photo-160107.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Hand writing financial asset plan in notebook with laptop",
      keyword: "wealth management financial notebook",
      provider: "Pexels"
    }
  ],
  tech: [
    {
      url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      alt: "Modern workspace with Macbook, smartphone and wireless headphones",
      keyword: "modern workspace macbook smartphone",
      provider: "Unsplash"
    },
    {
      url: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Modern software developer workspace and IT technology gadgets",
      keyword: "tech developer workspace gadgets",
      provider: "Pexels"
    },
    {
      url: "https://cdn.pixabay.com/photo/2015/01/08/18/27/startup-593341_1280.jpg",
      alt: "Digital technology user interface and tablet control",
      keyword: "tech startup tablet interface",
      provider: "Pixabay"
    },
    {
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      alt: "Person operating modern touchscreen digital tablet",
      keyword: "digital tablet screen user interface",
      provider: "Unsplash"
    },
    {
      url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Smart electronics and home automation setup",
      keyword: "smart home tech electronics",
      provider: "Pexels"
    }
  ],
  lifestyle: [
    {
      url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
      alt: "Cozy morning coffee with notebook and daily planner",
      keyword: "cozy coffee notebook lifestyle",
      provider: "Unsplash"
    },
    {
      url: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Relaxed lifestyle sitting with coffee and tablet",
      keyword: "relaxed coffee daily lifestyle",
      provider: "Pexels"
    },
    {
      url: "https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_1280.jpg",
      alt: "Minimalist workspace setting with tea and daily journal",
      keyword: "journal tea minimalist workspace",
      provider: "Pixabay"
    },
    {
      url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
      alt: "Smartphone usage in everyday relaxed setting",
      keyword: "smartphone lifestyle daily routine",
      provider: "Unsplash"
    }
  ],
  health: [
    {
      url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
      alt: "Fresh healthy organic meal salad preparation",
      keyword: "fresh healthy organic nutrition salad",
      provider: "Unsplash"
    },
    {
      url: "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Fitness wellness stretching and healthy active routine",
      keyword: "wellness stretching workout fitness",
      provider: "Pexels"
    },
    {
      url: "https://cdn.pixabay.com/photo/2017/04/06/11/24/fashion-2208045_1280.jpg",
      alt: "Smartwatch fitness health tracking and water bottle",
      keyword: "smartwatch health tracking fitness",
      provider: "Pixabay"
    },
    {
      url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
      alt: "Morning wellness stretching and yoga routine",
      keyword: "wellness yoga stretching exercise",
      provider: "Unsplash"
    }
  ],
  food: [
    {
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      alt: "Delicious gourmet culinary dish presentation",
      keyword: "gourmet food dish dining table",
      provider: "Unsplash"
    },
    {
      url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Fresh home cooked recipe dish and healthy ingredients",
      keyword: "home cooked recipe kitchen fresh",
      provider: "Pexels"
    },
    {
      url: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
      alt: "Artisan gourmet baking and culinary cooking process",
      keyword: "artisan culinary baking gourmet",
      provider: "Pixabay"
    }
  ],
  travel: [
    {
      url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      alt: "Travel map, camera, and passport packing concept",
      keyword: "travel map camera passport trip",
      provider: "Unsplash"
    },
    {
      url: "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Breathtaking outdoor nature travel landscape scenery",
      keyword: "outdoor nature scenic mountain roadtrip",
      provider: "Pexels"
    },
    {
      url: "https://cdn.pixabay.com/photo/2017/12/15/13/51/polynesia-3021072_1280.jpg",
      alt: "Tropical beach ocean resort vacation landscape",
      keyword: "tropical beach resort vacation travel",
      provider: "Pixabay"
    }
  ]
};

/**
 * Generate a Pollinations AI image URL with prompt engineering for editorial blog quality
 */
export function createPollinationsImageUrl(keywordEn: string, seed?: number): string {
  const cleanKeyword = keywordEn.replace(/[^a-zA-Z0-9\s,-]/g, ' ').trim() || "modern technology workspace";
  const prompt = `editorial realistic professional photo of ${cleanKeyword}, highly detailed, clean lighting, 8k resolution, blog cover photo style`;
  const encodedPrompt = encodeURIComponent(prompt);
  const randomSeed = seed ?? Math.floor(Math.random() * 899999 + 100000);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800&nologo=true&seed=${randomSeed}`;
}

/**
 * Return external stock platform direct search links so user can easily search Unsplash, Pexels, and Pixabay
 */
export function getExternalStockSearchUrls(keywordEn: string) {
  const q = encodeURIComponent(keywordEn || "workspace");
  return {
    unsplash: `https://unsplash.com/s/photos/${q}`,
    pexels: `https://www.pexels.com/search/${q}/`,
    pixabay: `https://pixabay.com/images/search/${q}/`
  };
}

/**
 * Get a photo based on English search term and selected provider filter
 * Defaults to Pollinations AI generation first, with stock photo fallback
 */
export function getPhotoByEnglishSearch(
  keywordEn: string, 
  category: string, 
  preferredProvider?: StockProvider | 'all'
): { 
  url: string; 
  alt: string; 
  source: string; 
  keyword: string; 
  provider: StockProvider;
  fallbackUrl: string;
  fallbackProvider: StockProvider;
} {
  const kwLower = keywordEn.toLowerCase();
  
  let keyGroup = "lifestyle";
  if (kwLower.includes("finan") || kwLower.includes("money") || kwLower.includes("bank") || kwLower.includes("invest") || kwLower.includes("tax") || category.includes("금융")) {
    keyGroup = "finance";
  } else if (kwLower.includes("tech") || kwLower.includes("phone") || kwLower.includes("computer") || kwLower.includes("device") || category.includes("IT")) {
    keyGroup = "tech";
  } else if (kwLower.includes("health") || kwLower.includes("fit") || kwLower.includes("doctor") || kwLower.includes("diet") || category.includes("건강")) {
    keyGroup = "health";
  } else if (kwLower.includes("food") || kwLower.includes("cook") || kwLower.includes("eat") || kwLower.includes("recipe") || category.includes("음식")) {
    keyGroup = "food";
  } else if (kwLower.includes("travel") || kwLower.includes("trip") || kwLower.includes("hotel") || category.includes("여행")) {
    keyGroup = "travel";
  }

  let stockPool = MULTI_PROVIDER_PHOTOS[keyGroup] || MULTI_PROVIDER_PHOTOS.lifestyle;

  // Select a fallback stock photo
  const stockSelected = stockPool[Math.floor(Math.random() * stockPool.length)];

  // If user explicitly chose a specific stock provider (Unsplash, Pexels, or Pixabay)
  if (preferredProvider === 'Unsplash' || preferredProvider === 'Pexels' || preferredProvider === 'Pixabay') {
    const filtered = stockPool.filter(p => p.provider === preferredProvider);
    const chosen = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : stockSelected;

    return {
      url: chosen.url,
      alt: chosen.alt,
      source: `${chosen.provider} Free Stock Photo (Search: "${keywordEn}")`,
      keyword: keywordEn,
      provider: chosen.provider,
      fallbackUrl: createPollinationsImageUrl(keywordEn),
      fallbackProvider: 'Pollinations'
    };
  }

  // DEFAULT & PRIMARY: Pollinations AI Generation first!
  const pollinationsUrl = createPollinationsImageUrl(keywordEn);
  return {
    url: pollinationsUrl,
    alt: `${keywordEn} - Pollinations AI 이미지`,
    source: `Pollinations AI Image Generator (Prompt: "${keywordEn}")`,
    keyword: keywordEn,
    provider: 'Pollinations',
    fallbackUrl: stockSelected.url,
    fallbackProvider: stockSelected.provider
  };
}

/**
 * Generate a QuickChart PNG url for informative blog charts
 */
export function createChartUrl(title: string, labels: string[], data: number[]): string {
  const chartConfig = {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)',
          'rgba(59, 130, 246, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(139, 92, 246, 0.85)',
          'rgba(236, 72, 153, 0.85)'
        ].slice(0, labels.length),
        borderRadius: 6
      }]
    },
    options: {
      title: { display: true, text: title, fontSize: 16, fontColor: '#1e293b', fontStyle: 'bold' },
      legend: { display: false },
      plugins: { datalabels: { display: true, color: '#1e293b', anchor: 'end', align: 'start' } }
    }
  };
  return `https://quickchart.io/chart?bkg=white&w=800&h=420&c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
}

/**
 * Generate naturally positioned blog images
 * PRIMARY: Pollinations AI generation first, with fallback to Unsplash/Pexels/Pixabay stock photos
 */
export function generateBlogImages(
  category: string,
  topic: string,
  englishKeywords?: string[],
  providerFilter?: StockProvider | 'all'
): BlogImage[] {
  const images: BlogImage[] = [];

  const kw1 = englishKeywords?.[0] || `${category} ${topic} realistic photo`;
  const kw2 = englishKeywords?.[1] || `${topic} detailed guide workflow`;

  // Default provider filter is Pollinations AI primary
  const targetProvider = providerFilter && providerFilter !== 'all' ? providerFilter : 'Pollinations';

  // 1. Primary image: Pollinations AI Image first (with stock photo fallback)
  const photo1 = getPhotoByEnglishSearch(kw1, category, targetProvider);

  images.push({
    id: 'img_' + Math.random().toString(36).substr(2, 7),
    url: photo1.url,
    type: 'photo',
    alt: photo1.alt,
    caption: `[이미지 1] ${topic} ${photo1.provider === 'Pollinations' ? 'AI 생성이미지' : '스톡사진'} (${photo1.provider})`,
    source: photo1.source,
    insertedParagraphIndex: 1,
    englishKeyword: kw1,
    provider: photo1.provider,
    fallbackUrl: photo1.fallbackUrl,
    fallbackProvider: photo1.fallbackProvider
  });

  // 2. Second image: An Infographic Chart or secondary Pollinations / stock photo
  if (Math.random() > 0.35) {
    let chartTitle = `${topic.slice(0, 15)} 핵심 가치 비교`;
    let labels = ['만족도', '효율성', '추천도', '가성비'];
    let data = [88, 92, 95, 85];

    if (category === "재테크/금융") {
      chartTitle = "소액 재테크 및 적금 기간별 수익 비중 (%)";
      labels = ["3개월", "6개월", "12개월", "24개월"];
      data = [2.5, 3.8, 5.2, 7.0];
    } else if (category === "IT/가전") {
      chartTitle = "체감 가성비 및 사용자 만족도 평가 점수 (100점 만점)";
      labels = ["디자인", "성능", "배터리", "가성비"];
      data = [88, 94, 91, 96];
    } else if (category === "건강/의학" || category === "일상/생활") {
      chartTitle = "실천 후 체감 효과 및 지속 가능성 만족도 (%)";
      labels = ["1주차", "2주차", "1달차", "3달차"];
      data = [45, 68, 85, 94];
    }

    const chartUrl = createChartUrl(chartTitle, labels, data);
    const pollinationsChartFallback = createPollinationsImageUrl(`${chartTitle} infographic bar chart graph visualization`, Math.floor(Math.random() * 100000));

    images.push({
      id: 'img_' + Math.random().toString(36).substr(2, 7),
      url: chartUrl,
      type: 'chart',
      alt: chartTitle,
      caption: `[차트 1] ${chartTitle} 요약 인포그래픽`,
      source: "QuickChart Free Engine (Fallback: Pollinations AI)",
      insertedParagraphIndex: 3,
      provider: "QuickChart",
      fallbackUrl: pollinationsChartFallback,
      fallbackProvider: "Pollinations"
    });
  } else {
    const photo2 = getPhotoByEnglishSearch(kw2, category, targetProvider);
    images.push({
      id: 'img_' + Math.random().toString(36).substr(2, 7),
      url: photo2.url,
      type: 'photo',
      alt: photo2.alt,
      caption: `[이미지 2] ${topic} 상세 가이드 안내 이미지 (${photo2.provider})`,
      source: photo2.source,
      insertedParagraphIndex: 3,
      englishKeyword: kw2,
      provider: photo2.provider,
      fallbackUrl: photo2.fallbackUrl,
      fallbackProvider: photo2.fallbackProvider
    });
  }

  return images;
}

/**
 * Trigger browser file download for a specific image URL
 */
export async function downloadImageFile(imageUrl: string, filename: string): Promise<void> {
  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (!response.ok) throw new Error("네트워크 응답 오류");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename.endsWith('.jpg') || filename.endsWith('.png') ? filename : `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.warn("Direct blob download restricted, opening in new tab:", err);
    // Fallback: Open in new window for saving
    const a = document.createElement('a');
    a.href = imageUrl;
    a.target = '_blank';
    a.download = filename;
    a.click();
  }
}
