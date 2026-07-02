import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(['development', 'production']),
        LLM_API_KEY: z.string().min(1),
        LLM_MODEL: z.string().optional(),
        // Optional - base URL for an OpenAI-compatible endpoint (e.g. Anthropic's
        // OpenAI-compatible API at https://api.anthropic.com/v1). Defaults to OpenAI.
        LLM_BASE_URL: z.string().url().optional(),
        // Optional - when set, the AI endpoints are locked and require the unlock
        // cookie from /api/ai-unlock?token=... When unset, the endpoints stay open.
        AI_ACCESS_TOKEN: z.string().optional(),
    },
    client: {
        NEXT_PUBLIC_GTM_MEASUREMENT_ID: z.string().min(1),
        NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
        NEXT_PUBLIC_TALLY_FORM_ID: z.string().optional(),
        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        LLM_API_KEY: process.env.LLM_API_KEY,
        LLM_MODEL: process.env.LLM_MODEL,
        LLM_BASE_URL: process.env.LLM_BASE_URL,
        AI_ACCESS_TOKEN: process.env.AI_ACCESS_TOKEN,
        NEXT_PUBLIC_GTM_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID,
        NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
        NEXT_PUBLIC_TALLY_FORM_ID: process.env.NEXT_PUBLIC_TALLY_FORM_ID,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
})
