/// <reference types="@cloudflare/workers-types" />

interface Env {
  ASSETS: Fetcher;
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
}

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  website?: string; // honeypot
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method === 'POST') {
        return handleContact(request, env);
      }
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'POST' },
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleContact(request: Request, env: Env): Promise<Response> {
  let payload: ContactPayload;
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      payload = (await request.json()) as ContactPayload;
    } else if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const form = await request.formData();
      payload = Object.fromEntries(form) as unknown as ContactPayload;
    } else {
      return jsonResponse({ error: 'Unsupported content type' }, 415);
    }
  } catch {
    return jsonResponse({ error: 'Invalid payload' }, 400);
  }

  const name = String(payload.name ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const message = String(payload.message ?? '').trim();
  const honeypot = String(payload.website ?? '').trim();

  // honeypot: silently accept ("OK"), no email sent
  if (honeypot) return jsonResponse({ ok: true });

  if (!name || name.length > 100) {
    return jsonResponse({ error: '名前を入力してください（100文字以内）。' }, 400);
  }
  if (!email || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: '有効なメールアドレスを入力してください。' }, 400);
  }
  if (!message || message.length > 5000) {
    return jsonResponse({ error: 'メッセージを入力してください（5000文字以内）。' }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL secret');
    return jsonResponse({ error: 'サーバ設定が完了していません。直接ココナラ等でご連絡ください。' }, 503);
  }

  try {
    await sendViaResend({ name, email, message }, env);
  } catch (err) {
    console.error('Resend send failed:', err);
    return jsonResponse({ error: '送信に失敗しました。時間をおいて再度お試しください。' }, 502);
  }

  return jsonResponse({ ok: true });
}

async function sendViaResend(
  data: { name: string; email: string; message: string },
  env: Env,
): Promise<void> {
  const subject = `[Contact] ${data.name}`;
  const text =
    `Name: ${data.name}\n` +
    `Email: ${data.email}\n\n` +
    `--- Message ---\n${data.message}\n`;
  const html =
    `<h2 style="margin:0 0 0.6em;font-family:Inter,system-ui,sans-serif;">新しい問い合わせ</h2>` +
    `<table style="border-collapse:collapse;font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.6;">` +
    `<tr><th align="left" style="padding:4px 12px 4px 0;color:#888;">Name</th><td>${escapeHtml(data.name)}</td></tr>` +
    `<tr><th align="left" style="padding:4px 12px 4px 0;color:#888;">Email</th><td><a href="mailto:${encodeURI(data.email)}">${escapeHtml(data.email)}</a></td></tr>` +
    `</table>` +
    `<h3 style="margin:1.2em 0 0.4em;font-family:Inter,system-ui,sans-serif;">Message</h3>` +
    `<pre style="white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;background:#f5f5f4;padding:12px;border-radius:6px;border:1px solid #e6e2d6;">${escapeHtml(data.message)}</pre>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Contact Form <onboarding@resend.dev>',
      to: [env.CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body.slice(0, 200)}`);
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
