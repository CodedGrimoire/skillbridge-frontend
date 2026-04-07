import classNames from "classnames";
import { forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

const Input = forwardRef<HTMLInputElement, Props>(function Input({ className, invalid, ...props }, ref) {
  return <input ref={ref} className={classNames("sb-input", invalid && "border-danger focus-visible:ring-danger/60", className)} {...props} />;
});

export default Input;

