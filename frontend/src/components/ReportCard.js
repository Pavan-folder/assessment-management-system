const { useState } = window.React;

function ReportCard({ report, onClose, onDownload, onDelete }) {
  // Make ReportCard component globally available
  window.ReportCard = ReportCard;

  // Ensure all props are functions
  const handleClose = onClose || (() => {});
  const handleDownload = onDownload || (() => {});
  const handleDelete = onDelete || (() => {});

  const [activeTab, setActiveTab] = useState('details');

  if (!report) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'processing': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'failed': return 'text-red-400 bg-red-900/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type) => {
    if (type.includes('Health & Fitness')) {
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    } else if (type.includes('Cardiac')) {
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    }
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const getMockReportData = (report) => {
    // Mock data for demonstration - in real implementation, this would come from the report
    return {
      summary: {
        totalPages: 12,
        generationTime: '2.3 seconds',
        templateVersion: 'v2.1.0',
        assessmentScore: report.type.includes('Health') ? '85/100' : '92/100'
      },
      sections: [
        {
          title: 'Executive Summary',
          content: 'This report provides a comprehensive analysis of the assessment results with detailed findings and recommendations.',
          status: 'completed'
        },
        {
          title: 'Data Analysis',
          content: 'Statistical analysis of collected metrics with trend identification and comparative benchmarks.',
          status: 'completed'
        },
        {
          title: 'Recommendations',
          content: 'Actionable recommendations based on assessment findings with prioritized implementation steps.',
          status: 'completed'
        }
      ],
      metadata: {
        'Report ID': report.id,
        'Session ID': report.sessionId,
        'Assessment Type': report.type,
        'Generated': formatDate(report.createdAt),
        'File Size': report.fileSize,
        'Status': report.status.toUpperCase()
      }
    };
  };

  const reportData = getMockReportData(report);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600 rounded-xl">
                {getTypeIcon(report.type)}
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-white">{report.type}</h2>
                <p className="text-gray-400">{report.sessionId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
              <button
                onClick={() => handleClose()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10">
          <div className="flex">
            {['details', 'metadata', 'preview'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(reportData.summary).map(([key, value]) => (
                  <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-white font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Report Sections</h3>
                {reportData.sections.map((section, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-medium text-white">{section.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        section.status === 'completed'
                          ? 'text-green-400 bg-green-900/20 border border-green-500/30'
                          : 'text-yellow-400 bg-yellow-900/20 border border-yellow-500/30'
                      }`}>
                        {section.status}
                      </span>
                    </div>
                    <p className="text-gray-300">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Report Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(reportData.metadata).map(([key, value]) => (
                  <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">{key}</p>
                    <p className="text-white font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Report Preview</h3>
              <div className="bg-white/5 rounded-lg p-8 border border-white/10 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10l.64 12.8a1 1 0 001 .8h.72a1 1 0 001-.8L21 4H7z" />
                </svg>
                <p className="text-gray-400 mb-4">PDF Preview</p>
                <p className="text-sm text-gray-500">
                  PDF preview functionality would be implemented here with a PDF viewer library
                </p>
                <button
                  onClick={() => handleDownload(report)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Download PDF Instead
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/20 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Generated on {formatDate(report.createdAt)}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleDownload(report)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
            <button
              onClick={() => handleDelete(report.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
