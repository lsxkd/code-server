import { test as base } from "@playwright/test"
import * as path from "path"
import { getMaybeProxiedCodeServer } from "../utils/helpers"
import { describe, test, expect } from "./baseFixture"

if (process.env.USE_PROXY !== "1") {
  // Setup
  const flags = ["--extensions-dir", path.join(__dirname, "./extensions")]

  describe("Extensions with --cert", [...flags, "--cert"], {}, () => {
    // This will only work if the test extension is loaded into code-server.
    test("should have access to VSCODE_PROXY_URI", async ({ codeServerPage }) => {
      const address = await getMaybeProxiedCodeServer(codeServerPage)

      await codeServerPage.waitForTestExtensionLoaded()
      await codeServerPage.executeCommandViaMenus("code-server: Get proxy URI")

      await codeServerPage.page.waitForSelector("text=proxyUri", { timeout: 3000 })
      const text = await codeServerPage.page.locator("text=proxyUri").first().textContent()
      // Remove end slash in address
      const normalizedAddress = address.replace(/\/+$/, "")
      expect(text).toBe(`Info: proxyUri: ${normalizedAddress}/proxy/{{port}}`)
    })
  })
} else {
  base.describe("Extensions with --cert", () => {
    base.skip("skipped because USE_PROXY is set", () => {
      // Playwright will not show this without a function.
    })
  })
}
