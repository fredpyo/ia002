import type React from 'react'
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">{title}</h2>
      <div className="text-slate-700">{children}</div>
    </div>
  )
}

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3001'

function InflationCard() {
  const [state, setState] = useState<
    | { status: 'idle' | 'loading' }
    | { status: 'error'; error: string }
    | {
        status: 'success'
        data: { month: string; monthlyInflationPct: number; annualInflationPct: number; updatedAt: string }
      }
  >({ status: 'idle' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetch(`${API_BASE}/inflation`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const json = await r.json()
        if (!cancelled) {
          setState({ status: 'success', data: json })
        }
      })
      .catch((e) => {
        if (!cancelled) setState({ status: 'error', error: e.message })
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading' || state.status === 'idle') {
    return <div className="h-10 animate-pulse rounded bg-slate-100" />
  }

  if (state.status === 'error') {
    return <div className="text-sm text-red-600">Error: {state.error}</div>
  }

  const { monthlyInflationPct, annualInflationPct, updatedAt, month } = state.data
  return (
    <div>
      <div className="text-3xl font-bold">{monthlyInflationPct}%</div>
      <p className="text-sm text-slate-500">Mensual — {month}</p>
      <p className="text-sm text-slate-500">Anual: {annualInflationPct}%</p>
      <p className="text-xs text-slate-400">Actualizado: {new Date(updatedAt).toLocaleString()}</p>
    </div>
  )
}

function WatchlistCard() {
  const [state, setState] = useState<
    | { status: 'idle' | 'loading' }
    | { status: 'error'; error: string }
    | { status: 'success'; data: { items: { symbol: string; name: string; price: number; changePct: number }[] } }
  >({ status: 'idle' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetch(`${API_BASE}/assets`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const json = await r.json()
        if (!cancelled) setState({ status: 'success', data: json })
      })
      .catch((e) => {
        if (!cancelled) setState({ status: 'error', error: e.message })
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading' || state.status === 'idle') {
    return <div className="h-16 animate-pulse rounded bg-slate-100" />
  }
  if (state.status === 'error') {
    return <div className="text-sm text-red-600">Error: {state.error}</div>
  }

  return (
    <ul className="divide-y divide-slate-100">
      {state.data.items.map((it) => (
        <li key={it.symbol} className="flex items-center justify-between py-2">
          <div>
            <div className="font-medium text-slate-900">{it.symbol}</div>
            <div className="text-xs text-slate-500">{it.name}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">${it.price}</div>
            <div className={it.changePct >= 0 ? 'text-emerald-600 text-sm' : 'text-red-600 text-sm'}>
              {it.changePct >= 0 ? '+' : ''}
              {it.changePct}%
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function App() {
  const [easter, setEaster] = useState(false)
  const [alpha, setAlpha] = useState<string | null>(null)

  useEffect(() => {
    const KONAMI = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ] as const
    let idx = 0
    const onKey = (e: KeyboardEvent) => {
      const key = e.key
      const expected = KONAMI[idx]
      if (key === expected) {
        idx++
        if (idx === KONAMI.length) {
          setEaster(true)
          idx = 0
        }
      } else {
        idx = 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!easter) return
    fetch(`${API_BASE}/alpha`)
      .then((r) => r.json())
      .then((j) => setAlpha(j.tip as string))
      .catch(() => setAlpha('Alpha unlocked.'))
  }, [easter])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">MONETIX</h1>
          <p className="text-sm text-slate-500">Panel financiero (MVP, datos reales/dummy)</p>
        </header>

        <main className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card title="Inflación (último mes)">
            <InflationCard />
          </Card>

          <Card title="Tipo de cambio">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-500">Oficial</div>
                <div className="text-xl font-semibold">$870</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Paralelo</div>
                <div className="text-xl font-semibold">$1400</div>
              </div>
            </div>
          </Card>

          <Card title="Watchlist (top 5)">
            <WatchlistCard />
          </Card>

          <Card title="Noticias resumidas">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Banco central mantiene tasas sin cambios — cautela para próximos meses.
              </li>
              <li>
                Big Tech con resultados mixtos — ingresos superan expectativas, guidance conservador.
              </li>
            </ul>
          </Card>

          <Card title="Mensaje financiero del día">
            <p>
              Consejo: Diversifica tu portafolio. No pongas todos los huevos en la misma canasta.
            </p>
            <button className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
              Compartir
            </button>
          </Card>
        </main>
      </div>

      {easter && (
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-amber-100/80 via-pink-100/60 to-sky-100/80 backdrop-blur-sm" />
          <div className="pointer-events-auto absolute left-1/2 top-8 -translate-x-1/2 rounded-xl border border-amber-200 bg-white/90 px-4 py-3 shadow-lg">
            <div className="text-sm font-semibold text-amber-700">Modo Alfa activado ✨</div>
            <div className="text-slate-700 text-sm">{alpha ?? 'Cargando alpha...'}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
