import { useState } from 'react'
import './MemoInput.css'

export default function MemoInput({ value, onChange, disabled }) {
  const maxLength = 5000
  const charCount = value.length

  return (
    <div className="memo-input-wrapper animate-fade-in">
      <div className="memo-input-header">
        <label htmlFor="memo-textarea" className="memo-input-label">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          会議メモを入力
        </label>
        <span className={`memo-input-count ${charCount > maxLength ? 'over' : ''}`}>
          {charCount.toLocaleString()} / {maxLength.toLocaleString()}
        </span>
      </div>
      <textarea
        id="memo-textarea"
        className="memo-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={maxLength + 100}
        rows={10}
        placeholder={`会議中に取ったメモを貼り付けてください。
箇条書きや断片的なメモでOKです。

例：
・A社 見積 来週提出
・UI 修正必要
・山田 テスト確認
・来週火曜 再確認`}
      />
    </div>
  )
}
