// 한국어 불용어 목록
const STOPWORDS = new Set([
  "이", "그", "저", "것", "들", "의", "에", "를", "을", "와", "과", "도", "는", "은", "가", "이",
  "하다", "있다", "되다", "하는", "있는", "되는", "같은", "다른", "많은", "좋은", "나쁜",
  "앱", "어플", "사용", "이용", "정말", "너무", "진짜", "완전", "아주", "매우", "조금",
  "좀", "잘", "안", "못", "더", "덜", "또", "다시", "계속", "항상", "가끔", "때문에",
  "그래서", "하지만", "그런데", "그러나", "근데", "그냥", "일단", "우선", "먼저"
]);

export interface KeywordCluster {
  topic: string;
  keywords: string[];
  reviews: string[];
  count: number;
  sentiment: "positive" | "neutral" | "negative";
}

// 텍스트 토큰화 및 키워드 추출
export function extractKeywords(text: string, minLength = 2): string[] {
  // 한글, 영문, 숫자만 추출
  const tokens = text
    .toLowerCase()
    .replace(/[^\w가-힣\s]/g, " ")
    .split(/\s+/)
    .filter(token => 
      token.length >= minLength && 
      !STOPWORDS.has(token) &&
      !/^\d+$/.test(token) // 숫자만 있는 토큰 제외
    );

  // 빈도 계산
  const frequency: { [key: string]: number } = {};
  tokens.forEach(token => {
    frequency[token] = (frequency[token] || 0) + 1;
  });

  // 빈도 기준 정렬 후 상위 키워드 반환
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

// 간단한 감성 분석 (키워드 기반)
export function analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
  const positiveWords = ["좋", "만족", "편리", "빠른", "훌륭", "최고", "감사", "추천", "완벽"];
  const negativeWords = ["나쁜", "느린", "불편", "짜증", "화나", "최악", "실망", "문제", "오류", "버그"];

  const positiveCount = positiveWords.reduce((count, word) => 
    count + (text.includes(word) ? 1 : 0), 0);
  const negativeCount = negativeWords.reduce((count, word) => 
    count + (text.includes(word) ? 1 : 0), 0);

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}

// Jaccard 유사도 계산
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

// 키워드 기반 클러스터링
export function clusterReviews(reviews: Array<{
  text: string;
  rating: number;
  id: string;
}>): KeywordCluster[] {
  // 각 리뷰에서 키워드 추출
  const reviewsWithKeywords = reviews.map(review => ({
    ...review,
    keywords: extractKeywords(review.text),
    sentiment: analyzeSentiment(review.text)
  }));

  const clusters: KeywordCluster[] = [];
  const processed = new Set<string>();

  reviewsWithKeywords.forEach(review => {
    if (processed.has(review.id)) return;

    const keywordSet = new Set(review.keywords);
    const similarReviews = [review];
    processed.add(review.id);

    // 유사한 리뷰 찾기
    reviewsWithKeywords.forEach(other => {
      if (processed.has(other.id) || other.id === review.id) return;

      const otherKeywordSet = new Set(other.keywords);
      const similarity = jaccardSimilarity(keywordSet, otherKeywordSet);

      if (similarity > 0.3) { // 30% 이상 유사하면 같은 클러스터
        similarReviews.push(other);
        processed.add(other.id);
        // 키워드 세트 업데이트
        other.keywords.forEach(keyword => keywordSet.add(keyword));
      }
    });

    if (similarReviews.length >= 2) { // 최소 2개 이상의 리뷰가 있어야 클러스터 생성
      // 주요 키워드로 토픽명 생성
      const topKeywords = Array.from(keywordSet)
        .slice(0, 3)
        .join(", ");

      // 전체 감성 계산
      const sentimentCounts = {
        positive: similarReviews.filter(r => r.sentiment === "positive").length,
        neutral: similarReviews.filter(r => r.sentiment === "neutral").length,
        negative: similarReviews.filter(r => r.sentiment === "negative").length,
      };

      const dominantSentiment = Object.entries(sentimentCounts)
        .sort(([,a], [,b]) => b - a)[0][0] as "positive" | "neutral" | "negative";

      clusters.push({
        topic: topKeywords || "기타",
        keywords: Array.from(keywordSet).slice(0, 5),
        reviews: similarReviews.map(r => r.text),
        count: similarReviews.length,
        sentiment: dominantSentiment
      });
    }
  });

  // 클러스터를 크기 순으로 정렬
  return clusters.sort((a, b) => b.count - a.count);
}

// 언어 감지 (간단한 휴리스틱)
export function detectLanguage(text: string): string {
  const koreanPattern = /[가-힣]/;
  const englishPattern = /[a-zA-Z]/;
  
  const koreanMatches = text.match(/[가-힣]/g) || [];
  const englishMatches = text.match(/[a-zA-Z]/g) || [];
  
  if (koreanMatches.length > englishMatches.length) {
    return "ko";
  } else if (englishMatches.length > koreanMatches.length) {
    return "en";
  }
  
  return "ko"; // 기본값
}

