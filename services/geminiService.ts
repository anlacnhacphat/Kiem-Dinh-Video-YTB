
import { GoogleGenAI, Type } from "@google/genai";
import { AuditReport, RiskLevel } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là một chuyên gia cao cấp về chính sách cộng đồng và kiếm tiền (Monetization) của YouTube. 
Nhiệm vụ của bạn là thực hiện một cuộc "Kiểm định kiếm tiền" (Monetization Audit) chuyên sâu.

QUY TRÌNH XỬ LÝ:
1. Nếu đầu vào là một URL: Hãy sử dụng Google Search để tìm kiếm tiêu đề, mô tả, bình luận và các bài đánh giá về video này.
2. Nếu không thể truy cập trực tiếp nội dung video (do link riêng tư hoặc lỗi kỹ thuật), hãy dựa vào các thông tin tìm thấy trên web để đưa ra dự đoán chuyên môn NHƯNG phải ghi rõ trong phần tóm tắt. KHÔNG được chỉ trả về thông báo lỗi đơn thuần trừ khi hoàn toàn không có thông tin.
3. Nếu đầu vào là văn bản mô tả: Phân tích dựa trên các tiêu chí chính sách YouTube.

TIÊU CHÍ KIỂM ĐỊNH:
- "Nội dung lặp lại" (Reused Content): Video có giá trị gia tăng đáng kể không?
- Giọng đọc AI: Đánh giá xem có vi phạm lỗi "Nội dung lặp lại một cách máy móc" không.
- Giá trị giáo dục/giải trí: Có mang tính độc bản không?

Hãy trả về kết quả dưới dạng JSON cấu trúc chặt chẽ bằng TIẾNG VIỆT. Đánh giá khách quan, khắt khe.
`;

export async function performMonetizationAudit(input: string): Promise<AuditReport> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Thực hiện kiểm định kiếm tiền cho nội dung/link sau: ${input}. Nếu là link YouTube, hãy tìm kiếm thông tin chi tiết về nó trên Google trước khi kết luận.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          monetizationScore: { type: Type.NUMBER, description: "Điểm từ 0 đến 10" },
          summary: { type: Type.STRING, description: "Tóm tắt ngắn gọn tình trạng" },
          reusedContentRisk: { type: Type.STRING, enum: Object.values(RiskLevel) },
          aiVoiceRisk: { type: Type.STRING, enum: Object.values(RiskLevel) },
          visualRepetitionRisk: { type: Type.STRING, enum: Object.values(RiskLevel) },
          creativeValueScore: { type: Type.NUMBER },
          checklist: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING },
                passed: { type: Type.BOOLEAN },
                comment: { type: Type.STRING }
              },
              required: ["item", "passed", "comment"]
            }
          },
          expertRecommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["monetizationScore", "summary", "reusedContentRisk", "aiVoiceRisk", "visualRepetitionRisk", "creativeValueScore", "checklist", "expertRecommendations"]
      }
    }
  });

  const result = JSON.parse(response.text);
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sources = groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || "Nguồn tham khảo",
    uri: chunk.web?.uri
  })).filter((s: any) => s.uri);

  return {
    ...result,
    groundingSources: sources
  };
}
