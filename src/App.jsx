import { useState, useCallback } from 'react'
import Header from './components/Header'
import LoginButton from './components/LoginButton'
import MemoInput from './components/MemoInput'
import TemplateSelector from './components/TemplateSelector'
import GenerateButton from './components/GenerateButton'
import ResultDisplay from './components/ResultDisplay'
import HistoryList from './components/HistoryList'
import PricingModal from './components/PricingModal'
import { templates } from './lib/templates'
import './App.css'

// For Phase 1 demo: simulate logged-in user
const DEMO_MODE = true

function App() {
  // Auth state
  const [user, setUser] = useState(
    DEMO_MODE ? { name: 'テストユーザー', email: 'test@example.com', image: null } : null
  )

  // Core state
  const [memo, setMemo] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('internal')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Credit state
  const [credits, setCredits] = useState(DEMO_MODE ? 5 : null)
  const [currentPlan, setCurrentPlan] = useState('free')

  // UI state
  const [showHistory, setShowHistory] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [history, setHistory] = useState([])

  const hasCredits = credits === 'unlimited' || (typeof credits === 'number' && credits > 0)

  const handleLogin = useCallback(() => {
    // Phase 2: Better Auth Google login
    // For now, simulate login
    setUser({ name: 'テストユーザー', email: 'test@example.com', image: null })
    setCredits(5)
  }, [])

  const handleLogout = useCallback(() => {
    setUser(null)
    setCredits(null)
    setResult('')
    setHistory([])
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!memo.trim()) {
      setError('メモを入力してください')
      return
    }
    if (memo.length > 5000) {
      setError('メモは5000文字以内で入力してください')
      return
    }

    setError('')
    setLoading(true)
    setResult('')

    try {
      const template = templates.find((t) => t.id === selectedTemplate)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memo: memo.trim(),
          templateId: selectedTemplate,
          templateName: template.name,
          templatePrompt: template.prompt,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || '議事録の生成に失敗しました')
      }

      const data = await response.json()
      setResult(data.result)

      // Update credits
      if (data.creditsRemaining !== undefined) {
        setCredits(data.creditsRemaining)
      } else if (typeof credits === 'number') {
        setCredits((prev) => Math.max(0, prev - 1))
      }

      // Add to local history
      const historyItem = {
        id: Date.now().toString(),
        memo: memo.trim(),
        templateName: template.name,
        result: data.result,
        createdAt: new Date().toISOString(),
      }
      setHistory((prev) => [historyItem, ...prev])
    } catch (err) {
      setError(err.message || '議事録の生成に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }, [memo, selectedTemplate, credits])

  const handleSelectHistory = useCallback((item) => {
    setResult(item.result)
    setShowHistory(false)
  }, [])

  const handleDeleteHistory = useCallback((id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handleSelectPlan = useCallback((planId) => {
    // Phase 3: Polar checkout
    alert(`${planId}プランの決済ページに遷移します（Phase 3で実装）`)
    setShowPricing(false)
  }, [])

  // Not logged in
  if (!user) {
    return (
      <div className="app">
        <Header user={null} credits={null} onLogin={handleLogin} />
        <LoginButton onLogin={handleLogin} />
      </div>
    )
  }

  // Logged in
  return (
    <div className="app">
      <Header
        user={user}
        credits={credits}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onShowPricing={() => setShowPricing(true)}
        onShowHistory={() => setShowHistory(true)}
      />

      <main className="main">
        <div className="main-content">
          <div className="main-hero">
            <h1>会議メモから議事録を生成</h1>
            <p>メモを入力してテンプレートを選ぶだけ。AIが議事録を自動作成します。</p>
          </div>

          <div className="main-form">
            <MemoInput value={memo} onChange={setMemo} disabled={loading} />
            <TemplateSelector
              selected={selectedTemplate}
              onChange={setSelectedTemplate}
              disabled={loading}
            />

            {error && (
              <div className="error-message animate-fade-in">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <GenerateButton
              onClick={handleGenerate}
              disabled={!memo.trim() || loading}
              loading={loading}
              hasCredits={hasCredits}
            />
          </div>

          {result && (
            <div className="main-result">
              <ResultDisplay result={result} />
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 議事録AI</p>
      </footer>

      {showHistory && (
        <HistoryList
          items={history}
          onSelect={handleSelectHistory}
          onClose={() => setShowHistory(false)}
          onDelete={handleDeleteHistory}
        />
      )}

      {showPricing && (
        <PricingModal
          onClose={() => setShowPricing(false)}
          onSelectPlan={handleSelectPlan}
          currentPlan={currentPlan}
        />
      )}
    </div>
  )
}

export default App
