// livix-main/supabase/functions/record-like/index.ts
// Called by the app when user swipes right. Uses service_role to INSERT
// so the client never sees other users' likes (prevents pre-match exposure).

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify the calling user's identity
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { liked_id } = await req.json()
    if (!liked_id) {
      return new Response(JSON.stringify({ error: 'liked_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (liked_id === user.id) {
      return new Response(JSON.stringify({ error: 'Cannot like yourself' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Rate limiting: max 20 likes per 60 seconds
    const serviceClientForRateLimit = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { count: recentLikes } = await serviceClientForRateLimit
      .from('roommate_likes')
      .select('*', { count: 'exact', head: true })
      .eq('liker_id', user.id)
      .gte('created_at', new Date(Date.now() - 60_000).toISOString())

    if ((recentLikes ?? 0) >= 20) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Slow down.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify the target profile exists and is active
    const { data: targetProfile } = await serviceClientForRateLimit
      .from('roommate_profiles')
      .select('user_id')
      .eq('user_id', liked_id)
      .eq('is_active', true)
      .maybeSingle()

    if (!targetProfile) {
      return new Response(JSON.stringify({ error: 'Profile not found or inactive' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Service role client — bypasses RLS to hide pre-match likes from client
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Insert the like (unique constraint prevents duplicates)
    const { error: likeError } = await serviceClient
      .from('roommate_likes')
      .insert({ liker_id: user.id, liked_id })

    if (likeError && likeError.code !== '23505') {
      // 23505 = unique_violation (already liked — idempotent, not an error)
      throw likeError
    }

    // Check if this created a mutual match (trigger handles DB insert, we just report)
    const { data: matchData } = await serviceClient
      .from('roommate_matches')
      .select('id, matched_at')
      .or(`and(user_1_id.eq.${user.id},user_2_id.eq.${liked_id}),and(user_1_id.eq.${liked_id},user_2_id.eq.${user.id})`)
      .maybeSingle()

    return new Response(
      JSON.stringify({ match: matchData ?? null }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
