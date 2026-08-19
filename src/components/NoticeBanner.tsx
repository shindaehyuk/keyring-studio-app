'use client'

import { useEffect, useState } from 'react'
import { ChevronRightIcon, CloseIcon } from '../art/Icons'
import { formatNoticeDate, latestNotice, NOTICES } from '../data/notices'

function MegaphoneIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 V13.5 A1.5 1.5 0 0 0 5.5 15 H7 L8.2 19.4 A1 1 0 0 0 9.2 20.1 H10.3 A1 1 0 0 0 11.2 18.8 L10.2 15 H11 L18 19 V5 L11 9 H5.5 A1.5 1.5 0 0 0 4 10.5 Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M20.5 9.5 A3.4 3.4 0 0 1 20.5 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function NoticeBanner() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(NOTICES[0]?.id ?? null)
  const latest = latestNotice()

  // 시트가 열려 있는 동안에는 뒤 화면이 스크롤되지 않게 한다
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!latest) return null

  return (
    <>
      <section className="notice">
        <button className="notice-banner" onClick={() => setOpen(true)}>
          <span className="notice-banner__icon">
            <MegaphoneIcon />
          </span>
          <span className="notice-banner__text">{latest.title}</span>
          {latest.isNew && <span className="notice-banner__badge">NEW</span>}
          <ChevronRightIcon size={16} color="var(--color-faint)" />
        </button>
      </section>

      {open && (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <div
            className="sheet notice-sheet"
            role="dialog"
            aria-label="공지사항"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet__grip" />
            <div className="notice-sheet__head">
              <p className="sheet__title">공지사항</p>
              <button className="icon-button" aria-label="닫기" onClick={() => setOpen(false)}>
                <CloseIcon size={20} />
              </button>
            </div>

            <ul className="notice-list">
              {NOTICES.map((notice) => {
                const isOpen = expanded === notice.id
                return (
                  <li key={notice.id} className="notice-item">
                    <button
                      className="notice-item__head"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : notice.id)}
                    >
                      <span className="notice-item__meta">
                        <span className="notice-item__date">{formatNoticeDate(notice.date)}</span>
                        {notice.isNew && <span className="notice-item__new">NEW</span>}
                      </span>
                      <span className="notice-item__title">{notice.title}</span>
                      <span className={`notice-item__caret${isOpen ? ' open' : ''}`} aria-hidden>
                        <ChevronRightIcon size={16} color="var(--color-faint)" />
                      </span>
                    </button>
                    {isOpen && (
                      <p className="notice-item__body">
                        {notice.body.map((line) => (
                          <span key={line}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
