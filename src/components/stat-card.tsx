import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  detail?: string;
  accent?: 'default' | 'green' | 'yellow' | 'red' | 'blue';
}

const accentColors = {
  default: 'border-border/50',
  green: 'border-status-green/30',
  yellow: 'border-status-yellow/30',
  red: 'border-status-red/30',
  blue: 'border-status-blue/30',
};

export function StatCard({ label, value, icon, detail, accent = 'default' }: StatCardProps) {
  return (
    <Card className={`bg-card/50 ${accentColors[accent]}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
          </div>
          {icon && <span className="text-2xl opacity-60">{icon}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
