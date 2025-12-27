"use client";

import { InputHTMLAttributes } from "react";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>;

interface IntInputProps extends NativeInputProps {
  label?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  labelClassName?: string,

}

export function IntInput({
  label,
  value,
  onChange,
  min,
  max,
  labelClassName,
  ...props
}: IntInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className={`text-sm font-medium  ${labelClassName}`}>
          {label}
        </label>
      )}

      <input
        type="number"
        inputMode="numeric"
        step="0.01"
        min={min}
        max={max}
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : parseInt(v, 10));
        }}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        {...props}
      />
    </div>
  );
}
