"use client";
import Link from "next/link";
import { Briefcase, UserCheck, KanbanSquare } from "lucide-react";

export default function ATSIndex() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Applicant Tracking System (ATS)</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        <Link href="/dashboard/ats/jobs" style={{
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
            <Briefcase size={32} />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Job Orders</h2>
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', margin: 0 }}>
            Manage active roles, exclusivity timers, and intake criteria.
          </p>
        </Link>

        <Link href="/dashboard/ats/candidates" style={{
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
            <UserCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Candidates</h2>
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', margin: 0 }}>
            Talent pool, vetting stages, and white-glove summaries.
          </p>
        </Link>

        <Link href="/dashboard/ats/pipeline" style={{
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
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Candidate Pipeline</h2>
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', margin: 0 }}>
            Track applicants from sourced to placed for active jobs.
          </p>
        </Link>

      </div>
    </div>
  );
}
