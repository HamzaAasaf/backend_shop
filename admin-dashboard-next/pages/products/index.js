import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

export default function AdminProducts(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const [list, setList] = useState([])
  useEffect(()=>{
    if(!token) { window.location.href = '/login'; return }
    fetch('http://localhost:5000/api/admin/products', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(setList)
      .catch(()=>{})
  }, [])
  return (
    <Layout>
      <h1>إدارة المنتجات</h1>
      <ul>{list.map(p => (<li key={p.id||p._id}>{p.title} - {p.price}</li>))}</ul>
    </Layout>
  )
}
