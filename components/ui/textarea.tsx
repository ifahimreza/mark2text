import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[280px] w-full resize-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
