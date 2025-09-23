import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('candidates')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Supabase connection successful!')
    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

export async function testCreateCandidate() {
  try {
    console.log('Testing create candidate...')
    
    const testCandidate = {
      name: 'Test Candidate',
      class: 'Test Class',
      photo_url: 'https://example.com/test.jpg',
      vision: 'Test Vision',
      mission: ['Test Mission 1', 'Test Mission 2'],
      votes: 0,
      created_at: new Date().toISOString(),
      update_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('candidates')
      .insert([testCandidate])
      .select()
      .single()
    
    if (error) {
      console.error('Create candidate error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Create candidate successful:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}








