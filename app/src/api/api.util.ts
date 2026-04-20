async function fetchData(url: string, type?: "json"): Promise<unknown>;
async function fetchData(url: string, type: "text"): Promise<string>;

async function fetchData(url: string, type: "json" | "text" = "json"): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
  }
  if (type === "json") {
    return await response.json();
  } else {
    return await response.text();
  }
}

export default fetchData;