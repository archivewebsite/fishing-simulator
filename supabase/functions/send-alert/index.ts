import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (request: Request): Promise<Response> => {
    if (request.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    try {
        const payload = await request.json();
        const { type, user, details, timestamp } = payload;

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'FishingGame Alert <onboarding@resend.dev>',
                to: ['unvermicular@gmail.com'],
                subject: `ALERT: ${type} Detected`,
                html: `
          <h1>Suspicious Activity Detected</h1>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>User ID:</strong> ${user || 'Anonymous'}</p>
          <p><strong>Time:</strong> ${timestamp}</p>
          <p><strong>Details:</strong> ${details}</p>
        `
            })
        });

        const body = await res.text();
        if (!res.ok) {
            return new Response(JSON.stringify({ error: 'Resend failed', status: res.status, body }), {
                status: 502,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        return new Response(body, {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
