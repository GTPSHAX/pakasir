import 'dotenv/config';
import Pakasir from "../src";
import { DEFAULT_BASE_API_URL } from "../src/consts";

describe("Pakasir Client", () => {
  const projectSlug = process.env.PAKASIR_PROJECT_SLUG;
  const apiKey = process.env.PAKASIR_API_KEY;
  let client: Pakasir;

  beforeAll(() => {
    if (!projectSlug || !apiKey) {
      throw new Error("PAKASIR_PROJECT_SLUG and PAKASIR_API_KEY must be set in environment variables for tests.");
    }

    client = new Pakasir(projectSlug, apiKey);
  });

  test("should initialize Pakasir client correctly", () => {
    expect(client.projectSlug).toBe(projectSlug);
    expect((client as any)._apiKey).toBe(apiKey);
    expect(client.baseURL).toBe(DEFAULT_BASE_API_URL);
  });

  test("should allow updating baseURL", () => {
    const newBaseUrl = "https://custom.pakasir.com";
    client.baseURL = newBaseUrl;
    expect(client.baseURL).toBe(newBaseUrl);
  });

  test("should allow updating projectSlug and apiKey", () => {
    const newProjectSlug = "new-project";
    const newApiKey = "new-api-key";

    client.projectSlug = newProjectSlug;
    client.apiKey = newApiKey;

    expect(client.projectSlug).toBe(newProjectSlug);
    expect((client as any)._apiKey).toBe(newApiKey);
  });
});