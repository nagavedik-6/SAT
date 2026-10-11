import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle,
  Inbox
} from 'lucide-react';
import AssignmentCard from './AssignmentCard';
import { SUBJECT_CONFIG } from '../data/sampleAssignments';
import { getDaysDifference } from '../utils/dateHelpers';

export default function OrganizedSections({
  assignments,
  groupMode, // 'urgency' | 'subject' | 'priority' | 'kanban'
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
  onReschedule
}) {
  // Collapsed state tracking for individual sections
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (sectionKey) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  if (assignments.length === 0) {
    return (
      <div className="empty-workspace-state">
        <div className="empty-icon-box">
          <Inbox size={48} />
        </div>
        <h3 className="empty-title">No assignments match your filter</h3>
        <p className="empty-description">
          Try clearing your search query or subject filters, or click "Add Assignment" to create a new task.
        </p>
      </div>
    );
  }

  // --- RENDER SECTIONS BY URGENCY / TIMELINE ---
  if (groupMode === 'urgency') {
    const overdueList = assignments.filter(a => !a.completed && getDaysDifference(a.deadline) < 0);
    const todayTomorrowList = assignments.filter(a => {
      if (a.completed) return false;
      const diff = getDaysDifference(a.deadline);
      return diff === 0 || diff === 1;
    });
    const upcomingList = assignments.filter(a => {
      if (a.completed) return false;
      const diff = getDaysDifference(a.deadline);
      return diff > 1;
    });
    const completedList = assignments.filter(a => a.completed);

    const sections = [
      {
        key: 'overdue',
        title: 'Overdue • Immediate Action Needed',
        subtitle: 'Tasks past their target deadline',
        icon: <AlertTriangle size={18} className="sec-icon-overdue" />,
        badgeClass: 'sec-badge-overdue',
        items: overdueList,
        emptyText: 'No overdue assignments! You are totally on top of your schedule 🚀'
      },
      {
        key: 'today_tomorrow',
        title: 'Due Today & Tomorrow • High Focus',
        subtitle: 'Immediate deadlines requiring attention',
        icon: <Flame size={18} className="sec-icon-today" />,
        badgeClass: 'sec-badge-today',
        items: todayTomorrowList,
        emptyText: 'No urgent tasks due today or tomorrow. Free study window! ☕'
      },
      {
        key: 'upcoming',
        title: 'Upcoming Assignments • Scheduled Ahead',
        subtitle: 'Deadlines later this week and beyond',
        icon: <Calendar size={18} className="sec-icon-upcoming" />,
        badgeClass: 'sec-badge-upcoming',
        items: upcomingList,
        emptyText: 'No future tasks scheduled. Plan ahead by adding upcoming exams or labs.'
      },
      {
        key: 'completed',
        title: 'Completed & Submitted Archive',
        subtitle: 'Accomplished assignments',
        icon: <CheckCircle2 size={18} className="sec-icon-completed" />,
        badgeClass: 'sec-badge-completed',
        items: completedList,
        emptyText: 'No assignments completed yet. Check off a task when you submit!'
      }
    ];

    return (
      <div className="organized-sections-container">
        {sections.map(sec => {
          const isCollapsed = !!collapsedSections[sec.key];
          // If no items in overdue and it's 0, we can show a nice clean empty note
          if (sec.items.length === 0 && sec.key === 'overdue') return null;

          return (
            <section key={sec.key} className={`section-panel section-${sec.key}`}>
              <div 
                className="section-header"
                onClick={() => toggleSection(sec.key)}
              >
                <div className="section-title-group">
                  <div className="section-icon-badge">{sec.icon}</div>
                  <div>
                    <div className="section-title-row">
                      <h3 className="section-heading">{sec.title}</h3>
                      <span className={`section-counter-pill ${sec.badgeClass}`}>
                        {sec.items.length} {sec.items.length === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>
                    <p className="section-subheading">{sec.subtitle}</p>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="section-collapse-toggle"
                  aria-label="Toggle section"
                >
                  {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
              </div>

              {!isCollapsed && (
                <div className="section-content">
                  {sec.items.length === 0 ? (
                    <div className="section-empty-notice">
                      <p>{sec.emptyText}</p>
                    </div>
                  ) : (
                    <div className="assignment-cards-grid">
                      {sec.items.map(assignment => (
                        <AssignmentCard
                          key={assignment.id}
                          assignment={assignment}
                          onToggleComplete={onToggleComplete}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onDuplicate={onDuplicate}
                          onReschedule={onReschedule}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    );
  }

  // --- RENDER SECTIONS BY SUBJECT ---
  if (groupMode === 'subject') {
    // Unique subjects from current assignments
    const subjects = Array.from(new Set(assignments.map(a => a.subject))).sort();

    return (
      <div className="organized-sections-container">
        {subjects.map(subject => {
          const items = assignments.filter(a => a.subject === subject);
          const completedCount = items.filter(a => a.completed).length;
          const subjectProgress = Math.round((completedCount / items.length) * 100);
          const config = SUBJECT_CONFIG[subject] || {
            color: '#6366f1',
            bg: 'rgba(99, 102, 241, 0.12)',
            border: 'rgba(99, 102, 241, 0.25)',
            icon: '📝'
          };
          const isCollapsed = !!collapsedSections[`subject_${subject}`];

          return (
            <section 
              key={subject} 
              className="section-panel section-subject-panel"
              style={{ borderLeftColor: config.color }}
            >
              <div 
                className="section-header"
                onClick={() => toggleSection(`subject_${subject}`)}
              >
                <div className="section-title-group">
                  <div 
                    className="section-icon-badge"
                    style={{ backgroundColor: config.bg, color: config.color }}
                  >
                    <span>{config.icon}</span>
                  </div>
                  <div>
                    <div className="section-title-row">
                      <h3 className="section-heading">{subject}</h3>
                      <span 
                        className="section-counter-pill"
                        style={{ backgroundColor: config.bg, color: config.color }}
                      >
                        {items.length} {items.length === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>
                    <div className="subject-progress-mini-row">
                      <div className="subject-progress-mini-bar">
                        <div 
                          className="subject-progress-mini-fill"
                          style={{ width: `${subjectProgress}%`, backgroundColor: config.color }}
                        />
                      </div>
                      <span className="subject-progress-label">
                        {completedCount}/{items.length} completed ({subjectProgress}%)
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="section-collapse-toggle"
                  aria-label="Toggle subject section"
                >
                  {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
              </div>

              {!isCollapsed && (
                <div className="section-content">
                  <div className="assignment-cards-grid">
                    {items.map(assignment => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        onToggleComplete={onToggleComplete}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                        onReschedule={onReschedule}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    );
  }

  // --- RENDER SECTIONS BY PRIORITY ---
  if (groupMode === 'priority') {
    const priorities = [
      {
        level: 'High',
        title: '🔥 High Priority • Critical Deadlines',
        desc: 'Major tests, heavy percentage projects, and strict cutoffs',
        badgeClass: 'sec-badge-overdue'
      },
      {
        level: 'Medium',
        title: '⚡ Medium Priority • Regular Assignments',
        desc: 'Standard homework problem sets, readings, and weekly quizzes',
        badgeClass: 'sec-badge-today'
      },
      {
        level: 'Low',
        title: '🌱 Low Priority • Flexible / Self-paced',
        desc: 'Suggested readings, supplementary practice, and optional tasks',
        badgeClass: 'sec-badge-upcoming'
      }
    ];

    return (
      <div className="organized-sections-container">
        {priorities.map(p => {
          const items = assignments.filter(a => a.priority === p.level);
          const isCollapsed = !!collapsedSections[`priority_${p.level}`];

          return (
            <section key={p.level} className="section-panel">
              <div 
                className="section-header"
                onClick={() => toggleSection(`priority_${p.level}`)}
              >
                <div className="section-title-group">
                  <div>
                    <div className="section-title-row">
                      <h3 className="section-heading">{p.title}</h3>
                      <span className={`section-counter-pill ${p.badgeClass}`}>
                        {items.length} {items.length === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>
                    <p className="section-subheading">{p.desc}</p>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="section-collapse-toggle"
                  aria-label="Toggle priority section"
                >
                  {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
              </div>

              {!isCollapsed && (
                <div className="section-content">
                  {items.length === 0 ? (
                    <div className="section-empty-notice">
                      <p>No assignments currently marked as {p.level} priority.</p>
                    </div>
                  ) : (
                    <div className="assignment-cards-grid">
                      {items.map(assignment => (
                        <AssignmentCard
                          key={assignment.id}
                          assignment={assignment}
                          onToggleComplete={onToggleComplete}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onDuplicate={onDuplicate}
                          onReschedule={onReschedule}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    );
  }

  // --- RENDER AS KANBAN BOARD COLUMNS ---
  if (groupMode === 'kanban') {
    const todoItems = assignments.filter(a => !a.completed && getDaysDifference(a.deadline) > 0);
    const inProgressItems = assignments.filter(a => !a.completed && getDaysDifference(a.deadline) <= 0);
    const doneItems = assignments.filter(a => a.completed);

    const columns = [
      {
        id: 'todo',
        title: '📋 To-Do / Planned',
        subtitle: 'Scheduled upcoming assignments',
        items: todoItems,
        color: '#6366f1'
      },
      {
        id: 'focus',
        title: '⚡ In Progress / Urgent',
        subtitle: 'Overdue or due within 24h',
        items: inProgressItems,
        color: '#f59e0b'
      },
      {
        id: 'done',
        title: '🏆 Submitted & Completed',
        subtitle: 'Finished tasks',
        items: doneItems,
        color: '#10b981'
      }
    ];

    return (
      <div className="kanban-columns-container">
        {columns.map(col => (
          <div key={col.id} className="kanban-column">
            <div className="kanban-column-header" style={{ borderTopColor: col.color }}>
              <div className="kanban-header-info">
                <h4>{col.title}</h4>
                <p>{col.subtitle}</p>
              </div>
              <span className="kanban-count-pill">{col.items.length}</span>
            </div>

            <div className="kanban-column-body">
              {col.items.length === 0 ? (
                <div className="kanban-empty-slot">
                  <p>No tasks in this lane</p>
                </div>
              ) : (
                col.items.map(assignment => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onReschedule={onReschedule}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
