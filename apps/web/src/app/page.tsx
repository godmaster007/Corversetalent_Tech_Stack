import Link from "next/link";

export default function Home() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '1rem', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Corversetalent Platform</h1>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: 'var(--muted-foreground)' }}>
          The operating system for boutique GTM recruiting. Custom CRM, ATS, and AI-powered LinkedIn automation.
        </p>
        <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
