import { describe, expect, it } from "vitest";
import { parseStringToArray } from "./utils";

describe("parseStringToArray", () => {
  it("should split a comma-separated string into an array", () => {
    expect(parseStringToArray({ str: "apple, banana, cherry" })).toEqual([
      "apple",
      "banana",
      "cherry",
    ]);
  });

  it("should trim spaces around elements", () => {
    expect(
      parseStringToArray({ str: "  apple  , banana  ,  cherry " }),
    ).toEqual(["apple", "banana", "cherry"]);
  });

  it("should remove empty elements when multiple separators are used", () => {
    expect(parseStringToArray({ str: "apple, , banana,, cherry" })).toEqual([
      "apple",
      "banana",
      "cherry",
    ]);
  });

  it("should return an empty array when given an empty string", () => {
    expect(parseStringToArray({ str: "" })).toEqual([]);
  });

  it("should return an empty array when str is undefined", () => {
    expect(parseStringToArray({})).toEqual([]);
  });

  it("should use a custom separator if provided", () => {
    expect(
      parseStringToArray({ str: "apple|banana|cherry", separator: "|" }),
    ).toEqual(["apple", "banana", "cherry"]);
  });

  it("should handle different separators correctly", () => {
    expect(
      parseStringToArray({ str: "apple - banana - cherry", separator: " - " }),
    ).toEqual(["apple", "banana", "cherry"]);
  });
});
