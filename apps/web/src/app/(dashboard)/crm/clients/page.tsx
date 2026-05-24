import { prisma } from "@corversetalent/db";
import Link from "next/link";
import { Plus, Building2, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.company.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Clients</h1>
        <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={16} /> Add Client
        </button>
      </div>

      <div style={{
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
          <input 
            className="input" 
            placeholder="Search clients..." 
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {clients.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            <Building2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>No clients found</h3>
            <p>Get started by adding your first client company.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Industry</th>
                <th style={{ padding: '1rem' }}>Stage</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/dashboard/crm/clients/${client.id}`} style={{ fontWeight: 500, color: 'var(--primary)' }}>
                      {client.name}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>{client.industry || '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>{client.fundingStage || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem',
                      backgroundColor: client.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'var(--secondary)',
                      color: client.status === 'active' ? '#22c55e' : 'var(--muted-foreground)'
                    }}>
                      {client.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
