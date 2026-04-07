import classNames from "classnames";
import { forwardRef, SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

const Select = forwardRef<HTMLSelectElement, Props>(function Select({ className, invalid, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={classNames("sb-input", invalid && "border-danger focus-visible:ring-danger/60", className)}
      {...props}
    >
      {children}
    </select>
  );
});

export default Select;

