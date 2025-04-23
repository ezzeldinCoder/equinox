"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Loader2,
  GitCommit,
  GitPullRequest,
  GitMerge,
  GitBranch,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface GithubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url?: string;
  };
  created_at: string;
  payload: {
    commits?: Array<{ sha: string; message: string }>;
    ref?: string;
    head?: string;
    action?: string;
    number?: number;
    pull_request?: {
      html_url: string;
      title: string;
      merged: boolean;
    };
  };
}

interface ActivityItem {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  createdAt: string;
  payload?: {
    commits?: Array<{ sha: string; message: string }>;
    pull_request?: {
      html_url: string;
      title: string;
      merged: boolean;
    };
    number?: number;
  };
  commits?: Array<{ sha: string; message: string }>;
  branch?: string;
  action?: string;
  number?: number;
  title?: string;
  head?: string;
}

interface GithubActivityProps {
  username?: string;
  limit?: number;
}

export function GithubActivity({
  username = "octocat",
  limit = 5,
}: GithubActivityProps) {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchGitHubActivity = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        } else {
          setIsRefreshing(true);
        }
        setError(null);

        console.log(`Fetching GitHub activity for ${username}...`);

        // Add timestamp to prevent caching
        const timestamp = Date.now();
        // Use our API route instead of calling GitHub directly
        // This avoids CORS issues since the request happens server-side
        const response = await fetch(
          `/api/github?username=${encodeURIComponent(
            username
          )}&limit=${limit}&_=${timestamp}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Error: ${response.status} ${response.statusText}`
          );
        }

        const data = (await response.json()) as GithubEvent[];

        // Check if we got any data
        if (!Array.isArray(data)) {
          throw new Error("Invalid response from GitHub API");
        }

        // Filter for relevant events (PushEvent, PullRequestEvent)
        // Events are already sorted by creation date (newest first) from the API
        const filteredData = data
          .filter((item) =>
            ["PushEvent", "PullRequestEvent"].includes(item.type)
          )
          .map((item) => ({
            id: item.id,
            type: item.type,
            repo: {
              name: item.repo.name,
              url: `https://github.com/${item.repo.name}`,
            },
            createdAt: item.created_at,
            payload: item.payload,
            branch:
              item.type === "PushEvent"
                ? item.payload.ref?.replace("refs/heads/", "")
                : undefined,
            action:
              item.type === "PullRequestEvent"
                ? item.payload.action
                : undefined,
            number:
              item.type === "PullRequestEvent"
                ? item.payload.number
                : undefined,
            head: item.type === "PushEvent" ? item.payload.head : undefined,
          }))
          .slice(0, limit);

        setActivity(filteredData);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Error fetching GitHub activity:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Could not load GitHub activity";
        setError(errorMessage);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [username, limit]
  );

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchGitHubActivity();

    const refreshInterval = setInterval(() => {
      fetchGitHubActivity(true); // Silent refresh
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, [fetchGitHubActivity]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchGitHubActivity(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchGitHubActivity()}
            className="flex items-center gap-2 w-full"
          >
            <RefreshCw className="size-3.5" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (activity.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground mb-2">
            No recent GitHub activity found for{" "}
            <span className="font-medium">{username}</span>.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Make sure you have public activity on GitHub and check your token
            configuration.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchGitHubActivity()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Display activity
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {activity.map((item) => (
        <ActivityCard key={item.id} activity={item} />
      ))}
      <div className="text-center mt-4">
        <Button asChild variant="outline" size="sm">
          <Link
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View More on GitHub
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
  let icon = <GitCommit className="h-4 w-4 text-primary" />;
  let title = "Activity";
  let description = "";
  let linkHref = activity.repo.url;

  // Format time ago
  const timeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  // Determine the icon, title, and description based on activity type
  switch (activity.type) {
    case "PushEvent":
      icon = <GitCommit className="h-4 w-4 text-green-500" />;
      title = `Pushed to ${activity.repo.name.split("/")[1]}`;
      description = `${activity.payload?.commits?.length || 0} commit${
        activity.payload?.commits?.length !== 1 ? "s" : ""
      } to ${activity.branch}`;
      linkHref = `${activity.repo.url}/commits/${activity.head}`;
      break;

    case "PullRequestEvent":
      linkHref = activity.payload?.pull_request?.html_url || activity.repo.url;

      if (activity.action === "opened") {
        icon = <GitPullRequest className="h-4 w-4 text-purple-500" />;
        title = `Opened PR #${activity.payload?.number} in ${
          activity.repo.name.split("/")[1]
        }`;
      } else if (
        activity.action === "closed" &&
        activity.payload?.pull_request?.merged
      ) {
        icon = <GitMerge className="h-4 w-4 text-indigo-500" />;
        title = `Merged PR #${activity.payload?.number} in ${
          activity.repo.name.split("/")[1]
        }`;
      } else if (activity.action === "closed") {
        icon = <GitPullRequest className="h-4 w-4 text-red-500" />;
        title = `Closed PR #${activity.payload?.number} in ${
          activity.repo.name.split("/")[1]
        }`;
      } else {
        icon = <GitPullRequest className="h-4 w-4 text-yellow-500" />;
        title = `Updated PR #${activity.payload?.number} in ${
          activity.repo.name.split("/")[1]
        }`;
      }

      description = activity.payload?.pull_request?.title || "Pull request";
      break;
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium truncate">
                <Link
                  href={linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {title}
                </Link>
              </h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                {timeAgo(activity.createdAt)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {description}
            </p>
            <div className="mt-2">
              <Link
                href={activity.repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-primary hover:underline"
              >
                <GitBranch className="h-3 w-3 mr-1" />
                {activity.repo.name}
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
