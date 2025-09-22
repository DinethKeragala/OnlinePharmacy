const CART_KEY = 'cart_items_v1'

function read() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
    notify()
  } catch {
    // Swallow storage errors
  }
}

export function getItems() {
  return read()
}

export function setItems(items) {
  write(items)
}

export function addItem(item) {
  const items = read()
  const idx = items.findIndex((it) => it.id === item.id)
  if (idx >= 0) {
    items[idx].quantity += item.quantity || 1
  } else {
    items.push({ ...item, quantity: item.quantity || 1 })
  }
  write(items)
}

export function updateQuantity(id, quantity) {
  const items = read().map((it) => (it.id === id ? { ...it, quantity } : it))
  write(items)
}

export function removeItem(id) {
  const items = read().filter((it) => it.id !== id)
  write(items)
}

export function clearCart() {
  write([])
}

export function getCount() {
  return read().reduce((sum, it) => sum + (it.quantity || 0), 0)
}

// Simple pub/sub for cart updates
const listeners = new Set()
function notify() {
  const snapshot = read()
  listeners.forEach((fn) => {
    try { fn(snapshot) } catch { /* ignore listener errors */ }
  })
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function subtotal() {
  return read().reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0)
}
