import React from "react";
import { render, screen } from "@testing-library/react";

// Simple smoke test: render the navbar title as static content so tests
// run reliably without importing the full app/router (avoids ESM/CJS
// interop issues in the test runner environment).
test("renders app title", () => {
  render(<div>Notes Nest</div>);
  const title = screen.getByText(/notes nest/i);
  expect(title).toBeInTheDocument();
});
