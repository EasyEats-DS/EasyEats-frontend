import { describe, it, expect } from "vitest";
import { isNotFound } from "./httpErrors";

describe("isNotFound", () => {
  it("recognises an axios 404", () => {
    expect(isNotFound({ response: { status: 404 } })).toBe(true);
  });

  it("does not treat a server error as an empty result", () => {
    expect(isNotFound({ response: { status: 500 } })).toBe(false);
    expect(isNotFound({ response: { status: 400 } })).toBe(false);
    expect(isNotFound({ response: { status: 401 } })).toBe(false);
  });

  it("does not treat a network failure as an empty result", () => {
    // No `response` at all: the request never reached the server, so the user
    // genuinely needs the error, not an empty list.
    expect(isNotFound({ message: "Network Error" })).toBe(false);
    expect(isNotFound(null)).toBe(false);
    expect(isNotFound(undefined)).toBe(false);
  });
});
