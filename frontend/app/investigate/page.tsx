"use client";

import { useEffect, useState } from "react";
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
  XCircle,
  HelpCircle,
  ArrowDown,
  ArrowLeft,
  Sparkles,
  Loader2,
  Clock,
  Lightbulb,
  AlertTriangle,
  RotateCcw,
  Layers,
} from "lucide-react";
import {
  investigateIncident,
  InvestigationResponse,
  MemoryEvidence,
} from "@/lib/api";

export default function InvestigatePage() {
  const router = useRouter();
  const [data, setData] = useState<InvestigationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/" },
    { name: "Investigate", icon: Search, href: "/investigate" },
    { name: "Incidents", icon: AlertCircle, href: "#" },
    { name: "Memory", icon: Database, href: "#" },
    { name: "Learning", icon: GraduationCap, href: "#" },
  ];

  const fetchInvestigation = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await investigateIncident({
        service: "checkout-service",
        symptoms: ["HTTP 503", "database connection acquisition delays"],
      });
      sessionStorage.setItem("latest_investigation", JSON.stringify(result));
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to investigate the incident. Please verify that the backend is running.";
      console.error("Investigation error:", err);
      setError(
        message.includes("Hindsight investigation error")
          ? "Unable to investigate the incident. Please verify that the backend is running."
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = sessionStorage.getItem("latest_investigation");
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch {
        fetchInvestigation();
      }
    } else {
      fetchInvestigation();
    }
  }, []);

  const service = data?.service || "checkout-service";
  const symptoms = data?.symptoms || [
    "HTTP 503",
    "database connection acquisition delays",
  ];
  const memoryEvidence: MemoryEvidence[] = data?.memory_evidence || [];
  const memoryCount = data?.memory_count ?? memoryEvidence.length;

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

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.name === "Investigate";
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
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
              </Link>
            );
          })}
        </nav>

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
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Overview
              </Link>
              <span className="text-stone-300">/</span>
              <h1 className="text-base sm:text-lg font-semibold text-stone-900">
                Incident Investigation
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>All Systems Operational</span>
            </div>

            <div className="hidden items-center gap-1 text-xs text-stone-500 sm:flex">
              <Clock className="h-3.5 w-3.5 text-stone-400" />
              <span>Last updated: Just now</span>
            </div>

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

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Investigation Target Header Card */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Incident Investigation
                  </div>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
                    {service}
                  </h2>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={fetchInvestigation}
                  className="inline-flex items-center gap-2 self-start rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-100 transition-colors disabled:opacity-50"
                >
                  <RotateCcw
                    className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>{loading ? "Re-investigating..." : "Re-run Investigation"}</span>
                </button>
              </div>

              <div className="mt-4 border-t border-stone-100 pt-4">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Observed Symptoms:
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {symptoms.map((symptom, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-800"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message if API failed */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 p-5 text-sm text-red-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-red-900">
                        Investigation Request Failed
                      </div>
                      <div className="mt-1 text-xs text-red-700 leading-relaxed">
                        {error}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={fetchInvestigation}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-200 transition-colors shrink-0"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Loading State Skeleton */}
            {loading && !data && (
              <div className="rounded-xl border border-stone-200 bg-white p-12 text-center shadow-sm">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <h3 className="mt-3 text-base font-semibold text-stone-900">
                  Consulting Organizational Memory
                </h3>
                <p className="mt-1 text-xs text-stone-500">
                  Recalling previous postmortems and synthesizing incident reflection...
                </p>
              </div>
            )}

            {data && (
              <>
                {/* SECTION C: MEMORY COUNT STATS BAR */}
                <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-5 py-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-stone-900">
                      Historical memories found: {memoryCount}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-stone-500">
                    Bank: <code className="text-stone-700">recall-ops-test</code>
                  </span>
                </div>

                {/* SECTION A: AI DIAGNOSIS */}
                <section className="rounded-xl border border-stone-200 bg-white p-6 sm:p-7 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-stone-900">
                      AI Diagnosis
                    </h3>
                  </div>

                  <div className="rounded-lg border border-stone-100 bg-[#fbfbfa] p-5 text-sm sm:text-base leading-relaxed text-stone-800 whitespace-pre-wrap font-sans">
                    {data.diagnosis}
                  </div>
                </section>

                {/* SECTION D: WHY THIS RECOMMENDATION? */}
                <section className="rounded-xl border border-stone-200 bg-white p-6 sm:p-7 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-stone-900">
                        Why this Recommendation?
                      </h3>
                      <p className="text-xs text-stone-500">
                        Deterministic reasoning path through organizational memory
                      </p>
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center space-y-4 max-w-xl mx-auto py-2">
                    {/* Step 1: Current Incident */}
                    <div className="w-full rounded-lg border border-stone-200 bg-[#fbfbfa] p-4 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
                            Current Incident
                          </div>
                          <div className="text-xs text-stone-600 mt-0.5">
                            {service} experiencing 503 errors and connection acquisition delays
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector Arrow 1 */}
                    <div className="flex flex-col items-center text-blue-500 py-0.5">
                      <div className="h-3 w-0.5 bg-blue-300" />
                      <ArrowDown className="h-4 w-4 text-blue-600 my-0.5" />
                    </div>

                    {/* Step 2: Historical Memory */}
                    <div className="w-full rounded-lg border border-stone-200 bg-[#fbfbfa] p-4 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                          <Database className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
                            Historical Memory
                          </div>
                          <div className="text-xs text-stone-600 mt-0.5">
                            Recalled {memoryCount} previous incidents identifying database connection pool exhaustion
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector Arrow 2 */}
                    <div className="flex flex-col items-center text-blue-500 py-0.5">
                      <div className="h-3 w-0.5 bg-blue-300" />
                      <ArrowDown className="h-4 w-4 text-blue-600 my-0.5" />
                    </div>

                    {/* Step 3: Previous Outcome */}
                    <div className="w-full rounded-lg border border-stone-200 bg-[#fbfbfa] p-4 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
                            Previous Outcome
                          </div>
                          <div className="text-xs text-stone-600 mt-0.5">
                            Restarting pods failed; increasing pool capacity (10 → 50) successfully restored service
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector Arrow 3 */}
                    <div className="flex flex-col items-center text-blue-500 py-0.5">
                      <div className="h-3 w-0.5 bg-blue-300" />
                      <ArrowDown className="h-4 w-4 text-blue-600 my-0.5" />
                    </div>

                    {/* Step 4: Current Recommendation */}
                    <div className="w-full rounded-lg border border-blue-200 bg-blue-50/50 p-4 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
                            Current Recommendation
                          </div>
                          <div className="text-xs text-blue-800 mt-0.5 font-medium">
                            Inspect connection pool saturation first and expand pool limits before applying restart actions
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION B: MEMORY EVIDENCE */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-stone-900">
                        Memory Evidence
                      </h3>
                      <p className="text-xs text-stone-500">
                        Structured historical cases extracted from organizational memory
                      </p>
                    </div>
                    <span className="text-xs font-medium text-stone-500">
                      {memoryEvidence.length} items
                    </span>
                  </div>

                  <div className="space-y-4">
                    {memoryEvidence.map((mem, index) => {
                      const outcome = mem.outcome || "unknown";
                      const isSuccess = outcome === "successful";
                      const isFailed = outcome === "failed";

                      return (
                        <div
                          key={mem.id || index}
                          className={`rounded-xl border bg-white p-5 sm:p-6 shadow-sm transition-all ${
                            isSuccess
                              ? "border-stone-200 hover:border-emerald-200"
                              : isFailed
                              ? "border-stone-200 hover:border-rose-200"
                              : "border-stone-200"
                          }`}
                        >
                          {/* Card Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-semibold text-stone-800">
                                {mem.service || "unknown-service"}
                              </span>
                              {mem.id && (
                                <span className="font-mono text-[11px] text-stone-400">
                                  #{mem.id.slice(0, 8)}
                                </span>
                              )}
                            </div>

                            {/* Outcome Badge */}
                            <div>
                              {isSuccess && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Successful</span>
                                </span>
                              )}
                              {isFailed && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                                  <XCircle className="h-3 w-3" />
                                  <span>Failed</span>
                                </span>
                              )}
                              {!isSuccess && !isFailed && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
                                  <HelpCircle className="h-3 w-3" />
                                  <span>Unknown</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Snippet */}
                          {mem.snippet && (
                            <div className="mt-3 rounded-lg border border-stone-100 bg-[#fbfbfa] p-3 text-xs leading-relaxed text-stone-700 italic">
                              &ldquo;{mem.snippet}&rdquo;
                            </div>
                          )}

                          {/* Structured Detail Grid */}
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="rounded-lg border border-stone-100 bg-stone-50/50 p-3">
                              <div className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
                                Root Cause
                              </div>
                              <div className="mt-1 text-stone-800 leading-normal">
                                {mem.root_cause || "—"}
                              </div>
                            </div>

                            <div className="rounded-lg border border-stone-100 bg-stone-50/50 p-3">
                              <div className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
                                Resolution
                              </div>
                              <div className="mt-1 text-stone-800 leading-normal">
                                {mem.resolution || "—"}
                              </div>
                            </div>

                            <div className="rounded-lg border border-stone-100 bg-stone-50/50 p-3">
                              <div className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
                                Lesson Learned
                              </div>
                              <div className="mt-1 text-stone-800 leading-normal">
                                {mem.lesson || "—"}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
