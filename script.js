let cart = [];
let currentModalProductId = null;
let currentModalProductName = "";
let currentModalProductPrice = 0;
let modalImagesArray = [];
let currentImageIndex = 0;
let selectedRating = 0;

document.addEventListener("DOMContentLoaded", () => {
    initStars();
});

function startHiddenAudio() {
    const audio = document.getElementById('bgAudio');
    if (audio) {
        audio.play().then(() => {
            document.removeEventListener('click', startHiddenAudio);
            document.removeEventListener('touchstart', startHiddenAudio);
        }).catch((error) => {
            console.log("Audio play blocked, waiting for user interaction.", error);
        });
    }
}
document.addEventListener('click', startHiddenAudio);
document.addEventListener('touchstart', startHiddenAudio);

function toggleMenu() {
    document.getElementById('menuSidebar').classList.toggle('active');
}

function openFabricModal(e, tabType = 'compression') {
    if (e && e.preventDefault) e.preventDefault();
    const sidebar = document.getElementById('menuSidebar');
    if (sidebar && sidebar.classList.contains('active')) toggleMenu();
    
    const modal = document.getElementById('fabricModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        switchFabricTab(tabType);
    }
}

function closeFabricModal() { 
    const modal = document.getElementById('fabricModal');
    if (modal) {
        modal.classList.remove('active'); 
        document.body.style.overflow = ''; 
    }
}

function closeFabricModalOutsideClick(e) { 
    if (e.target.id === 'fabricModal') closeFabricModal(); 
}

function switchFabricTab(type) {
    const compTab = document.getElementById('compressionTab');
    const suitTab = document.getElementById('suitTab');
    const hoodiesTab = document.getElementById('hoodiesTab');
    const pantsTab = document.getElementById('pantsTab');
    const buttons = document.querySelectorAll('.fabric-tabs .tab-btn');
    
    if (compTab) compTab.style.display = 'none';
    if (suitTab) suitTab.style.display = 'none';
    if (hoodiesTab) hoodiesTab.style.display = 'none';
    if (pantsTab) pantsTab.style.display = 'none';
    
    buttons.forEach(btn => {
        btn.style.color = '#aaa';
        btn.style.borderBottom = '2px solid transparent';
    });
    
    if (type === 'compression' && compTab) {
        compTab.style.display = 'block';
        if (buttons[0]) { buttons[0].style.color = '#fff'; buttons[0].style.borderBottom = '2px solid #ff4444'; }
    } else if (type === 'suit' && suitTab) {
        suitTab.style.display = 'block';
        if (buttons[1]) { buttons[1].style.color = '#fff'; buttons[1].style.borderBottom = '2px solid #ff4444'; }
    } else if (type === 'hoodies' && hoodiesTab) {
        hoodiesTab.style.display = 'block';
        if (buttons[2]) { buttons[2].style.color = '#fff'; buttons[2].style.borderBottom = '2px solid #ff4444'; }
    } else if (type === 'pants' && pantsTab) {
        pantsTab.style.display = 'block';
        if (buttons[3]) { buttons[3].style.color = '#fff'; buttons[3].style.borderBottom = '2px solid #ff4444'; }
    }
}

function changeSuitImage(imgSrc, element) {
    const mainImg = document.getElementById('suitMainImage');
    if (mainImg) {
        mainImg.src = imgSrc;
    }
    const thumbs = document.querySelectorAll('.suit-thumb');
    thumbs.forEach(thumb => thumb.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }
}

function openAboutModal(e) { 
    e.preventDefault(); 
    const sidebar = document.getElementById('menuSidebar'); 
    if (sidebar && sidebar.classList.contains('active')) toggleMenu(); 
    const modal = document.getElementById('aboutModal');
    if (modal) {
        modal.classList.add('active'); 
        document.body.style.overflow = 'hidden'; 
    }
}

function closeAboutModal() { 
    const modal = document.getElementById('aboutModal');
    if (modal) {
        modal.classList.remove('active'); 
        document.body.style.overflow = ''; 
    }
}

function closeAboutModalOnOutsideClick(e) { 
    if (e.target.id === 'aboutModal') closeAboutModal(); 
}

function openReviewModalFromFooter(e) { 
    e.preventDefault(); 
    document.getElementById('reviewOverlay').classList.add('active'); 
}

function closeReviewModalOnOutsideClick(e) { 
    if (e.target.id === 'reviewOverlay') closeReviewAndReset(); 
}

function closeReviewAndReset() { 
    document.getElementById('reviewOverlay').classList.remove('active'); 
}

function initStars() {
    const stars = document.querySelectorAll('#ratingStars .star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-value'));
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= selectedRating) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });
}

function submitReview() {
    const name = document.getElementById('reviewerName').value;
    const text = document.getElementById('reviewText').value;
    if (!name || !text || selectedRating === 0) {
        alert("من فضلك املأ جميع الحقول واقترح تقييماً بالنجوم.");
        return;
    }
    alert("شكراً لك! تم إرسال تقييمك إلى الـ Abyss بنجاح.");
    closeReviewAndReset();
}

function toggleCart() { 
    document.getElementById('cartSidebar').classList.toggle('active'); 
}

function scrollToTop() { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

function openProductModal(event, id, name, price, img1, img2) {
    const card = event.currentTarget;
    
    if (card && (card.classList.contains('sold-out') || card.classList.contains('Restock-ing'))) {
        alert("عذراً، هذا المنتج غير متاح حالياً (RESTOCKING) ولا يمكن طلبه في الوقت الحالي.");
        return;
    }

    currentModalProductId = id;
    currentModalProductName = name;
    currentModalProductPrice = price;
    modalImagesArray = [img1, img2];
    currentImageIndex = 0;

    document.getElementById('modalProductTitle').innerText = name;
    document.getElementById('modalProductPrice').innerText = price + " EGP";
    document.getElementById('modalMainImage').src = img1;
    document.getElementById('thumbFront').src = img1;
    document.getElementById('thumbBack').src = img2;
    document.getElementById('thumbFront').classList.add('active-thumb');
    document.getElementById('thumbBack').classList.remove('active-thumb');

    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function setModalImage(src, index) {
    currentImageIndex = index;
    document.getElementById('modalMainImage').src = src;
    document.querySelectorAll('.modal-thumbnails img').forEach((img, idx) => {
        if (idx === index) img.classList.add('active-thumb');
        else img.classList.remove('active-thumb');
    });
}

function switchModalImage(direction) {
    currentImageIndex = (currentImageIndex + direction + modalImagesArray.length) % modalImagesArray.length;
    setModalImage(modalImagesArray[currentImageIndex], currentImageIndex);
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const count = document.getElementById('cartCount');
    
    count.innerText = cart.length;
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(i => {
            total += (i.price * i.qty);
            return `<div class="cart-item"><h4>${i.name}</h4><p>المقاس: ${i.size} | ${i.price} EGP</p></div>`;
        }).join('');
    }
    cartTotal.innerText = total + " EGP";
}

function openCheckoutForm() {
    if (cart.length === 0) { alert("السلة فارغة!"); return; }
    const productsCost = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shippingCost = 80;
    const finalTotal = productsCost + shippingCost;

    const priceDisplay = document.getElementById('finalTotalDisplay');
    if (priceDisplay) {
        priceDisplay.value = `${productsCost} + 80 (شحن) = ${finalTotal} EGP`;
    }
    document.getElementById('checkoutOverlay').classList.add('active');
}

function sendOrder(event) {
    event.preventDefault();
    const form = document.getElementById('orderForm');
    const productsCost = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let itemsDetails = cart.map(i => `${i.name} (${i.size})`).join(', ');
    
    document.getElementById('orderedProductsDetails').value = itemsDetails + ` | الإجمالي شامل الشحن: ${productsCost + 80} EGP`;

    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            alert("تم إرسال الطلب بنجاح!");
            cart = [];
            updateCartUI();
            closeCheckoutForm();
        } else {
            alert("حدث خطأ في الإرسال.");
        }
    })
    .catch(err => alert("خطأ في الاتصال: " + err));
}

function addFromModalToCart() {
    const sizeInput = document.querySelector('input[name="modal-size"]:checked');
    if (!sizeInput) { alert("من فضلك اختر المقاس"); return; }
    cart.push({ id: currentModalProductId, name: currentModalProductName, price: currentModalProductPrice, size: sizeInput.value, qty: 1 });
    updateCartUI();
    closeProductModal();
    toggleCart();
}

function buyItNowFromModal() {
    const sizeInput = document.querySelector('input[name="modal-size"]:checked');
    if (!sizeInput) { alert("من فضلك اختر المقاس"); return; }
    cart = [{ id: currentModalProductId, name: currentModalProductName, price: currentModalProductPrice, size: sizeInput.value, qty: 1 }];
    updateCartUI();
    closeProductModal();
    openCheckoutForm();
}

function closeProductModal() { 
    document.getElementById('productModal').classList.remove('active'); 
    document.body.style.overflow = ''; 
}

function closeProductModalOnOutsideClick(e) { 
    if (e.target.id === 'productModal') closeProductModal(); 
}

function closeCheckoutForm() { 
    document.getElementById('checkoutOverlay').classList.remove('active'); 
}

function closeCheckoutFormOnOutsideClick(e) { 
    if (e.target.id === 'checkoutOverlay') closeCheckoutForm(); 
}
