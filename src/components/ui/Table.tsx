import classNames from "classnames";

type Props = {
  headers: string[];
  children: React.ReactNode;
  className?: string;
};

export default function Table({ headers, children, className }: Props) {
  return (
    <div className={classNames("sb-table overflow-x-auto", className)}>
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

