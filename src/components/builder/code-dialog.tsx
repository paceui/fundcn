import { CheckIcon, CodeIcon, CopyIcon } from "lucide-react"
import { useState } from "react"

import { installCommand, pageSource } from "@/components/builder/snippet"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import type { PricingLayoutId, SponsorId } from "@/components/builder/catalog"

type CodeDialogProps = {
  sponsorId: SponsorId
  pricingId: PricingLayoutId
}

function CopyBlock({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{label}</p>
        <Button
          variant="outline"
          size="sm"
          className="shadow-none"
          onClick={() => {
            void copy()
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">
        {value}
      </pre>
    </div>
  )
}

const REGISTRY_ORIGIN = "https://fundcn.paceui.com"

export function CodeDialog({ sponsorId, pricingId }: CodeDialogProps) {
  const source = pageSource(sponsorId, pricingId)
  const command = installCommand(REGISTRY_ORIGIN, sponsorId, pricingId)

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon-sm" className="shadow-none">
            <CodeIcon />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Use this page</DialogTitle>
          <DialogDescription>
            Pick a design, run the command, then paste the page into your React
            project. Edit your tier list, pricing, and buy links directly in the
            files - no design skills needed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[70vh] gap-5 overflow-y-auto">
          <CopyBlock label="Install" value={command} />
          <CopyBlock label="Page" value={source} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
