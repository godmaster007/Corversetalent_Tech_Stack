import { prisma } from "@corversetalent/db";
import Link from "next/link";
import { Plus, Briefcase, Search, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function JobOrdersPage() {
  const jobs = await prisma.jobOrder.findMany({
    include: { company: true },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Job Orders</h1>
        <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={16} /> New Job Order
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
            placeholder="Search active roles..." 
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {jobs.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>No job orders found</h3>
            <p>Start a new search by adding a job order.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Company</th>
                <th style={{ padding: '1rem' }}>Tier / Fee</th>
                <th style={{ padding: '1rem' }}>Exclusivity</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => {
                // Calculate exclusivity days remaining
                let exclusivityDaysLeft = 0;
                if (job.exclusivityStart) {
                  const end = new Date(job.exclusivityStart);
                  end.setDate(end.getDate() + job.exclusivityDays);
                  const diff = end.getTime() - new Date().getTime();
                  exclusivityDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
                }

                return (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <Link href={`/dashboard/ats/jobs/${job.id}`} style={{ fontWeight: 500, color: 'var(--primary)' }}>
                        {job.title}
                      </Link>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {job.company ? (
                        <Link href={`/dashboard/crm/clients/${job.company.id}`} style={{ color: 'inherit' }}>
                          {job.company.name}
                        </Link>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>
                      <div>{job.roleTier || '-'}</div>
                      {job.feePercentage && <div style={{ fontSize: '0.75rem' }}>{Number(job.feePercentage)}%</div>}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {job.exclusivityStart && exclusivityDaysLeft > 0 ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#eab308', fontSize: '0.875rem' }}>
                          <Clock size={14} /> {exclusivityDaysLeft} days left
                        </span>
                      ) : (
                        <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Expired / None</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem',
                        backgroundColor: job.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'var(--secondary)',
                        color: job.status === 'active' ? '#22c55e' : 'var(--muted-foreground)'
                      }}>
                        {job.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
