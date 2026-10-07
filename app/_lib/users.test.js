import { describe, expect, it } from "vitest";
import { safeNextPath, toGuestUser } from "./users";

describe("safeNextPath", () => {
  it("keeps a page of this site", () => {
    expect(safeNextPath("/cabins/32#reserve")).toBe("/cabins/32#reserve");
  });

  it("refuses anything that leaves the site", () => {
    for (const next of [
      "https://evil.example",
      "//evil.example",
      String.raw`/\evil.example`,
      "javascript:alert(1)",
      "",
      undefined,
      null,
    ])
      expect(safeNextPath(next)).toBe("/account");
  });
});

describe("toGuestUser", () => {
  it("uses the name and photo Google gives", () => {
    const user = toGuestUser({
      id: "u1",
      email: "lena@example.com",
      user_metadata: {
        full_name: "Lena Vogel",
        avatar_url: "https://lh3.googleusercontent.com/a/photo",
      },
    });

    expect(user).toEqual({
      id: "u1",
      email: "lena@example.com",
      name: "Lena Vogel",
      image: "https://lh3.googleusercontent.com/a/photo",
    });
  });

  it("falls back to the email when no name was given", () => {
    const user = toGuestUser({ id: "u2", email: "omar.haddad@example.com" });

    expect(user.name).toBe("omar.haddad");
    expect(user.image).toBeNull();
  });
});
