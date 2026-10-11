import React from 'react';
import { 
  BookOpen, 
  Plus, 
  Moon, 
  Sun, 
  RotateCcw, 
  Sparkles,
  Calendar
} from 'lucide-react';

export default function Navbar({
  darkMode,
  setDarkMode,
  onOpenAddModal,
  onResetData,
  todayFormatted
}) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo-badge">
          <BookOpen className="logo-icon" size={22} />
        </div>
        <div className="logo-text-group">
          <div className="logo-title-row">
            <span className="logo-title">StudySpace</span>
            <span className="version-pill">React Workspace</span>
          </div>
          <span className="logo-subtitle">Academic Assignment & Deadline Tracker</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="date-chip" title="Today's Date">
          <Calendar size={15} className="date-icon" />
          <span>{todayFormatted}</span>
        </div>

        <button 
          className="icon-action-btn theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={18} className="theme-sun" /> : <Moon size={18} />}
        </button>

        <button 
          className="reset-btn"
          onClick={onResetData}
          title="Reset to sample assignments"
        >
          <RotateCcw size={14} />
          <span>Reset Data</span>
        </button>

        <button 
          className="btn-primary-glow"
          onClick={onOpenAddModal}
        >
          <Plus size={17} strokeWidth={2.5} />
          <span>Add Assignment</span>
        </button>
      </div>
    </header>
  );
}
