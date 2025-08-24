// services/GeminiApiClient.ts
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const MAX_CONVERSATION_PAIRS = 7;

interface ContentPart { text: string }
interface Content { role: 'user' | 'model'; parts: ContentPart[] }
interface GeminiApiRequestBody {
  contents: Content[]
  generationConfig: { temperature: number; maxOutputTokens: number }
  safetySettings: { category: string; threshold: string }[]
}
interface GeminiApiResponse {
  candidates: { content: { parts: { text: string }[] } }[]
}

class GeminiApiClient {
  private apiEndpoint: string;
  private chatHistory: Content[] = [];
  private initialInstructionGiven = false;

  constructor(endpoint: string = GEMINI_API_ENDPOINT) {
    this.apiEndpoint = endpoint;
  }

  /**
   * Thiết lập hướng dẫn ban đầu – GIỚI HẠN PHẠM VI:
   * - Chỉ trả lời về: Thời kỳ bao cấp VN 1975–1996, 5 phần: Bối cảnh, Hạn chế, Đổi mới, Trả lời câu hỏi, Kết luận.
   * - Song ngữ: trả lời theo ngôn ngữ người dùng hỏi (vi/en).
   * - Nếu câu hỏi ngoài phạm vi → từ chối ngắn gọn.
   */
private ensureInitialInstruction() {
  if (!this.initialInstructionGiven) {
    this.chatHistory = [
      {
        role: 'user',
        parts: [
          {
            text: `
Bạn là trợ lý AI chuyên về lịch sử kinh tế Việt Nam giai đoạn 1975–1996, thường gọi là "Thời kỳ bao cấp".

PHẠM VI TRẢ LỜI:
- Chỉ giải thích, phân tích các vấn đề liên quan đến Thời kỳ bao cấp: 
  1) Bối cảnh ra đời
  2) Hạn chế của cơ chế bao cấp
  3) Quá trình Đổi mới
  4) Trả lời câu hỏi "Có phải một sai lầm của ĐCSVN không?"
  5) Kết luận tổng thể
- Nếu người dùng hỏi ngoài phạm vi trên (ví dụ: toán, lập trình, phim, đời tư...), bạn phải từ chối ngắn gọn.

QUY TẮC:
- Trả lời theo ngôn ngữ người dùng (tiếng Việt hoặc tiếng Anh).
- Trình bày rõ ràng, có thể dùng gạch đầu dòng, chữ đậm.
- Nếu từ chối: 
   • vi: "Xin lỗi, mình chỉ hỗ trợ về Thời kỳ bao cấp (1975–1996)."
   • en: "Sorry, I only answer about Vietnam’s Subsidy Period (1975–1996)."
          `.trim(),
          },
        ],
      },
      {
        role: 'model',
        parts: [
          { text: 'Đã thiết lập phạm vi. Tôi sẽ chỉ trả lời về Thời kỳ bao cấp 1975–1996.' },
        ],
      },
    ]
    this.initialInstructionGiven = true
  }
}
  private trimChatHistory() {
    if (this.chatHistory.length > 2 + MAX_CONVERSATION_PAIRS * 2) {
      const startIndex = this.chatHistory.length - (MAX_CONVERSATION_PAIRS * 2);
      this.chatHistory = [this.chatHistory[0], this.chatHistory[1], ...this.chatHistory.slice(startIndex)];
    }
  }

  async generateContent(prompt: string): Promise<string> {
    this.ensureInitialInstruction();
    this.chatHistory.push({ role: 'user', parts: [{ text: prompt }] });
    this.trimChatHistory();

    const requestBody: GeminiApiRequestBody = {
      contents: this.chatHistory,
      generationConfig: {
        temperature: 0.4,       // trả lời chặt chẽ, ít lan man
        maxOutputTokens: 1024,  // đủ ngắn gọn cho UI
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    try {
      const response = await axios.post<GeminiApiResponse>(this.apiEndpoint, requestBody, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 45000,
      });

      const botResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!botResponse) throw new Error('Phản hồi từ Gemini API không đúng định dạng.');

      this.chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });
      return botResponse;
    } catch (error: any) {
      if (this.chatHistory[this.chatHistory.length - 1]?.role === 'user') this.chatHistory.pop();
      console.error('Lỗi khi gọi Gemini API:', (error.response?.data || error.message));
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.error?.message || 'Lỗi không xác định từ máy chủ.';
        if (status === 429) throw new Error(`Hệ thống đang quá tải, vui lòng thử lại sau. (${errorMessage})`);
        throw new Error(`Lỗi từ API: ${status} - ${errorMessage}`);
      }
      throw error;
    }
  }

  resetChatHistory() {
    this.chatHistory = [];
    this.initialInstructionGiven = false;
  }
}

export const geminiApiClient = new GeminiApiClient();
