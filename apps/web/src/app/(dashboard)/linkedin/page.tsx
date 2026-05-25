import { Share2 } from "lucide-react";

export default function LinkedinAutoPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>LinkedIn Auto</h1>
      </div>

      <div style={{
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'var(--muted-foreground)'
      }}>
        <Share2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>Coming Soon</h3>
        <p>The LinkedIn Auto dashboard is currently under construction. Check back soon for automated outreach controls.</p>
      </div>
    </div>
  );
}
