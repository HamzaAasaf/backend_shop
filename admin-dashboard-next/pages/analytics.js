import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

export default function AdminAnalytics(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const [stats, setStats] = useState(null)
  useEffect(()=>{
    if(!token) { window.location.href = '/login'; return }
    fetch('http://localhost:5000/api/admin/analytics', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(setStats)
      .catch(()=>{})
  }, [])
  return (
    <Layout>
      <h1>الإحصاءات</h1>
      <pre>{stats ? JSON.stringify(stats, null, 2) : 'جار التحميل'}</pre>
    </Layout>
  )
}
