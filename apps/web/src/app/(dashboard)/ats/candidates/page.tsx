import { prisma } from "@corversetalent/db";
import Link from "next/link";
import { Plus, UserCheck, Search, CheckCircle2, Circle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Candidates</h1>
        <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={16} /> Add Candidate
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
            placeholder="Search talent pool..." 
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {candidates.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            <UserCheck size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>No candidates found</h3>
            <p>Your talent pool is empty. Add top-tier GTM talent here.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Current Role</th>
                <th style={{ padding: '1rem' }}>Methodology</th>
                <th style={{ padding: '1rem' }}>Internal Vet (1 / 2)</th>
                <th style={{ padding: '1rem' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate: any) => (
                <tr key={candidate.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/dashboard/ats/candidates/${candidate.id}`} style={{ fontWeight: 500, color: 'var(--primary)' }}>
                      {candidate.firstName} {candidate.lastName}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: 'var(--foreground)' }}>{candidate.currentTitle || '-'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{candidate.currentCompany || ''}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {candidate.gtmMethodology.length > 0 ? candidate.gtmMethodology.map((m: string) => (
                        <span key={m} style={{ backgroundColor: 'var(--secondary)', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>
                          {m}
                        </span>
                      )) : <span style={{ color: 'var(--muted-foreground)' }}>-</span>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--primary)' }}>
                      {candidate.vettingStage1 ? <CheckCircle2 size={18} /> : <Circle size={18} style={{ color: 'var(--muted-foreground)' }} />}
                      {candidate.vettingStage2 ? <CheckCircle2 size={18} /> : <Circle size={18} style={{ color: 'var(--muted-foreground)' }} />}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {candidate.overallScore ? (
                      <span style={{ fontWeight: 600, color: Number(candidate.overallScore) >= 8 ? '#22c55e' : 'var(--foreground)' }}>
                        {Number(candidate.overallScore)}/10
                      </span>
                    ) : (
                      <span style={{ color: 'var(--muted-foreground)' }}>-</span>
                    )}
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
