import classNames from "classnames";
import { forwardRef, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={classNames("sb-input min-h-[120px]", invalid && "border-danger focus-visible:ring-danger/60", className)}
      {...props}
    />
  );
});

export default Textarea;

