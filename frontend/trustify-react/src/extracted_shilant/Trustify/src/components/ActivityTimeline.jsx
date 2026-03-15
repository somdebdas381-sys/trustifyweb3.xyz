export default function ActivityTimeline({ activities }) {
  return (
    <div className="activity-timeline">
      <h3>Recent Activity</h3>
      <div className="timeline">
        {activities.map((activity, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-icon">{activity.icon}</div>
            <div className="timeline-content">
              <div className="timeline-description">{activity.description}</div>
              <div className="timeline-timestamp">{activity.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}