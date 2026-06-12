export const config = { runtime: 'edge' };

const ALLOWED_ORIGINS = ['https://fichascout.vercel.app','https://fichascout.com','https://www.fichascout.com'];
const RATE_LIMIT_RPM = 8;
const rateLimitMap = new Map();

export default async function handler(req) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app');
  const corsHeaders = {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response(JSON.stringify({error:'Method not allowed'}), {status:405, headers:{...corsHeaders,'Content-Type':'application/json'}});

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rk = ip + ':' + Math.floor(Date.now()/60000);
  const cnt = (rateLimitMap.get(rk)||0) + 1;
  rateLimitMap.set(rk, cnt);
  if(cnt > RATE_LIMIT_RPM) return new Response(JSON.stringify({error:'Demasiadas solicitudes. Espera un minuto.', code:'RATE_LIMIT'}), {status:429, headers:{...corsHeaders,'Content-Type':'application/json'}});

  let body;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({error:'Body invalido'}), {status:400, headers:{...corsHeaders,'Content-Type':'application/json'}}); }

  const { model, max_tokens, messages, tools, system, stream } = body;
  if (!messages?.length) return new Response(JSON.stringify({error:'messages requerido'}), {status:400, headers:{...corsHeaders,'Content-Type':'application/json'}});

  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) return new Response(JSON.stringify({error:'Servidor no configurado'}), {status:500, headers:{...corsHeaders,'Content-Type':'application/json'}});

  const payload = {
    model: model || 'claude-sonnet-4-6',
    max_tokens: Math.min(max_tokens||1500, 2000),
    messages,
  };
  if (system) payload.system = system;
  if (tools?.length) payload.tools = tools;

  // MODO STREAMING - evita timeout de 25s en Vercel Hobby
  if (stream) {
    payload.stream = true;
    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body: JSON.stringify(payload),
    });
    if (!anthropicResp.ok) {
      const errText = await anthropicResp.text();
      let errMsg = 'Error Anthropic HTTP ' + anthropicResp.status;
      try { errMsg = JSON.parse(errText).error?.message || errMsg; } catch {}
      return new Response(JSON.stringify({error: errMsg}), {status: anthropicResp.status, headers:{...corsHeaders,'Content-Type':'application/json'}});
    }
    // Pasar el stream SSE de Anthropic directo al cliente
    return new Response(anthropicResp.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  }

  // MODO NORMAL (no streaming)
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body: JSON.stringify(payload),
    });
    let data;
    const contentType = r.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await r.json();
    } else {
      const rawText = await r.text();
      try { data = JSON.parse(rawText); }
      catch { return new Response(JSON.stringify({error: 'Error Anthropic (HTTP ' + r.status + '): ' + rawText.substring(0,200)}), {status: r.status >= 400 ? r.status : 500, headers:{...corsHeaders,'Content-Type':'application/json'}}); }
    }
    if (!r.ok) return new Response(JSON.stringify({error: data.error?.message || 'Error Anthropic HTTP ' + r.status, type: data.error?.type}), {status:r.status, headers:{...corsHeaders,'Content-Type':'application/json'}});
    return new Response(JSON.stringify(data), {status:200, headers:{...corsHeaders,'Content-Type':'application/json'}});
  } catch(err) {
    return new Response(JSON.stringify({error:'Error proxy: '+err.message}), {status:500, headers:{...corsHeaders,'Content-Type':'application/json'}});
  }
}
