// =====================================================
// Cart store — Svelte 5 runes (file suffix .svelte.js
// gives us reactive $state outside components)
// =====================================================
import { PRODUCTS, SHOP, fmt } from './shop.js';

export const cart = $state({ items: {} }); // { productId: qty }

const STORAGE_KEY = 'rashmita_cart';

export function loadCart() {
        try {
                const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                const valid = {};
                for (const [id, qty] of Object.entries(saved)) {
                        if (PRODUCTS.some((p) => p.id === id) && qty >= 1) valid[id] = qty;
                }
                cart.items = valid;
        } catch {
                cart.items = {};
        }
}

export function saveCart() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.items));
}

export function addToCart(id, silent = false) {
        cart.items[id] = (cart.items[id] || 0) + 1;
        saveCart();
        return silent ? null : productById(id);
}

export function decreaseFromCart(id) {
        const p = productById(id);
        if ((cart.items[id] ?? 0) > 1) {
                cart.items[id]--;
        } else {
                delete cart.items[id];
        }
        saveCart();
        return p;
}

export function removeFromCart(id) {
        delete cart.items[id];
        saveCart();
}

export function clearCart() {
        cart.items = {};
        saveCart();
}

export function productById(id) {
        return PRODUCTS.find((p) => p.id === id);
}

export function cartQty() {
        return Object.values(cart.items).reduce((a, b) => a + b, 0);
}

export function cartEntries() {
        return Object.entries(cart.items).map(([id, qty]) => ({
                p: productById(id),
                qty
        }));
}

export function cartSubtotal() {
        return cartEntries().reduce((a, { p, qty }) => a + p.price * qty, 0);
}

export function deliveryFee() {
        const sub = cartSubtotal();
        if (sub === 0) return 0;
        return sub >= SHOP.freeDeliveryAbove ? 0 : SHOP.deliveryFee;
}

export function buildWhatsAppOrder(name, phone, addr) {
        const items = cartEntries();
        const sub = cartSubtotal();
        const del = deliveryFee();
        const lines = [
                `*New Order — ${SHOP.name}* 🍪`,
                ``,
                ...items.map(({ p, qty }) => `• ${p.name} × ${qty} = ${fmt(p.price * qty)}`),
                ``,
                `Subtotal: ${fmt(sub)}`,
                `Delivery: ${del === 0 ? 'FREE' : fmt(del)}`,
                `*Total: ${fmt(sub + del)}*`,
                ``,
                `Name: ${name}`,
                `Phone: ${phone}`,
                `Address: ${addr}`
        ];
        return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
}
