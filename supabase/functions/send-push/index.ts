// livix-main/supabase/functions/send-push/index.ts
// Called by pg_net from DB triggers. Sends Expo push notifications
// and cleans up DeviceNotRegistered tokens automatically.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface PushPayload {
  user_id: string
  title: string
  body: string
  data?: Record<string, string>
}

serve(async (req) => {
  try {
    const payload: PushPayload = await req.json()
    const { user_id, title, body, data = {} } = payload

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch all tokens for this user (multi-device)
    const { data: tokens, error } = await serviceClient
      .from('push_tokens')
      .select('token')
      .eq('user_id', user_id)

    if (error || !tokens?.length) return new Response('ok')

    const messages = tokens.map(({ token }) => ({
      to: token,
      title,
      body,
      data,
      sound: 'default',
    }))

    // Send via Expo Push API
    const expoRes = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(messages),
    })

    const result = await expoRes.json()

    // Clean up expired tokens
    const expiredTokens: string[] = []
    const tickets: Array<{ status: string; details?: { error?: string } }> =
      result.data ?? []

    tickets.forEach((ticket, i) => {
      if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
        expiredTokens.push(tokens[i].token)
      }
    })

    if (expiredTokens.length > 0) {
      await serviceClient
        .from('push_tokens')
        .delete()
        .in('token', expiredTokens)
    }

    return new Response(JSON.stringify({ sent: tokens.length, cleaned: expiredTokens.length }))
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
