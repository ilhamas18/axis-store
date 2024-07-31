import { useState, useCallback, useEffect } from "react"
import { useInView } from "react-intersection-observer"

/**
 *
 * @param {*} animation
 * @returns
 *
 * e.g fadeInUp, fadeInDown, etc .. further animation please check antikode base animation
 * in base/_animations.scss
 */

const useScrollAnim = (
  threshold = [0.25, 0.5, 0.75],
  animation = "fadeInUp",
  triggerOnce = true
) => {
  const [ref, inView]: any = useInView({
    threshold,
    triggerOnce,
  })

  const [animate, setAnimate] = useState(() => {
    return {
      text: `scroll-${animation}`,
      hasSet: false,
    }
  })

  const anim = useCallback(
    (delay: any, replaceAnim = null) => {
      if (replaceAnim) {
        return animate.hasSet
          ? `scroll-${replaceAnim} ${replaceAnim} delayp${delay}`
          : `scroll-${replaceAnim}`
      } else {
        return animate.hasSet
          ? `${animate.text} ${animation} delayp${delay}`
          : animate.text
      }
    },
    [animate, animation]
  )

  useEffect(() => {
    if (inView) {
      setAnimate((prevState) => {
        return {
          ...prevState,
          hasSet: true,
        }
      })
    }
  }, [inView])

  return [ref, anim, inView]
}

export default useScrollAnim
