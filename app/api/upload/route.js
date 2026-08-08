import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { image } = await request.json()
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Convert base64 to buffer
    const base64Data = image.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Generate unique filename
    const fileName = `wedding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
    const filePath = `public/${fileName}`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('wedding-photos')
      .upload(filePath, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('wedding-photos')
      .getPublicUrl(filePath)
    
    // Save to database
    const { error: dbError } = await supabaseAdmin
      .from('photos')
      .insert([{
        file_name: fileName,
        file_path: filePath,
        public_url: publicUrl
      }])
    
    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save photo info' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      photo: {
        file_name: fileName,
        public_url: publicUrl
      }
    })
    
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}