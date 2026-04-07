import './HistoryList.css'

export default function HistoryList({ items, onSelect, onClose, onDelete }) {
  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <h2 className="history-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            議事録の履歴
          </h2>
          <button
            className="btn btn-ghost btn-sm history-close"
            onClick={onClose}
            type="button"
            id="history-close-button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="history-content">
          {(!items || items.length === 0) ? (
            <div className="history-empty">
              <span className="history-empty-icon">📂</span>
              <p>まだ議事録がありません</p>
              <p className="history-empty-sub">議事録を生成すると、ここに履歴が表示されます</p>
            </div>
          ) : (
            <ul className="history-list">
              {items.map((item) => (
                <li key={item.id} className="history-item">
                  <button
                    className="history-item-btn"
                    onClick={() => onSelect(item)}
                    type="button"
                  >
                    <div className="history-item-meta">
                      <span className="history-item-template">{item.templateName}</span>
                      <span className="history-item-date">
                        {new Date(item.createdAt).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="history-item-preview">
                      {item.result?.substring(0, 80)}...
                    </p>
                  </button>
                  {onDelete && (
                    <button
                      className="history-item-delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(item.id)
                      }}
                      type="button"
                      title="削除"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
