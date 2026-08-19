interface OptionSheetProps {
  title: string
  options: readonly string[]
  selected: string
  onSelect: (option: string) => void
  onClose: () => void
}

export function OptionSheet({ title, options, selected, onSelect, onClose }: OptionSheetProps) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grip" />
        <p className="sheet__title">{title}</p>
        {options.map((option) => (
          <button
            key={option}
            className={`sheet__option${option === selected ? ' selected' : ''}`}
            onClick={() => {
              onSelect(option)
              onClose()
            }}
          >
            {option}
            {option === selected && <span style={{ color: 'var(--color-accent)' }}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
