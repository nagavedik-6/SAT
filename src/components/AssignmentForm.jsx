import React, { useState } from 'react';
import { 
  Calendar, 
  Tag, 
  AlertCircle, 
  Clock, 
  FileText, 
  Plus, 
  Save, 
  X, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { SUBJECT_CONFIG } from '../data/sampleAssignments';
import { getTodayString } from '../utils/dateHelpers';

export default function AssignmentForm({
  formData,
  setFormData,
  onSubmit,
  isEditing,
  onCancelEdit,
  isModal = false,
  onCloseModal
}) {
  const [customSubjectMode, setCustomSubjectMode] = useState(false);
  const [validationError, setValidationError] = useState('');

  const todayStr = getTodayString();

  // Preset date helpers
  const handleSetRelativeDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const newDeadline = `${year}-${month}-${day}`;
    setFormData(prev => ({ ...prev, deadline: newDeadline }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validationError) setValidationError('');
  };

  const handlePrioritySelect = (priority) => {
    setFormData(prev => ({ ...prev, priority }));
  };

  const handleSubjectChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setCustomSubjectMode(true);
      setFormData(prev => ({ ...prev, subject: '' }));
    } else {
      setCustomSubjectMode(false);
      setFormData(prev => ({ ...prev, subject: val }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setValidationError('Please provide an assignment title.');
      return;
    }
    if (!formData.subject.trim()) {
      setValidationError('Please select or enter a subject.');
      return;
    }
    if (!formData.deadline) {
      setValidationError('Please select a valid deadline date.');
      return;
    }

    setValidationError('');
    onSubmit(e);
  };

  const defaultSubjects = Object.keys(SUBJECT_CONFIG).filter(s => s !== 'General');

  return (
    <div className={`assignment-form-card ${isModal ? 'is-modal-inner' : ''}`}>
      <div className="form-card-header">
        <div className="form-header-title-wrap">
          <div className="form-header-badge">
            {isEditing ? <Save size={18} /> : <Sparkles size={18} />}
          </div>
          <div>
            <h3 className="form-title">
              {isEditing ? 'Edit Assignment' : 'New Assignment'}
            </h3>
            <p className="form-subtitle">
              {isEditing 
                ? 'Update deadline, priority, or notes' 
                : 'Plan upcoming academic tasks & deadlines'}
            </p>
          </div>
        </div>

        {isModal && onCloseModal && (
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={onCloseModal}
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {validationError && (
        <div className="form-alert-error">
          <AlertCircle size={16} />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="assignment-form">
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="assignment-title">
            Assignment Title <span className="req">*</span>
          </label>
          <input
            id="assignment-title"
            name="title"
            type="text"
            className="form-input"
            placeholder="e.g., Quantum Mechanics Simulation Lab #3"
            value={formData.title}
            onChange={handleChange}
            maxLength={120}
            required
          />
        </div>

        {/* Subject & Priority Grid */}
        <div className="form-row-2">
          {/* Subject Selection */}
          <div className="form-group">
            <label htmlFor="assignment-subject">
              <Tag size={13} className="inline-icon" /> Subject <span className="req">*</span>
            </label>
            {!customSubjectMode ? (
              <div className="select-wrapper">
                <select
                  id="assignment-subject"
                  name="subject"
                  className="form-select"
                  value={formData.subject}
                  onChange={handleSubjectChange}
                  required
                >
                  <option value="" disabled>Select Subject</option>
                  {defaultSubjects.map(sub => (
                    <option key={sub} value={sub}>
                      {SUBJECT_CONFIG[sub]?.icon} {sub}
                    </option>
                  ))}
                  <option value="General">📝 General / Other</option>
                  <option value="__custom__">➕ + Custom Subject...</option>
                </select>
              </div>
            ) : (
              <div className="custom-subject-input-group">
                <input
                  type="text"
                  name="subject"
                  className="form-input"
                  placeholder="Enter custom subject..."
                  value={formData.subject}
                  onChange={handleChange}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="btn-back-preset"
                  onClick={() => setCustomSubjectMode(false)}
                  title="Choose from list"
                >
                  Presets
                </button>
              </div>
            )}
          </div>

          {/* Priority Pills */}
          <div className="form-group">
            <label>Priority Level</label>
            <div className="priority-pill-selector">
              {['Low', 'Medium', 'High'].map(p => (
                <button
                  key={p}
                  type="button"
                  className={`priority-select-btn priority-${p.toLowerCase()} ${
                    formData.priority === p ? 'selected' : ''
                  }`}
                  onClick={() => handlePrioritySelect(p)}
                >
                  {p === 'High' && '🔥 '}
                  {p === 'Medium' && '⚡ '}
                  {p === 'Low' && '🌱 '}
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deadline Date Input with Quick Presets */}
        <div className="form-group">
          <div className="label-with-presets">
            <label htmlFor="assignment-deadline">
              <Calendar size={13} className="inline-icon" /> Deadline Date <span className="req">*</span>
            </label>
            <div className="quick-date-chips">
              <button 
                type="button" 
                className="date-preset-chip"
                onClick={() => handleSetRelativeDate(0)}
              >
                Today
              </button>
              <button 
                type="button" 
                className="date-preset-chip"
                onClick={() => handleSetRelativeDate(1)}
              >
                Tomorrow
              </button>
              <button 
                type="button" 
                className="date-preset-chip"
                onClick={() => handleSetRelativeDate(3)}
              >
                +3 Days
              </button>
              <button 
                type="button" 
                className="date-preset-chip"
                onClick={() => handleSetRelativeDate(7)}
              >
                +1 Week
              </button>
            </div>
          </div>
          <input
            id="assignment-deadline"
            name="deadline"
            type="date"
            className="form-input date-input"
            value={formData.deadline}
            onChange={handleChange}
            min={todayStr}
            required
          />
        </div>

        {/* Estimated Hours & Completion Checkbox in Edit */}
        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="assignment-hours">
              <Clock size={13} className="inline-icon" /> Est. Study Hours
            </label>
            <input
              id="assignment-hours"
              name="estimatedHours"
              type="number"
              step="0.5"
              min="0.5"
              max="100"
              className="form-input"
              placeholder="e.g., 3"
              value={formData.estimatedHours || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-checkbox-group">
            <label className="checkbox-label" htmlFor="assignment-completed">
              <input
                id="assignment-completed"
                name="completed"
                type="checkbox"
                className="styled-checkbox"
                checked={!!formData.completed}
                onChange={handleChange}
              />
              <span className="checkbox-text">
                <CheckCircle2 size={16} className="check-indicator-icon" />
                Mark as Completed
              </span>
            </label>
          </div>
        </div>

        {/* Notes / Instructions */}
        <div className="form-group">
          <label htmlFor="assignment-notes">
            <FileText size={13} className="inline-icon" /> Notes & Requirements
          </label>
          <textarea
            id="assignment-notes"
            name="notes"
            className="form-textarea"
            placeholder="Key formulas, submission portal links, problem numbers, or rubric notes..."
            rows={2}
            value={formData.notes || ''}
            onChange={handleChange}
          />
        </div>

        {/* Form Action Buttons */}
        <div className="form-actions-row">
          <button type="submit" className="btn-submit-primary">
            {isEditing ? (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Plus size={16} strokeWidth={2.5} />
                <span>Add Assignment</span>
              </>
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
