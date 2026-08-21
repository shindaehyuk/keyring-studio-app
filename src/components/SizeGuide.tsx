'use client'

import { useEffect, useState } from 'react'
import { SIZE_CHART, SIZE_CHART_NOTE } from '../data/sizeChart'

/** 자 아이콘 */
function RulerIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.6 14.2 14.2 3.6a1.2 1.2 0 0 1 1.7 0l4.5 4.5a1.2 1.2 0 0 1 0 1.7L9.8 20.4a1.2 1.2 0 0 1-1.7 0l-4.5-4.5a1.2 1.2 0 0 1 0-1.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m7.7 10.1 1.8 1.8m2-4.2 1.8 1.8m2-4.2 1.8 1.8M5.6 14.2l1.8 1.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * 티셔츠 실측 사이즈표 — 버튼을 누르면 모달로 뜬다.
 * 사이즈를 고르는 자리(사전예약·상품 상세) 옆에 둔다.
 */
export function SizeGuide({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  // 열려 있는 동안 뒤 화면이 밀리지 않게 하고, ESC로 닫는다
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className={`size-guide__button${className ? ` ${className}` : ''}`}
        onClick={() => setOpen(true)}
      >
        <RulerIcon />
        사이즈표
      </button>

      {open && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="티셔츠 사이즈표"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal__panel size-guide__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="modal__title">티셔츠 사이즈표</p>
            <p className="size-guide__sub">성인용 · 단위 cm</p>

            <div className="size-guide__table-wrap">
              <table className="size-guide__table">
                <thead>
                  <tr>
                    <th scope="col">사이즈</th>
                    <th scope="col">총길이</th>
                    <th scope="col">가슴단면</th>
                    <th scope="col">어깨너비</th>
                    <th scope="col">소매길이</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.map((row) => (
                    <tr key={row.size}>
                      <th scope="row">
                        {row.size}
                        <em>({row.label})</em>
                      </th>
                      <td>{row.total}</td>
                      <td>{row.chest}</td>
                      <td>{row.shoulder}</td>
                      <td>{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="size-guide__note">{SIZE_CHART_NOTE}</p>

            <div className="modal__actions">
              <button className="modal__button" onClick={() => setOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
