const { useState } = window.React;

function Dashboard({ user, onLogout }) {
  // Make Dashboard component globally available
  window.Dashboard = Dashboard;

  const [currentView, setCurrentView] = useState('overview');
  const [selectedSession, setSelectedSession] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleViewChange = (view) => {
    setCurrentView(view);
    setSelectedSession(null);
    setReportGenerated(null);
    setSelectedReport(null);
  };

  const handleSessionSelect = (sessionId) => {
    setSelectedSession(sessionId);
  };

  const handleReportGenerated = (sessionId, reportData) => {
    setReportGenerated({ sessionId, ...reportData });
  };

  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };

  const handleReportClose = () => {
    setSelectedReport(null);
  };

  const handleReportDownload = (report) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = `http://localhost:3001${report.downloadUrl}`;
    link.download = `report_${report.sessionId}_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReportDelete = (reportId) => {
    // This would typically call an API to delete the report
    // For now, we'll just close the modal
    setSelectedReport(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <window.WelcomeSection user={user} />;
      case 'reports':
        return (
          <window.SessionSelector
            onSessionSelect={handleSessionSelect}
            onGenerateReport={handleReportGenerated}
          />
        );
      case 'reports-viewer':
        return (
          <div>
            <window.ReportsViewer
              onReportSelect={handleReportSelect}
            />
          </div>
        );
      case 'config-showcase':
        return (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Configuration Showcase</h3>
            <p className="text-gray-300">Configuration showcase will be implemented in Phase 4.</p>
          </div>
        );
      default:
        return <window.WelcomeSection user={user} />;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <window.Sidebar
            currentView={currentView}
            onViewChange={handleViewChange}
            user={user}
            onLogout={onLogout}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-8">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Report Card Modal */}
      {selectedReport && (
        <window.ReportCard
          report={selectedReport}
          onClose={handleReportClose}
          onDownload={handleReportDownload}
          onDelete={handleReportDelete}
        />
      )}
    </>
  );
}


