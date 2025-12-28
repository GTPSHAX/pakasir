import 'dotenv/config';
import { Client } from "../dist/index.cjs";
// import { Pakasir } from "../dist/index.cjs"; // Pakasir as an alias
import { DEFAULT_BASE_URL, DEFAULT_BASE_API_PATH } from "../src/consts";

describe("Pakasir Client", () => {
  const projectSlug = process.env.PAKASIR_PROJECT_SLUG;
  const apiKey = process.env.PAKASIR_API_KEY;
  let client: Client; // Or use Pakasir as an alias

  beforeAll(() => {
    if (!projectSlug || !apiKey) {
      throw new Error("PAKASIR_PROJECT_SLUG and PAKASIR_API_KEY must be set in environment variables for tests.");
    }

    // You can also use Pakasir as an alias for Client
    // client = new Pakasir({
    //  project: projectSlug,
    //  api_key: apiKey,
    // });
    client = new Client({
      project: projectSlug,
      api_key: apiKey,
    });
  });

  test("Should initialize Pakasir client correctly", () => {
    expect(client.projectSlug).toBe(projectSlug);
    expect(client.baseURL).toBe(`${DEFAULT_BASE_URL}/${DEFAULT_BASE_API_PATH}`);
  });

  test("Should allow updating baseURL", () => {
    const newBaseUrl = "https://custom.pakasir.com";
    client.baseURL = newBaseUrl;
    expect(client.baseURL).toBe(newBaseUrl);
  });

  test("Should allow updating projectSlug", () => {
    const newProjectSlug = "new-project";

    client.projectSlug = newProjectSlug;

    expect(client.projectSlug).toBe(newProjectSlug);
  });

  test("Should can't access apiKey directly", () => {
    expect((client as any).apiKey).toBeUndefined();
  });
});