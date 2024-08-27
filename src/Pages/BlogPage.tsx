import React, { useState } from 'react'
import { BsShare, BsX } from 'react-icons/bs'
import { FaPenSquare, FaThumbsUp } from 'react-icons/fa'
import { FiMessageSquare } from 'react-icons/fi'

export default function BlogPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newPost, setNewPost] = useState({ title: '', content: '' })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewPost(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('New blog post:', newPost)
        // Here you would typically send this data to your backend
        setNewPost({ title: '', content: '' })
        setIsModalOpen(false)
    }

    return (
        <div className="min-h-screen bg-zinc-900 text-zinc-100 font-mono">

            <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                <div className="lg:w-3/4 space-y-8">
                    <button
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded flex items-center justify-center"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaPenSquare className="mr-2" size={18} />
                        Write New Post
                    </button>

                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full"></div>
                            <div>
                                <h2 className="text-lg font-semibold">Mastering React Hooks: A Deep Dive</h2>
                                <p className="text-sm text-zinc-400">by John Doe • 3 days ago</p>
                            </div>
                        </div>
                        <p className="text-zinc-300 mb-4">
                            React Hooks have revolutionized the way we write React components. In this post, we'll explore the power of useState, useEffect, and custom hooks...
                        </p>
                        <div className="flex justify-between items-center text-zinc-400">
                            <div className="flex space-x-4">
                                <button className="flex items-center hover:text-emerald-500">
                                    <FaThumbsUp size={18} className="mr-1" />
                                    124
                                </button>
                                <button className="flex items-center hover:text-emerald-500">
                                    <FiMessageSquare size={18} className="mr-1" />
                                    23
                                </button>
                            </div>
                            <button className="flex items-center hover:text-emerald-500">
                                <BsShare size={18} className="mr-1" />
                                Share
                            </button>
                        </div>
                    </div>

                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full"></div>
                            <div>
                                <h2 className="text-lg font-semibold">Building Scalable APIs with GraphQL</h2>
                                <p className="text-sm text-zinc-400">by Jane Doe • 1 week ago</p>
                            </div>
                        </div>
                        <p className="text-zinc-300 mb-4">
                            GraphQL has gained popularity for its flexibility and efficiency in API development. In this article, we'll dive into best practices for building scalable GraphQL APIs...
                        </p>
                        <div className="flex justify-between items-center text-zinc-400">
                            <div className="flex space-x-4">
                                <button className="flex items-center hover:text-emerald-500">
                                    <FaThumbsUp size={18} className="mr-1" />
                                    89
                                </button>
                                <button className="flex items-center hover:text-emerald-500">
                                    <FiMessageSquare size={18} className="mr-1" />
                                    15
                                </button>
                            </div>
                            <button className="flex items-center hover:text-emerald-500">
                                <BsShare size={18} className="mr-1" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                <aside className="lg:w-1/4 space-y-8">
                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Popular Tags</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-emerald-900 text-emerald-100 px-2 py-1 rounded text-sm">#react</span>
                            <span className="bg-emerald-900 text-emerald-100 px-2 py-1 rounded text-sm">#javascript</span>
                            <span className="bg-emerald-900 text-emerald-100 px-2 py-1 rounded text-sm">#nodejs</span>
                            <span className="bg-emerald-900 text-emerald-100 px-2 py-1 rounded text-sm">#typescript</span>
                            <span className="bg-emerald-900 text-emerald-100 px-2 py-1 rounded text-sm">#graphql</span>
                        </div>
                    </div>

                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Top Contributors</h2>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-emerald-500 rounded-full"></div>
                                <div>
                                    <p className="font-semibold">John Doe</p>
                                    <p className="text-sm text-zinc-400">Full Stack Developer</p>
                                </div>
                            </li>
                            <li className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-emerald-500 rounded-full"></div>
                                <div>
                                    <p className="font-semibold">Jane Doe</p>
                                    <p className="text-sm text-zinc-400">Frontend Specialist</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </aside>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Write New Blog Post</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-100">
                                <BsX size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newPost.title}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-zinc-100 focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-sm font-medium text-zinc-300 mb-1">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={newPost.content}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-zinc-100 focus:outline-none focus:border-emerald-500"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded">
                                Publish Post
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}