import { find } from "../src/controllers/UserController";
import { beforeEach, describe, expect, it } from "vitest"; // <-- **

describe("No falla", () => {
    beforeEach(async () => {
        // TODO: llenar de datos falsos la db
    });

    it("returns 0 with no numbers input", () => {
        expect(find()).toBe(0);
    });

    it("Debe fallar", () => {
        expect(find()).toBe(2);
    });
});
