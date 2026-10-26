/**
 * Helper utilities for declarative DOM creation and manipulation
 */

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | boolean | undefined> = {},
  children: (HTMLElement | string | null | undefined)[] = []
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    if (key === 'className' || key === 'class') {
      el.className = String(value);
    } else if (key.startsWith('data-') || key.startsWith('aria-')) {
      el.setAttribute(key, String(value));
    } else if (key === 'innerHTML') {
      el.innerHTML = String(value);
    } else {
      (el as any)[key] = value;
    }
  }

  for (const child of children) {
    if (!child) continue;
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  }

  return el;
}

export function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', durationMs = 3500): void {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = createElement('div', { class: 'toast-container' });
    document.body.appendChild(container);
  }

  const toast = createElement('div', {
    class: `toast toast--${type}`,
    role: 'status',
    'aria-live': 'polite'
  }, [message]);

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, durationMs);
}
