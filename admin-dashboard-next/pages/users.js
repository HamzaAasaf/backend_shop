import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

export default function AdminUsers(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const [list, setList] = useState([])
  useEffect(()=>{
    if(!token) { window.location.href = '/login'; return }
    fetch('http://localhost:5000/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(setList)
      .catch(()=>{})
  }, [])
  return (
    <Layout>
      <h1>المستخدمين</h1>
      <ul>{list.map(u => (<li key={u._id||u.id}>{u.name} - {u.email} - {u.role}</li>))}</ul>
    </Layout>
  )
}
