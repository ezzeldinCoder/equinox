import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "octocat";
  const limit = searchParams.get("limit") || "5";

  // Get GitHub token from environment variable
  const githubToken = process.env.GITHUB_TOKEN;

  try {
    // Make the request from the server side
    const headers: HeadersInit = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    };

    // Add token if available
    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    // Add timestamp to prevent caching
    const timestamp = Date.now();
    const response = await fetch(
      `https://api.github.com/users/${username}/events?per_page=${limit}&sort=created&direction=desc&_=${timestamp}`,
      { headers }
    );

    // For debugging rate limits
    console.log("GitHub API Rate Limits:", {
      limit: response.headers.get("x-ratelimit-limit"),
      remaining: response.headers.get("x-ratelimit-remaining"),
      reset: response.headers.get("x-ratelimit-reset"),
    });

    if (!response.ok) {
      if (
        response.status === 403 &&
        response.headers.get("x-ratelimit-remaining") === "0"
      ) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded" },
          { status: 403 }
        );
      }

      if (response.status === 404) {
        return NextResponse.json(
          { error: `GitHub user '${username}' not found` },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: `GitHub API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Set cache control headers in response to prevent browser caching
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error proxying GitHub request:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
