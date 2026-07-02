import { cookies } from 'next/headers'

import { env } from '@/env.mjs'
import { AI_ACCESS_COOKIE } from '@/lib/ai-guard'

/**
 * One-time unlock for the AI endpoints on a public deployment.
 *
 * Visit /api/ai-unlock?token=<AI_ACCESS_TOKEN> once in your browser. If the
 * token matches, an httpOnly cookie is set and the AI features work for you
 * from then on. Everyone else gets a 403 from the AI endpoints.
 *
 * If AI_ACCESS_TOKEN is not configured, the gate is disabled and this route 404s.
 */
export async function GET(request: Request) {
    const token = env.AI_ACCESS_TOKEN
    if (!token) {
        return Response.json({ error: 'AI access gate is not configured' }, { status: 404 })
    }

    const provided = new URL(request.url).searchParams.get('token')
    if (!provided || provided !== token) {
        return new Response('Forbidden', { status: 403 })
    }

    const cookieStore = await cookies()
    cookieStore.set(AI_ACCESS_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    // Land back on the tool, now unlocked. Use a relative Location so the browser
    // resolves it against the public domain — building an absolute URL from
    // request.url would point at the container's internal host (localhost:3000)
    // when running behind a reverse proxy.
    return new Response(null, { status: 302, headers: { Location: '/' } })
}
