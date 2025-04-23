"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Loader2,
  GitCommit,
  GitPullRequest,
  GitMerge,
  GitBranch,
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

  useEffect(() => {
    async function fetchActivity() {
      try {
        setLoading(true);
        setError(null);

        // In a real implementation, this would call your API endpoint
        // For example: /api/github/activity?username=${username}&limit=${limit}
        // For now we'll use the GitHub API directly
        const response = await fetch(
          `https://api.github.com/users/${username}/events?per_page=${limit}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub activity");
        }

        const data = (await response.json()) as GithubEvent[];

        // Filter for relevant events (PushEvent, PullRequestEvent)
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
      } catch (err) {
        console.error("Error fetching GitHub activity:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Could not load GitHub activity";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [username, limit]);

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
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (activity.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">
            No recent GitHub activity found for {username}.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Display activity
  return (
    <div className="space-y-4">
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
