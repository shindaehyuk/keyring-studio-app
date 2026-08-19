import { OfferingIcon, PencilIcon, PeopleIcon } from '../art/Icons'
import type { PurposeIconId } from '../data/site'

const ICONS = {
  pencil: PencilIcon,
  offering: OfferingIcon,
  people: PeopleIcon,
} satisfies Record<PurposeIconId, unknown>

export function PurposeIcon({ icon, size = 22 }: { icon: PurposeIconId; size?: number }) {
  const Icon = ICONS[icon]
  return <Icon size={size} />
}
