// =====================================================
// Rashmita Bakery — shop config & products (edit freely)
// =====================================================

export const SHOP = {
	name: 'Rashmita Bakery',
	// ⚠️ REPLACE with the bakery's real WhatsApp number (country code, no "+")
	whatsapp: '919437000000',
	deliveryFee: 40, // ₹ flat delivery
	freeDeliveryAbove: 499 // ₹ free-delivery threshold
};

export const CATEGORIES = [
	{ key: 'all', label: 'All cookies' },
	{ key: 'classic', label: '🫖 Classic' },
	{ key: 'chocolate', label: '🍫 Chocolate' },
	{ key: 'premium', label: '✨ Premium' }
];

export const PRODUCTS = [
	{ id: 'cc1', emoji: '🍪', name: 'Chocolate Chip Cookies', desc: 'Crisp edges, gooey centres, loaded with real chocolate chips. Our all-time bestseller.', price: 199, weight: '250 g box', cat: 'chocolate', tag: 'bestseller', veg: true },
	{ id: 'dc2', emoji: '🍫', name: 'Double Chocolate Cookies', desc: 'Cocoa-rich dough studded with dark chocolate chunks. A chocoholic\'s dream.', price: 219, weight: '250 g box', cat: 'chocolate', tag: '', veg: true },
	{ id: 'bc3', emoji: '🧈', name: 'Pure Butter Cookies', desc: 'Melt-in-the-mouth Danish-style butter cookies, baked golden. Simple and perfect.', price: 179, weight: '250 g box', cat: 'classic', tag: '', veg: true },
	{ id: 'nk4', emoji: '🥮', name: 'Nankhatai', desc: "Traditional Indian cardamom-scented shortbread, just like grandma's tin.", price: 169, weight: '250 g box', cat: 'classic', tag: 'classic', veg: true },
	{ id: 'co5', emoji: '🥥', name: 'Coconut Crunch Cookies', desc: 'Toasted coconut in every bite — lightly sweet, perfectly crunchy.', price: 189, weight: '250 g box', cat: 'classic', tag: '', veg: true },
	{ id: 'cb6', emoji: '🥜', name: 'Cashew–Badam Cookies', desc: 'Loaded with whole cashews and almonds. Premium festive favourite.', price: 249, weight: '250 g box', cat: 'premium', tag: 'premium', veg: true },
	{ id: 'cp7', emoji: '🍮', name: 'Chhena Poda Cookies', desc: 'Our signature Odisha twist — caramelised chhena-poda flavour in a cookie!', price: 229, weight: '250 g box', cat: 'premium', tag: 'odisha special', veg: true },
	{ id: 'at8', emoji: '🌾', name: 'Atta Digestive Cookies', desc: 'Whole-wheat, lightly sweetened with jaggery. The healthy-ish tea companion.', price: 159, weight: '250 g box', cat: 'classic', tag: '', veg: true },
	{ id: 'jb9', emoji: '☕', name: 'Jeera Butter Cookies', desc: 'Savoury-sweet butter cookies with roasted cumin. Perfect with masala chai.', price: 165, weight: '250 g box', cat: 'classic', tag: '', veg: true },
	{ id: 'ec10', emoji: '🥚', name: 'Egg & Milk Cake Cookies', desc: 'Soft, rich cookies made with farm eggs and milk — extra protein, extra softness.', price: 199, weight: '250 g box', cat: 'classic', tag: '', veg: false }
];

export const REVIEWS = [
	{ stars: 5, text: 'The chocolate chip cookies disappeared within an hour of the box opening! Tastes even better than the big city brands.', avatar: '👩', name: 'Soumya Ranjan', place: 'Dungurpali' },
	{ stars: 5, text: 'Ordered nankhatai for my mother — she said it tastes exactly like the ones from her childhood. Will order again for Diwali.', avatar: '🧕', name: 'Priyanka Meher', place: 'Balangir' },
	{ stars: 5, text: 'Fresh, crunchy and you can actually smell the butter. The chhena poda flavour is such a unique Odisha twist!', avatar: '👨', name: 'Debasis Sahu', place: 'Titelagarh' }
];

export const fmt = (n) => '₹' + n.toLocaleString('en-IN');
