import { useRouter } from 'next/router'
import { useState } from 'react'
export default function Login(){
  const router = useRouter()
  const [email, setEmail] = useState('hamza@hamza.com')
  const [password, setPassword] = useState('hamza9090')
  const [error, setError] = useState(null)
  async function handleSubmit(e){
    e.preventDefault()
    try{
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if(res.ok && data.token){
        localStorage.setItem('admin_token', data.token)
        router.push('/dashboard')
      } else {
        setError(data.message || 'فشل الدخول')
      }
    }catch(err){ setError('فشل الاتصال بالخادم') }
  }
  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>تسجيل الدخول كمسؤول</h2>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="البريد الإلكتروني"/>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="كلمة المرور" type="password"/>
        <button type="submit">تسجيل الدخول</button>
        {error && <p className="error">{error}</p>}
      </form>
      <style jsx>{`
        .login-page{ display:flex; min-height:100vh; align-items:center; justify-content:center; background:#f5f5f5 }
        .login-form{ padding:2rem; background:#fff; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,.15) }
        input{ display:block; width:360px; padding:12px; margin:8px 0; border-radius:6px; border:1px solid #ddd }
        button{ padding:10px 16px; border-radius:6px; border:0; background:#111; color:#fff; }
        .error{ color:red }
      `}</style>
    </div>
  )
}
