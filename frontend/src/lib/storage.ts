import { supabase } from './supabase'

export interface UploadResult {
  success: boolean
  data?: {
    path: string
    fullPath: string
    publicUrl?: string
  }
  error?: string
}

export interface FileMetadata {
  id: string
  name: string
  path: string
  size: number
  type: string
  uploadedAt: Date
  userId: string
  processed: boolean
}

const STORAGE_BUCKET = 'knowledge-base'

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File, 
  userId: string, 
  folder: string = 'documents'
): Promise<UploadResult> {
  try {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 10MB'
      }
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'File type not supported. Please upload PDF, TXT, DOC, or DOCX files.'
      }
    }

    // Generate unique file path
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `${userId}/${folder}/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    // Get public URL (if needed for public access)
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)

    // Save file metadata to database
    await saveFileMetadata({
      name: file.name,
      path: filePath,
      size: file.size,
      type: file.type,
      userId,
      processed: false
    })

    return {
      success: true,
      data: {
        path: filePath,
        fullPath: data.path,
        publicUrl
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    // Remove file metadata from database
    await removeFileMetadata(filePath)

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

/**
 * Get download URL for a file
 */
export async function getFileUrl(filePath: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      url: data.signedUrl
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get file URL'
    }
  }
}

/**
 * List files for a user
 */
export async function listUserFiles(userId: string): Promise<{ success: boolean; files?: FileMetadata[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('knowledge_files')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    const files: FileMetadata[] = data.map((file) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(file.uploaded_at),
      userId: file.user_id,
      processed: file.processed
    }))

    return {
      success: true,
      files
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files'
    }
  }
}

/**
 * Save file metadata to database
 */
async function saveFileMetadata(metadata: Omit<FileMetadata, 'id' | 'uploadedAt'> & { uploadedAt?: Date }) {
  const { error } = await supabase
    .from('knowledge_files')
    .insert({
      name: metadata.name,
      path: metadata.path,
      size: metadata.size,
      type: metadata.type,
      user_id: metadata.userId,
      processed: metadata.processed,
      uploaded_at: metadata.uploadedAt || new Date().toISOString()
    })

  if (error) {
    console.error('Failed to save file metadata:', error)
    throw error
  }
}

/**
 * Remove file metadata from database
 */
async function removeFileMetadata(filePath: string) {
  const { error } = await supabase
    .from('knowledge_files')
    .delete()
    .eq('path', filePath)

  if (error) {
    console.error('Failed to remove file metadata:', error)
    throw error
  }
}

/**
 * Update file processing status
 */
export async function updateFileProcessingStatus(
  filePath: string, 
  processed: boolean, 
  chunks?: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { processed }
    if (chunks !== undefined) {
      updateData.chunks = chunks
    }

    const { error } = await supabase
      .from('knowledge_files')
      .update(updateData)
      .eq('path', filePath)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update file status'
    }
  }
}

/**
 * Get storage usage for a user
 */
export async function getUserStorageUsage(userId: string): Promise<{ success: boolean; usage?: number; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('knowledge_files')
      .select('size')
      .eq('user_id', userId)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    const totalUsage = data.reduce((sum, file) => sum + file.size, 0)

    return {
      success: true,
      usage: totalUsage
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get storage usage'
    }
  }
}