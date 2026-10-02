export const packageManagers = [
  {
    name: "npm",
    title: "NPM",
    logo: "https://cdn.paceui.com/brand-logos/npm.svg",
    packageInstall: "npm install ",
    paceuiInstall: "npx shadcn@latest add https://fundcn.paceui.com/r/",
    fundcnInstall: "npx shadcn@latest add https://fundcn.paceui.com/r/",
    shadcn: "npx shadcn@latest ",
    execute: "npx ",
  },
  {
    name: "pnpm",
    title: "pnpm",
    logo: "https://cdn.paceui.com/brand-logos/pnpm.svg",
    packageInstall: "pnpm install ",
    paceuiInstall: "pnpm dlx shadcn@latest add https://fundcn.paceui.com/r/",
    fundcnInstall: "pnpm dlx shadcn@latest add https://fundcn.paceui.com/r/",
    shadcn: "pnpm dlx shadcn@latest ",
    execute: "pnpm dlx ",
  },
  {
    name: "yarn",
    title: "Yarn",
    logo: "https://cdn.paceui.com/brand-logos/yarn.svg",
    packageInstall: "yarn add ",
    paceuiInstall: "yarn dlx shadcn@latest add https://fundcn.paceui.com/r/",
    fundcnInstall: "yarn dlx shadcn@latest add https://fundcn.paceui.com/r/",
    shadcn: "yarn dlx shadcn@latest ",
    execute: "yarn dlx ",
  },
  {
    name: "bun",
    title: "Bun",
    logo: "https://cdn.paceui.com/brand-logos/bun.svg",
    packageInstall: "bun add ",
    paceuiInstall: "bun x --bun shadcn@latest add https://fundcn.paceui.com/r/",
    fundcnInstall: "bun x --bun shadcn@latest add https://fundcn.paceui.com/r/",
    shadcn: "bun x --bun shadcn@latest ",
    execute: "bun x --bun ",
  },
] as const

export const frameworks = [
  {
    name: "tanstack",
    title: "TanStack Start",
    logo: "https://cdn.paceui.com/brand-logos/tanstack.svg",
    darkInvert: true,
    fileSuffix: "",
  },
  {
    name: "next.js",
    title: "Next.js",
    logo: "https://cdn.paceui.com/brand-logos/nextjs.svg",
    darkInvert: true,
    fileSuffix: ".next",
  },
  {
    name: "react",
    title: "React",
    logo: "https://cdn.paceui.com/brand-logos/react.svg",
    fileSuffix: "",
  },
]

export const icons = [
  {
    name: "lucide",
    title: "Lucide",
    suffix: "lucide",
  },
  {
    name: "tabler-icons",
    title: "Tabler",
    suffix: "tabler",
  },
  {
    name: "hugeicons",
    title: "Hugeicons",
    suffix: "hugeicons",
  },
  {
    name: "remix",
    title: "Remix Icon",
    suffix: "remixicon",
  },
  {
    name: "phosphor",
    title: "Phosphor",
    suffix: "phosphor",
  },
]
