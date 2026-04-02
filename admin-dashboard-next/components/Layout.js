export default function Layout({ children }) {
  return (
    <div style={{ display:'flex' }}>
      <aside style={{ width:240, background:'#111', color:'#fff', minHeight:'100vh', padding:20 }}>
        <h3 style={{marginTop:0}}>Shop Admin</h3>
        <nav>
          <a href="/dashboard" style={{ color:'#fff', display:'block', margin:'8px 0' }}>لوحة التحكم</a>
          <a href="/products" style={{ color:'#fff', display:'block', margin:'8px 0' }}>إدارة المنتجات</a>
          <a href="/orders" style={{ color:'#fff', display:'block', margin:'8px 0' }}>الطلبات</a>
          <a href="/settings" style={{ color:'#fff', display:'block', margin:'8px 0' }}>الإعدادات</a>
        </nav>
      </aside>
      <main style={{ flex:1, padding:20 }}>{children}</main>
    </div>
  )
}
