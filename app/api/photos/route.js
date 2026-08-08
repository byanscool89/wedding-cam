import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ photos: data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}