import './PricingModal.css'

const plans = [
  {
    id: 'ume',
    name: '梅プラン',
    label: 'ライト',
    emoji: '🌸',
    price: 500,
    count: '30回/月',
    description: '週1〜2回の会議がある方に',
    features: ['月30回の議事録生成', '3種類のテンプレート', '議事録の保存・履歴'],
  },
  {
    id: 'take',
    name: '竹プラン',
    label: 'スタンダード',
    emoji: '🎋',
    price: 1280,
    count: '100回/月',
    description: '毎日会議がある方に',
    popular: true,
    features: ['月100回の議事録生成', '3種類のテンプレート', '議事録の保存・履歴'],
  },
  {
    id: 'matsu',
    name: '松プラン',
    label: 'プレミアム',
    emoji: '🌲',
    price: 2980,
    count: '無制限',
    description: 'チームで大量に使う方に',
    features: ['無制限の議事録生成', '3種類のテンプレート', '議事録の保存・履歴'],
  },
]

export default function PricingModal({ onClose, onSelectPlan, currentPlan }) {
  return (
    <div className="pricing-overlay" onClick={onClose}>
      <div className="pricing-modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <button
          className="pricing-close"
          onClick={onClose}
          type="button"
          id="pricing-close-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="pricing-header">
          <h2>プランを選択</h2>
          <p>あなたに合ったプランで、議事録作成を効率化しましょう</p>
        </div>

        <div className="pricing-cards">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? 'popular' : ''} ${currentPlan === plan.id ? 'current' : ''}`}
            >
              {plan.popular && <div className="pricing-badge">人気</div>}
              {currentPlan === plan.id && <div className="pricing-badge current-badge">利用中</div>}

              <div className="pricing-card-top">
                <span className="pricing-emoji">{plan.emoji}</span>
                <h3 className="pricing-plan-name">{plan.name}</h3>
                <span className="pricing-plan-label">{plan.label}</span>
              </div>

              <div className="pricing-price">
                <span className="pricing-currency">¥</span>
                <span className="pricing-amount">{plan.price.toLocaleString()}</span>
                <span className="pricing-period">/月</span>
              </div>

              <p className="pricing-count">{plan.count}</p>
              <p className="pricing-desc">{plan.description}</p>

              <ul className="pricing-features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} pricing-select-btn`}
                onClick={() => onSelectPlan(plan.id)}
                disabled={currentPlan === plan.id}
                type="button"
                id={`select-plan-${plan.id}`}
              >
                {currentPlan === plan.id ? '利用中' : 'このプランを選択'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
