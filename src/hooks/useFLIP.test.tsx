import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFLIP } from "./useFLIP";

function FlipHarness({ beat, disabled }: { beat: number; disabled?: boolean }) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled,
    duration: 320,
  });

  return (
    <div ref={ref}>
      <div data-testid="stable-a">A</div>
      <div data-testid="stable-b">B</div>
      {beat > 0 && <div data-testid="new-c">C</div>}
    </div>
  );
}

describe("useFLIP", () => {
  it("does not snapshot or animate beat layout changes when disabled", () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(
        () =>
          ({
            left: 0,
            top: 0,
            right: 10,
            bottom: 10,
            width: 10,
            height: 10,
            x: 0,
            y: 0,
            toJSON: () => {},
          }) as DOMRect,
      );

    const { rerender, getByTestId } = render(
      <FlipHarness beat={0} disabled={true} />,
    );
    rerender(<FlipHarness beat={1} disabled={true} />);

    expect(rectSpy).not.toHaveBeenCalled();
    expect(getByTestId("stable-a")).toHaveStyle({ transform: "" });
    expect(getByTestId("stable-b")).toHaveStyle({ transform: "" });

    rectSpy.mockRestore();
  });
});
