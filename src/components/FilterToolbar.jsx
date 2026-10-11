import React from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  ArrowUpDown, 
  X, 
  CalendarDays, 
  FolderGit2, 
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';
import { SUBJECT_CONFIG } from '../data/sampleAssignments';

export default function FilterToolbar({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  selectedSubject,
  setSelectedSubject,
  selectedPriority,
  setSelectedPriority,
  sortBy,
  setSortBy,
  groupMode,
  setGroupMode,
  availableSubjects,
  totalMatching,
  onClearFilters
}) {
  const hasActiveFilters = searchQuery || filterStatus !== 'All' || selectedSubject !== 'All' || selectedPriority !== 'All';

  return (
    <div className="filter-toolbar-card">
      {/* Top row: Section View Mode Tabs */}
      <div className="toolbar-top-row">
        <div className="section-modes-label">
          <Layers size={14} />
          <span>Organize By:</span>
        </div>

        <div className="section-mode-button-group">
          <button
            type="button"
            className={`mode-btn ${groupMode === 'urgency' ? 'is-active' : ''}`}
            onClick={() => setGroupMode('urgency')}
          >
            <CalendarDays size={14} />
            <span>Timeline Sections</span>
          </button>

          <button
            type="button"
            className={`mode-btn ${groupMode === 'subject' ? 'is-active' : ''}`}
            onClick={() => setGroupMode('subject')}
          >
            <FolderGit2 size={14} />
            <span>By Subject</span>
          </button>

          <button
            type="button"
            className={`mode-btn ${groupMode === 'priority' ? 'is-active' : ''}`}
            onClick={() => setGroupMode('priority')}
          >
            <SlidersHorizontal size={14} />
            <span>By Priority</span>
          </button>

          <button
            type="button"
            className={`mode-btn ${groupMode === 'kanban' ? 'is-active' : ''}`}
            onClick={() => setGroupMode('kanban')}
          >
            <LayoutGrid size={14} />
            <span>Kanban Board</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Filters, Search & Sorting */}
      <div className="toolbar-controls-row">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search assignments, topics, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="status-filter-pills">
          {['All', 'Pending', 'Due Soon', 'Overdue', 'Completed'].map(status => (
            <button
              key={status}
              type="button"
              className={`status-pill ${filterStatus === status ? 'is-selected' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Dropdowns group */}
        <div className="filter-selects-group">
          {/* Subject Filter */}
          <select
            className="toolbar-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Filter by subject"
          >
            <option value="All">All Subjects</option>
            {availableSubjects.map(sub => (
              <option key={sub} value={sub}>
                {SUBJECT_CONFIG[sub]?.icon || '📝'} {sub}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            className="toolbar-select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            aria-label="Filter by priority"
          >
            <option value="All">All Priorities</option>
            <option value="High">🔥 High Priority</option>
            <option value="Medium">⚡ Medium Priority</option>
            <option value="Low">🌱 Low Priority</option>
          </select>

          {/* Sort By */}
          <div className="sort-select-wrapper">
            <ArrowUpDown size={13} className="sort-icon" />
            <select
              className="toolbar-select sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort assignments"
            >
              <option value="deadline-asc">Deadline (Earliest)</option>
              <option value="deadline-desc">Deadline (Latest)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="title-asc">Title (A - Z)</option>
            </select>
          </div>

          {/* Clear Filters Button if any filter active */}
          {hasActiveFilters && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={onClearFilters}
              title="Reset all filters"
            >
              <X size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
