import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

export default function AdminSettings(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const [settings, setSettings] = useState(null)
  useEffect(()=>{
    if(!token) { window.location.href = '/login'; return }
    fetch('http://localhost:5000/api/admin/settings', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(setSettings)
      .catch(()=>{})
  }, [])
  return (
    <Layout>
      <h1>الإعدادات</h1>
      <pre>{settings ? JSON.stringify(settings, null, 2) : 'جار التحميل'}</pre>
    </Layout>
  )
}
