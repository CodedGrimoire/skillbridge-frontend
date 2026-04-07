"use client";

import { Search } from "lucide-react";
import classNames from "classnames";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

type Option = { label: string; value: string };

type FiltersBarProps = {
  searchPlaceholder?: string;
  search: string;
  onSearchChange: (value: string) => void;
  filters?: { label: string; value: string; options: Option[]; onChange: (v: string) => void }[];
  sort?: { value: string; options: Option[]; onChange: (v: string) => void };
  onClear?: () => void;
};

export default function FiltersBar({ searchPlaceholder, search, onSearchChange, filters = [], sort, onClear }: FiltersBarProps) {
  return (
    <div className="sb-card p-4 flex flex-col md:flex-row md:items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="h-4 w-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder || "Search"}
          className="pl-9"
          aria-label="Search"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Select
            key={f.label}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            aria-label={f.label}
            className="min-w-[160px]"
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        ))}

        {sort && (
          <Select
            value={sort.value}
            onChange={(e) => sort.onChange(e.target.value)}
            aria-label="Sort"
            className="min-w-[160px]"
          >
            {sort.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        )}

        {onClear && (
          <Button variant="secondary" onClick={onClear} className={classNames("px-3", filters.length === 0 && "hidden md:inline-flex")}>Clear</Button>
        )}
      </div>
    </div>
  );
}

