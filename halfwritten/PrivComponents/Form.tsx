"use client"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Form(){
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (!title.trim() || !content.trim()){
            setLoading(false)
            return alert('Title and content cannot be empty')
        }

        
        try {
            const response = await fetch('/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            })
            if(!response.ok) {
                throw new Error('Failed to create a post')
            }

            const result = await response.json()
            if(result.success){
                setTitle("")
                setContent("")

            }

        } catch (error) {
            console.error('Error creating post:', error)

        } finally {
            setLoading(false)
        }

    }

     

    return(
       <>
        {loading ? <p>Loading...</p> : <div className="w-9/10 h-full">
            <form action="" onSubmit={handleSubmit}>
                <h1 className="mb-4">Tell your story</h1>
                <div className="flex flex-col gap-4">
                    <div>
                        <Input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} name="title" placeholder="Title" />
                    </div>
                    <div className="w-full h-full">
                        <Textarea  name="content" value={content} onChange={(e)=>setContent(e.target.value)} className="h-100" placeholder="Content" />
                    </div>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </form>
        </div>} 
       </>
    )
}