// Supabase Edge Function: send-sos-sms
// Dispatches real SMS alerts to trusted emergency contacts via Twilio
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

interface SosSmsPayload {
  contacts: Array<{
    name: string;
    phone: string;
  }>;
  message: string;
  incidentId?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Twilio credentials not configured on Supabase Edge Function secrets.',
          instructions: 'Run: supabase secrets set TWILIO_ACCOUNT_SID=... TWILIO_AUTH_TOKEN=... TWILIO_PHONE_NUMBER=...'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { contacts, message, incidentId } = (await req.json()) as SosSmsPayload;

    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No contacts provided.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];
    const twilioEndpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const basicAuth = btoa(`${accountSid}:${authToken}`);

    for (const contact of contacts) {
      const cleanPhone = contact.phone.replace(/[^\d+]/g, '');
      const body = new URLSearchParams({
        To: cleanPhone,
        From: fromNumber,
        Body: message
      });

      try {
        const response = await fetch(twilioEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body.toString()
        });

        const data = await response.json();
        if (response.ok) {
          results.push({
            phone: cleanPhone,
            name: contact.name,
            status: 'sent',
            sid: data.sid
          });
        } else {
          results.push({
            phone: cleanPhone,
            name: contact.name,
            status: 'failed',
            error: data.message || 'Twilio delivery failed'
          });
        }
      } catch (err: any) {
        results.push({
          phone: cleanPhone,
          name: contact.name,
          status: 'failed',
          error: err.message
        });
      }
    }

    const allFailed = results.every((r) => r.status === 'failed');

    return new Response(
      JSON.stringify({
        success: !allFailed,
        incidentId,
        dispatchedCount: results.filter((r) => r.status === 'sent').length,
        results
      }),
      { status: allFailed ? 502 : 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
