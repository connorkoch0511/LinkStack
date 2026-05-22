import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function LoginCatchAllPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-6 px-4">
      <Link href="/" className="text-2xl font-bold tracking-tight">
        Link<span className="text-violet-400">Stack</span>
      </Link>
      <SignIn
        forceRedirectUrl="/dashboard"
        appearance={{
          variables: { colorPrimary: '#7c3aed' },
          elements: {
            card: 'bg-slate-900 border border-slate-800 shadow-xl',
            headerTitle: 'text-slate-100',
            headerSubtitle: 'text-slate-400',
            formFieldLabel: 'text-slate-300',
            formFieldInput: 'bg-slate-800 border-slate-700 text-slate-100',
            footerActionLink: 'text-violet-400 hover:text-violet-300',
            formButtonPrimary: 'bg-violet-600 hover:bg-violet-500',
          },
        }}
      />
    </div>
  )
}
