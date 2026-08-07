"use client"
import { useState, useEffect } from "react"

export default function Dashboard(){
  const [text, setText] = useState("")
  const [mounted, setMounted] = useState(false)
  
  useEffect(()=>{
    setMounted(true)
  },[])

  const publish = async () => {
    const token = localStorage.getItem("threads_token")
    if(!text){
      alert("Type something first")
      return
    }
    const res = await fetch("/api/threads/publish", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({text, token})
    })
    const data = await res.json()
    alert(data.id ? "Posted! ID: "+data.id : JSON.stringify(data))
  }

  if(!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-xl md:max-w-3xl mx-auto">
        <div className="
