import './GenerateButton.css'

export default function GenerateButton({ onClick, disabled, loading, hasCredits }) {
  return (
    <div className="generate-wrapper animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <button
        id="generate-button"
        className="btn btn-primary btn-lg generate-btn"
        onClick={onClick}
        disabled={disabled || loading || !hasCredits}
        type="button"
      >
        {loading ? (
          <>
            <span className="generate-spinner" />
            議事録を生成中...
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            議事録を生成
          </>
        )}
      </button>
      {!hasCredits && !loading && (
        <p className="generate-no-credits">
          クレジットが不足しています。プランを選択してください。
        </p>
      )}
    </div>
  )
}
