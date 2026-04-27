function NpcLogo({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="NPC Logo">
			<path d="M24 3 L42 11 L42 27 C42 36 33 43 24 46 C15 43 6 36 6 27 L6 11 Z" stroke="currentColor" strokeWidth="2" fill="none" />
			<path d="M24 8 L38 15 L38 27 C38 34 31 40 24 42 C17 40 10 34 10 27 L10 15 Z" fill="currentColor" opacity="0.12" />
			<rect x="17" y="23" width="14" height="10" rx="2" fill="currentColor" />
			<path d="M19 23 L19 19 C19 16.2 21 14 24 14 C27 14 29 16.2 29 19 L29 23" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
			<circle cx="24" cy="27.5" r="1.5" className="fill-background" />
		</svg>
	)
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative flex min-h-screen flex-col bg-background">
			<div className="bg-primary py-2.5 text-center text-xs font-medium text-primary-foreground/80 tracking-wider uppercase">
				Republic of the Philippines — National Privacy Commission
			</div>
			<div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-4 py-10">
				<header className="flex flex-col items-center gap-4 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
						<NpcLogo className="h-10 w-10 text-primary-foreground" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">NPC QECMS</h1>
						<p className="mt-0.5 text-sm text-muted-foreground">Quanby Enterprise Complaints Management System</p>
						<p className="text-xs text-muted-foreground">National Privacy Commission · Philippines</p>
					</div>
				</header>
				<main className="flex flex-1 flex-col">{children}</main>
			</div>
		</div>
	)
}
