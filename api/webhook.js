import { db } from "../src/lib/db";
import { validateEvent } from "@polar-sh/sdk/webhooks";

export const config = {
  api: {
    bodyParser: false, // Webhook 署名検証のために生のボディが必要
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = await getRawBody(req);
  const signature = req.headers['polar-signature'];
  
  let event;
  try {
    // 1. Webhook 署名の検証
    event = validateEvent(payload, signature, process.env.POLAR_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. 決済完了イベントの処理
  if (event.type === 'order.created') {
    const order = event.data;
    const { userId, planId } = order.metadata || {};

    if (userId && planId) {
      // プランごとの付与クレジット数
      const creditAmounts = {
        ume: 30,
        take: 100,
        matsu: 'unlimited'
      };

      const amount = creditAmounts[planId];

      try {
        // 3. データベースの更新
        await db.updateTable('credits')
          .set({
            amount: amount === 'unlimited' ? 999999 : amount, // 松プランは便宜上大きな数値かフラグ
            plan: planId,
            updatedAt: new Date()
          })
          .where('userId', '=', userId)
          .execute();

        console.log(`Successfully updated credits for user ${userId}: ${planId}`);
      } catch (dbErr) {
        console.error('Database update failed for webhook:', dbErr);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  return res.status(200).json({ received: true });
}

// 補助関数: 生のボディを取得
async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}
