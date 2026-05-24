import { prisma } from "@corversetalent/db";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const STAGES = [
  { id: "prospect", label: "Prospect" },
  { id: "outreach_sent", label: "Outreach Sent" },
  { id: "meeting_scheduled", label: "Meeting Scheduled" },
  { id: "msa_sent", label: "MSA Sent" },
  { id: "msa_signed", label: "MSA Signed" },
];

export default async function PipelinePage() {
  const deals = await prisma.deal.findMany({
    include: { company: true, contact: true },
    where: { stage: { notIn: ["closed_won", "closed_lost"] } },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Deal Pipeline</h1>
        <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={16} /> New Deal
        </button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        flex: 1, 
        overflowX: 'auto',
        paddingBottom: '1rem' 
      }}>
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          
          return (
            <div key={stage.id} style={{ 
              minWidth: '300px', 
              width: '300px', 
              backgroundColor: 'var(--secondary)', 
              borderRadius: 'var(--radius)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '100%'
            }}>
              <div style={{ padding: '1rem', borderBottom: '2px solid var(--border)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                {stage.label}
                <span style={{ backgroundColor: 'var(--border)', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>
                  {stageDeals.length}
                </span>
              </div>
              
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
                {stageDeals.map(deal => (
                  <div key={deal.id} style={{ 
                    backgroundColor: 'var(--card)', 
                    padding: '1rem', 
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{deal.title}</div>
                    {deal.company && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                        {deal.company.name}
                      </div>
                    )}
                    {deal.estimatedValue && (
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
                        ${Number(deal.estimatedValue).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
                
                {stageDeals.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.875rem', padding: '2rem 0' }}>
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
