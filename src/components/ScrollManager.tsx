import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/** New page: start at the top. Link with a #hash: scroll to that section.
    Changing only the query (shop filters) leaves the scroll alone. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  const lastPath = useRef(pathname)

  useEffect(() => {
    const changedPage = lastPath.current !== pathname
    lastPath.current = pathname
    if (hash) {
      // wait a frame so the target section has rendered
      requestAnimationFrame(() => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (el) el.scrollIntoView({ behavior: changedPage ? 'auto' : 'smooth', block: 'start' })
      })
    } else if (changedPage) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}
