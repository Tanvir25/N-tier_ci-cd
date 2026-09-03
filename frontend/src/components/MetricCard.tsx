import type { ReactNode } from 'react';

type MetricCardProps = {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  accent?: 'indigo' | 'emerald' | 'cyan' | 'amber';
};

export default function MetricCard({ label, value, detail, icon, accent }: MetricCardProps) {
  return (
    <article className={`metric-card${accent ? ` metric-card--${accent}` : ''}`}>
      <div className="metric-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}

