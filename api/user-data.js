import "dotenv/config";
import { auth } from "./_lib/auth.js";
import { db } from "./_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

  try {
    // 2. クレジットの取得
    let credits = await db
      .selectFrom('credits')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirst();

    // 初回ログイン時のクレジット付与 (DBになければ)
    if (!credits) {
      const now = new Date();
      await db.insertInto('credits')
        .values({
          userId,
          amount: 5,
          plan: 'free',
          updatedAt: now
        })
        .execute();
      credits = { amount: 5, plan: 'free' };
    }

    // 3. 履歴の取得 (最新20件)
    const history = await db
      .selectFrom('history')
      .selectAll()
      .where('userId', '=', userId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .execute();

    return res.status(200).json({
      credits: credits.amount,
      plan: credits.plan,
      history: history
    });

  } catch (error) {
    console.error('User data fetch error:', error);
    return res.status(500).json({ error: 'データの取得中にエラーが発生しました。' });
  }
}
