import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

export default function AdminCoupons(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const [list, setList] = useState([])
  useEffect(()=>{
    if(!token) { window.location.href = '/login'; return }
    fetch('http://localhost:5000/api/admin/coupons', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(setList)
      .catch(()=>{})
  }, [])
  return (
    <Layout>
      <h1>الكوبونات</h1>
      <ul>{list.map(c => (<li key={c._id||c.id}>{c.code} - {c.discount}{c.type}</li>))}</ul>
    </Layout>
  )
}
