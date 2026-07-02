import { useCallback, useEffect, useRef, useState } from 'react'
import posthog from 'posthog-js'

import { createClient } from '@/lib/supabase/client'

export function useAnonymousAuth() {
    const [isReady, setIsReady] = useState(false)
    const supabaseRef = useRef(createClient())
    const sessionChecked = useRef(false)

    // Check for an existing session on mount
    useEffect(() => {
        if (sessionChecked.current) return
        sessionChecked.current = true

        supabaseRef.current.auth
            .getSession()
            .then(({ data: { session } }) => {
                if (session) setIsReady(true)
            })
            .catch(() => {
                // Supabase unreachable/unconfigured. Anonymous auth is only a
                // best-effort rate-limit backstop; when the operator access gate
                // is in use it's unnecessary, so never block the UI on it.
                setIsReady(true)
            })
    }, [])

    // Idempotent - returns immediately if already authed
    const ensureSession = useCallback(async () => {
        if (isReady) return

        try {
            const {
                data: { session },
            } = await supabaseRef.current.auth.getSession()
            if (session) {
                setIsReady(true)
                return
            }

            const { error } = await supabaseRef.current.auth.signInAnonymously()
            if (error) throw new Error(error.message)

            setIsReady(true)
        } catch (err) {
            // Anonymous auth failed or isn't configured. The AI endpoints are
            // protected by the operator gate (or their own limits), so degrade
            // to a usable UI instead of leaving the AI modal greyed out.
            posthog.captureException(err instanceof Error ? err : new Error('Anonymous auth failed'))
            setIsReady(true)
        }
    }, [isReady])

    return { isAuthReady: isReady, ensureSession }
}
