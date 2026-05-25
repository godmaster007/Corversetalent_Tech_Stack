import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Analytics</h1>
      </div>

      <div style={{
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'var(--muted-foreground)'
      }}>
        <BarChart3 size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>Coming Soon</h3>
        <p>The Analytics dashboard is currently under construction. Check back soon for detailed insights on your campaigns.</p>
      </div>
    </div>
  );
}
