/**
 * Makes an HTTP request using the Fetch API.
 * 
 * @template T - The expected response data type
 * @template B - The request body type
 * 
 * @param url - The URL to send the request to
 * @param method - HTTP method to use
 * @param [body] - Optional request body (will be JSON stringified)
 * 
 * @returns Promise resolving to the parsed JSON response
 * 
 * @throws {Error} If the request fails or returns a non-OK status
 * 
 * @example
 * ```ts
 * const data = await makeRequest<UserData>('/api/user', 'GET');
 * ```
 */
export function makeRequest<T = any, B = unknown>( // eslint-disable-line @typescript-eslint/no-explicit-any,
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: B
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options).then(async (response) => {
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${
          response.statusText
        }, URL: ${url}, Method: ${method}, Body: ${
          errorBody || "N/A"
        }`
      );
    }

    return response.json() as T;
  });
}