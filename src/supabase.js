import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://byuergcdkeyrpgffxuga.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5dWVyZ2Nka2V5cnBnZmZ4dWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjQ1NDQsImV4cCI6MjA5NTc0MDU0NH0.kF6wbAul3IE_H8mYSz413JCb-Qckktfs48imiUBT178'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
