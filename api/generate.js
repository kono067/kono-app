import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { memo, templatePrompt, templateName } = req.body;

  if (!memo) {
    return res.status(400).json({ error: 'Memo is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured' });
  }

  try {
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `あなたは会議議事録を作成するアシスタントです。
ユーザーが入力した会議メモを、指定されたテンプレート形式に整理して議事録を作成してください。

ルール：
- メモの内容を正確に反映すること
- メモにない情報を勝手に追加しないこと
- 各セクションに該当する内容がない場合は「特になし」と記載すること
- 敬語・丁寧語で記載すること
- 簡潔でわかりやすい文章にすること

以下のメモを「${templateName}」テンプレートの形式で議事録にしてください。

テンプレート形式：
${templatePrompt}

メモ：
${memo}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // In Phase 1, we don't have DB/Credit logic yet, so we just return the result.
    // We'll add user session checking and credit deduction in Phase 2.
    
    return res.status(200).json({
      result: text,
      // For demo purposes in Phase 1
      creditsRemaining: 4 
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate minutes. Please try again.' });
  }
}
