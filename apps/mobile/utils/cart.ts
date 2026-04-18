const CART_KEY   = 'agrimart_cart';
const CART_EVENT = 'cartchange';

export interface CartItem {
  productId: string;
  quantity: number;
}

function dispatch() {
  window.dispatchEvent(new Event(CART_EVENT));
}

export function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}

function saveCart(items: CartItem[]) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
  dispatch();
}

export function addToCart(productId: string) {
  const items = getCart();
  const existing = items.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += 1;
    saveCart(items);
  } else {
    saveCart([...items, { productId, quantity: 1 }]);
  }
}

export function removeFromCart(productId: string) {
  saveCart(getCart().filter(i => i.productId !== productId));
}

export function updateQty(productId: string, qty: number) {
  if (qty <= 0) { removeFromCart(productId); return; }
  const items = getCart().map(i => i.productId === productId ? { ...i, quantity: qty } : i);
  saveCart(items);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export { CART_EVENT };
