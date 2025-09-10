import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface TopicSummary {
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  urgency: "low" | "medium" | "high";
  suggestion: string;
}

export async function summarizeTopic(examples: string[]): Promise<TopicSummary> {
  const prompt = `
역할: 고객 피드백 분석가
작업: 아래 리뷰 묶음에서 공통 포인트를 3줄 이내로 요약하고, 감성(positive/neutral/negative)과 긴급도(low/medium/high), 개선 제안 1가지를 JSON으로 출력해주세요.

리뷰 묶음:
${examples.map((text, i) => `- ${text}`).join("\n")}

출력 JSON 스키마:
{ "summary": string, "sentiment": "positive|neutral|negative", "urgency": "low|medium|high", "suggestion": string }

반드시 위 JSON 형식으로만 응답해주세요.
  `.trim();

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // JSON 추출 (코드 블록 제거)
    const cleanText = text.replace(/```json|```/g, "").trim();
    const json = JSON.parse(cleanText);
    
    return {
      summary: json.summary || "요약을 생성할 수 없습니다.",
      sentiment: ["positive", "neutral", "negative"].includes(json.sentiment) 
        ? json.sentiment : "neutral",
      urgency: ["low", "medium", "high"].includes(json.urgency) 
        ? json.urgency : "medium",
      suggestion: json.suggestion || "추가 분석이 필요합니다."
    };
  } catch (error) {
    console.error("Gemini API 호출 오류:", error);
    return {
      summary: "AI 요약 생성 중 오류가 발생했습니다.",
      sentiment: "neutral",
      urgency: "medium",
      suggestion: "수동으로 리뷰를 확인해주세요."
    };
  }
}

export async function generateDailySummary(
  topicSummaries: Array<{
    topic: string;
    count: number;
    sentiment: string;
    urgency: string;
    summary: string;
  }>
): Promise<string> {
  const prompt = `
역할: 고객 서비스 매니저
작업: 오늘 수집된 T world 앱 리뷰의 토픽별 요약을 바탕으로 전체 상황을 3-5문장으로 종합 요약해주세요.

토픽별 요약:
${topicSummaries.map(t => 
  `- ${t.topic} (${t.count}건, ${t.sentiment}, ${t.urgency}): ${t.summary}`
).join("\n")}

다음 관점에서 종합해주세요:
1. 가장 빈번한 이슈와 긍정적 피드백
2. 우선순위가 높은 개선점
3. 전반적인 고객 만족도 트렌드

한국어로 답변해주세요.
  `.trim();

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("일일 요약 생성 오류:", error);
    return "일일 요약을 생성하는 중 오류가 발생했습니다.";
  }
}

