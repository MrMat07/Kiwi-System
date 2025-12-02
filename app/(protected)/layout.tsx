import { ReactNode } from 'react';
import { Sidebar } from '../../components/layout/sidebar';
import { Topbar } from '../../components/layout/topbar';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_20%_20%,#fafb8a_0,#f1fbdd_18%,#eaf6f2_45%,#e7f1ff_100%)]">
      <Sidebar />
      <div className="flex-1 flex flex-col backdrop-blur">
        <Topbar />
        <main className="container-page">{children}</main>
      </div>
    </div>
  );
}
