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

import { signIn, signOut, useSession } from './lib/auth-client'
import { templates } from './lib/templates'
import './App.css'

function App() {
  // 1. Auth state from Better Auth
  const { data: session, isPending: authPending } = useSession()
  const user = session?.user

  // 2. Core business state
  const [memo, setMemo] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('internal')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 3. User data state (Synced from DB)
  const [credits, setCredits] = useState(null)
  const [currentPlan, setCurrentPlan] = useState('free')
  const [history, setHistory] = useState([])

  // 4. UI state
  const [showHistory, setShowHistory] = useState(false)
  const [showPricing, setShowPricing] = useState(false)

  // Sync user data when logged in
  useEffect(() => {
    if (user) {
      fetchUserData()
      
      // Handle success redirect from Polar
      const params = new URLSearchParams(window.location.search)
      if (params.get('success') === 'true') {
        alert('決済が完了しました！クレジットが反映されるまで数分かかる場合があります。')
        // Remove parameter from URL
        window.history.replaceState({}, document.title, "/")
      }
    } else {
      // Clear state on logout
      setCredits(null)
      setHistory([])
      setResult('')
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user-data')
      if (res.ok) {
        const data = await res.json()
        setCredits(data.credits)
        setCurrentPlan(data.plan)
        setHistory(data.history)
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err)
    }
  }

  const hasCredits = credits === 'unlimited' || (typeof credits === 'number' && credits > 0)

  const handleLogin = useCallback(async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.origin
      })
    } catch (err) {
      setError('ログインに失敗しました')
    }
  }, [])

  const handleLogout = useCallback(async () => {
    await signOut()
    window.location.reload()
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

  // Loading state for initial session check
  if (authPending) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>読み込み中...</p>
      </div>
    )
  }

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
