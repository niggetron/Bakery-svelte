<script>
	import { fade, fly } from 'svelte/transition';
	import { SHOP, CATEGORIES, PRODUCTS, REVIEWS, fmt } from '$lib/shop.js';
	import {
		cart,
		loadCart,
		addToCart,
		decreaseFromCart,
		removeFromCart,
		clearCart,
		cartEntries,
		cartQty,
		cartSubtotal,
		deliveryFee,
		buildWhatsAppOrder
	} from '$lib/cart.svelte.js';

	// ---------- UI state ----------
	let activeCat = $state('all');
	let searchQuery = $state('');
	let drawerOpen = $state(false);
	let menuOpen = $state(false);
	let toasts = $state([]);
	let toastId = 0;
	let countBump = $state(false);

	// ---------- Checkout form ----------
	let custName = $state('');
	let custPhone = $state('');
	let custAddr = $state('');
	let errName = $state(false);
	let errPhone = $state(false);
	let errAddr = $state(false);

	// ---------- Load persisted cart (browser only) ----------
	$effect(() => {
		loadCart();
	});

	// ---------- Lock scroll while drawer is open ----------
	$effect(() => {
		document.body.style.overflow = drawerOpen ? 'hidden' : '';
	});

	// ---------- Bump the cart badge when quantity changes ----------
	let prevQty = 0;
	$effect(() => {
		const q = qty;
		if (q > prevQty) {
			countBump = true;
			setTimeout(() => (countBump = false), 220);
		}
		prevQty = q;
	});

	// ---------- Reveal-on-scroll animation ----------
	$effect(() => {
		const io = new IntersectionObserver(
			(entries) => {
				for (const en of entries) {
					if (en.isIntersecting) {
						en.target.classList.add('in');
						io.unobserve(en.target);
					}
				}
			},
			{ threshold: 0.12 }
		);
		document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
		return () => io.disconnect();
	});

	// ---------- Derived cart data ----------
	const entries = $derived(cartEntries());
	const qty = $derived(cartQty());
	const subtotal = $derived(cartSubtotal());
	const delivery = $derived(deliveryFee());
	const total = $derived(subtotal + delivery);
	const shipNote = $derived(
		subtotal === 0 ? '' : delivery === 0 ? "🎉 You've unlocked FREE delivery!" : `Add ${fmt(SHOP.freeDeliveryAbove - subtotal)} more for FREE delivery`
	);
	const visibleProducts = $derived(
		PRODUCTS.filter(
			(p) =>
				(activeCat === 'all' || p.cat === activeCat) &&
				(!searchQuery.trim() ||
					p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
					p.desc.toLowerCase().includes(searchQuery.trim().toLowerCase()))
		)
	);

	// ---------- Actions ----------
	function toast(msg) {
		const id = ++toastId;
		toasts.push({ id, msg });
		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, 2700);
	}

	function handleAdd(id, silent = false) {
		const p = addToCart(id, silent);
		if (!silent && p) toast(`🍪 ${p.name} added to cart`);
	}

	function handleDec(id) {
		const p = decreaseFromCart(id);
		if (p && !cart.items[id]) toast(`Removed ${p.name}`);
	}

	function handleRemove(id) {
		const p = removeFromCart(id);
		if (p) toast(`Removed ${p.name}`);
	}

	function handleCheckout() {
		if (!qty) {
			toast('Your cart is empty 🛒');
			return;
		}
		errName = custName.trim() === '';
		errPhone = !/^\d{10}$/.test(custPhone.trim());
		errAddr = custAddr.trim() === '';
		if (errName || errPhone || errAddr) {
			toast('Please fill name, 10-digit phone & address');
			return;
		}
		const url = buildWhatsAppOrder(custName.trim(), custPhone.trim(), custAddr.trim());
		window.open(url, '_blank', 'noopener');
		toast('Opening WhatsApp to confirm your order 💬');
	}

	function handleClear() {
		if (!qty) return;
		clearCart();
		toast('Cart cleared');
	}

	const year = new Date().getFullYear();
</script>

<svelte:head>
	<title>Rashmita Bakery — Fresh Homemade Cookies in Dungurpali, Odisha</title>
</svelte:head>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (drawerOpen = false, menuOpen = false)} />

<!-- ================= HEADER ================= -->
<header>
	<div class="nav">
		<a class="brand" href="#home" aria-label="Rashmita Bakery home">
			<span class="logo" aria-hidden="true">🍪</span>
			<span>Rashmita Bakery<small>Dungurpali · Odisha</small></span>
		</a>
		<button
			class="menu-toggle"
			aria-label="Toggle menu"
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			{menuOpen ? '✕' : '☰'}
		</button>
		<nav class:open={menuOpen} class="links" aria-label="Main navigation">
			<a href="#home" onclick={() => (menuOpen = false)}>Home</a>
			<a href="#menu" onclick={() => (menuOpen = false)}>Menu</a>
			<a href="#about" onclick={() => (menuOpen = false)}>About</a>
			<a href="#contact" onclick={() => (menuOpen = false)}>Contact</a>
		</nav>
		<button class="cart-btn" aria-label="Open cart" onclick={() => (drawerOpen = true)}>
			<span aria-hidden="true">🛒</span><span class="cart-label">Cart</span>
			<span class="cart-count" class:bump={countBump}>{qty}</span>
		</button>
	</div>
</header>

<!-- ================= HERO ================= -->
<section id="home">
	<div class="hero">
		<div>
			<span class="kicker">🧁 Baked fresh every morning in Dungurpali</span>
			<h1>Cookies that taste <em>just like home</em></h1>
			<p>
				Handmade in small batches with real butter, clean ingredients and a whole lot of love.
				From classic chocolate chip to Odisha's own chhena-poda flavour — Rashmita Bakery
				brings warm, crunchy happiness to your tea time.
			</p>
			<div class="hero-actions">
				<a href="#menu" class="btn-primary">Order Cookies 🍪</a>
				<a href="#about" class="btn-ghost">Our Story</a>
			</div>
			<div class="hero-stats">
				<div><strong>12+</strong><span>Cookie flavours</span></div>
				<div><strong>100%</strong><span>Fresh &amp; homemade</span></div>
				<div><strong>1 day</strong><span>Freshly baked to order</span></div>
			</div>
		</div>
		<div class="hero-art" aria-hidden="true">
			<div class="cookie-hero">🍪</div>
			<div class="chip-badge b1">🧈 Real butter</div>
			<div class="chip-badge b2">⭐ Loved locally</div>
		</div>
	</div>
</section>

<!-- ================= MENU ================= -->
<section id="menu">
	<div class="section-wrap">
		<div class="section-head reveal">
			<h2>Our Cookie Menu</h2>
			<p>Every box is baked fresh after you order. Prices are per 250&nbsp;g box unless marked otherwise.</p>
		</div>
		<div class="menu-tools reveal">
			<div class="search-box">
				<span aria-hidden="true">🔍</span>
				<input
					type="search"
					placeholder="Search cookies…"
					aria-label="Search cookies"
					bind:value={searchQuery}
				/>
			</div>
			<div class="filters" role="tablist" aria-label="Cookie categories">
				{#each CATEGORIES as c (c.key)}
					<button
						class="filter-chip"
						class:active={activeCat === c.key}
						role="tab"
						aria-selected={activeCat === c.key}
						onclick={() => (activeCat = c.key)}
					>
						{c.label}
					</button>
				{/each}
			</div>
		</div>
		<div class="grid">
			{#if visibleProducts.length === 0}
				<div class="empty-msg"><span>🔍</span>No cookies match your search — try another flavour!</div>
			{:else}
				{#each visibleProducts as p (p.id)}
					<article class="card">
						<div class="card-img" aria-hidden="true">
							{p.emoji}
							{#if p.tag}<span class="tag" class:veg={p.veg} class:egg={!p.veg}>{p.tag}</span>{/if}
						</div>
						<div class="card-body">
							<h3>{p.name}</h3>
							<p class="desc">{p.desc}</p>
							<div class="card-foot">
								<div class="price">
									{fmt(p.price)}
									<small>{p.weight} · {p.veg ? '🌱 eggless' : '🥚 contains egg'}</small>
								</div>
								{#if cart.items[p.id] > 0}
									<div class="qty-ctrl" aria-label="Quantity of {p.name} in cart">
										<button aria-label="Decrease quantity" onclick={() => handleDec(p.id)}>−</button>
										<span class="q">{cart.items[p.id]}</span>
										<button aria-label="Increase quantity" onclick={() => handleAdd(p.id, true)}>+</button>
									</div>
								{:else}
									<button class="add-btn" onclick={() => handleAdd(p.id)}>＋ Add to cart</button>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			{/if}
		</div>
	</div>
</section>

<!-- ================= ABOUT ================= -->
<section id="about" class="about">
	<div class="section-wrap">
		<div class="about-grid">
			<div class="about-art reveal" aria-hidden="true">👩‍🍳</div>
			<div class="reveal">
				<h2>From our little oven in Dungurpali</h2>
				<p>
					Rashmita Bakery started in a small home kitchen in <strong>Dungurpali, Balangir
					district (Odisha)</strong> with one simple idea — cookies the way a mother would make
					them: honest ingredients, generous butter and absolutely no shortcuts.
				</p>
				<p>
					What began as festival treats for neighbours is today a favourite stop for cookie
					lovers across the town. We still bake in small batches, knead every dough by hand,
					and pack each box only after you place your order.
				</p>
				<ul>
					<li>No preservatives, no artificial colours</li>
					<li>Pure butter &amp; quality dry fruits</li>
					<li>Both egg and eggless options — clearly marked</li>
					<li>Local pickup in Dungurpali &amp; delivery across nearby areas</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- ================= REVIEWS ================= -->
<section>
	<div class="section-wrap">
		<div class="section-head reveal">
			<h2>Sweet words from our customers</h2>
			<p>Real love from real neighbours. 💛</p>
		</div>
		<div class="reviews-grid">
			{#each REVIEWS as r (r.name)}
				<div class="review reveal">
					<div class="stars" aria-label="{r.stars} out of 5 stars">{'★'.repeat(r.stars)}</div>
					<p>{r.text}</p>
					<div class="who">
						<span class="avatar">{r.avatar}</span>
						<span>{r.name}<small>{r.place}</small></span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ================= CONTACT ================= -->
<section id="contact">
	<div class="section-wrap">
		<div class="section-head reveal">
			<h2>Get in touch</h2>
			<p>Walk in, call us, or simply add cookies to your cart — we'll confirm every order personally.</p>
		</div>
		<div class="contact-grid">
			<div class="contact-card reveal">
				<div class="ico">📍</div>
				<h3>Visit us</h3>
				<p>Rashmita Bakery<br />Main Road, near Dungurpali Bus Stand<br />Dungurpali, Balangir, Odisha 767023</p>
			</div>
			<div class="contact-card reveal">
				<div class="ico">🕖</div>
				<h3>Open hours</h3>
				<p>Mon – Sat: 8:00 AM – 8:30 PM<br />Sunday: 9:00 AM – 1:00 PM<br />(Festival orders: book 2 days ahead)</p>
			</div>
			<div class="contact-card reveal">
				<div class="ico">📞</div>
				<h3>Call / WhatsApp</h3>
				<p>+91 94370 00000<br />Same number for delivery queries<br />and bulk / festival orders.</p>
			</div>
		</div>
	</div>
</section>

<!-- ================= FOOTER ================= -->
<footer>
	<div class="f-brand">🍪 Rashmita Bakery</div>
	<p>Baking smiles in Dungurpali, one cookie at a time.</p>
	<p class="copy">© {year} Rashmita Bakery · Dungurpali, Odisha · Made with ❤️ and real butter</p>
</footer>

<!-- ================= CART DRAWER ================= -->
{#if drawerOpen}
	<div
		class="overlay"
		transition:fade={{ duration: 250 }}
		onclick={() => (drawerOpen = false)}
		aria-hidden="true"
	></div>
	<aside
		class="drawer"
		aria-label="Shopping cart"
		transition:fly={{ x: 440, duration: 300, opacity: 1 }}
	>
		<div class="drawer-head">
			<h3>Your Cookie Box 🛒</h3>
			<button class="close-btn" aria-label="Close cart" onclick={() => (drawerOpen = false)}>✕</button>
		</div>
		<div class="drawer-items">
			{#if entries.length === 0}
				<div class="cart-empty">
					<span>🛒</span>Your cookie box is empty.<br />Go grab some warm cookies from the menu!
				</div>
			{:else}
				{#each entries as { p, qty: q } (p.id)}
					<div class="cart-item">
						<div class="thumb" aria-hidden="true">{p.emoji}</div>
						<div class="info">
							<h4>{p.name}</h4>
							<div class="unit">{fmt(p.price)} · {p.weight}</div>
							<button class="rm" onclick={() => handleRemove(p.id)}>Remove</button>
						</div>
						<div style="display:flex;flex-direction:column;align-items:flex-end;gap:.4rem">
							<div class="line-total">{fmt(p.price * q)}</div>
							<div class="qty-ctrl">
								<button aria-label="Decrease quantity" onclick={() => handleDec(p.id)}>−</button>
								<span class="q">{q}</span>
								<button aria-label="Increase quantity" onclick={() => handleAdd(p.id, true)}>+</button>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
		<div class="drawer-foot">
			<div class="free-ship-note">{shipNote}</div>
			<div class="bill-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
			<div class="bill-row"><span>Delivery</span><span>{delivery === 0 ? 'FREE' : fmt(delivery)}</span></div>
			<div class="bill-row total"><span>Total</span><span>{fmt(total)}</span></div>
			<div class="checkout-fields">
				<input
					type="text"
					placeholder="Your name"
					autocomplete="name"
					bind:value={custName}
					class:err={errName}
				/>
				<input
					type="tel"
					placeholder="Phone number (10 digits)"
					autocomplete="tel"
					inputmode="numeric"
					bind:value={custPhone}
					class:err={errPhone}
				/>
				<input
					type="text"
					placeholder="Delivery address / pickup note"
					autocomplete="street-address"
					bind:value={custAddr}
					class:err={errAddr}
				/>
			</div>
			<button class="checkout-btn" onclick={handleCheckout}>
				<span aria-hidden="true">💬</span> Place order on WhatsApp
			</button>
			<button class="clear-cart" onclick={handleClear}>Clear cart</button>
		</div>
	</aside>
{/if}

<!-- ================= TOASTS ================= -->
<div class="toast-zone" aria-live="polite">
	{#each toasts as t (t.id)}
		<div class="toast" transition:fly={{ y: 14, duration: 300 }}>{t.msg}</div>
	{/each}
</div>
