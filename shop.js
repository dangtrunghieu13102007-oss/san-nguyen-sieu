const SHOP_PRODUCTS = [
  {
    id: 'water',
    image: 'https://product.hstatic.net/200000531683/product/nuoc_suoi_aquafina_500ml_0e1fa9958e1d4ecb991c2942f2d8b736_master.jpg',
    category: 'drink',
    name: 'Nước suối 500ml',
    description: 'Chai nước mát, tiện mang theo trong lúc chơi.',
    price: 7000,
    unit: 'chai',
    icon: '💧',
    tag: 'Thiết yếu'
  },
  {
    id: 'revive',
    image: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/3226/96107/bhx/96107-thumb_202507290928567207.jpg',
    category: 'drink',
    name: 'Nước Revive 390ml',
    description: 'Nước bù khoáng giúp bổ sung năng lượng sau vận động.',
    price: 10000,
    unit: 'chai',
    icon: '⚡',
    tag: 'Bù khoáng'
  },
  {
    id: 'salt-lemon',
    image: 'https://victoryplaza.vn/media/product/4238_revive_chanh_muoi.jpg',
    category: 'drink',
    name: 'Nước chanh muối 390ml',
    description: 'Vị chanh muối dễ uống, phù hợp sau những trận đấu dài.',
    price: 10500,
    unit: 'chai',
    icon: '🍋',
    tag: 'Bù khoáng'
  },
  {
    id: 'sting',
    image: 'https://img.websosanh.vn/v2/users/wss/images/nuoc-tang-luc-sting-lon-do-330/bs40xsnivadp5.jpg',
    category: 'drink',
    name: 'Nước tăng lực 330ml',
    description: 'Đồ uống giải khát dùng trước hoặc giữa buổi chơi.',
    price: 10000,
    unit: 'lon',
    icon: '🥤',
    tag: 'Giải khát'
  },
  {
    id: 'ion-water',
    image: 'https://cdn.nhathuoclongchau.com.vn/v1/static/DSC_02249_62354bdc79.jpg',
    category: 'drink',
    name: 'Nước điện giải 500ml',
    description: 'Bổ sung nước và chất điện giải khi vận động.',
    price: 15000,
    unit: 'chai',
    icon: '🫗',
    tag: 'Bù nước'
  },
  {
    id: 'sports-tape',
    image: 'https://img.drz.lazcdn.com/static/pk/p/74fd6b54957b9dac2fe7ebc2d5b17cf4.jpg_720x720q80.jpg',
    category: 'support',
    name: 'Băng cuốn thể thao',
    description: 'Cuộn băng co giãn dùng quấn cổ tay, cổ chân hoặc ngón tay.',
    price: 19000,
    unit: 'cuộn',
    icon: '🩹',
    tag: 'Cơ bản'
  },
  {
    id: 'knee-support',
    image: 'https://product.hstatic.net/200000611939/product/den_xam-2_4705e01d71df493d8463d32ae964178c.jpg',
    category: 'support',
    name: 'Băng gối thể thao',
    description: 'Đai hỗ trợ đầu gối cơ bản cho các hoạt động vận động.',
    price: 195000,
    unit: 'chiếc',
    icon: '🦵',
    tag: 'Bảo hộ'
  },
  {
    id: 'ankle-support',
    image: 'https://cdn.shopvnb.com/uploads/san_pham/bang-co-chan-aolikes-a-1527-chinh-hang-3.webp',
    category: 'support',
    name: 'Băng cổ chân',
    description: 'Thiết kế ôm gọn, hỗ trợ cổ chân khi chạy và đổi hướng.',
    price: 145000,
    unit: 'chiếc',
    icon: '🦶',
    tag: 'Bảo hộ'
  },
  {
    id: 'wrist-support',
    image: 'https://cdn.hstatic.net/products/200000427585/bang_quan_co_tay__4__694c7426ecad4b5caa6dfe03bc9b21bd_master.jpg',
    category: 'support',
    name: 'Băng cổ tay',
    description: 'Giúp cố định và hạn chế mỏi cổ tay khi chơi thể thao.',
    price: 99000,
    unit: 'chiếc',
    icon: '🤲',
    tag: 'Bảo hộ'
  },
  {
    id: 'arm-sleeve',
    image: 'https://laz-img-sg.alicdn.com/p/47d3df1d8841f37baa04441287b94961.jpg',
    category: 'support',
    name: 'Băng tay thể thao',
    description: 'Ống tay co giãn nhẹ, hỗ trợ bảo vệ và thấm mồ hôi.',
    price: 129000,
    unit: 'chiếc',
    icon: '💪',
    tag: 'Phụ kiện'
  }
];

const SHOP_STORAGE = {
  cart: 'vk_shop_cart',
  orders: 'vk_shop_orders'
};
const SHOP_SHIPPING_FEE = 30000;
const SHOP_PICKUP_VENUES = [
  'Khu A · Cầu lông — Sân 1',
  'Khu A · Cầu lông — Sân 2',
  'Khu A · Cầu lông — Sân 3',
  'Khu A · Cầu lông — Sân 4',
  'Khu B · Pickleball — Sân A',
  'Khu B · Pickleball — Sân B',
  'Khu B · Pickleball — Sân C',
  'Khu C · Bóng đá mini — Sân 1',
  'Khu C · Bóng đá mini — Sân 2',
  'Khu C · Bóng đá mini — Sân 3',
  'Khu C · Bóng đá mini — Sân 4',
  'Khu D · Sân 7 người — Sân 1',
  'Khu D · Sân 7 người — Sân 2',
  'Khu D · Sân 7 người — Sân 3',
  'Khu D · Sân 7 người — Sân 4',
  'Khu E · Tennis — Sân đất nền',
  'Khu E · Tennis — Sân cứng'
];
const SHOP_PICKUP_HOURS = Array.from({ length: 20 }, (_, index) => index + 6);

const shopElement = id => document.getElementById(id);
const shopMoney = value => `${Number(value).toLocaleString('vi-VN')}đ`;
const shopEscape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[character]));

const readShopStorage = (name, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(name) || 'null');
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
};

const writeShopStorage = (name, value) => {
  try {
    localStorage.setItem(name, JSON.stringify(value));
  } catch (error) {
  }
};

const shopProductsById = new Map(SHOP_PRODUCTS.map(product => [product.id, product]));
let shopCart = readShopStorage(SHOP_STORAGE.cart, []);
let shopFilter = 'all';
let activeShopOrder = null;

shopCart = Array.isArray(shopCart)
  ? shopCart
    .filter(item => shopProductsById.has(item.productId))
    .map(item => ({
      productId: item.productId,
      quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1))
    }))
  : [];

function shopCartQuantity() {
  return shopCart.reduce((total, item) => total + item.quantity, 0);
}

function shopCartTotal() {
  return shopCart.reduce((total, item) => {
    const product = shopProductsById.get(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function shopSelectedDeliveryMethod() {
  return document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'shipping';
}

function shopShippingFee() {
  return shopCart.length && shopSelectedDeliveryMethod() === 'shipping' ? SHOP_SHIPPING_FEE : 0;
}

function shopOrderTotal() {
  return shopCartTotal() + shopShippingFee();
}

function shopSetMessage(element, message, type = '') {
  if (!element) return;
  element.textContent = message;
  element.className = `msg${type ? ` ${type}` : ''}`;
}

function shopFormatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa xác định';

  return date.toLocaleString('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function shopFormatPickupDate(value) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function shopPickupTimeLabel(hour) {
  const start = String(hour % 24).padStart(2, '0');
  const end = String((hour + 1) % 24).padStart(2, '0');
  return `${start}:00 – ${end}:00`;
}

function shopSetupDeliveryOptions() {
  const venueSelect = shopElement('shopPickupVenue');
  const timeSelect = shopElement('shopPickupTime');
  const dateInput = shopElement('shopPickupDate');

  if (venueSelect) {
    venueSelect.innerHTML = `
      <option value="">Chọn khu và sân</option>
      ${SHOP_PICKUP_VENUES.map(venue => `<option value="${shopEscape(venue)}">${shopEscape(venue)}</option>`).join('')}
    `;
  }

  if (timeSelect) {
    timeSelect.innerHTML = `
      <option value="">Chọn khung giờ nhận</option>
      ${SHOP_PICKUP_HOURS.map(hour => {
        const label = shopPickupTimeLabel(hour);
        return `<option value="${label}">${label}</option>`;
      }).join('')}
    `;
  }

  if (dateInput) {
    const today = new Date();
    const todayKey = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');
    dateInput.min = todayKey;
  }
}

function shopSyncDeliveryFields() {
  const isPickup = shopSelectedDeliveryMethod() === 'pickup';
  const shippingFields = shopElement('shopShippingFields');
  const pickupFields = shopElement('shopPickupFields');
  const address = shopElement('shopAddress');
  const pickupInputs = [
    shopElement('shopPickupVenue'),
    shopElement('shopPickupDate'),
    shopElement('shopPickupTime')
  ];

  if (shippingFields) shippingFields.hidden = isPickup;
  if (pickupFields) pickupFields.hidden = !isPickup;
  if (address) {
    address.disabled = isPickup;
    address.required = !isPickup;
  }
  pickupInputs.forEach(input => {
    if (!input) return;
    input.disabled = !isPickup;
    input.required = isPickup;
  });

  shopRenderCart();
}

function shopOrderStatus(status) {
  const statuses = {
    pending: { label: 'Chờ thanh toán', className: 'is-pending' },
    customer_reported: { label: 'Đã báo thanh toán', className: 'is-reported' },
    pickup_reserved: { label: 'Đã đặt · trả tại quầy', className: 'is-confirmed' },
    confirmed: { label: 'Đã xác nhận', className: 'is-confirmed' },
    delivering: { label: 'Đang giao hàng', className: 'is-delivering' },
    completed: { label: 'Đã hoàn tất', className: 'is-completed' },
    cancelled: { label: 'Đã hủy', className: 'is-cancelled' }
  };

  return statuses[status] || statuses.pending;
}

function shopRenderOrders() {
  const container = shopElement('shopOrdersList');
  const countElement = shopElement('shopOrdersCount');
  if (!container || !countElement) return;

  const orders = readShopStorage(SHOP_STORAGE.orders, [])
    .filter(order => order && Array.isArray(order.items))
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));

  countElement.textContent = `${orders.length} đơn`;

  if (!orders.length) {
    container.innerHTML = '<p class="empty">Bạn chưa có đơn mua hàng nào.</p>';
    return;
  }

  container.innerHTML = orders.map(order => {
    const status = shopOrderStatus(order.status);
    const items = order.items.map(item => {
      const product = shopProductsById.get(item.productId);
      const name = item.name || product?.name || 'Sản phẩm không còn trong danh mục';
      const unit = item.unit || product?.unit || 'món';
      const price = Number(item.price ?? product?.price ?? 0);
      const image = item.image || product?.image || '';
      const quantity = Math.max(1, Number(item.quantity) || 1);

      return `
        <div class="shop-order-item">
          <img src="${shopEscape(image)}" alt="${shopEscape(name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
          <div class="shop-order-item-info">
            <strong>${shopEscape(name)}</strong>
            <span>${quantity} ${shopEscape(unit)} × ${shopMoney(price)}</span>
          </div>
          <strong>${shopMoney(price * quantity)}</strong>
        </div>
      `;
    }).join('');

    return `
      <article class="shop-order-card">
        <div class="shop-order-heading">
          <div>
            <span class="shop-order-label">Mã đơn ${shopEscape(order.id || '—')}</span>
            <strong>${shopFormatDate(order.createdAt)}</strong>
          </div>
          <span class="shop-order-status ${status.className}">${status.label}</span>
        </div>
        <div class="shop-order-items">${items}</div>
        <div class="shop-order-summary">
          <span>Nhận hàng: ${shopEscape(order.deliverySummary || order.address || 'Chưa có thông tin')}</span>
          <strong>Tổng ${shopMoney(order.total)}</strong>
        </div>
        ${order.paymentMethod === 'pay_at_counter' ? '<p class="shop-order-note">Thanh toán trực tiếp tại quầy khi nhận đồ.</p>' : ''}
        ${order.note ? `<p class="shop-order-note">Ghi chú: ${shopEscape(order.note)}</p>` : ''}
      </article>
    `;
  }).join('');
}

function shopRenderProducts() {
  const container = shopElement('shopProducts');
  if (!container) return;

  const products = shopFilter === 'all'
    ? SHOP_PRODUCTS
    : SHOP_PRODUCTS.filter(product => product.category === shopFilter);

  container.innerHTML = products.map(product => `
    <article class="shop-product-card">
      <div class="shop-product-visual">
        <img class="shop-product-image" src="${shopEscape(product.image)}" alt="${shopEscape(product.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
      </div>
      <div class="shop-product-top">
        <span class="shop-product-tag">${shopEscape(product.tag)}</span>
      </div>
      <h3>${shopEscape(product.name)}</h3>
      <p>${shopEscape(product.description)}</p>
      <div class="shop-product-bottom">
        <div>
          <strong>${shopMoney(product.price)}</strong>
          <span>/ ${shopEscape(product.unit)}</span>
        </div>
        <button class="shop-add-button" type="button" data-add-product="${product.id}">Thêm vào giỏ</button>
      </div>
    </article>
  `).join('');
}

function shopRenderCart() {
  const container = shopElement('shopCartItems');
  const subtotalElement = shopElement('shopSubtotal');
  const totalElement = shopElement('shopTotal');
  const shippingFeeElement = shopElement('shopShippingFee');
  const shippingFeeRow = shopElement('shopShippingFeeRow');
  const countElement = shopElement('shopCartCount');
  const badgeElement = shopElement('shopCartBadge');
  const payButton = shopElement('shopPayButton');

  if (!container || !subtotalElement || !totalElement || !shippingFeeElement || !shippingFeeRow || !countElement || !badgeElement || !payButton) return;

  const count = shopCartQuantity();
  countElement.textContent = count;
  badgeElement.textContent = count;
  subtotalElement.textContent = shopMoney(shopCartTotal());
  shippingFeeElement.textContent = shopMoney(SHOP_SHIPPING_FEE);
  shippingFeeRow.hidden = count === 0 || shopSelectedDeliveryMethod() !== 'shipping';
  totalElement.textContent = shopMoney(shopOrderTotal());
  payButton.disabled = count === 0;
  payButton.textContent = count === 0
    ? 'Thêm sản phẩm để thanh toán'
    : shopSelectedDeliveryMethod() === 'pickup'
      ? 'Đặt trước, thanh toán tại quầy'
      : 'Tạo mã QR thanh toán';

  if (!shopCart.length) {
    container.innerHTML = '<p class="empty">Giỏ hàng đang trống. Hãy chọn một món để bắt đầu.</p>';
    return;
  }

  container.innerHTML = shopCart.map(item => {
    const product = shopProductsById.get(item.productId);
    if (!product) return '';

    return `
      <div class="shop-cart-item">
        <div class="shop-cart-item-info">
          <strong>${shopEscape(product.name)}</strong>
          <span>${shopMoney(product.price)} / ${shopEscape(product.unit)}</span>
        </div>
        <div class="shop-cart-item-controls">
          <div class="shop-quantity-control" aria-label="Số lượng ${shopEscape(product.name)}">
            <button type="button" data-cart-action="decrease" data-product-id="${product.id}" aria-label="Giảm số lượng">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-action="increase" data-product-id="${product.id}" aria-label="Tăng số lượng">+</button>
          </div>
          <strong>${shopMoney(product.price * item.quantity)}</strong>
          <button class="shop-remove-button" type="button" data-cart-action="remove" data-product-id="${product.id}" aria-label="Xóa ${shopEscape(product.name)}">×</button>
        </div>
      </div>
    `;
  }).join('');
}

function shopSaveCart() {
  writeShopStorage(SHOP_STORAGE.cart, shopCart);
  shopRenderCart();
}

function shopAddProduct(productId) {
  const item = shopCart.find(cartItem => cartItem.productId === productId);
  if (item) {
    item.quantity = Math.min(99, item.quantity + 1);
  } else {
    shopCart.push({ productId, quantity: 1 });
  }

  shopSaveCart();
  shopSetMessage(shopElement('shopCheckoutMsg'), 'Đã thêm sản phẩm vào giỏ hàng.', 'ok');
}

function shopChangeQuantity(productId, change) {
  const item = shopCart.find(cartItem => cartItem.productId === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    shopCart = shopCart.filter(cartItem => cartItem.productId !== productId);
  }

  shopSaveCart();
}

function shopRemoveProduct(productId) {
  shopCart = shopCart.filter(item => item.productId !== productId);
  shopSaveCart();
}

function shopPrefillUser() {
  try {
    const user = JSON.parse(localStorage.getItem('vk_session') || 'null');
    if (!user) return;

    const nameInput = shopElement('shopName');
    const phoneInput = shopElement('shopPhone');
    if (nameInput && user.name && !nameInput.value) nameInput.value = user.name;
    if (phoneInput && /^0\d{9}$/.test(user.contact || '') && !phoneInput.value) {
      phoneInput.value = user.contact;
    }
  } catch (error) {
  }
}

function shopPaymentQrUrl(amount, phone) {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: phone,
    accountName: 'NGUYEN SIEU'
  });

  return `https://img.vietqr.io/image/TCB-1122777163-compact2.png?${params}`;
}

function shopOpenPayment(order) {
  activeShopOrder = order;
  const qr = shopElement('shopPaymentQr');
  if (qr) {
    qr.src = shopPaymentQrUrl(order.total, order.phone);
    qr.alt = `Mã QR thanh toán ${shopMoney(order.total)} cho đơn ${order.id}`;
  }

  shopElement('shopPaymentOrderId').textContent = order.id;
  shopElement('shopPaymentAmount').textContent = shopMoney(order.total);
  shopElement('shopPaymentContent').textContent = order.phone;
  shopElement('shopPaymentAddress').textContent = order.deliverySummary || order.address;
  shopSetMessage(shopElement('shopPaymentMsg'), 'Đơn hàng sẽ được sân xác nhận sau khi kiểm tra giao dịch.');
  shopElement('shopPaymentModal').hidden = false;
  document.body.classList.add('modal-open');
}

function shopClosePayment() {
  const modal = shopElement('shopPaymentModal');
  if (modal) modal.hidden = true;
  document.body.classList.remove('modal-open');
}

function shopUpdateOrderStatus(status) {
  if (!activeShopOrder) return;
  const orders = readShopStorage(SHOP_STORAGE.orders, []);
  const orderIndex = orders.findIndex(order => order.id === activeShopOrder.id);
  if (orderIndex === -1) return;

  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date().toISOString();
  writeShopStorage(SHOP_STORAGE.orders, orders);
}

function shopHandleCheckout(event) {
  event.preventDefault();
  const message = shopElement('shopCheckoutMsg');

  if (!shopCart.length) {
    shopSetMessage(message, 'Hãy thêm ít nhất một sản phẩm vào giỏ hàng.', 'err');
    return;
  }

  const name = shopElement('shopName').value.trim();
  const phone = shopElement('shopPhone').value.replace(/\D/g, '');
  const address = shopElement('shopAddress').value.trim();
  const note = shopElement('shopNote').value.trim();
  const deliveryMethod = shopSelectedDeliveryMethod();
  const pickupVenue = shopElement('shopPickupVenue')?.value || '';
  const pickupDate = shopElement('shopPickupDate')?.value || '';
  const pickupTime = shopElement('shopPickupTime')?.value || '';

  if (name.length < 2) {
    shopSetMessage(message, 'Vui lòng nhập họ tên người nhận.', 'err');
    return;
  }

  if (!/^0\d{9}$/.test(phone)) {
    shopSetMessage(message, 'Số điện thoại cần gồm 10 số và bắt đầu bằng 0.', 'err');
    return;
  }

  if (deliveryMethod === 'shipping' && address.length < 8) {
    shopSetMessage(message, 'Vui lòng nhập địa chỉ giao hàng đầy đủ.', 'err');
    return;
  }

  if (deliveryMethod === 'pickup' && (!pickupVenue || !pickupDate || !pickupTime)) {
    shopSetMessage(message, 'Vui lòng chọn rõ khu/sân, ngày và giờ nhận đồ tại sân.', 'err');
    return;
  }

  const deliverySummary = deliveryMethod === 'shipping'
    ? `Giao tận nơi · ${address}`
    : `Nhận tại ${pickupVenue} · ${shopFormatPickupDate(pickupDate)} · ${pickupTime}`;
  const shippingFee = deliveryMethod === 'shipping' ? SHOP_SHIPPING_FEE : 0;

  const order = {
    id: `MH${Date.now().toString(36).toUpperCase()}`,
    items: shopCart.map(item => {
      const product = shopProductsById.get(item.productId);
      return {
        ...item,
        name: product?.name,
        price: product?.price,
        unit: product?.unit,
        image: product?.image
      };
    }),
    name,
    phone,
    address: deliveryMethod === 'shipping' ? address : '',
    note,
    deliveryMethod,
    shippingFee,
    pickupVenue: deliveryMethod === 'pickup' ? pickupVenue : null,
    pickupDate: deliveryMethod === 'pickup' ? pickupDate : null,
    pickupTime: deliveryMethod === 'pickup' ? pickupTime : null,
    deliverySummary,
    total: shopCartTotal() + shippingFee,
    transferContent: phone,
    status: deliveryMethod === 'pickup' ? 'pickup_reserved' : 'pending',
    paymentMethod: deliveryMethod === 'pickup' ? 'pay_at_counter' : 'bank_transfer',
    createdAt: new Date().toISOString()
  };
  const orders = readShopStorage(SHOP_STORAGE.orders, []);
  orders.push(order);
  writeShopStorage(SHOP_STORAGE.orders, orders);

  if (deliveryMethod === 'pickup') {
    shopFinishPickupOrder(order);
    return;
  }

  shopOpenPayment(order);
}

function shopFinishPickupOrder(order) {
  shopCart = [];
  shopSaveCart();
  shopElement('shopCheckoutForm').reset();
  shopSyncDeliveryFields();
  shopPrefillUser();
  shopRenderOrders();
  shopSetMessage(
    shopElement('shopCheckoutMsg'),
    `Đã giữ đơn ${order.id}. Khi đến ${order.deliverySummary}, bạn đọc họ tên ${order.name} và số điện thoại ${order.phone} để nhận đồ, rồi thanh toán trực tiếp tại quầy.`,
    'ok'
  );
  shopElement('shopOrders')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function shopFinishPayment() {
  const finishedOrderId = activeShopOrder?.id;
  shopUpdateOrderStatus('customer_reported');
  shopClosePayment();
  shopCart = [];
  shopSaveCart();
  shopElement('shopCheckoutForm').reset();
  shopSyncDeliveryFields();
  shopPrefillUser();
  shopRenderOrders();
  shopSetMessage(shopElement('shopCheckoutMsg'), `Đã ghi nhận đơn ${finishedOrderId}. Bạn có thể xem lại sản phẩm trong mục “Đồ đã mua” bên dưới.`, 'ok');
  activeShopOrder = null;
  shopElement('shopOrders')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const productContainer = shopElement('shopProducts');
if (productContainer) {
  productContainer.addEventListener('click', event => {
    const button = event.target.closest('[data-add-product]');
    if (button) shopAddProduct(button.dataset.addProduct);
  });
}

const cartContainer = shopElement('shopCartItems');
if (cartContainer) {
  cartContainer.addEventListener('click', event => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;

    const productId = button.dataset.productId;
    const action = button.dataset.cartAction;
    if (action === 'increase') shopChangeQuantity(productId, 1);
    if (action === 'decrease') shopChangeQuantity(productId, -1);
    if (action === 'remove') shopRemoveProduct(productId);
  });
}

document.querySelectorAll('[data-shop-filter]').forEach(button => {
  button.addEventListener('click', () => {
    shopFilter = button.dataset.shopFilter;
    document.querySelectorAll('[data-shop-filter]').forEach(filterButton => {
      filterButton.classList.toggle('is-active', filterButton === button);
    });
    shopRenderProducts();
  });
});

document.querySelectorAll('input[name="deliveryMethod"]').forEach(input => {
  input.addEventListener('change', shopSyncDeliveryFields);
});

shopElement('shopCheckoutForm')?.addEventListener('submit', shopHandleCheckout);
shopElement('shopPaymentClose')?.addEventListener('click', shopClosePayment);
document.querySelector('[data-shop-payment-close]')?.addEventListener('click', shopClosePayment);
shopElement('shopPaymentDone')?.addEventListener('click', shopFinishPayment);
shopElement('shopCopyPayment')?.addEventListener('click', async () => {
  if (!activeShopOrder) return;
  const text = `${activeShopOrder.phone} - ${shopMoney(activeShopOrder.total)}`;
  try {
    await navigator.clipboard.writeText(text);
    shopSetMessage(shopElement('shopPaymentMsg'), `Đã sao chép nội dung: ${text}`, 'ok');
  } catch (error) {
    shopSetMessage(shopElement('shopPaymentMsg'), `Nội dung chuyển khoản: ${text}`);
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !shopElement('shopPaymentModal').hidden) {
    shopClosePayment();
  }
});

shopElement('shopProductCount').textContent = SHOP_PRODUCTS.length;
shopSetupDeliveryOptions();
shopSyncDeliveryFields();
shopPrefillUser();
shopRenderProducts();
shopRenderCart();
shopRenderOrders();
