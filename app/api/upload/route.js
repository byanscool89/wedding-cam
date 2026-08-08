import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { image } = body
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Convert base64 to buffer
    const base64Data = image.split(',')[1]
    if (!base64Data) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 })
    }
    
    const buffer = Buffer.from(base64Data, 'base64')
    const fileName = `wedding-${Date.now()}.jpg`
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
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }
    
    // Get public URL
    const { data: urlData } = supabaseAdmin
      .storage
      .from('wedding-photos')
      .getPublicUrl(filePath)
    
    const publicUrl = urlData?.publicUrl
    
    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to get public URL' }, { status: 500 })
    }
    
    // Save to database
    const { error: dbError } = await supabaseAdmin
      .from('photos')
      .insert([{
        file_name: fileName,
        file_path: filePath,
        public_url: publicUrl
      }])
    
    if (dbError) {
      console.error('Database insert error:', dbError)
      // File udah keupload, tapi database gagal
      // Tetap return success dengan URL
      return NextResponse.json({ 
        success: true, 
        url: publicUrl,
        warning: 'Photo uploaded but failed to save metadata'
      })
    }
    
    return NextResponse.json({ success: true, url: publicUrl })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: error.message || 'Upload failed' 
    }, { status: 500 })
  }
}