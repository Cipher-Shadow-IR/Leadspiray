import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Leadspiray — Lead Distribution Platform",
  description:
    "Distribute service enquiries to providers with real-time quota tracking and fair round-robin allocation.",
  icons: {
    icon: "/Leadspiray_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <body className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
            {/* Logo */}
            <Link
              href="/request-service"
              className="flex items-center gap-2.5 shrink-0"
            >
              <img
                src="/Leadspiray_logo.png"
                alt="Leadspiray Logo"
                className="h-6 w-6 object-contain"
              />
              <span className="text-sm font-semibold tracking-tight text-white">
                Leadspiray
              </span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-0.5">
              <NavLink href="/request-service">Request Service</NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/test-tools">Test Tools</NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
          {children}
        </main>

        <footer className="border-t border-zinc-900">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
            <span className="text-xs text-zinc-600">
              Leadspiray · Built by{" "}
              <a
                href="https://github.com/Cipher-Shadow-IR"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Ishaan Ray
              </a>
            </span>
            <span className="text-xs text-zinc-700">
              Next.js · PostgreSQL · Prisma
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
    >
      {children}
    </Link>
  );
}
