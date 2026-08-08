import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { image } = body
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const base64Data = image.split(',')[1]
    if (!base64Data) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }
    
    const buffer = Buffer.from(base64Data, 'base64')
    const fileName = `wedding-${Date.now()}.jpg`
    const filePath = `public/${fileName}`
    
    // Dynamic import supabase
    const { supabaseAdmin } = await import('@/lib/supabase')
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('wedding-photos')
      .upload(filePath, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Storage error:', uploadError)
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 })
    }
    
    // Get public URL
    const { data: urlData } = supabaseAdmin
      .storage
      .from('wedding-photos')
      .getPublicUrl(filePath)
    
    const publicUrl = urlData?.publicUrl
    
    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to get URL' }, { status: 500 })
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
      console.error('Database error:', dbError)
      // Tetap return success walaupun db error
    }
    
    return NextResponse.json({ success: true, url: publicUrl })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Server error: ' + error.message 
    }, { status: 500 })
  }
}