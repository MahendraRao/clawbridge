import { useEffect, useMemo, useState } from "react";

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

type ModelCatalog = Record<
  string,
  {
    label: string;
    models: string[];
  }
>;

type ProviderConfigResponse = {
  ok: boolean;
  message: string;
  config: string;
};

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className={ok ? "badge-ok" : "badge-bad"}>
      {ok ? "Installed" : "Missing"}
    </span>
  );
}

function CheckCard({
  title,
  check
}: {
  title: string;
  check: ToolCheck;
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        <StatusBadge ok={check.ok} />
      </div>

      <p>
        <strong>Command:</strong> {check.name}
      </p>

      <p>
        <strong>Version:</strong> {check.version || "Not detected"}
      </p>

      {!check.ok && check.details ? (
        <p className="error-text">
          <strong>Details:</strong> {check.details}
        </p>
      ) : null}
    </div>
  );
}

export default function App() {
  const [result, setResult] = useState<SystemCheckResponse | null>(null);
  const [doctorCommands, setDoctorCommands] = useState<string[]>([]);
  const [modelCatalog, setModelCatalog] = useState<ModelCatalog>({});
  const [providerConfig, setProviderConfig] = useState("");
  const [configMessage, setConfigMessage] = useState("");
  const [commandOutput, setCommandOutput] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-5.4");
  const [customModel, setCustomModel] = useState("");
  const [ollamaHost, setOllamaHost] = useState("http://localhost:11434");

  useEffect(() => {
    async function loadModelCatalog() {
      const res = await fetch("/api/model-catalog");
      const data: ModelCatalog = await res.json();
      setModelCatalog(data);

      const defaultOpenAI =
        data.openai?.models?.find((m) => m !== "custom") || "custom";

      setSelectedModel(defaultOpenAI);
    }

    loadModelCatalog();
  }, []);

  const providerModels = useMemo(() => {
    return modelCatalog[provider]?.models || ["custom"];
  }, [modelCatalog, provider]);

  function getDefaultModel(nextProvider: string) {
    const models = modelCatalog[nextProvider]?.models || ["custom"];
    return models.find((m) => m !== "custom") || "custom";
  }

  function handleProviderChange(nextProvider: string) {
    setProvider(nextProvider);
    setSelectedModel(getDefaultModel(nextProvider));
    setCustomModel("");
    setProviderConfig("");
    setConfigMessage("");
    setSaveMessage("");
  }

  async function runSystemCheck() {
    setLoading(true);

    const res = await fetch("/api/system-check");
    const data = await res.json();

    setResult(data);
    setLoading(false);
  }

  async function loadDoctorPreview() {
    const res = await fetch("/api/doctor-preview");
    const data = await res.json();
    setDoctorCommands(data.commands);
  }

  async function generateProviderConfig() {
    const res = await fetch("/api/provider-config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        provider,
        apiKey,
        model: selectedModel,
        customModel,
        ollamaHost
      })
    });

    const data: ProviderConfigResponse = await res.json();
    setProviderConfig(data.config);
    setConfigMessage(data.message);
    setSaveMessage("");
  }

  async function saveConfigToFile() {
    const res = await fetch("/api/save-config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        config: providerConfig
      })
    });

    const data = await res.json();
    setSaveMessage(data.message);
  }

  async function runDoctorCommand(
    command: "version" | "status" | "doctor" | "gateway" | "channels" | "deep-status"
  ) {
    const res = await fetch("/api/run-command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ command })
    });

    const data = await res.json();
    setCommandOutput(data.output);
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
  }

  const showApiKey =
    provider === "openai" || provider === "anthropic";

  const showOllamaHost = provider === "ollama";
  const showCustomModel = selectedModel === "custom";

  return (
    <div className="app-shell">
      <section className="hero panel">
        <div className="eyebrow">CLAWBRIDGE</div>
        <h1>Beginner-friendly OpenClaw wrapper</h1>
        <p className="hero-copy">
          Guided onboarding, provider configuration, and first-run setup.
        </p>

        <div className="hero-actions">
          <button
            className="primary-btn"
            onClick={runSystemCheck}
            disabled={loading}
          >
            {loading ? "Checking..." : "Run system check"}
          </button>

          <button
            className="secondary-btn"
            onClick={loadDoctorPreview}
          >
            Doctor preview
          </button>
        </div>
      </section>

      {result && (
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
              <pre className="code-block">
                {result.recommendedInstallCommand}
              </pre>

              <button
                className="secondary-btn"
                onClick={() =>
                  copyText(result.recommendedInstallCommand)
                }
              >
                Copy install command
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
      )}

      {doctorCommands.length > 0 && (
        <section className="panel">
          <h2>Doctor preview</h2>
          {doctorCommands.map((cmd) => (
            <pre key={cmd} className="code-block">
              {cmd}
            </pre>
          ))}
        </section>
      )}

      <section className="panel">
        <h2>Provider setup (current recommended models)</h2>

        <p className="muted-text">
          Hosted providers use curated current model lists.
          Ollama and local providers support any custom model.
        </p>

        <div className="form-grid">
          <select
            value={provider}
            onChange={(e) => handleProviderChange(e.target.value)}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="ollama">Ollama</option>
            <option value="local">Local / Custom</option>
          </select>

          {showApiKey && (
            <input
              type="password"
              placeholder={
                provider === "openai"
                  ? "Enter OpenAI API key"
                  : "Enter Anthropic API key"
              }
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          )}

          {showOllamaHost && (
            <input
              type="text"
              placeholder="Ollama host"
              value={ollamaHost}
              onChange={(e) => setOllamaHost(e.target.value)}
            />
          )}

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {providerModels.map((model) => (
              <option key={model} value={model}>
                {model === "custom" ? "Custom model" : model}
              </option>
            ))}
          </select>

          {showCustomModel && (
            <input
              type="text"
              placeholder="Enter custom model name"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
            />
          )}

          <button
            className="primary-btn"
            onClick={generateProviderConfig}
          >
            Generate config
          </button>
        </div>

        {configMessage && (
          <p className="muted-text">{configMessage}</p>
        )}

        {providerConfig && (
          <>
            <pre className="code-block">{providerConfig}</pre>

            <div className="hero-actions">
              <button
                className="secondary-btn"
                onClick={() => copyText(providerConfig)}
              >
                Copy provider config
              </button>

              <button
                className="primary-btn"
                onClick={saveConfigToFile}
              >
                Save as .env
              </button>
            </div>

            {saveMessage && (
              <p className="muted-text">{saveMessage}</p>
            )}
          </>
        )}
      </section>

      <section className="panel">
        <h2>Run verification commands</h2>

        <div className="hero-actions">
          <button
            className="secondary-btn"
            onClick={() => runDoctorCommand("version")}
          >
            Version
          </button>

          <button
            className="secondary-btn"
            onClick={() => runDoctorCommand("status")}
          >
            Status
          </button>

          <button
            className="secondary-btn"
            onClick={() => runDoctorCommand("gateway")}
          >
            Gateway
          </button>

          <button
            className="secondary-btn"
            onClick={() => runDoctorCommand("channels")}
          >
            Channels
          </button>

          <button
            className="secondary-btn"
            onClick={() => runDoctorCommand("deep-status")}
          >
            Deep Status
          </button>

          <button
            className="secondary-btn"
            onClick={() => runDoctorCommand("doctor")}
          >
            Doctor
          </button>
        </div>

        {commandOutput && (
          <pre className="code-block">{commandOutput}</pre>
        )}
      </section>
    </div>
  );
}
