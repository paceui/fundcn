import { useState } from "react"
import { Check, Clipboard } from "lucide"
import { MorphIcon } from "morphicons/react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const CopyButton = ({
  text,
  className,
}: {
  text: string
  className?: string
}) => {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Tooltip open={open || copied} onOpenChange={setOpen}>
      <TooltipTrigger
        className="not-typeset"
        render={
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={copyToClipboard}
            className={className}
            aria-label="Copy"
          >
            <MorphIcon icon={copied ? Check : Clipboard} />
          </Button>
        }
      />
      <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
    </Tooltip>
  )
}
