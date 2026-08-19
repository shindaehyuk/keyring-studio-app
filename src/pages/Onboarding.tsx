import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyringArt, type ArtId } from '../art/KeyringArt'

const SLIDES: { art: ArtId; title: string; copy: string }[] = [
  {
    art: 'cloud',
    title: 'Keyring\nStudio',
    copy: '나만의 이야기를 담은\n아크릴 키링을 만들어보세요.',
  },
  {
    art: 'heart',
    title: '취향을 담은\n컬렉션',
    copy: '캐릭터부터 이니셜까지,\n취향에 꼭 맞는 키링을 골라보세요.',
  },
  {
    art: 'star',
    title: '매일 곁에\n작은 행운',
    copy: '가방, 파우치, 열쇠 어디든\n귀여움을 더해줄 거예요.',
  },
]

export const ONBOARDING_KEY = 'ks:onboarded'

export function Onboarding() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const slide = SLIDES[index]
  const isLast = index === SLIDES.length - 1

  const next = () => {
    if (isLast) {
      localStorage.setItem(ONBOARDING_KEY, '1')
      navigate('/', { replace: true })
    } else {
      setIndex(index + 1)
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding__stage">
        <KeyringArt art={slide.art} sparkles className="onboarding__art" />
        <div>
          <h1 className="onboarding__logo" style={{ whiteSpace: 'pre-line' }}>
            {slide.title}
          </h1>
          <p className="onboarding__copy">{slide.copy}</p>
        </div>
      </div>
      <button className="button-primary" onClick={next}>
        {isLast ? '시작하기' : '다음'}
      </button>
      <div className="onboarding__dots">
        {SLIDES.map((_, i) => (
          <span key={i} className={`dot${i === index ? ' active' : ''}`} />
        ))}
      </div>
    </div>
  )
}
