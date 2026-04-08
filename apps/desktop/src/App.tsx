import { useState } from "react";

type ToolCheck = {
  name: string;
  ok: boolean;
  version?: string;
  details?: string;
};

type SystemCheckResponse = {
  ok: boolean;
  os: string;
  arch: string;
  shell: string;
  node: ToolCheck;
  git: ToolCheck;
  openclaw: ToolCheck;
  recommendedInstallCommand: string;
  recommendedNextSteps: string[];
};

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.35rem 0.7rem",
        borderRadius: "999px",
        fontSize: "0.85rem",
        fontWeight: 700,
        background: ok ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.14)",
        color: ok ? "#86efac" : "#fca5a5",
        border: ok ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.3)"
      }}
    >
      {ok ? "Installed" : "Missing"}
    </span>
  );
}

function CheckCard({ title, check }: { title: string; check: ToolCheck }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        <StatusBadge ok={check.ok} />
      </div>
      <p><strong>Command:</strong> {check.name}</p>
      <p><strong>Version:</strong> {check.version || "Not detected"}</p>
      {!check.ok && check.details ? (
        <p className="error-text"><strong>Details:</strong> {check.details}</p>
      ) : null}
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SystemCheckResponse | null>(null);

  async function runSystemCheck() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/system-check");
      if (!response.ok) {
        throw new Error(`System check failed with status ${response.status}`);
      }

      const data: SystemCheckResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function copyCommand() {
    if (!result?.recommendedInstallCommand) return;
    await navigator.clipboard.writeText(result.recommendedInstallCommand);
  }

  return (
    <div className="app-shell">
      <section className="hero panel">
        <div className="eyebrow">CLAWBRIDGE</div>
        <h1>Beginner-friendly OpenClaw wrapper</h1>
        <p className="hero-copy">
          A guided local setup experience for detecting prerequisites,
          suggesting the correct OpenClaw install path, and preparing first launch.
        </p>

        <div className="hero-actions">
          <button className="primary-btn" onClick={runSystemCheck} disabled={loading}>
            {loading ? "Running system check..." : "Run system check"}
          </button>
        </div>

        {error ? <p className="error-text">Error: {error}</p> : null}
      </section>

      <section className="grid-two">
        <div className="panel">
          <h2>MVP flow</h2>
          <ul>
            <li>Detect OS and shell</li>
            <li>Check Node and Git</li>
            <li>Check OpenClaw installation</li>
            <li>Prepare the recommended installer command</li>
            <li>Guide the next verification steps</li>
          </ul>
        </div>

        <div className="panel">
          <h2>Dummy example</h2>
          <p><strong>User ask:</strong> Install OpenClaw on my Mac with OpenAI.</p>
          <p>
            ClawBridge checks the machine, suggests the install command, validates
            prerequisites, and then guides the user into first launch and provider setup.
          </p>
        </div>
      </section>

      {result ? (
        <>
          <section className="grid-two">
            <div className="panel">
              <h2>Machine summary</h2>
              <p><strong>OS:</strong> {result.os}</p>
              <p><strong>Architecture:</strong> {result.arch}</p>
              <p><strong>Shell:</strong> {result.shell}</p>
            </div>

            <div className="panel">
              <h2>Recommended install command</h2>
              <pre className="code-block">{result.recommendedInstallCommand}</pre>
              <button className="secondary-btn" onClick={copyCommand}>
                Copy command
              </button>
            </div>
          </section>

          <section className="grid-three">
            <CheckCard title="Node.js" check={result.node} />
            <CheckCard title="Git" check={result.git} />
            <CheckCard title="OpenClaw" check={result.openclaw} />
          </section>

          <section className="panel">
            <h2>Recommended next steps</h2>
            <ol>
              {result.recommendedNextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </>
      ) : null}
    </div>
  );
}
