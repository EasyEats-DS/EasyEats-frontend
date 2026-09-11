import { describe, it, expect } from "vitest";
import { extractUsers } from "./users";

const USER = { _id: "u1", firstName: "John" };

describe("extractUsers", () => {
  it("unwraps the gateway's nested { data: { data: { users } } } shape", () => {
    expect(extractUsers({ data: { success: true, data: { users: [USER] } } })).toEqual([USER]);
  });

  it("accepts a bare array", () => {
    expect(extractUsers([USER])).toEqual([USER]);
  });

  it("accepts { users: [...] }", () => {
    expect(extractUsers({ users: [USER] })).toEqual([USER]);
  });

  it("accepts { data: [...] }", () => {
    expect(extractUsers({ data: [USER] })).toEqual([USER]);
  });

  it("returns an empty array for an unrecognised shape", () => {
    expect(extractUsers({ nope: true })).toEqual([]);
    expect(extractUsers(null)).toEqual([]);
  });
});
