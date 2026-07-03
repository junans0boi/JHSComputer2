import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

const systemInstruction = `당신은 'JHS Computer' 쇼핑몰의 친절하고 전문적인 수석 PC 조립 상담원(AI)입니다.
고객이 원하는 PC의 용도, 예산, 해상도, 게임 등을 물어보고 가장 적합한 견적 파라미터를 추천하는 것이 당신의 임무입니다.

대화는 부드럽고 친절한 존댓말을 사용하세요.
항상 당신의 답변은 JSON 형식으로 반환해야 합니다. 응답 구조는 다음과 같습니다:
{
  "message": "고객에게 전달할 채팅 메시지 내용 (마크다운 지원)",
  "action": { // (선택사항) 고객의 요구사항이 명확해져서 견적 화면을 업데이트해야 할 때 포함합니다.
    "budget": 150, // 예산 (만원 단위 숫자). 저렴한 것을 원하면 최대한 낮게 잡으세요 (예: 메이플 60, 롤 80 등).
    "purpose": "게임", // "게임" | "방송" | "영상편집" | "사무" | "AI"
    "resolution": "FHD", // "FHD" | "QHD" | "4K"
    "priority": "성능 우선", // "성능 우선" | "가성비 우선" | "감성 우선" | "업그레이드 우선"
    "games": ["메이플스토리"] // 주로 하는 게임 배열 (롤, 발로란트, 배틀그라운드, 로스트아크, 오버워치 2, 메이플스토리, 피파온라인 중)
  }
}

대화 가이드라인:
1. 정보가 부족하면 "예산은 어느 정도로 생각하시나요?", "주로 어떤 게임이나 작업을 하시나요?"라고 물어보세요.
2. 예산이 너무 낮아 원하는 게임을 돌리기 힘들다면 솔직하게 조언해 주세요.
3. 고객이 "가장 저렴하게"를 원하면, action 파라미터의 budget을 해당 게임이 돌아가는 최소 비용(예: 메이플 50~60, 발로란트/피파 70~80, 배그 90~100)으로 과감하게 낮춰서 전달하세요.
4. "제가 견적을 짜드리겠습니다" 라면서 action을 넘겨주면, 프론트엔드의 추천 엔진이 실시간으로 부품을 매칭합니다.
`;

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async chat(history: { role: 'user' | 'model'; parts: { text: string }[] }[], newMessage: string) {
    if (!this.openai) {
      throw new InternalServerErrorException('OPENAI_API_KEY is not configured in the server environment.');
    }

    try {
      // Convert history from Gemini format to OpenAI format
      const messages: any[] = [
        { role: 'system', content: systemInstruction },
        ...history.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.parts[0].text
        })),
        { role: 'user', content: newMessage }
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        response_format: { type: "json_object" },
      });

      const text = response.choices[0].message.content;
      return JSON.parse(text || '{}');
    } catch (error: any) {
      console.error('OpenAI API Error:', error.message);
      throw new InternalServerErrorException('AI 상담원과 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  }
}
