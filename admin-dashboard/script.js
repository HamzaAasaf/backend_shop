const BASE = 'http://localhost:5000/api'
let token = null

function api(path, options = {}) {
  const headers = options.headers || {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'
  return fetch(`${BASE}${path}`, { ...options, headers })
}

async function login() {
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (res.ok) {
    const data = await res.json()
    token = data.token
    document.getElementById('login-area').style.display = 'none'
    document.getElementById('logout-btn').style.display = 'inline-block'
    renderAll()
  } else {
    alert('فشل تسجيل الدخول! تحقق من بيانات الاعتماد والموافقة')
  }
}

document.getElementById('login-btn').addEventListener('click', login)
document.getElementById('logout-btn').addEventListener('click', ()=>{
  token = null
  document.getElementById('login-area').style.display = 'flex'
  document.getElementById('logout-btn').style.display = 'none'
})

function showSection(name){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'))
  const el = document.getElementById(name)
  if (el) el.classList.add('active')
}
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    showSection(btn.getAttribute('data-section'))
  })
})

async function renderAll(){
  if(!token) return
  document.getElementById('inventory').innerHTML = InventoryUI()
  document.getElementById('orders').innerHTML = OrdersUI()
  document.getElementById('users').innerHTML = UsersUI()
  document.getElementById('coupons').innerHTML = CouponsUI()
  document.getElementById('analytics').innerHTML = AnalyticsUI()
  document.getElementById('settings').innerHTML = SettingsUI()
  // Bind event handlers
  document.getElementById('prod-submit')?.addEventListener('click', submitProduct)
  // ... more bindings can be added as needed
}

function InventoryUI(){
  return `
  <div class="card"><h3>إدارة المنتجات (Inventory)</h3>
    <form id="prod-form">
      <div class="grid">
        <input id="p-title" placeholder="عنوان المنتج" />
        <input id="p-price" placeholder="السعر" type="number" step="0.01" />
      </div>
      <div class="grid">
        <input id="p-stock" placeholder="المخزون" type="number" />
        <input id="p-category" placeholder="التصنيف" />
      </div>
      <textarea id="p-description" placeholder="وصف المنتج" rows="3" style="width:100%"></textarea>
      <textarea id="p-images" placeholder="صور (رابط، مفصول بفواصل)" rows="2" style="width:100%"></textarea>
      <textarea id="variations-json" placeholder="Variations كـ JSON array" rows="3" style="width:100%"></textarea>
      <div id="variations"></div>
      <button type="button" id="add-variation">إضافة variation</button>
      <div style="margin-top:8px"></div>
      <textarea id="details-json" placeholder="Details كـ JSON array" rows="3" style="width:100%"></textarea>
      <div id="details"></div>
      <button type="button" id="add-detail">إضافة Detail</button>
      <div style="margin-top:8px"></div>
      <button type="button" id="prod-submit">إضافة المنتج</button>
    </form>
  </div>`
}
function OrdersUI(){
  return `<div class=\"card\"><h3>إدارة الطلبات</h3><div id=\"orders-list\"></div></div>`
}
function UsersUI(){ return `<div class=\"card\"><h3>المستخدمين</h3><div id=\"users-list\"></div></div>` }
function CouponsUI(){ return `<div class=\"card\"><h3>الكوبونات</h3></div>` }
function AnalyticsUI(){ return `<div class=\"card\"><h3>الإحصاءات</h3><div id=\"analytics-area\"></div></div>` }
function SettingsUI(){ return `<div class=\"card\"><h3>الإعدادات</h3><div>إعدادات الشحن والدفع والعملات واللغات</div></div>` }
async function submitProduct(){
  const payload = {
    title: document.getElementById('p-title').value,
    price: parseFloat(document.getElementById('p-price').value),
    stock: parseInt(document.getElementById('p-stock').value, 10),
    category: document.getElementById('p-category').value,
    description: document.getElementById('p-description').value,
    imageUrls: document.getElementById('p-images').value.split(',').map(s => s.trim()).filter(Boolean),
    variations: JSON.parse(document.getElementById('variations-json')?.value || '[]'),
    details: JSON.parse(document.getElementById('details-json')?.value || '[]')
  }
  const res = await api('/admin/products', {
    method: 'POST', body: JSON.stringify(payload)
  })
  if (res.ok) {
    alert('تم إنشاء المنتج بنجاح')
  } else {
    alert('فشل إنشاء المنتج')
  }
}

// Initialize a basic UI on load
window.onload = () => {
  // Initialize sections
  document.getElementById('dashboard').innerHTML = `<div class=\"card\"><h3>مرحبا بك في لوحة التحكم</h3><p>قم باختيار قسم من الشريط الجانبي لبدأ الإدارة.</p></div>`
  renderAll().catch(console.error)
}
