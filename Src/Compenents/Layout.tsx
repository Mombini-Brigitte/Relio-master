import { type ReactNode } from 'react';
import Sidebar, { type PageKey } from '@/components/Sidebar';

interface LayoutProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function Layout({ current, onNavigate, title, subtitle, actions, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar current={current} onNavigate={onNavigate} />
      <div className="lg:pl-72">
        <main className="pt-14 lg:pt-0">
          <div className="px-6 py-6 lg:px-10 lg:py-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
                {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
            <div className="animate-fade-in">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
