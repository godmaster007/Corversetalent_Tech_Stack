"use client";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Mail, 
  Share2, 
  BarChart3, 
  Settings 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--card)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          height: 'var(--header-height)', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <Link href="/dashboard" style={{ fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
            Corverse<span style={{ color: 'var(--primary)' }}>talent</span>
          </Link>
        </div>
        
        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <SidebarLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          <SidebarLink href="/crm" icon={<Users size={20} />} label="CRM" />
          <SidebarLink href="/ats" icon={<Briefcase size={20} />} label="ATS" />
          <SidebarLink href="/linkedin" icon={<Share2 size={20} />} label="LinkedIn Auto" />
          <SidebarLink href="/outreach" icon={<Mail size={20} />} label="Outreach" />
          <SidebarLink href="/analytics" icon={<BarChart3 size={20} />} label="Analytics" />
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <SidebarLink href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          height: 'var(--header-height)',
          backgroundColor: 'var(--background)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem'
        }}>
          <div>
            {/* Breadcrumbs or Page Title could go here */}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              CT
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 0.75rem',
      borderRadius: 'var(--radius)',
      color: 'var(--muted-foreground)',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      fontWeight: 500
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'var(--secondary)';
      e.currentTarget.style.color = 'var(--foreground)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = 'var(--muted-foreground)';
    }}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
