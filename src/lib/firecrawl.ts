const isPlaceholderKey = (key: string | undefined) => 
  !key || key.includes("your-firecrawl-api-key") || key === "placeholder-key" || key.startsWith("fc-your");

const FIRECRAWL_API_KEY = isPlaceholderKey(process.env.FIRECRAWL_API_KEY) ? "dummy" : process.env.FIRECRAWL_API_KEY!;
const FIRECRAWL_API_URL = "https://api.firecrawl.dev/v1";

export async function scrapeUrl(url: string) {
  if (FIRECRAWL_API_KEY === "dummy") {
    console.log("SIMULATION MODE: Returning mock Scrape data");
    return { data: { markdown: "# Mock Content\nThis is simulated content from " + url } };
  }

  const response = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
    }),
  });

  if (!response.ok) {
    throw new Error(`Firecrawl API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function crawlUrl(url: string, maxPages: number = 5) {
  if (FIRECRAWL_API_KEY === "dummy") {
    console.log("SIMULATION MODE: Returning mock Crawl data");
    return { success: true, id: "mock-crawl-id" };
  }

  const response = await fetch(`${FIRECRAWL_API_URL}/crawl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url,
      limit: maxPages,
      formats: ["markdown"],
    }),
  });

  if (!response.ok) {
    throw new Error(`Firecrawl API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function searchWeb(query: string, limit: number = 5) {
  if (FIRECRAWL_API_KEY === "dummy") {
    console.log("SIMULATION MODE: Returning mock Search results");
    await new Promise(r => setTimeout(r, 1000));
    return {
      success: true,
      data: [
        { title: "Senior Software Engineer", url: "https://example.com/job1", description: "Remote role at a leading tech company.", metadata: { company: "SimuTech", location: "Remote", salary: "$120k - $160k" } },
        { title: "Frontend Developer", url: "https://example.com/job2", description: "Build modern UIs with React and Next.js.", metadata: { company: "WebWorks", location: "New York", salary: "$100k - $140k" } },
        { title: "AI Product Designer", url: "https://example.com/job3", description: "Design the future of AI productivity tools.", metadata: { company: "Visionary AI", location: "San Francisco", salary: "$130k - $180k" } }
      ]
    };
  }

  const response = await fetch(`${FIRECRAWL_API_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      limit,
    }),
  });

  if (!response.ok) {
    throw new Error(`Firecrawl API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
