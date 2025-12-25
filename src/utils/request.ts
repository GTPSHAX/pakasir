export function makeRequest(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: any,
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
        `Request failed with status ${response.status}: ${response.statusText}, URL: ${url}, Method: ${method}, Body: ${body ? JSON.stringify(body) : "N/A"}`,
      )
    }

    return response.json();
  });
}