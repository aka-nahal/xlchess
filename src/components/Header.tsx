const links = [
  { href: "#play", label: "Play" },
  { href: "#learn", label: "Learn" },
  { href: "#compete", label: "Compete" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-navy-950/70 backdrop-blur-md">
      <nav
        className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-6"
        aria-label="Primary"
      >
        <a href="#" className="focus-brand flex items-center gap-2 rounded-md">
          <span className="text-2xl text-brand-light" aria-hidden>
            {"\u265E"}
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            XL<span className="text-gradient">Chess</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="focus-brand rounded-md transition-colors hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#play"
          className="focus-brand rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/[0.12]"
        >
          Sign in
        </a>
      </nav>
    </header>
  );
}
