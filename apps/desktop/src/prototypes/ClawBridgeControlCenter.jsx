import React, { useEffect, useMemo, useRef, useState } from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const icons = {
  Activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  AlertCircle: "M12 8v4m0 4h.01 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  Check: "M20 6 9 17l-5-5",
  ChevronDown: "m6 9 6 6 6-6",
  CircleDot: "M12 12h.01 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  Code2: "m18 16 4-4-4-4 M6 8l-4 4 4 4 M14.5 4l-5 16",
  Copy: "M8 8h10v10H8z M6 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",
  Download: "M12 3v12m0 0 4-4m-4 4-4-4 M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  ExternalLink: "M15 3h6v6 M10 14 21 3 M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  Eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  EyeOff: "M3 3l18 18 M10.6 10.6A3 3 0 0 0 13.4 13.4 M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-3.2 4.4 M6.1 6.1C3.5 8 2 12 2 12s3.5 8 10 8c1.2 0 2.3-.2 3.3-.6",
  FileCode2: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M10 13l-2 2 2 2 M14 17l2-2-2-2",
  Filter: "M3 5h18l-7 8v5l-4 2v-7z",
  Github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.3-.4 6.7-1.6 6.7-7.3A5.7 5.7 0 0 0 20 4.3 5.3 5.3 0 0 0 19.9 1S18.6.6 16 2.5a13.4 13.4 0 0 0-8 0C5.4.6 4.1 1 4.1 1A5.3 5.3 0 0 0 4 4.3a5.7 5.7 0 0 0-1.7 3.9c0 5.7 3.4 6.9 6.7 7.3a3.4 3.4 0 0 0-1 2.6V22",
  Key: "M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8Zm0 0L15 8m0 0 3 3 3-3-3-3",
  Loader: "M21 12a9 9 0 0 1-9 9",
  Menu: "M4 6h16 M4 12h16 M4 18h16",
  MoreHorizontal: "M12 12h.01 M19 12h.01 M5 12h.01",
  Play: "M8 5v14l11-7z",
  PlugZap: "M13 2 3 14h7l-1 8 10-12h-7z",
  RefreshCw: "M21 12a9 9 0 0 0-15.6-6.1L3 8m0 0V3m0 5h5 M3 12a9 9 0 0 0 15.6 6.1L21 16m0 0v5m0-5h-5",
  Save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z M17 21v-8H7v8 M7 3v5h8",
  Search: "M21 21l-4.3-4.3 M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
  Server: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4H4z M4 14h16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z M8 8h.01 M8 16h.01",
  Settings: "M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.5-.2-.1a1.7 1.7 0 0 0-1.9.1 8 8 0 0 1-1.7 1l-.3.1a1.7 1.7 0 0 0-1.2 1.6V23h-4v-.2a1.7 1.7 0 0 0-1.2-1.6l-.3-.1a8 8 0 0 1-1.7-1 1.7 1.7 0 0 0-1.9-.1l-.2.1-2-3.5.1-.1A1.7 1.7 0 0 0 4.6 15a8.3 8.3 0 0 1 0-2 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.5.2.1a1.7 1.7 0 0 0 1.9-.1 8 8 0 0 1 1.7-1l.3-.1a1.7 1.7 0 0 0 1.2-1.6V4h4v.2a1.7 1.7 0 0 0 1.2 1.6l.3.1a8 8 0 0 1 1.7 1 1.7 1.7 0 0 0 1.9.1l.2-.1 2 3.5-.1.1a1.7 1.7 0 0 0-.3 1.9 8.3 8.3 0 0 1 0 2Z",
  ShieldCheck: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z M9 12l2 2 4-4",
  TerminalSquare: "M4 4h16v16H4z M8 9l3 3-3 3 M13 15h3",
  Trash2: "M3 6h18 M8 6V4h8v2 M6 6l1 15h10l1-15 M10 11v6 M14 11v6",
  Wifi: "M5 13a10 10 0 0 1 14 0 M8.5 16.5a5 5 0 0 1 7 0 M12 20h.01 M2 9a15 15 0 0 1 20 0",
};

function Icon({ name, size = 16, className = "", spin = false }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(spin && "animate-spin", className)}
    >
      <path d={icons[name] || icons.CircleDot} />
    </svg>
  );
}

const initialProviders = [
  {
    id: "openai",
    name: "OpenAI",
    type: "Cloud LLM",
    endpoint: "https://api.openai.com/v1",
    model: "gpt-4.1-mini",
    apiKey: "sk-demo-visible-key",
    latency: "184 ms",
    lastChecked: "2 min ago",
    enabled: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    type: "Cloud LLM",
    endpoint: "https://api.anthropic.com",
    model: "claude-3-5-sonnet-latest",
    apiKey: "",
    latency: "—",
    lastChecked: "Not tested",
    enabled: false,
  },
  {
    id: "ollama",
    name: "Ollama",
    type: "Local LLM",
    endpoint: "http://localhost:11434",
    model: "llama3.2",
    apiKey: "",
    latency: "52 ms",
    lastChecked: "Now",
    enabled: true,
  },
  {
    id: "custom",
    name: "Custom Provider",
    type: "OpenAI-compatible",
    endpoint: "http://localhost:3001/v1",
    model: "custom-model",
    apiKey: "sk-custom-demo-key",
    latency: "418 ms",
    lastChecked: "8 min ago",
    enabled: true,
  },
];

const checks = [
  { id: 1, label: "OpenClaw CLI detected", detail: "/opt/homebrew/bin/openclaw", state: "pass" },
  { id: 2, label: "Gateway reachable", detail: "http://127.0.0.1:7331", state: "pass" },
  { id: 3, label: "OpenAI key configured", detail: "OPENAI_API_KEY exists in generated env", state: "pass" },
  { id: 4, label: "Anthropic key configured", detail: "ANTHROPIC_API_KEY is missing", state: "fail" },
  { id: 5, label: "Ollama model available", detail: "llama3.2 found locally", state: "pass" },
  { id: 6, label: "Desktop app bridge", detail: "Launch agent registered", state: "warn" },
];

const initialLogs = [
  { time: "21:36:41", level: "info", message: "Gateway health check completed successfully" },
  { time: "21:36:38", level: "info", message: "Loaded provider config from generated environment" },
  { time: "21:36:33", level: "warn", message: "Anthropic provider disabled because API key is missing" },
  { time: "21:36:20", level: "info", message: "Ollama provider responded with available model list" },
  { time: "21:35:58", level: "error", message: "Custom provider returned 401 during validation" },
];

const modelOptions = ["gpt-4.1-mini", "claude-3-5-sonnet-latest", "llama3.2", "custom-model"];

function getStatus(provider) {
  if (!provider.enabled) return "idle";
  if (["openai", "anthropic", "custom"].includes(provider.id) && !provider.apiKey.trim()) return "missing-key";
  if (provider.id === "custom") return "warning";
  return "ready";
}

function statusText(status) {
  return {
    ready: "Ready",
    pass: "Pass",
    warning: "Check",
    warn: "Review",
    "missing-key": "Needs key",
    fail: "Fix",
    idle: "Disabled",
    running: "Running",
    done: "Done",
  }[status] || "Idle";
}

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function maskSecret(value) {
  if (!value) return "";
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 3)}••••••••••••${value.slice(-4)}`;
}

function buildEnv(providers, showSecrets) {
  const byId = Object.fromEntries(providers.map((provider) => [provider.id, provider]));
  const openaiKey = showSecrets ? byId.openai?.apiKey || "" : maskSecret(byId.openai?.apiKey || "");
  const anthropicKey = showSecrets ? byId.anthropic?.apiKey || "" : maskSecret(byId.anthropic?.apiKey || "");
  const customKey = showSecrets ? byId.custom?.apiKey || "" : maskSecret(byId.custom?.apiKey || "");

  return `# Generated by ClawBridge
OPENCLAW_GATEWAY_URL=http://127.0.0.1:7331
DEFAULT_PROVIDER=openai

OPENAI_BASE_URL=${byId.openai?.endpoint || ""}
OPENAI_MODEL=${byId.openai?.model || ""}
OPENAI_API_KEY=${openaiKey}

ANTHROPIC_BASE_URL=${byId.anthropic?.endpoint || ""}
ANTHROPIC_MODEL=${byId.anthropic?.model || ""}
ANTHROPIC_API_KEY=${anthropicKey}

OLLAMA_BASE_URL=${byId.ollama?.endpoint || ""}
OLLAMA_MODEL=${byId.ollama?.model || ""}

CUSTOM_BASE_URL=${byId.custom?.endpoint || ""}
CUSTOM_MODEL=${byId.custom?.model || ""}
CUSTOM_API_KEY=${customKey}`;
}

function runSelfTests() {
  const enabledMissingKey = { id: "openai", enabled: true, apiKey: "" };
  const disabledMissingKey = { id: "openai", enabled: false, apiKey: "" };
  const readyProvider = { id: "ollama", enabled: true, apiKey: "" };
  const envHidden = buildEnv(initialProviders, false);
  const envVisible = buildEnv(initialProviders, true);

  console.assert(getStatus(enabledMissingKey) === "missing-key", "enabled cloud provider without key should need a key");
  console.assert(getStatus(disabledMissingKey) === "idle", "disabled provider should be idle");
  console.assert(getStatus(readyProvider) === "ready", "ollama should be ready without an API key");
  console.assert(maskSecret("sk-demo-visible-key") === "sk-••••••••••••-key", "secret should be masked with prefix and suffix");
  console.assert(envHidden.includes("OPENAI_API_KEY=sk-••••••••••••-key"), "hidden env should mask OpenAI key");
  console.assert(envVisible.includes("OPENAI_API_KEY=sk-demo-visible-key"), "visible env should reveal OpenAI key");
}

if (typeof console !== "undefined") runSelfTests();

function StatusPill({ state, children }) {
  const styles = {
    ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
    pass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    warn: "border-amber-200 bg-amber-50 text-amber-700",
    "missing-key": "border-rose-200 bg-rose-50 text-rose-700",
    fail: "border-rose-200 bg-rose-50 text-rose-700",
    idle: "border-slate-200 bg-slate-50 text-slate-600",
    running: "border-sky-200 bg-sky-50 text-sky-700",
    done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <span className={cn("inline-flex h-6 items-center gap-1 rounded border px-2 text-xs font-medium", styles[state] || styles.idle)}>
      {children}
    </span>
  );
}

function IconButton({ icon, label, active, className, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-slate-600 transition hover:border-slate-200 hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
        active && "border-slate-300 bg-white text-slate-950 shadow-sm",
        className
      )}
      {...props}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

function ProviderRow({ provider, selected, onSelect }) {
  const status = getStatus(provider);

  return (
    <button
      type="button"
      onClick={() => onSelect(provider.id)}
      className={cn(
        "grid w-full grid-cols-[minmax(160px,1.35fr)_minmax(120px,1fr)_minmax(110px,.8fr)_88px_36px] items-center gap-3 border-b border-slate-200 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-slate-50",
        selected && "bg-sky-50/70"
      )}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", provider.enabled ? "bg-emerald-500" : "bg-slate-300")} />
          <span className="truncate font-medium text-slate-950">{provider.name}</span>
        </div>
        <div className="mt-0.5 truncate text-xs text-slate-500">{provider.endpoint}</div>
      </div>
      <div className="min-w-0">
        <div className="truncate text-slate-700">{provider.model}</div>
        <div className="mt-0.5 truncate text-xs text-slate-500">{provider.type}</div>
      </div>
      <StatusPill state={status}>{statusText(status)}</StatusPill>
      <div className="text-xs text-slate-500">{provider.latency}</div>
      <Icon name="MoreHorizontal" size={16} className="text-slate-400" />
    </button>
  );
}

function Metric({ label, value, icon, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    sky: "bg-sky-100 text-sky-700",
  };

  return (
    <div className="min-w-[150px] flex-1 border-r border-slate-200 px-4 py-3 last:border-r-0 max-md:border-b max-md:border-r-0">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-normal text-slate-500">
        <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded", toneMap[tone] || toneMap.slate)}>
          <Icon name={icon} size={14} />
        </span>
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function Toggle({ enabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("relative h-5 w-9 rounded-full transition", enabled ? "bg-slate-900" : "bg-slate-300")}
      aria-pressed={enabled}
    >
      <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition", enabled ? "left-[18px]" : "left-0.5")} />
    </button>
  );
}

export default function ClawBridgeApp() {
  const [activeTab, setActiveTab] = useState("providers");
  const [providers, setProviders] = useState(initialProviders);
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [search, setSearch] = useState("");
  const [showSecrets, setShowSecrets] = useState(false);
  const [doctorState, setDoctorState] = useState("idle");
  const [configSaved, setConfigSaved] = useState(false);
  const [gatewayOnline, setGatewayOnline] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [logs, setLogs] = useState(initialLogs);
  const doctorTimerRef = useRef(null);
  const copiedTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (doctorTimerRef.current) window.clearTimeout(doctorTimerRef.current);
      if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const navItems = useMemo(
    () => [
      { id: "providers", label: "Providers", icon: "PlugZap" },
      { id: "env", label: "Config", icon: "FileCode2" },
      { id: "doctor", label: "Doctor", icon: "TerminalSquare" },
      { id: "activity", label: "Activity", icon: "Activity" },
    ],
    []
  );

  const filteredProviders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((provider) =>
      [provider.name, provider.type, provider.endpoint, provider.model].join(" ").toLowerCase().includes(q)
    );
  }, [providers, search]);

  const currentProvider = providers.find((provider) => provider.id === selectedProvider) || providers[0];
  const currentStatus = getStatus(currentProvider);
  const passingChecks = checks.filter((check) => check.state === "pass").length;
  const activeProviderCount = providers.filter((provider) => provider.enabled).length;
  const envPreview = useMemo(() => buildEnv(providers, showSecrets), [providers, showSecrets]);

  const updateProvider = (id, patch) => {
    setProviders((current) =>
      current.map((provider) => {
        if (provider.id !== id) return provider;
        return { ...provider, ...patch };
      })
    );
  };

  const runDoctor = () => {
    if (doctorTimerRef.current) window.clearTimeout(doctorTimerRef.current);
    setDoctorState("running");
    setLogs((current) => [{ time: nowTime(), level: "info", message: "Doctor checks started" }, ...current]);
    doctorTimerRef.current = window.setTimeout(() => {
      setDoctorState("done");
      setLogs((current) => [{ time: nowTime(), level: "info", message: "Doctor checks completed" }, ...current]);
    }, 1200);
  };

  const testProvider = () => {
    const nextStatus = getStatus(currentProvider);
    updateProvider(currentProvider.id, {
      latency: currentProvider.enabled && nextStatus !== "missing-key" ? "96 ms" : "—",
      lastChecked: "Now",
    });
    setLogs((current) => [
      {
        time: nowTime(),
        level: nextStatus === "missing-key" ? "error" : "info",
        message:
          nextStatus === "missing-key"
            ? `${currentProvider.name} validation failed because API key is missing`
            : `${currentProvider.name} validation completed successfully`,
      },
      ...current,
    ]);
  };

  const saveProvider = () => {
    setLogs((current) => [
      { time: nowTime(), level: "info", message: `${currentProvider.name} provider configuration saved` },
      ...current,
    ]);
  };

  const copyEnv = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(envPreview);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = envPreview;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setConfigSaved(true);
      if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = window.setTimeout(() => setConfigSaved(false), 1500);
    } catch {
      setConfigSaved(false);
      setLogs((current) => [{ time: nowTime(), level: "error", message: "Unable to copy generated environment to clipboard" }, ...current]);
    }
  };

  const downloadEnv = () => {
    const blob = new Blob([envPreview], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = ".env";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block">
          <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white">
              <Icon name="Code2" size={17} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-950">ClawBridge</div>
              <div className="text-xs text-slate-500">OpenClaw AI wrapper</div>
            </div>
          </div>

          <nav className="space-y-1 p-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                  activeTab === item.id && "bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
                )}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 hidden w-60 border-t border-slate-200 bg-white p-3 lg:block">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-medium text-slate-600">Gateway</div>
                <StatusPill state={gatewayOnline ? "ready" : "fail"}>{gatewayOnline ? "Online" : "Offline"}</StatusPill>
              </div>
              <div className="mt-2 truncate font-mono text-xs text-slate-500">127.0.0.1:7331</div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-3 backdrop-blur md:px-5">
            <div className="flex min-w-0 items-center gap-2">
              <IconButton
                icon="Menu"
                label="Toggle navigation"
                className="lg:hidden"
                active={mobileNavOpen}
                onClick={() => setMobileNavOpen((open) => !open)}
              />
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold text-slate-950 md:text-lg">Provider Control Center</h1>
                <p className="hidden truncate text-xs text-slate-500 sm:block">Configure, validate, and export your OpenClaw bridge environment.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGatewayOnline((online) => !online)}
                className="hidden h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 md:inline-flex"
              >
                <Icon name="Wifi" size={15} />
                {gatewayOnline ? "Connected" : "Disconnected"}
              </button>
              <IconButton icon="Github" label="Open GitHub" />
              <IconButton icon="Settings" label="Settings" />
            </div>
          </header>

          {mobileNavOpen && (
            <div className="border-b border-slate-200 bg-white p-2 lg:hidden">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={cn(
                      "flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-medium",
                      activeTab === item.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    <Icon name={item.icon} size={15} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-b border-slate-200 bg-white">
            <div className="flex flex-wrap divide-x divide-slate-200 max-md:divide-x-0">
              <Metric label="Active providers" value={activeProviderCount} icon="PlugZap" tone="sky" />
              <Metric label="Doctor checks" value={`${passingChecks}/${checks.length}`} icon="ShieldCheck" tone="green" />
              <Metric label="Gateway" value={gatewayOnline ? "Online" : "Offline"} icon="Server" tone={gatewayOnline ? "green" : "amber"} />
              <Metric label="Default model" value="GPT-4.1 mini" icon="CircleDot" tone="slate" />
            </div>
          </div>

          <div className="p-3 md:p-5">
            {activeTab === "providers" && (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                <section className="min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-slate-950">Providers</h2>
                      <p className="text-xs text-slate-500">Enable providers and verify model connectivity.</p>
                    </div>
                    <div className="flex min-w-[240px] flex-1 items-center justify-end gap-2 md:flex-none">
                      <div className="relative min-w-0 flex-1 md:w-64 md:flex-none">
                        <Icon name="Search" size={15} className="absolute left-2.5 top-2.5 text-slate-400" />
                        <input
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder="Search providers"
                          className="h-9 w-full rounded-md border border-slate-200 bg-white pl-8 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                        />
                      </div>
                      <IconButton icon="Filter" label="Filter" />
                      <button type="button" className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-800">
                        <Icon name="PlugZap" size={15} />
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="hidden grid-cols-[minmax(160px,1.35fr)_minmax(120px,1fr)_minmax(110px,.8fr)_88px_36px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium uppercase text-slate-500 md:grid">
                    <div>Provider</div>
                    <div>Model</div>
                    <div>Status</div>
                    <div>Latency</div>
                    <div />
                  </div>

                  <div className="overflow-x-auto">
                    <div className="min-w-[720px]">
                      {filteredProviders.length ? (
                        filteredProviders.map((provider) => (
                          <ProviderRow
                            key={provider.id}
                            provider={provider}
                            selected={selectedProvider === provider.id}
                            onSelect={setSelectedProvider}
                          />
                        ))
                      ) : (
                        <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                          <Icon name="Search" size={24} className="text-slate-400" />
                          <h3 className="mt-3 text-sm font-semibold text-slate-950">No providers found</h3>
                          <p className="mt-1 max-w-sm text-sm text-slate-500">Try a different provider name, endpoint, or model keyword.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <aside className="rounded-md border border-slate-200 bg-white">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-sm font-semibold text-slate-950">{currentProvider.name}</h2>
                        <StatusPill state={currentStatus}>{statusText(currentStatus)}</StatusPill>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Last checked {currentProvider.lastChecked}</p>
                    </div>
                    <Toggle enabled={currentProvider.enabled} onClick={() => updateProvider(currentProvider.id, { enabled: !currentProvider.enabled })} />
                  </div>

                  <div className="space-y-4 p-4">
                    <label className="block">
                      <span className="text-xs font-medium text-slate-600">Base URL</span>
                      <input
                        value={currentProvider.endpoint}
                        onChange={(event) => updateProvider(currentProvider.id, { endpoint: event.target.value })}
                        className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-slate-600">Model</span>
                      <div className="relative mt-1">
                        <select
                          value={currentProvider.model}
                          onChange={(event) => updateProvider(currentProvider.id, { model: event.target.value })}
                          className="h-9 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm outline-none focus:border-slate-400"
                        >
                          {modelOptions.includes(currentProvider.model) ? null : <option value={currentProvider.model}>{currentProvider.model}</option>}
                          {modelOptions.map((model) => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                        <Icon name="ChevronDown" size={15} className="pointer-events-none absolute right-3 top-3 text-slate-400" />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-slate-600">API key</span>
                      <div className="relative mt-1">
                        <Icon name="Key" size={15} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type={showSecrets ? "text" : "password"}
                          value={currentProvider.apiKey}
                          onChange={(event) => updateProvider(currentProvider.id, { apiKey: event.target.value })}
                          placeholder={currentProvider.id === "ollama" ? "Optional" : "Paste key"}
                          className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-10 text-sm outline-none focus:border-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSecrets((visible) => !visible)}
                          className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center text-slate-400 hover:text-slate-700"
                          aria-label={showSecrets ? "Hide key" : "Show key"}
                        >
                          <Icon name={showSecrets ? "EyeOff" : "Eye"} size={15} />
                        </button>
                      </div>
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={testProvider}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Icon name="RefreshCw" size={15} />
                        Test
                      </button>
                      <button
                        type="button"
                        onClick={saveProvider}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-800"
                      >
                        <Icon name="Save" size={15} />
                        Save
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            )}

            {activeTab === "env" && (
              <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-950">Generated environment</h2>
                    <p className="text-xs text-slate-500">Review and export config for local development.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSecrets((visible) => !visible)}
                      className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Icon name={showSecrets ? "EyeOff" : "Eye"} size={15} />
                      {showSecrets ? "Hide" : "Reveal"}
                    </button>
                    <button
                      type="button"
                      onClick={copyEnv}
                      className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      <Icon name={configSaved ? "Check" : "Copy"} size={15} />
                      {configSaved ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <pre className="max-h-[520px] overflow-auto bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                  <code>{envPreview}</code>
                </pre>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="ShieldCheck" size={16} className="text-emerald-600" />
                    Secrets are masked by default before export.
                  </div>
                  <button
                    type="button"
                    onClick={downloadEnv}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Icon name="Download" size={15} />
                    Download .env
                  </button>
                </div>
              </section>
            )}

            {activeTab === "doctor" && (
              <section className="rounded-md border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-950">Doctor checks</h2>
                    <p className="text-xs text-slate-500">Validate CLI, gateway, models, keys, and launch agent readiness.</p>
                  </div>
                  <button
                    type="button"
                    onClick={runDoctor}
                    disabled={doctorState === "running"}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Icon name={doctorState === "running" ? "Loader" : "Play"} size={15} spin={doctorState === "running"} />
                    {doctorState === "running" ? "Running" : "Run doctor"}
                  </button>
                </div>
                <div className="divide-y divide-slate-200">
                  {checks.map((check) => (
                    <div key={check.id} className="flex items-start justify-between gap-4 px-4 py-3">
                      <div className="flex min-w-0 gap-3">
                        <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full", check.state === "pass" ? "bg-emerald-100 text-emerald-700" : check.state === "warn" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")}>
                          <Icon name={check.state === "pass" ? "Check" : "AlertCircle"} size={15} />
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-slate-950">{check.label}</div>
                          <div className="mt-0.5 truncate text-xs text-slate-500">{check.detail}</div>
                        </div>
                      </div>
                      <StatusPill state={check.state}>{statusText(check.state)}</StatusPill>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "activity" && (
              <section className="rounded-md border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-950">Activity</h2>
                    <p className="text-xs text-slate-500">Recent bridge events and provider validation logs.</p>
                  </div>
                  <IconButton icon="Trash2" label="Clear logs" onClick={() => setLogs([])} />
                </div>
                <div className="divide-y divide-slate-200">
                  {logs.length ? (
                    logs.map((log, idx) => (
                      <div key={`${log.time}-${idx}`} className="grid grid-cols-[78px_72px_minmax(0,1fr)_32px] items-center gap-3 px-4 py-3 text-sm">
                        <span className="font-mono text-xs text-slate-500">{log.time}</span>
                        <span className={cn("rounded px-2 py-0.5 text-center text-xs font-medium", log.level === "info" ? "bg-sky-50 text-sky-700" : log.level === "warn" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700")}>
                          {log.level}
                        </span>
                        <span className="min-w-0 truncate text-slate-700">{log.message}</span>
                        <Icon name="ExternalLink" size={14} className="text-slate-400" />
                      </div>
                    ))
                  ) : (
                    <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                      <Icon name="Activity" size={24} className="text-slate-400" />
                      <h3 className="mt-3 text-sm font-semibold text-slate-950">No activity yet</h3>
                      <p className="mt-1 max-w-sm text-sm text-slate-500">Run doctor checks or test a provider to generate fresh logs.</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
