import { describe, it, expect } from "bun:test";
import { encodeJsonForUrl, decodeJsonFromUrl } from "../../src/lib/url";

describe("URL JSON encoding", () => {
  it("should encode and decode a simple JSON object", () => {
    const data = { a: 1, b: "hello" };
    const encoded = encodeJsonForUrl(JSON.stringify(data));
    const decoded = decodeJsonFromUrl(encoded);
    expect(JSON.parse(decoded)).toEqual(data);
  });

  it("should handle a more complex JSON object", () => {
    const data = {
      name: "test",
      nested: {
        values: [1, 2, 3],
        isTrue: true,
      },
      specialChars: "!@#$%^&*()_+-=[]{}'\";:|,.<>/?`~",
    };
    const encoded = encodeJsonForUrl(JSON.stringify(data));
    const decoded = decodeJsonFromUrl(encoded);
    expect(JSON.parse(decoded)).toEqual(data);
  });

  it("should handle an empty object", () => {
    const data = {};
    const encoded = encodeJsonForUrl(JSON.stringify(data));
    const decoded = decodeJsonFromUrl(encoded);
    expect(JSON.parse(decoded)).toEqual(data);
  });

  it("should produce a URL-safe string", () => {
    const data = { a: "++++////====" };
    const encoded = encodeJsonForUrl(JSON.stringify(data));
    expect(encoded).not.toContain("+");
    expect(encoded).not.toContain("/");
    expect(encoded).not.toContain("=");
  });
});
