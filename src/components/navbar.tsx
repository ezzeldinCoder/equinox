import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "./command-palette";
import { NonMobileWrapper } from "./helper/non-mobile-wrapper";
import { UpdatesModal } from "./updates-modal";

export function Navbar() {
  return (
    <nav className="w-full relative flex items-center justify-between max-w-7xl mx-auto px-4 py-5">
      <Link href="/" className="text-3xl font-bold">
        Equinox
      </Link>

      <div className="flex items-center gap-2">
        <Link href="/blog">
          <Button variant="secondary">Blog</Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* <ThemeSwitcher /> */}
        <UpdatesModal />
        <NonMobileWrapper className="flex items-center gap-2">
          <CommandPalette />
        </NonMobileWrapper>
      </div>
    </nav>
  );
}
