export const applyStylesToDocument = (
  styles: Record<string, string>,
  document: HTMLElement
) => {
  const s = document.style
  ;[...s].forEach((name) => name.startsWith("--") && s.removeProperty(name))

  Object.keys(styles).forEach((key) => {
    if (key.startsWith("--")) {
      document.style.setProperty(key, styles[key])
    } else {
      document.style[key as any] = styles[key]
    }
  })
}
