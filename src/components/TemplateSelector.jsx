import { templates } from '../lib/templates'
import './TemplateSelector.css'

export default function TemplateSelector({ selected, onChange, disabled }) {
  return (
    <div className="template-selector animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="template-selector-label">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        テンプレートを選択
      </div>
      <div className="template-cards">
        {templates.map((t) => (
          <button
            key={t.id}
            id={`template-${t.id}`}
            className={`template-card ${selected === t.id ? 'active' : ''}`}
            onClick={() => onChange(t.id)}
            disabled={disabled}
            type="button"
          >
            <span className="template-card-icon">{t.icon}</span>
            <div className="template-card-content">
              <span className="template-card-name">{t.name}</span>
              <span className="template-card-desc">{t.description}</span>
            </div>
            <div className="template-card-sections">
              {t.sections.map((s, i) => (
                <span key={i} className="template-card-tag">{s}</span>
              ))}
            </div>
            {selected === t.id && (
              <div className="template-card-check">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
