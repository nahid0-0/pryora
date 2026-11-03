import { useEffect, useRef } from 'react'

/** A silent, looping background video. It never plays sound, pauses when off-screen
    and stays still for people who ask for reduced motion. */
export default function AutoVideo({ src, preload = 'metadata' }: { src: string; preload?: 'auto' | 'metadata' }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    v.muted = true
    v.defaultMuted = true
    v.volume = 0
    const keepSilent = () => {
      if (!v.muted || v.volume > 0) {
        v.muted = true
        v.volume = 0
      }
    }
    v.addEventListener('volumechange', keepSilent)

    const play = () => {
      if (!still.matches) v.play().catch(() => {})
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : v.pause()), { threshold: 0.15 })
    io.observe(v)
    const onMotion = () => (still.matches ? v.pause() : play())
    still.addEventListener('change', onMotion)
    if (still.matches) v.pause()

    return () => {
      io.disconnect()
      v.removeEventListener('volumechange', keepSilent)
      still.removeEventListener('change', onMotion)
    }
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
