import React, { useLayoutEffect, useState } from 'react'

export default function FloatingChat() {

  const [initialLivechat, setInitialLivechat] = useState(true)

  useLayoutEffect(() => {
    if (initialLivechat) {
      ; (function loadLiveChat() {
        var script = document.createElement("script")
        script.src =
          // "https://d27xr6oh14aaqn.cloudfront.net/webchat-xlcoid/assistant-xl-xlcoid.js"
          "https://d27xr6oh14aaqn.cloudfront.net/webchat-axiswebstore/assistant-xl-axiswebstore.js"
        script.async = true
        script.type = "text/javascript"
        document.body.appendChild(script)
      })()
      setInitialLivechat(false)
    }
  }, [initialLivechat])
  return (
    <section className=''>
     
    </section>
  )
}
