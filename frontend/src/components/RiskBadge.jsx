import React from 'react';

export default function RiskBadge({ value }) {
  return <span className={`risk-badge ${String(value || 'unknown').toLowerCase()}`}>{value || 'Unknown'}</span>;
}
