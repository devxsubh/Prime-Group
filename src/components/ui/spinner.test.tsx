import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "@/components/ui/spinner";

describe("Spinner", () => {
  it("has role status and default aria-label", () => {
    render(<Spinner />);
    const el = screen.getByRole("status", { name: "Loading" });
    expect(el).toBeInTheDocument();
  });

  it("shows label when provided and size is md", () => {
    render(<Spinner label="Loading..." />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading..." })).toBeInTheDocument();
  });

  it("renders with size sm without label text", () => {
    render(<Spinner size="sm" label="Loading..." />);
    expect(screen.getByRole("status", { name: "Loading..." })).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
