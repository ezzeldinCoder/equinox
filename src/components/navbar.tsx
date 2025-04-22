import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
export function Navbar() {
    return (
        <nav className="w-full relative flex items-center justify-between max-w-2xl mx-auto px-4 py-5">
            <Link href="/" className="text-3xl font-bold">
                Equinox
            </Link>

            <div className="flex items-center gap-2">
                <Link href="/blog">
                    <Button variant="secondary">Blog</Button>
                </Link>
            </div>
            
            <ThemeSwitcher />
        </nav>
    )
}
