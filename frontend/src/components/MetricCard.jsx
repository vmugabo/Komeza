import React from 'react';

export default function MetricCard({ label, value, detail, tone = '' }) {
  return <div className={`metric-card ${tone}`}><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>;
}
