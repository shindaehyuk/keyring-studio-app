'use client'

import { useEffect, useState } from 'react'
import { LAUNCH_DATE } from '../data/site'

interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getRemaining(): Remaining | null {
  const diff = new Date(LAUNCH_DATE).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export function Countdown() {
  // 서버 렌더와 하이드레이션이 어긋나지 않도록 마운트 후에만 시간을 계산한다
  const [remaining, setRemaining] = useState<Remaining | null | 'pending'>('pending')

  useEffect(() => {
    setRemaining(getRemaining())
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (remaining === null) {
    return <p className="countdown__open">지금 정식 오픈! 🎉</p>
  }

  const units =
    remaining === 'pending'
      ? [
          { value: '--', label: 'DAYS' },
          { value: '--', label: 'HOURS' },
          { value: '--', label: 'MIN' },
          { value: '--', label: 'SEC' },
        ]
      : [
          { value: String(remaining.days), label: 'DAYS' },
          { value: pad(remaining.hours), label: 'HOURS' },
          { value: pad(remaining.minutes), label: 'MIN' },
          { value: pad(remaining.seconds), label: 'SEC' },
        ]

  return (
    <div className="countdown" role="timer" aria-label="정식 오픈까지 남은 시간">
      {units.map((unit, i) => (
        <div key={unit.label} style={{ display: 'contents' }}>
          {i > 0 && <span className="countdown__colon">:</span>}
          <div className="countdown__unit">
            <span className="countdown__value">{unit.value}</span>
            <span className="countdown__label">{unit.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
