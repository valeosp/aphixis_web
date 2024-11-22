import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50",
        className
      )}
      {...props}
    />
  )
);
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);
