const SOCIALS = [
  {
    label: "Fundcn on X",
    href: "https://x.com/withden_",
    logo: "https://cdn.paceui.com/brand-logos/x.svg",
  },
  {
    label: "Fundcn on Discord",
    href: "https://paceui.com/discord",
    logo: "https://cdn.paceui.com/brand-logos/discord.svg",
  },
  {
    label: "Fundcn on GitHub",
    href: "https://github.com/paceui/fundcn",
    logo: "https://cdn.paceui.com/brand-logos/github.svg",
  },
]

export function BuilderFooter() {
  return (
    <footer className="w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-8">
        <p className="text-sm">
          <span className="font-medium text-foreground">Fundcn</span>{" "}
          <span className="text-muted-foreground">by</span>{" "}
          <a
            href="https://paceui.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            PaceUI
          </a>
        </p>
        <div className="flex items-center gap-1">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src={social.logo}
                alt=""
                aria-hidden
                className="size-4 dark:brightness-0 dark:invert"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
