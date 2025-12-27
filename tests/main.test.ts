import 'dotenv/config';
import { Pakasir } from "../src";
import { DEFAULT_BASE_URL, DEFAULT_BASE_API_PATH } from "../src/consts";

describe("Pakasir Client", () => {
  const projectSlug = process.env.PAKASIR_PROJECT_SLUG;
  const apiKey = process.env.PAKASIR_API_KEY;
  let client: Pakasir;

  beforeAll(() => {
    if (!projectSlug || !apiKey) {
      throw new Error("PAKASIR_PROJECT_SLUG and PAKASIR_API_KEY must be set in environment variables for tests.");
    }

    client = new Pakasir({
      project: projectSlug,
      api_key: apiKey,
    });
  });

  test("Should initialize Pakasir client correctly", () => {
    expect(client.projectSlug).toBe(projectSlug);
    expect(client.apiKey).toBe(apiKey);
    expect(client.baseURL).toBe(`${DEFAULT_BASE_URL}/${DEFAULT_BASE_API_PATH}`);
  });

  test("Should allow updating baseURL", () => {
    const newBaseUrl = "https://custom.pakasir.com";
    client.baseURL = newBaseUrl;
    expect(client.baseURL).toBe(newBaseUrl);
  });

  test("Should allow updating projectSlug and apiKey", () => {
    const newProjectSlug = "new-project";
    const newApiKey = "new-api-key";

    client.projectSlug = newProjectSlug;
    client.apiKey = newApiKey;

    expect(client.projectSlug).toBe(newProjectSlug);
    expect(client.apiKey).toBe(newApiKey);
  });
});