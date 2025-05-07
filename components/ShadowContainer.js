import React, { useState, useEffect } from 'react'
import ReactShadow from 'react-shadow'

export default function ShadowContainer({ children, styleSheets = [] }) {
  const [cssText, setCssText] = useState('')

  useEffect(() => {
    if (styleSheets.length === 0) return
    Promise.all(
      styleSheets.map((href) =>
        fetch(href).then((r) => {
          if (!r.ok) throw new Error(`Failed to load CSS: ${href}`)
          return r.text()
        })
      )
    )
      .then((arr) => {
        setCssText(arr.join('\n'))
      })
      .catch((err) => {
        console.error('ShadowContainer CSS load error:', err)
      })
  }, [styleSheets])

  return (
    <ReactShadow.div>
      {/* Inject any external stylesheets into the shadow root */}
      {cssText && <style>{cssText}</style>}
      {children}
    </ReactShadow.div>
  )
}
