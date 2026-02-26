import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { AuthInput } from "@/components/auth/AuthInput";
import { Mail } from "lucide-react";

function TestWrapper() {
  const { register } = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });
  return (
    <AuthInput
      type="email"
      name="email"
      placeholder="Email"
      label="Email"
      icon={Mail}
      register={register}
    />
  );
}

describe("AuthInput", () => {
  it("renders input with placeholder and label", () => {
    render(<TestWrapper />);
    const input = screen.getByPlaceholderText("Email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
    const label = screen.getByLabelText("Email");
    expect(label).toBeInTheDocument();
  });

  it("shows error and sets aria-invalid when error is passed", () => {
    function WrapperWithError() {
      const { register } = useForm<{ email: string }>({ defaultValues: { email: "" } });
      return (
        <AuthInput
          type="email"
          name="email"
          placeholder="Email"
          icon={Mail}
          register={register}
          error="Invalid email"
        />
      );
    }
    render(<WrapperWithError />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute("aria-invalid", "true");
  });
});
