import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

export default function Dashboard(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const [stats, setStats] = useState(null)
  useEffect(()=>{
    if(!token) return
    fetch('http://localhost:5000/api/admin/analytics', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(setStats)
  }, [token])
  return (
    <Layout>
      <h1>لوحة الإدارة</h1>
      <div className="card" style={{ padding:20 }}>
        <h3>الإحصاءات</h3>
        {stats ? <pre>{JSON.stringify(stats, null, 2)}</pre> : <p>جار التحميل...</p>}
      </div>
    </Layout>
  )
}
