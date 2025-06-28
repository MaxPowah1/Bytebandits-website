import { useState } from 'react'
import Terminal from '@/components/Terminal'

export default function Contact() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate submission
    setSubmitted(true)
  }

  return (
    <Terminal title="CONTACT">
      {!submitted ? (
        <>
          Enter your email to get in touch:
          <form onSubmit={handleSubmit} className="mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-black border border-green-400 text-green-400 p-1 w-full"
            />
            <button
              type="submit"
              className="mt-2 bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 rounded inline-block"
            >
              Submit
            </button>
          </form>
        </>
      ) : (
        'Thanks! We’ll be in touch soon.'
      )}
    </Terminal>
  )
}
