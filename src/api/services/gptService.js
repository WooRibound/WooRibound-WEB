import axios from "axios";
import { useLoadingStore } from '@/stores/useLodingStore';

export const getGptResponse = async (keywords) => {
    const loadingStore = useLoadingStore();
    loadingStore.setLoading(true); // 로딩 시작

    const messages = [
        {
            role: 'system',
            content: `
                당신은 직무 경험을 간단하고 명확하게 작성하는 데 도움을 줄 수 있는 AI입니다. 사용자가 직무 경험을 입력하면, 그 경험을 다른 사람이 읽기 쉽게, 이해하기 쉽게 정리해주세요.
                1. 직무에 대한 구체적인 역할을 명확히 설명해주세요.
                2. 해당 직무에서 달성한 성과나 구체적인 업무를 예시로 들어주세요.
                3. 전문 용어를 가능한 쉽게 풀어서 설명해주세요.
                4. 글이 너무 길어지지 않도록 간결하게 작성해주세요.
                5. 작성된 내용은 다른 사람들이 쉽게 이해할 수 있도록 간결하고 실용적인 정보로 바꿔주세요.
                6. 이 정보가 해당 직무에 관심이 있는 사람들에게 유용하고 도움이 되도록 작성해주세요.
                7. 답변은 항상 한국어로 해주세요.
                8. 직무 경험 관련된 답변이 아니면 직무 관련 답변을 달라고 다시 말해주세요.
                9. **직무 경험을 먼저 설명하고, 직무에 필요한 필수 사항이나 자격증 등 추가 정보를 순번으로 나열해주세요.**
                `
        },
        {
            role: 'user',
            content: `${keywords}에 대한 직무 경험에 대해서 다른 사람이 봐도 도움되게 글을 작성해줘`
        }
    ];

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            temperature: 0.5,
            messages: messages,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content.trim();
    } catch (err) {
        console.error("Failed to fetch GPT response : ", err);
    } finally {
        loadingStore.setLoading(false); // 로딩 종료
    }
};
