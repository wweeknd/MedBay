import React, { useState } from 'react';
import { mockMedicalRecords } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import {
  FileText, Upload, Search, Filter, Download, Eye, Trash2,
  File, Image, FlaskConical, Stethoscope, X
} from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  'prescription': <Stethoscope size={20} style={{ color: 'var(--primary-400)' }} />,
  'lab-report': <FlaskConical size={20} style={{ color: 'var(--success-400)' }} />,
  'scan': <Image size={20} style={{ color: 'var(--accent-400)' }} />,
  'discharge-summary': <FileText size={20} style={{ color: 'var(--warning-400)' }} />,
  'other': <File size={20} style={{ color: 'var(--text-secondary)' }} />,
};

const typeColors: Record<string, string> = {
  'prescription': 'rgba(6, 182, 212, 0.15)',
  'lab-report': 'rgba(16, 185, 129, 0.15)',
  'scan': 'rgba(99, 102, 241, 0.15)',
  'discharge-summary': 'rgba(245, 158, 11, 0.15)',
  'other': 'rgba(148, 163, 184, 0.15)',
};

const MedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const isSushanth = user?.email?.toLowerCase() === 'sssushanth2007@gmail.com';
  const isUday = user?.email?.toLowerCase() === 'uday@medbay.com';

  const demoRecords = (isSushanth || isUday) ? [
    {
      id: 'demo-rec-1',
      patientId: user?.uid!,
      title: 'Medical Degree - Verification',
      type: 'other',
      description: 'Official verified medical degree document.',
      fileURL: '#',
      fileName: 'medical_degree_verified.pdf',
      fileSize: 4500000,
      uploadedAt: '2025-03-01T10:00:00Z',
      doctor: 'Internal System',
      hospital: 'Verification Hub',
      tags: ['verified', 'legal'],
    },
    {
      id: 'demo-rec-2',
      patientId: user?.uid!,
      title: 'Professional License',
      type: 'lab-report',
      description: 'Active professional license for medical practice.',
      fileURL: '#',
      fileName: 'medical_license.pdf',
      fileSize: 1200000,
      uploadedAt: '2025-02-10T14:30:00Z',
      doctor: 'Board of Medicine',
      tags: ['license', 'active'],
    }
  ] : [];

  const userRecords = [...mockMedicalRecords.filter(r => r.patientId === user?.uid), ...demoRecords];

  const filteredRecords = userRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="page-inner">
      <div className="page-header animate-fade-in">
        <h1><FileText size={28} style={{ color: 'var(--primary-400)', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Medical Records</h1>
        <p>Upload, organize, and manage all your medical documents in one secure vault.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="records-toolbar glass-card animate-fade-in-up stagger-1">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search records by title, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="records-search"
          />
        </div>
        <div className="toolbar-actions">
          <div className="filter-group">
            <Filter size={16} />
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              id="records-filter"
            >
              <option value="all">All Types</option>
              <option value="prescription">Prescriptions</option>
              <option value="lab-report">Lab Reports</option>
              <option value="scan">Scans</option>
              <option value="discharge-summary">Discharge Summaries</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)} id="upload-record-btn">
            <Upload size={16} /> Upload Record
          </button>
        </div>
      </div>

      {/* Records Grid */}
      <div className="records-grid">
        {filteredRecords.map((record, index) => (
          <div key={record.id} className="record-card glass-card animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 1)}s`, opacity: 0 }}>
            <div className="record-card-header">
              <div className="record-type-icon" style={{ background: typeColors[record.type] }}>
                {typeIcons[record.type]}
              </div>
              <span className={`badge ${record.type === 'prescription' ? 'badge-primary' : record.type === 'lab-report' ? 'badge-success' : record.type === 'scan' ? 'badge-accent' : record.type === 'discharge-summary' ? 'badge-warning' : 'badge-neutral'}`}>
                {record.type.replace('-', ' ')}
              </span>
            </div>

            <h4 className="record-title">{record.title}</h4>
            <p className="record-description">{record.description}</p>

            <div className="record-meta">
              <div className="record-meta-item">
                <span className="record-meta-label">File</span>
                <span className="record-meta-value">{record.fileName}</span>
              </div>
              <div className="record-meta-item">
                <span className="record-meta-label">Size</span>
                <span className="record-meta-value">{formatFileSize(record.fileSize)}</span>
              </div>
              <div className="record-meta-item">
                <span className="record-meta-label">Uploaded</span>
                <span className="record-meta-value">{new Date(record.uploadedAt).toLocaleDateString()}</span>
              </div>
              {record.doctor && (
                <div className="record-meta-item">
                  <span className="record-meta-label">Doctor</span>
                  <span className="record-meta-value">{record.doctor}</span>
                </div>
              )}
            </div>

            {record.tags.length > 0 && (
              <div className="record-tags">
                {record.tags.map((tag, i) => (
                  <span key={i} className="record-tag">#{tag}</span>
                ))}
              </div>
            )}

            <div className="record-actions">
              <button className="btn btn-ghost btn-sm" title="View" onClick={() => {
                alert(`📄 ${record.title}\n\nType: ${record.type.replace('-', ' ')}\nDescription: ${record.description}\nDoctor: ${record.doctor || 'N/A'}\nDate: ${new Date(record.uploadedAt).toLocaleDateString('en-IN')}\nFile: ${record.fileName} (${formatFileSize(record.fileSize)})\nTags: ${record.tags.join(', ') || 'None'}`);
              }}><Eye size={16} /> View</button>
              <button className="btn btn-ghost btn-sm" title="Download" onClick={() => {
                const content = [
                  `═══════════════════════════════════════`,
                  `  MedBay — Medical Record`,
                  `═══════════════════════════════════════`,
                  ``,
                  `Title:       ${record.title}`,
                  `Type:        ${record.type.replace('-', ' ')}`,
                  `Description: ${record.description}`,
                  `Doctor:      ${record.doctor || 'N/A'}`,
                  `Date:        ${new Date(record.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                  `File:        ${record.fileName}`,
                  `Size:        ${formatFileSize(record.fileSize)}`,
                  `Tags:        ${record.tags.join(', ') || 'None'}`,
                  ``,
                  `═══════════════════════════════════════`,
                  `  Downloaded from MedBay on ${new Date().toLocaleDateString('en-IN')}`,
                  `═══════════════════════════════════════`,
                ].join('\n');
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = record.fileName.replace(/\.\w+$/, '') + '_record.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}><Download size={16} /> Download</button>
              <button className="btn btn-ghost btn-sm" title="Delete" style={{ color: 'var(--error-400)' }} onClick={() => {
                if (confirm(`Delete "${record.title}"? This cannot be undone.`)) {
                  // In a real app this would delete from Firestore
                  alert('Record deleted (demo mode — no actual data removed)');
                }
              }}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="empty-state">
          <FileText size={64} />
          <h3>No records found</h3>
          <p>Try adjusting your search or filter, or upload your first medical record.</p>
          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)} style={{ marginTop: 'var(--space-lg)' }}>
            <Upload size={16} /> Upload Record
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Medical Record</h3>
              <button className="btn-icon" onClick={() => setShowUploadModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Record Title</label>
                <input type="text" className="form-input" placeholder="e.g., Blood Test Results - March 2025" id="upload-title" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Record Type</label>
                <select className="form-select" id="upload-type">
                  <option value="prescription">Prescription</option>
                  <option value="lab-report">Lab Report</option>
                  <option value="scan">Scan / Imaging</option>
                  <option value="discharge-summary">Discharge Summary</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Brief description of the record..." id="upload-description" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Doctor Name (optional)</label>
                <input type="text" className="form-input" placeholder="e.g., Dr. Sarah Chen" id="upload-doctor" />
              </div>
              <div className="upload-dropzone" id="upload-dropzone">
                <Upload size={40} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }} />
                <p style={{ fontWeight: 500 }}>Drag & drop your file here</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>or click to browse • PDF, DCM, JPG, PNG up to 50MB</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowUploadModal(false)} id="upload-submit">Upload Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
