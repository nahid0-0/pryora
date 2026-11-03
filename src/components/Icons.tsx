/* Small inline icons used across the site. */

const STAR = 'M10 0 C10.8 6 14 9.2 20 10 C14 10.8 10.8 14 10 20 C9.2 14 6 10.8 0 10 C6 9.2 9.2 6 10 0Z'

/** The four-point Pryora star. */
export function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d={STAR} />
    </svg>
  )
}
export const STAR_PATH = STAR

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

export function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 8.5h13l-1 11.5h-11z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
    </svg>
  )
}

export function ArrowRight() {
  return (
    <svg viewBox="0 0 16 10" aria-hidden="true">
      <path d="M1 5h13M10 1l4 4-4 4" />
    </svg>
  )
}

export function ChevronDown() {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="m1 1 6 6 6-6" />
    </svg>
  )
}

export function ChevronLeft() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M7 1 1 7l6 6" />
    </svg>
  )
}

/** Line drawings from the collection cards. */
export function RingMark(props: { pathLength?: number }) {
  return (
    <svg className="i" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="62" r="26" pathLength={props.pathLength} />
      <path d="M38 38 L50 22 L62 38 Z" pathLength={props.pathLength} />
    </svg>
  )
}
export function NecklaceMark(props: { pathLength?: number }) {
  return (
    <svg className="i" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M14 20 C 14 80, 86 80, 86 20" pathLength={props.pathLength} />
      <path d="M50 74 L42 86 L50 98 L58 86 Z" pathLength={props.pathLength} />
    </svg>
  )
}
export function EarringMark(props: { pathLength?: number }) {
  return (
    <svg className="i" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 12 L50 34" pathLength={props.pathLength} />
      <path d="M50 34 C 24 44, 24 84, 50 90 C 76 84, 76 44, 50 34 Z" pathLength={props.pathLength} />
    </svg>
  )
}
