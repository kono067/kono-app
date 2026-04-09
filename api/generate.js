import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { auth } from "./_lib/auth.js";
import { db } from "./_lib/db.js";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. 認証セッションの取得
  const session = await auth.getSession({
    headers: req.headers
  });

  if (!session || !session.user) {
    return res.status(401).json({ error: 'ログインが必要です' });
  }

  const userId = session.user.id;
  const { memo, templatePrompt, templateName, templateId } = req.body;

  if (!memo) {
    return res.status(400).json({ error: 'メモを入力してください' });
  }

  try {
    // 2. クレジット確認
    let userCredits = await db
      .selectFrom('credits')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirst();

    // 初回ログイン時のクレジット付与 (もしDBになければ)
    if (!userCredits) {
      const now = new Date();
      await db.insertInto('credits')
        .values({
          userId,
          amount: 5,
          plan: 'free',
          updatedAt: now
        })
        .execute();
      userCredits = { amount: 5 };
    }

    if (userCredits.amount <= 0 && userCredits.plan !== 'matsu') {
      return res.status(403).json({ error: 'クレジットが不足しています。プランをアップグレードしてください。' });
    }

    // 3. Gemini API での生成
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `あなたは議事録作成アシスタントです。提供されたメモを「${templateName}」の形式に整理してください。
    
テンプレート形式:
${templatePrompt}

メモ:
${memo}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. 履歴の保存とクレジットの消費をアトミックに実行（風に）
    await db.transaction().execute(async (trx) => {
      // 履歴保存
      await trx.insertInto('history')
        .values({
          id: uuidv4(),
          userId,
          memo,
          templateName,
          result: text,
          createdAt: new Date()
        })
        .execute();

      // クレジット消費 (松プラン以外)
      if (userCredits.plan !== 'matsu') {
        await trx.updateTable('credits')
          .set({
            amount: userCredits.amount - 1,
            updatedAt: new Date()
          })
          .where('userId', '=', userId)
          .execute();
      }
    });

    return res.status(200).json({
      result: text,
      creditsRemaining: userCredits.plan === 'matsu' ? 'unlimited' : userCredits.amount - 1
    });

  } catch (error) {
    console.error('Generation Logic Error:', error);
    return res.status(500).json({ error: '議事録の生成中にエラーが発生しました。' });
  }
}
