export default function StatsCard({ icon, value, label, gradient }) {
  return (
    <div className={`stats-card ${gradient}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-value">{value}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
}