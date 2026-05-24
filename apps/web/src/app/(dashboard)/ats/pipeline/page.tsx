import { prisma } from "@corversetalent/db";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const STAGES = [
  { id: "sourced", label: "Sourced" },
  { id: "screen_1", label: "Screen 1 (Quota Check)" },
  { id: "screen_2", label: "Screen 2 (Methodology Vet)" },
  { id: "submitted", label: "Submitted to Client" },
  { id: "client_interview", label: "Client Interview" },
  { id: "offer", label: "Offer Stage" },
  { id: "placed", label: "Placed" },
];

export default async function ATSPipelinePage({
  searchParams,
}: {
  searchParams: { jobId?: string };
}) {
  const { jobId } = await searchParams;

  const jobOrders = await prisma.jobOrder.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' }
  });

  const activeJobId = jobId || (jobOrders.length > 0 ? jobOrders[0].id : null);

  const applications = activeJobId ? await prisma.application.findMany({
    where: { jobOrderId: activeJobId },
    include: { candidate: true },
    orderBy: { updatedAt: 'desc' }
  }) : [];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Candidate Pipeline</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            className="input" 
            style={{ width: '300px' }}
            defaultValue={activeJobId || ""}
          >
            <option value="" disabled>Select Job Order</option>
            {jobOrders.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
          <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Plus size={16} /> Add Candidate
          </button>
        </div>
      </div>

      {!activeJobId ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--muted-foreground)', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          No active job orders to display.
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flex: 1, 
          overflowX: 'auto',
          paddingBottom: '1rem' 
        }}>
          {STAGES.map(stage => {
            const stageApps = applications.filter(a => a.stage === stage.id);
            
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
                    {stageApps.length}
                  </span>
                </div>
                
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
                  {stageApps.map(app => (
                    <div key={app.id} style={{ 
                      backgroundColor: 'var(--card)', 
                      padding: '1rem', 
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                        {app.candidate.firstName} {app.candidate.lastName}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                        {app.candidate.currentTitle}
                      </div>
                      {app.candidate.overallScore && (
                        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'inline-block', padding: '0.1rem 0.4rem', backgroundColor: 'var(--secondary)', borderRadius: '0.25rem' }}>
                          Score: {Number(app.candidate.overallScore)}/10
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {stageApps.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.875rem', padding: '2rem 0' }}>
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
