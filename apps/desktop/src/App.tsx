const checklist = [
  "Detect OS and shell",
  "Check Node and Git",
  "Prepare the official OpenClaw install command",
  "Collect provider details",
  "Run verification checks",
  "Guide the first launch",
];

export default function App() {
  return (
    <main className="page">
      <section className="hero card">
        <p className="eyebrow">ClawBridge</p>
        <h1>Beginner-friendly OpenClaw wrapper</h1>
        <p className="subtext">
          A GitHub-ready starter for building a guided OpenClaw install and onboarding experience.
        </p>
      </section>

      <section className="grid">
        <article className="card">
          <h2>MVP flow</h2>
          <ul>
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Dummy example</h2>
          <p><strong>User ask:</strong> Install OpenClaw on my Mac with OpenAI.</p>
          <p>
            The wrapper checks the machine, suggests the official install command, verifies the binary,
            asks for provider details, and prepares the first launch.
          </p>
        </article>
      </section>
    </main>
  );
}
