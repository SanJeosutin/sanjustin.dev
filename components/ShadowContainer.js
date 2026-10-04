import React, { useState, useEffect } from 'react'
import ReactShadow from 'react-shadow'

export default function ShadowContainer({ children, styleSheets = [] }) {
  const styleSheetKey = JSON.stringify(styleSheets)
  const [cssText, setCssText] = useState('')

  useEffect(() => {
    let active = true
    const urls = JSON.parse(styleSheetKey)
    setCssText('')
    if (urls.length === 0) return

    Promise.all(
      urls.map((href) =>
        fetch(href).then((r) => {
          if (!r.ok) throw new Error(`Failed to load CSS: ${href}`)
          return r.text()
        })
      )
    )
      .then((arr) => {
        if (active) setCssText(arr.join('\n'))
      })
      .catch((err) => {
        if (active) console.error('ShadowContainer CSS load error:', err)
      })
    return () => { active = false }
  }, [styleSheetKey])

  return (
    <ReactShadow.div>
      {/* Inject any external stylesheets into the shadow root */}
      {cssText && <style>{cssText}</style>}
      {children}
    </ReactShadow.div>
  )
}
