import Terminal from '@/components/Terminal'

export default function Services() {
  return (
    <Terminal title="SERVICES">
      {`Our Services:

- Web Development
- Pixel Art & Animation
- Retro UI/UX Design
- Performance Audits

[Press ENTER to contact us]`}
      <div className="mt-4 flex justify-center">
        <a
          href="/contact"
          className="bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 rounded inline-block"
        >
          Contact Us
        </a>
      </div>
    </Terminal>
  )
}
