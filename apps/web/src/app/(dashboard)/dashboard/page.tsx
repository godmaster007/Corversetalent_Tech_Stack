export default function DashboardOverview() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Overview</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <MetricCard title="Active Job Orders" value="3" trend="+1 this week" />
        <MetricCard title="Pipeline Value" value="$127,000" trend="+$40k this week" />
        <MetricCard title="LinkedIn Connections" value="12" trend="Pending review" />
        <MetricCard title="Interviews Scheduled" value="4" trend="Next 7 days" />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem'
      }}>
        <div style={{ 
          backgroundColor: 'var(--card)', 
          borderRadius: 'var(--radius)', 
          border: '1px solid var(--border)',
          padding: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Placeholder for activity timeline */}
            <p style={{ color: 'var(--muted-foreground)' }}>System initializing...</p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'var(--card)', 
          borderRadius: 'var(--radius)', 
          border: '1px solid var(--border)',
          padding: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Action Items</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Placeholder for action items */}
            <p style={{ color: 'var(--muted-foreground)' }}>No pending actions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <div style={{
      backgroundColor: 'var(--card)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <h3 style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>{title}</h3>
      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</div>
      <div style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>{trend}</div>
    </div>
  );
}
