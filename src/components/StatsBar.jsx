import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  Flame,
  Award
} from 'lucide-react';

export default function StatsBar({ assignments, overdueCount, dueTodayCount }) {
  const total = assignments.length;
  const completed = assignments.filter(a => a.completed).length;
  const pending = total - completed;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const totalEstHours = assignments
    .filter(a => !a.completed)
    .reduce((sum, a) => sum + (Number(a.estimatedHours) || 0), 0);

  const getMotivationalNote = () => {
    if (total === 0) return "Add your first assignment to kick off your productivity!";
    if (completionPercentage === 100) return "🎉 Incredible! All assignments are finished! You're ahead of the curve.";
    if (completionPercentage >= 75) return "🔥 Almost there! Just a few more to conquer.";
    if (completionPercentage >= 50) return "💪 Halfway through! Keep up the great study momentum.";
    if (overdueCount > 0) return `⚠️ You have ${overdueCount} overdue item${overdueCount > 1 ? 's' : ''}. Prioritize these first!`;
    return "✨ Stay consistent. Break tasks into focused study sessions!";
  };

  return (
    <div className="stats-wrapper">
      <div className="stats-grid">
        {/* Card 1: Total */}
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper total-icon">
            <Layers size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Assignments</span>
            <div className="stat-value-group">
              <span className="stat-number">{total}</span>
              <span className="stat-subtext">in workspace</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pending / Est Hours */}
        <div className="stat-card stat-pending">
          <div className="stat-icon-wrapper pending-icon">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending Tasks</span>
            <div className="stat-value-group">
              <span className="stat-number">{pending}</span>
              <span className="stat-subtext">~{totalEstHours}h study needed</span>
            </div>
          </div>
        </div>

        {/* Card 3: Urgent / Overdue */}
        <div className={`stat-card stat-urgent ${overdueCount > 0 ? 'has-overdue' : ''}`}>
          <div className="stat-icon-wrapper urgent-icon">
            {overdueCount > 0 ? <AlertTriangle size={20} /> : <Flame size={20} />}
          </div>
          <div className="stat-content">
            <span className="stat-label">Urgent / Overdue</span>
            <div className="stat-value-group">
              <span className="stat-number">{overdueCount}</span>
              <span className="stat-subtext">{dueTodayCount} due today</span>
            </div>
          </div>
        </div>

        {/* Card 4: Completed */}
        <div className="stat-card stat-completed">
          <div className="stat-icon-wrapper completed-icon">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Completed</span>
            <div className="stat-value-group">
              <span className="stat-number">{completed}</span>
              <span className="stat-subtext">{completionPercentage}% done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Motivation Bar */}
      <div className="overall-progress-card">
        <div className="progress-header">
          <div className="progress-info">
            <span className="progress-title">Academic Progress</span>
            <span className="progress-quote">{getMotivationalNote()}</span>
          </div>
          <div className="progress-badge">
            <Award size={14} className="award-icon" />
            <span className="progress-score">{completionPercentage}%</span>
          </div>
        </div>
        <div className="progress-track-bar">
          <div 
            className="progress-fill-bar" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
