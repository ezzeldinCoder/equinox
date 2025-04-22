"use client";

import * as React from "react";
import { Book, Home, Moon, Sun } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "d" && e.altKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setTheme("dark");
      }
      if (e.key === "l" && e.altKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setTheme("light");
      }
      if (e.key === "1" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/");
      }
      if (e.key === "2" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/blog");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setTheme, router]);

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() => {
                router.push("/");
                setOpen(false);
              }}
            >
              <Home />
              <span>Home</span>
              <CommandShortcut>⌘ + 1</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/blog");
                setOpen(false);
              }}
            >
              <Book />
              <span>Blog</span>
              <CommandShortcut>⌘ + 2</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => {
                setTheme("dark");
                setOpen(false);
              }}
            >
              <Moon />
              <span>Dark Mode</span>
              <CommandShortcut>⌘ + alt + D</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme("light");
                setOpen(false);
              }}
            >
              <Sun />
              <span>Light Mode</span>
              <CommandShortcut>⌘ + alt + L</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
