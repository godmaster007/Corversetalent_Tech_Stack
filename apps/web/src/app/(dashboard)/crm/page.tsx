import Link from "next/link";
import { Building2, Users, KanbanSquare } from "lucide-react";

export default function CRMIndex() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>CRM Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        <Link href="/dashboard/crm/clients" style={{
          backgroundColor: 'var(--card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          transition: 'transform 0.2s, border-color 0.2s',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <Building2 size={32} />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Clients (Companies)</h2>
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', margin: 0 }}>
            Manage client profiles, funding stages, and firmographics.
          </p>
        </Link>

        <Link href="/dashboard/crm/contacts" style={{
          backgroundColor: 'var(--card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          transition: 'transform 0.2s, border-color 0.2s',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <Users size={32} />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Contacts</h2>
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', margin: 0 }}>
            Manage hiring managers, prospects, and talent network.
          </p>
        </Link>

        <Link href="/dashboard/crm/pipeline" style={{
          backgroundColor: 'var(--card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          transition: 'transform 0.2s, border-color 0.2s',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <KanbanSquare size={32} />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Deal Pipeline</h2>
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', margin: 0 }}>
            Track opportunities from prospect to signed MSA.
          </p>
        </Link>

      </div>
    </div>
  );
}
