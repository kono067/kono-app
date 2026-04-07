import { Polar } from "@polar-sh/sdk";
import { auth } from "../src/lib/auth";

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

  const { plan } = req.query;
  const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN
  });

  // プランとプロダクトIDの紐付け
  const productIds = {
    ume: process.env.POLAR_PRODUCT_UME,
    take: process.env.POLAR_PRODUCT_TAKE,
    matsu: process.env.POLAR_PRODUCT_MATSU
  };

  const productId = productIds[plan];

  if (!productId) {
    return res.status(400).json({ error: '無効なプランです' });
  }

  try {
    // 2. 決済セッション（Checkout）の作成
    const checkout = await polar.checkouts.custom.create({
      productPriceId: productId,
      successUrl: `${process.env.BETTER_AUTH_URL}/?success=true`,
      customerEmail: session.user.email,
      metadata: {
        userId: session.user.id,
        planId: plan
      }
    });

    // 3. 決済ページへリダイレクト
    return res.redirect(303, checkout.url);

  } catch (error) {
    console.error('Polar Checkout Error:', error);
    return res.status(500).json({ error: '決済ページの生成に失敗しました。' });
  }
}
