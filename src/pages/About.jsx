import Terminal from '@/components/Terminal'

export default function About() {
  return (
    <Terminal title="ABOUT">
      {`About Bytebandits GmbH:

Founded: 2020
Location: Berlin, Germany

We are a team of pixel artists, engineers, and designers committed to crafting immersive, retro-inspired web experiences.

Our Values:
- Creativity in pixel form
- Excellence in code
- Client-first collaboration

[Press ENTER to view our services]`}
      <div className="mt-4 flex justify-center">
        <a
          href="/services"
          className="bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 rounded inline-block"
        >
          View Services
        </a>
      </div>
    </Terminal>
  )
}
