/**
 * Makes an HTTP request to the specified URL with the given method and body.
 * 
 * @param url The URL to which the request is sent.
 * @param method The HTTP method to use for the request (GET, POST, PUT, DELETE).
 * @param body The body of the request, if applicable.
 * 
 * @returns {Promise<T>} Promise<T = any> The response data.
 * @throws {Error} Error If the request fails or encounters an error.
 */
export function makeRequest<T = any>( // eslint-disable-line @typescript-eslint/no-explicit-any,
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: any // eslint-disable-line @typescript-eslint/no-explicit-any,
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

  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${
          response.statusText
        }, URL: ${url}, Method: ${method}, Body: ${
          response.body ? JSON.stringify(response.body) : "N/A"
        }`
      );
    }

    return response.json() as T;
  });
}