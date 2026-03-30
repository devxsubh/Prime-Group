import React, { useId } from "react";
import { LucideIcon } from "lucide-react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import type { AuthFormData } from "../types/auth";

interface AuthInputProps<T extends FieldValues = AuthFormData> {
  type: string;
  name: Path<T>;
  placeholder: string;
  icon: LucideIcon;
  register: UseFormRegister<T>;
  error?: string;
  /** Optional visible or screen-reader label. If provided, a label is rendered (use className "sr-only" for screen-reader only). */
  label?: string;
  /** Optional id for the input; used for label htmlFor and aria-describedby. Defaults to a generated id. */
  id?: string;
}

export function AuthInput<T extends FieldValues = AuthFormData>({
  type,
  name,
  placeholder,
  icon: Icon,
  register,
  error,
  label,
  id: idProp,
}: AuthInputProps<T>) {
  const generatedId = useId();
  const id = idProp ?? `${generatedId}-${String(name)}`;
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden />
        </div>
        <input
          id={id}
          type={type}
          {...register(name)}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="block w-full pl-10 pr-3 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
        />
      </div>
      {error && (
        <p id={errorId} className="text-red-500 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
