import Layout from '../../components/Layout'
import { useState } from 'react'

export default function CreateProduct(){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [stock, setStock] = useState(0)
  const [category, setCategory] = useState('')
  const [imageUrls, setImageUrls] = useState('')
  const [variations, setVariations] = useState('[]')
  const [details, setDetails] = useState('[]')
  async function submit(){
    const body = {
      title, description, price: parseFloat(price), stock: parseInt(stock), category,
      imageUrls: imageUrls.split(',').map(s => s.trim()).filter(Boolean),
      variations: JSON.parse(variations), details: JSON.parse(details)
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    const res = await fetch('http://localhost:5000/api/admin/products', {
      method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify(body)
    })
    if(res.ok) alert('تم إنشاء المنتج')
    else alert('فشل إنشاء المنتج')
  }
  return (
    <Layout>
      <h1>إنشاء منتج</h1>
      <div className="card" style={{ padding:20 }}>
        <input placeholder="عنوان المنتج" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea placeholder="وصف" value={description} onChange={e=>setDescription(e.target.value)} rows={3} style={{ width:'100%' }} />
        <input placeholder="السعر" type="number" value={price} onChange={e=>setPrice(e.target.value)} />
        <input placeholder="المخزون" type="number" value={stock} onChange={e=>setStock(e.target.value)} />
        <input placeholder="التصنيف" value={category} onChange={e=>setCategory(e.target.value)} />
        <input placeholder="Urls للصورة (مفصولة بفواصل)" value={imageUrls} onChange={e=>setImageUrls(e.target.value)} />
        <textarea placeholder="Variations JSON" value={variations} onChange={e=>setVariations(e.target.value)} rows={4} style={{ width:'100%' }} />
        <textarea placeholder="Details JSON" value={details} onChange={e=>setDetails(e.target.value)} rows={4} style={{ width:'100%' }} />
        <button onClick={submit}>إضافة المنتج</button>
      </div>
    </Layout>
  )
}
