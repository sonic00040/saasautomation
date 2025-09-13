'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Upload, 
  File, 
  FileText, 
  FileImage,
  X,
  CheckCircle,
  AlertCircle,
  Book,
  Plus,
  Download,
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  FileType,
  Calendar,
  Users
} from "lucide-react"

interface KnowledgeFile {
  id: string
  name: string
  type: 'pdf' | 'txt' | 'doc' | 'docx' | 'text'
  size: number
  uploadDate: Date
  status: 'processing' | 'ready' | 'error'
  category: string
  description?: string
  chunks?: number
}

interface UploadFile {
  file: File
  id: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  error?: string
}

export default function KnowledgePage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [textContent, setTextContent] = useState('')
  const [textTitle, setTextTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Mock data - in real app this would come from API
  const knowledgeFiles: KnowledgeFile[] = [
    {
      id: '1',
      name: 'Product Documentation.pdf',
      type: 'pdf',
      size: 2547200,
      uploadDate: new Date(Date.now() - 86400000),
      status: 'ready',
      category: 'Documentation',
      description: 'Complete product documentation and user guide',
      chunks: 45
    },
    {
      id: '2',
      name: 'FAQ Responses.txt',
      type: 'txt',
      size: 156800,
      uploadDate: new Date(Date.now() - 172800000),
      status: 'ready',
      category: 'Support',
      description: 'Frequently asked questions and answers',
      chunks: 23
    },
    {
      id: '3',
      name: 'Company Policies.docx',
      type: 'docx',
      size: 894300,
      uploadDate: new Date(Date.now() - 259200000),
      status: 'processing',
      category: 'Policies',
      description: 'Internal company policies and procedures',
      chunks: 0
    }
  ]

  const categories = ['all', 'Documentation', 'Support', 'Policies', 'Training']

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = (files: File[]) => {
    const newUploads: UploadFile[] = files.map(file => ({
      file,
      id: Math.random().toString(),
      progress: 0,
      status: 'uploading'
    }))

    setUploadFiles(prev => [...prev, ...newUploads])

    // Simulate upload progress
    newUploads.forEach(upload => {
      simulateUpload(upload.id)
    })
  }

  const simulateUpload = (uploadId: string) => {
    const interval = setInterval(() => {
      setUploadFiles(prev => prev.map(upload => {
        if (upload.id === uploadId) {
          if (upload.progress >= 100) {
            clearInterval(interval)
            return { ...upload, status: 'processing' as const }
          }
          return { ...upload, progress: upload.progress + 10 }
        }
        return upload
      }))
    }, 200)

    // Simulate processing completion
    setTimeout(() => {
      setUploadFiles(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, status: 'complete' as const, progress: 100 }
          : upload
      ))
    }, 3000)
  }

  const removeUpload = (uploadId: string) => {
    setUploadFiles(prev => prev.filter(upload => upload.id !== uploadId))
  }

  const addTextContent = () => {
    if (!textContent.trim() || !textTitle.trim()) return

    const newUpload: UploadFile = {
      file: new File([textContent], `${textTitle}.txt`, { type: 'text/plain' }),
      id: Math.random().toString(),
      progress: 100,
      status: 'complete'
    }

    setUploadFiles(prev => [...prev, newUpload])
    setTextContent('')
    setTextTitle('')
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'txt':
        return <FileType className="h-5 w-5 text-blue-500" />
      case 'doc':
      case 'docx':
        return <File className="h-5 w-5 text-blue-600" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing':
        return <div className="h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = knowledgeFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalFiles = knowledgeFiles.length
  const totalSize = knowledgeFiles.reduce((sum, file) => sum + file.size, 0)
  const totalChunks = knowledgeFiles.reduce((sum, file) => sum + (file.chunks || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header with dark theme matching screenshot */}
      <div className="bg-slate-900 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Book className="h-7 w-7 text-yellow-400" />
              Knowledge Base
            </h1>
            <p className="mt-2 text-slate-300">
              Upload and manage content to train your AI chatbots
            </p>
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <File className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalFiles}</div>
            <div className="text-sm text-slate-600">Total Files</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {formatFileSize(totalSize).split(' ')[0]}
            </div>
            <div className="text-sm text-slate-600">
              {formatFileSize(totalSize).split(' ')[1]} Storage Used
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalChunks}</div>
            <div className="text-sm text-slate-600">Content Chunks</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload Files
            </CardTitle>
            <CardDescription>
              Upload PDF, DOC, or TXT files to expand your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-yellow-400 bg-yellow-50' 
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Drop files here
              </h3>
              <p className="text-slate-600 mb-4">
                or click to browse and select files
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Choose Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              />
              <p className="text-xs text-slate-500 mt-2">
                Supported formats: PDF, DOC, DOCX, TXT (Max 10MB each)
              </p>
            </div>

            {/* Upload Progress */}
            {uploadFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Upload Progress</h4>
                {uploadFiles.map((upload) => (
                  <div key={upload.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    {getFileIcon(upload.file.name.split('.').pop() || '')}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {upload.file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all"
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {upload.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {upload.status === 'complete' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {upload.status === 'processing' && (
                        <div className="h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeUpload(upload.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Text Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Add Text Content
            </CardTitle>
            <CardDescription>
              Directly input text content for your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-title">Title</Label>
              <Input
                id="text-title"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="Enter content title..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text-content">Content</Label>
              <textarea
                id="text-content"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste or type your content here..."
                className="w-full h-40 p-3 border border-slate-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <Button 
              onClick={addTextContent}
              disabled={!textContent.trim() || !textTitle.trim()}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Base Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-purple-600" />
                Content Library
              </CardTitle>
              <CardDescription>
                Manage your uploaded content and knowledge base
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Content List */}
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-slate-900 truncate">{file.name}</h3>
                    {getStatusIcon(file.status)}
                    <Badge variant="secondary" className="text-xs">
                      {file.category}
                    </Badge>
                  </div>
                  {file.description && (
                    <p className="text-sm text-slate-600 mb-2">{file.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {file.uploadDate.toLocaleDateString()}
                    </span>
                    <span>{formatFileSize(file.size)}</span>
                    {file.chunks && (
                      <span>{file.chunks} chunks</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No content found</h3>
              <p className="text-slate-600">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload your first file or add text content to get started'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}