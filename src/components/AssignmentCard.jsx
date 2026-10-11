import React, { useState } from 'react';
import { 
  Check, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Flame, 
  Edit3, 
  Trash2, 
  Copy, 
  CalendarPlus, 
  ChevronDown, 
  ChevronUp,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUBJECT_CONFIG } from '../data/sampleAssignments';
import { formatDisplayDate, getUrgencyStatus } from '../utils/dateHelpers';

export default function AssignmentCard({
  assignment,
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
  onReschedule
}) {
  const [showNotes, setShowNotes] = useState(false);

  const urgency = getUrgencyStatus(assignment.deadline, assignment.completed);
  const subjectStyle = SUBJECT_CONFIG[assignment.subject] || {
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.25)',
    icon: '📝'
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!assignment.completed) {
      // Trigger subtle celebratory confetti burst
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10b981', '#6366f1', '#f59e0b', '#3b82f6']
        });
      } catch (err) {
        // Fallback silently if confetti canvas not ready
      }
    }
    onToggleComplete(assignment.id);
  };

  const priorityClass = `priority-${assignment.priority?.toLowerCase() || 'medium'}`;

  // Card classes based on conditional styling
  const cardClasses = [
    'assignment-card',
    assignment.completed ? 'card-completed' : '',
    urgency.isOverdue ? 'card-overdue' : '',
    urgency.isToday ? 'card-today' : '',
    priorityClass
  ].filter(Boolean).join(' ');

  return (
    <article className={cardClasses}>
      {/* Status indicator strip on the left */}
      <div 
        className="card-indicator-strip"
        style={{
          backgroundColor: assignment.completed 
            ? '#10b981' 
            : urgency.isOverdue 
              ? '#ef4444' 
              : urgency.isToday 
                ? '#f59e0b' 
                : subjectStyle.color
        }}
      />

      <div className="card-main-content">
        <div className="card-top-row">
          {/* Checkbox */}
          <button
            type="button"
            className={`custom-checkbox ${assignment.completed ? 'is-checked' : ''}`}
            onClick={handleToggle}
            title={assignment.completed ? "Mark as pending" : "Mark as completed"}
            aria-label="Toggle assignment status"
          >
            {assignment.completed && <Check size={14} strokeWidth={3} />}
          </button>

          {/* Title & Subject Header */}
          <div className="card-title-container">
            <h4 className="card-title">
              {assignment.title}
            </h4>

            <div className="card-badge-row">
              {/* Subject Tag */}
              <span 
                className="subject-tag"
                style={{
                  color: subjectStyle.color,
                  backgroundColor: subjectStyle.bg,
                  borderColor: subjectStyle.border
                }}
              >
                <span className="subject-icon">{subjectStyle.icon}</span>
                <span>{assignment.subject}</span>
              </span>

              {/* Priority Pill */}
              <span className={`priority-badge ${priorityClass}`}>
                {assignment.priority === 'High' && '🔥 High'}
                {assignment.priority === 'Medium' && '⚡ Med'}
                {assignment.priority === 'Low' && '🌱 Low'}
              </span>

              {/* Urgency / Deadline Badge */}
              <span 
                className={`urgency-badge urgency-${urgency.type}`}
                style={{
                  color: urgency.color,
                  backgroundColor: urgency.bg,
                  borderColor: urgency.border
                }}
              >
                {urgency.isOverdue && <AlertTriangle size={12} className="urgency-icon" />}
                {urgency.isToday && <Flame size={12} className="urgency-icon" />}
                <span>{urgency.label}</span>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="card-actions">
            <button
              type="button"
              className="card-action-btn edit-btn"
              onClick={() => onEdit(assignment)}
              title="Edit assignment"
              aria-label="Edit assignment"
            >
              <Edit3 size={15} />
            </button>

            <button
              type="button"
              className="card-action-btn duplicate-btn"
              onClick={() => onDuplicate(assignment)}
              title="Duplicate assignment"
              aria-label="Duplicate assignment"
            >
              <Copy size={15} />
            </button>

            <button
              type="button"
              className="card-action-btn reschedule-btn"
              onClick={() => onReschedule(assignment.id, 1)}
              title="Postpone by +1 day"
              aria-label="Postpone by 1 day"
            >
              <CalendarPlus size={15} />
            </button>

            <button
              type="button"
              className="card-action-btn delete-btn"
              onClick={() => onDelete(assignment.id)}
              title="Delete assignment"
              aria-label="Delete assignment"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Card Footer: Deadline date & study hours */}
        <div className="card-footer-row">
          <div className="footer-meta-item">
            <Calendar size={13} className="meta-icon" />
            <span className="deadline-date-text">
              Due {formatDisplayDate(assignment.deadline)}
            </span>
          </div>

          {assignment.estimatedHours ? (
            <div className="footer-meta-item">
              <Clock size={13} className="meta-icon" />
              <span>{assignment.estimatedHours}h est.</span>
            </div>
          ) : null}

          {assignment.notes && (
            <button 
              type="button" 
              className="toggle-notes-btn"
              onClick={() => setShowNotes(!showNotes)}
            >
              <FileText size={12} />
              <span>{showNotes ? 'Hide Notes' : 'View Notes'}</span>
              {showNotes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        {/* Collapsible notes drawer */}
        {showNotes && assignment.notes && (
          <div className="card-notes-drawer">
            <p className="card-notes-text">{assignment.notes}</p>
          </div>
        )}
      </div>
    </article>
  );
}
