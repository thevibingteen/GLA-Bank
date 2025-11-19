import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

interface PageHeaderProps {
  title: string;
  description?: string;
  tag?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, tag, actions }: PageHeaderProps) {
  return (
    <header className="border-b border-border/60 bg-background/90 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          {tag && (
            <Badge variant="outline" className="mb-1 text-xs uppercase tracking-wide">
              {tag}
            </Badge>
          )}
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

