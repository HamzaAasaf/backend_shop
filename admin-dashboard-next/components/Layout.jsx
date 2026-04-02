import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Layout({ children }) {
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  useEffect(() => {
    const isLoginPage = router.pathname === '/login'
    if (!token && !isLoginPage) {
      router.push('/login')
    }
  }, [token, router.pathname])
  function logout() {
    localStorage.removeItem('admin_token')
    router.push('/login')
  }
  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <aside style={{ width:260, background:'#0b1320', color:'#fff', padding:20 }}>
        <h2 style={{ marginTop:0 }}>Shop Admin</h2>
        <nav>
          <Link href="/dashboard"><a style={{ display:'block', padding:8, color:'#fff' }}>لوحة التحكم</a></Link>
          <Link href="/products"><a style={{ display:'block', padding:8, color:'#fff' }}>إدارة المنتجات</a></Link>
          <Link href="/orders"><a style={{ display:'block', padding:8, color:'#fff' }}>الطلبات</a></Link>
          <Link href="/users"><a style={{ display:'block', padding:8, color:'#fff' }}>المستخدمين</a></Link>
          <Link href="/coupons"><a style={{ display:'block', padding:8, color:'#fff' }}>الكوبونات</a></Link>
          <Link href="/analytics"><a style={{ display:'block', padding:8, color:'#fff' }}>الإحصاءات</a></Link>
          <Link href="/settings"><a style={{ display:'block', padding:8, color:'#fff' }}>الإعدادات</a></Link>
        </nav>
        <button onClick={logout} style={{ marginTop:20, padding:10, borderRadius:6, background:'#1f2937', color:'#fff', border:0 }}>تسجيل الخروج</button>
      </aside>
      <main style={{ flex:1, padding:20 }}>{children}</main>
    </div>
  )
}
