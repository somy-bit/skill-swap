'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

export function useSaveUser() {
  const { user } = useUser()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saveUser = async () => {
      if (!user || saved) return

      setLoading(true)
      try {
        const res = await fetch('/api/save-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName}" "${user.lastName}`,
            imageUrl: user.imageUrl,
          }),
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Failed to save user')

        console.log(data.message)
        setSaved(true)
      } catch (err: any) {
        console.error('Save user error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    saveUser()
  }, [user, saved])

  return { saved, loading, error }
}
