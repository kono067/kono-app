import './Header.css'

export default function Header({ user, credits, onLogin, onLogout, onShowPricing, onShowHistory }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <span className="header-logo-icon">📋</span>
            <span className="header-logo-text">議事録AI</span>
          </div>
        </div>

        <div className="header-actions">
          {user && (
            <>
              <button
                className="btn btn-ghost btn-sm header-history-btn"
                onClick={onShowHistory}
                id="history-button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                履歴
              </button>

              <button
                className="header-credits"
                onClick={onShowPricing}
                id="credits-display"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span>{credits === null ? '...' : credits === 'unlimited' ? '無制限' : `${credits}回`}</span>
              </button>

              <div className="header-user">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="header-avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="header-avatar header-avatar-fallback">
                    {user.name?.charAt(0) || '?'}
                  </div>
                )}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={onLogout}
                  id="logout-button"
                >
                  ログアウト
                </button>
              </div>
            </>
          )}

          {!user && (
            <button
              className="btn btn-primary btn-sm"
              onClick={onLogin}
              id="login-button"
            >
              ログイン
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
