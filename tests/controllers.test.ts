import { find } from "../src/controllers/UserController";
import { describe, expect, it } from "vitest"; // <-- **

describe("No falla", () => {
    it("returns 0 with no numbers input", () => {
        expect(find()).toBe(0);
    });

    it("Debe fallar", () => {
        expect(find()).toBe(2);
    });
});
