import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // Get photo info
    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('photos')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    
    // Delete from storage
    const { error: storageError } = await supabaseAdmin
      .storage
      .from('wedding-photos')
      .remove([photo.file_path])
    
    if (storageError) throw storageError
    
    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('photos')
      .delete()
      .eq('id', id)
    
    if (dbError) throw dbError
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}