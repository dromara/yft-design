import { Directive, DirectiveBinding } from 'vue'

const clickListener = (el: HTMLElement, event: MouseEvent, binding: DirectiveBinding) => {
  const handler = binding.value

  const path = event.composedPath()
  const isClickOutside = path ? path.indexOf(el) < 0 : !el.contains(event.target as HTMLElement)

  if (!isClickOutside) return
  handler(event)
}

const ClickOutsideDirective: Directive = {
  mounted(el: HTMLElement, binding) {
    const handleDirective = (event: MouseEvent) => clickListener(el, event, binding)
    setTimeout(() => {
      document.addEventListener('click', handleDirective)
    }, 0)
  },
  
  unmounted(el: HTMLElement, binding) {
    const handleDirective = (event: MouseEvent) => clickListener(el, event, binding)
    document.removeEventListener('click', handleDirective)
  },
}

export default ClickOutsideDirective