// src/utils/emotionUtils.ts

/** 감정 키워드에 대응하는 이모지 매핑 */
const emotionIconMap: Record<string, string> = {
  "행복해요": "😊",
  "추워요": "🥶",
  "더워요": "🥵",
  "건조해요": "😰",
  "습해요": "💧",
  "습함": "💧",
  "밝음": "😎",
  "너무 어두워요": "😴",
  "햇빛이 너무 강해요": "😎",
  "목말라요": "🥺",
};

/**
 * 감정 문자열(예: "습함, 밝음")을 받아 이모지 문자열로 변환
 */
export function getEmojiFromEmotion(emotion: string): string {
  const cleanKeywords = emotion.replace(/\s/g, '').split(',');
  return cleanKeywords.map(e => emotionIconMap[e] || '❓').join('');
}

/**
 * 감정 문자열을 기반으로 식물 캐릭터 이미지 URL을 반환
 */
export function getImageUrlByEmotion(emotion: string): string {
  if (emotion.includes("행복")) return "/images/emotion/happy.png";
  if (emotion.includes("추움")) return "/images/emotion/cold.png";
  if (emotion.includes("더움")) return "/images/emotion/hot.png";
  if (emotion.includes("건조")) return "/images/emotion/dry.png";
  if (emotion.includes("습함") || emotion.includes("습해요")) return "/images/emotion/humid.png";
  if (emotion.includes("너무 어두워요")) return "/images/emotion/dark.png";
  if (emotion.includes("밝음") || emotion.includes("햇빛")) return "/images/emotion/bright.png";
  if (emotion.includes("목말라요")) return "/images/emotion/thirsty.png";

  return "/images/emotion/default.png";
}
