import { prisma } from "@corversetalent/db";
import Link from "next/link";
import { Plus, Users, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    include: { company: true },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Contacts</h1>
        <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={16} /> Add Contact
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
            placeholder="Search contacts..." 
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {contacts.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>No contacts found</h3>
            <p>Get started by adding people to your network.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Company</th>
                <th style={{ padding: '1rem' }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/dashboard/crm/contacts/${contact.id}`} style={{ fontWeight: 500, color: 'var(--primary)' }}>
                      {contact.firstName} {contact.lastName}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>{contact.title || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    {contact.company ? (
                      <Link href={`/dashboard/crm/clients/${contact.company.id}`} style={{ color: 'inherit' }}>
                        {contact.company.name}
                      </Link>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>{contact.email || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
