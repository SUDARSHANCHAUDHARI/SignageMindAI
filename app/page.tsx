import Link from 'next/link'

const PLATFORMS = [
  { name: 'Signage device', icon: '🖥', color: 'bg-blue-900 border-blue-700' },
  { name: 'Windows', icon: '🪟', color: 'bg-cyan-900 border-cyan-700' },
  { name: 'FireOS', icon: '🔥', color: 'bg-orange-900 border-orange-700' },
  { name: 'Tizen', icon: '📺', color: 'bg-indigo-900 border-indigo-700' },
  { name: 'webOS', icon: '📡', color: 'bg-red-900 border-red-700' },
  { name: 'Iframe', icon: '🔗', color: 'bg-violet-900 border-violet-700' },
]

const SAMPLE_QUESTIONS = [
  'Why is my iframe blocked by X-Frame-Options?',
  'Signage device shows black screen after update',
  'How do I sideload an app on Fire TV?',
  'Samsung Tizen display shows white screen',
  'How to set portrait mode on LG webOS display?',
  'Windows signage player memory leak fix',
]

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-16">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            SignageMind AI
          </div>
          <p className="text-gray-400 text-lg">
            Expert support chatbot for digital signage systems
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10">
          {PLATFORMS.map(p => (
            <div key={p.name} className={`rounded-lg border p-3 text-center text-sm font-medium ${p.color}`}>
              <span className="text-lg mr-1">{p.icon}</span> {p.name}
            </div>
          ))}
        </div>

        <Link
          href="/chat"
          className="block w-full text-center py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold text-lg mb-10"
        >
          Start a conversation
        </Link>

        <div className="mb-4 text-sm text-gray-500 font-medium uppercase tracking-wide">
          Try asking about
        </div>
        <div className="grid grid-cols-1 gap-2">
          {SAMPLE_QUESTIONS.map(q => (
            <Link
              key={q}
              href={`/chat?q=${encodeURIComponent(q)}`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 hover:border-blue-700 hover:bg-gray-800 transition text-sm text-gray-300"
            >
              <span className="text-blue-400">→</span>
              {q}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
