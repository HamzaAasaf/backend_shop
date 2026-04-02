import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

export default function AdminOrders(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const [list, setList] = useState([])
  useEffect(()=>{
    if(!token) { window.location.href = '/login'; return }
    fetch('http://localhost:5000/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(setList)
      .catch(()=>{})
  }, [])
  return (
    <Layout>
      <h1>إدارة الطلبات</h1>
      <ul>{list.map(o => (<li key={o.id||o._id}>{o.id} - {o.status}</li>))}</ul>
    </Layout>
  )
}
