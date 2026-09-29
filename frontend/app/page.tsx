"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  AlertCircle,
  Database,
  GraduationCap,
  Bell,
  Menu,
  X,
  Activity,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { investigateIncident } from "@/lib/api";

export default function DashboardShell() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/" },
    { name: "Investigate", icon: Search, href: "/investigate" },
    { name: "Incidents", icon: AlertCircle, href: "#" },
    { name: "Memory", icon: Database, href: "#" },
    { name: "Learning", icon: GraduationCap, href: "#" },
  ];

  const handleInvestigate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await investigateIncident({
        service: "checkout-service",
        symptoms: ["HTTP 503", "database connection acquisition delays"],
      });
      sessionStorage.setItem("latest_investigation", JSON.stringify(data));
      router.push("/investigate");
    } catch (err: unknown) {
      console.error("Investigation error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Unable to investigate the incident. Please verify that the backend is running.";
      setError(
        message.includes("Hindsight investigation error")
          ? "Unable to investigate the incident. Please verify that the backend is running."
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fafaf9] text-stone-900 antialiased font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-stone-900 leading-none">
                RECALL-OPS
              </div>
              <div className="mt-1 text-[11px] font-medium text-stone-500 leading-none">
                Production Operations
              </div>
            </div>
          </Link>
          <button
            type="button"
            className="rounded-md p-1 text-stone-400 hover:text-stone-600 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setActiveNav(item.name);
                  setMobileMenuOpen(false);
                  if (item.href === "/investigate") {
                    router.push("/investigate");
                  }
                }}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50/80 text-blue-700 border border-blue-100/70"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive
                      ? "text-blue-600"
                      : "text-stone-400 group-hover:text-stone-600"
                  }`}
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        <div className="border-t border-stone-200 p-4">
          <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3">
            <div className="text-xs font-semibold text-stone-700">
              Organizational Memory
            </div>
            <div className="mt-1 text-[11px] text-stone-500">
              Persistent Hindsight Engine
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-800 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-stone-900">
                Production Operations
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* System Status Indicator */}
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>All Systems Operational</span>
            </div>

            {/* Subtle Last Updated Label */}
            <div className="hidden items-center gap-1 text-xs text-stone-500 sm:flex">
              <Clock className="h-3.5 w-3.5 text-stone-400" />
              <span>Last updated: Just now</span>
            </div>

            {/* Notification Icon */}
            <button
              type="button"
              className="relative rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>
          </div>
        </header>

        {/* Dashboard Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Welcome / Incident Intelligence Card */}
            <section className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  Investigation Engine
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                Incident Intelligence
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-stone-600">
                Investigate production incidents using organizational memory and learned operational knowledge.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleInvestigate}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Investigating...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Investigate Incident</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50/80 p-4 text-sm text-red-800">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-red-900">
                          Investigation Request Failed
                        </div>
                        <div className="mt-0.5 text-xs text-red-700 leading-relaxed">
                          {error}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleInvestigate}
                      className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-200 transition-colors shrink-0"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
