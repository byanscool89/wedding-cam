import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    
    // Get photo info dulu
    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('photos')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }
    
    // Delete from storage
    const { error: storageError } = await supabaseAdmin
      .storage
      .from('wedding-photos')
      .remove([photo.file_path])
    
    if (storageError) {
      console.error('Storage error:', storageError)
      return NextResponse.json({ error: 'Failed to delete from storage' }, { status: 500 })
    }
    
    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('photos')
      .delete()
      .eq('id', id)
    
    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to delete from database' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}