import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import FilterToolbar from './components/FilterToolbar';
import OrganizedSections from './components/OrganizedSections';
import AssignmentForm from './components/AssignmentForm';
import Toast from './components/Toast';
import { INITIAL_ASSIGNMENTS, SUBJECT_CONFIG } from './data/sampleAssignments';
import { getDaysDifference, getTodayString } from './utils/dateHelpers';
import { 
  Sparkles, 
  Plus, 
  HelpCircle, 
  Calendar, 
  CheckCircle,
  FileCheck2,
  Trash2,
  ListTodo
} from 'lucide-react';
import './App.css';

const DEFAULT_FORM_STATE = {
  title: '',
  subject: 'Computer Science',
  deadline: '',
  priority: 'Medium',
  estimatedHours: '',
  notes: '',
  completed: false
};

function App() {
  // 1. STATE: Assignments list (persisted in localStorage)
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('study_space_assignments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading assignments from localStorage', e);
    }
    return INITIAL_ASSIGNMENTS;
  });

  // 2. STATE: Form input controls
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_STATE,
    deadline: getTodayString()
  });

  // 3. STATE: Editing status
  const [editingId, setEditingId] = useState(null);

  // 4. STATE: Section organizer layout
  const [groupMode, setGroupMode] = useState('urgency'); // 'urgency' | 'subject' | 'priority' | 'kanban'

  // 5. STATE: Filters, Search & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Pending' | 'Due Soon' | 'Overdue' | 'Completed'
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('deadline-asc');

  // 6. STATE: Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('study_space_theme') === 'dark';
  });

  // 7. STATE: Quick Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 8. STATE: Toast notifications & Undo
  const [toast, setToast] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);

  // Save assignments to localStorage
  useEffect(() => {
    localStorage.setItem('study_space_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Save and apply theme
  useEffect(() => {
    localStorage.setItem('study_space_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // Toast auto-dismiss timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Trigger notification
  const showToast = (message, type = 'info', canUndo = false) => {
    setToast({ message, type, canUndo });
  };

  // --- CRUD OPERATIONS ---

  // CREATE or UPDATE
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      // UPDATE
      setAssignments(prev =>
        prev.map(item =>
          item.id === editingId
            ? {
                ...item,
                title: formData.title.trim(),
                subject: formData.subject.trim(),
                deadline: formData.deadline,
                priority: formData.priority,
                estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : null,
                notes: formData.notes.trim(),
                completed: !!formData.completed
              }
            : item
        )
      );
      showToast(`Updated "${formData.title}"`, 'success');
      setEditingId(null);
    } else {
      // CREATE
      const newAssignment = {
        id: Date.now(),
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        deadline: formData.deadline,
        priority: formData.priority,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : null,
        notes: formData.notes.trim(),
        completed: !!formData.completed,
        createdAt: Date.now()
      };
      setAssignments(prev => [newAssignment, ...prev]);
      showToast(`Added "${newAssignment.title}"`, 'success');
    }

    // Reset Form
    setFormData({
      ...DEFAULT_FORM_STATE,
      deadline: getTodayString()
    });
    setIsModalOpen(false);
  };

  // EDIT: Load assignment into form
  const handleEdit = (assignment) => {
    setEditingId(assignment.id);
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      deadline: assignment.deadline,
      priority: assignment.priority,
      estimatedHours: assignment.estimatedHours || '',
      notes: assignment.notes || '',
      completed: assignment.completed
    });

    // If on smaller screens, open modal
    if (window.innerWidth < 1024) {
      setIsModalOpen(true);
    } else {
      // Scroll to form panel smoothly
      const formEl = document.getElementById('assignment-form-anchor');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      ...DEFAULT_FORM_STATE,
      deadline: getTodayString()
    });
    setIsModalOpen(false);
  };

  // DELETE
  const handleDelete = (id) => {
    const toDelete = assignments.find(a => a.id === id);
    if (!toDelete) return;

    setLastDeleted(toDelete);
    setAssignments(prev => prev.filter(a => a.id !== id));
    showToast(`Deleted "${toDelete.title}"`, 'info', true);

    if (editingId === id) {
      handleCancelEdit();
    }
  };

  // UNDO DELETE
  const handleUndoDelete = () => {
    if (lastDeleted) {
      setAssignments(prev => [lastDeleted, ...prev]);
      showToast(`Restored "${lastDeleted.title}"`, 'success');
      setLastDeleted(null);
      setToast(null);
    }
  };

  // TOGGLE COMPLETE
  const handleToggleComplete = (id) => {
    setAssignments(prev =>
      prev.map(a => {
        if (a.id === id) {
          const nextCompleted = !a.completed;
          if (nextCompleted) {
            showToast(`Completed "${a.title}" 🎉`, 'success');
          }
          return { ...a, completed: nextCompleted };
        }
        return a;
      })
    );
  };

  // DUPLICATE
  const handleDuplicate = (assignment) => {
    const duplicated = {
      ...assignment,
      id: Date.now(),
      title: `${assignment.title} (Copy)`,
      completed: false,
      createdAt: Date.now()
    };
    setAssignments(prev => [duplicated, ...prev]);
    showToast(`Duplicated "${assignment.title}"`, 'success');
  };

  // QUICK RESCHEDULE (+1 day)
  const handleReschedule = (id, daysToAdd = 1) => {
    setAssignments(prev =>
      prev.map(a => {
        if (a.id === id) {
          const [y, m, d] = a.deadline.split('-').map(Number);
          const target = new Date(y, m - 1, d);
          target.setDate(target.getDate() + daysToAdd);
          const newY = target.getFullYear();
          const newM = String(target.getMonth() + 1).padStart(2, '0');
          const newD = String(target.getDate()).padStart(2, '0');
          const newDeadline = `${newY}-${newM}-${newD}`;
          return { ...a, deadline: newDeadline };
        }
        return a;
      })
    );
    showToast(`Rescheduled by +${daysToAdd} day`, 'info');
  };

  // RESET TO SAMPLE DATA
  const handleResetData = () => {
    if (window.confirm('Reset all assignments back to default sample workspace?')) {
      setAssignments(INITIAL_ASSIGNMENTS);
      handleCancelEdit();
      showToast('Workspace reset to sample assignments', 'info');
    }
  };

  // CLEAR ALL COMPLETED
  const handleClearCompleted = () => {
    const completedCount = assignments.filter(a => a.completed).length;
    if (completedCount === 0) {
      showToast('No completed assignments to clear', 'info');
      return;
    }
    if (window.confirm(`Clear all ${completedCount} completed assignments?`)) {
      setAssignments(prev => prev.filter(a => !a.completed));
      showToast(`Cleared ${completedCount} completed assignments`, 'info');
    }
  };

  // CLEAR ALL ACTIVE FILTERS
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setSelectedSubject('All');
    setSelectedPriority('All');
  };

  // --- STATS CALCULATIONS ---
  const overdueCount = assignments.filter(
    a => !a.completed && getDaysDifference(a.deadline) < 0
  ).length;

  const dueTodayCount = assignments.filter(
    a => !a.completed && getDaysDifference(a.deadline) === 0
  ).length;

  // Available subjects for filtering
  const availableSubjects = Array.from(
    new Set([...Object.keys(SUBJECT_CONFIG).filter(s => s !== 'General'), ...assignments.map(a => a.subject)])
  ).sort();

  // --- FILTER & SORT LOGIC ---
  const filteredAssignments = assignments
    .filter(a => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(query);
        const matchesSubject = a.subject.toLowerCase().includes(query);
        const matchesNotes = (a.notes || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubject && !matchesNotes) return false;
      }

      // 2. Status Filter
      if (filterStatus === 'Pending' && a.completed) return false;
      if (filterStatus === 'Completed' && !a.completed) return false;
      if (filterStatus === 'Overdue') {
        if (a.completed || getDaysDifference(a.deadline) >= 0) return false;
      }
      if (filterStatus === 'Due Soon') {
        const diff = getDaysDifference(a.deadline);
        if (a.completed || diff < 0 || diff > 3) return false;
      }

      // 3. Subject Filter
      if (selectedSubject !== 'All' && a.subject !== selectedSubject) return false;

      // 4. Priority Filter
      if (selectedPriority !== 'All' && a.priority !== selectedPriority) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline-asc') {
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === 'deadline-desc') {
        return b.deadline.localeCompare(a.deadline);
      }
      if (sortBy === 'priority-desc') {
        const weight = { High: 3, Medium: 2, Low: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`app-shell ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAddModal={() => {
          handleCancelEdit();
          setIsModalOpen(true);
        }}
        onResetData={handleResetData}
        todayFormatted={todayFormatted}
      />

      <div className="main-content-layout">
        {/* Academic Stats Overview Bar */}
        <StatsBar
          assignments={assignments}
          overdueCount={overdueCount}
          dueTodayCount={dueTodayCount}
        />

        {/* Filter & View Mode Toolbar */}
        <FilterToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          sortBy={sortBy}
          setSortBy={setSortBy}
          groupMode={groupMode}
          setGroupMode={setGroupMode}
          availableSubjects={availableSubjects}
          totalMatching={filteredAssignments.length}
          onClearFilters={handleClearFilters}
        />

        {/* Workspace Dual-Panel Grid */}
        <main className="workspace-grid">
          {/* Left Column: Assignment Form (Desktop) */}
          <aside className="workspace-form-column" id="assignment-form-anchor">
            <div className="sticky-form-wrapper">
              <AssignmentForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleFormSubmit}
                isEditing={editingId !== null}
                onCancelEdit={handleCancelEdit}
              />

              {/* Study Tip & Workspace Quick Actions Card */}
              <div className="workspace-tip-card">
                <div className="tip-header">
                  <Sparkles size={16} className="tip-sparkle-icon" />
                  <h4>Productivity Pro-Tip</h4>
                </div>
                <p className="tip-body">
                  "Group related subjects in 90-minute deep study blocks. Check off assignments as soon as you submit to build positive momentum."
                </p>
                <div className="quick-actions-footer">
                  <button 
                    type="button" 
                    className="btn-text-danger"
                    onClick={handleClearCompleted}
                  >
                    <Trash2 size={13} />
                    <span>Clear Completed Tasks</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Organized Sections */}
          <section className="workspace-sections-column">
            <div className="sections-header-bar">
              <div className="sections-header-info">
                <h2>
                  {groupMode === 'urgency' && 'Timeline & Urgency Sections'}
                  {groupMode === 'subject' && 'Sections by Academic Subject'}
                  {groupMode === 'priority' && 'Sections by Priority Level'}
                  {groupMode === 'kanban' && 'Kanban Task Board'}
                </h2>
                <span className="results-count-chip">
                  Showing {filteredAssignments.length} of {assignments.length} assignments
                </span>
              </div>
            </div>

            {/* Organized Sections Component */}
            <OrganizedSections
              assignments={filteredAssignments}
              groupMode={groupMode}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onReschedule={handleReschedule}
            />
          </section>
        </main>
      </div>

      {/* Floating Add Modal for Mobile / Small Screens */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <AssignmentForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleFormSubmit}
              isEditing={editingId !== null}
              onCancelEdit={handleCancelEdit}
              isModal={true}
              onCloseModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        onUndo={handleUndoDelete}
      />
    </div>
  );
}

export default App;
