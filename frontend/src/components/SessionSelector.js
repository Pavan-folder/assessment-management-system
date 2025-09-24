const { useState } = window.React;

function SessionSelector({ onSessionSelect, onGenerateReport }) {
  // Make SessionSelector component globally available
  window.SessionSelector = SessionSelector;

  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const sampleSessionIds = [
    {
      id: 'session_001',
      type: 'Health & Fitness Assessment',
      description: 'Comprehensive health evaluation with fitness metrics',
      category: 'Health & Fitness',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'session_002',
      type: 'Cardiac Assessment',
      description: 'Cardiac health evaluation with detailed analysis',
      category: 'Medical',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ];

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!sessionId) {
      setMessage('Please select or enter a session ID');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await window.reportService.generateReport(sessionId);

      if (response.success) {
        setMessage(`Report generated successfully! Download available at: ${response.downloadUrl}`);
        setMessageType('success');
        onGenerateReport && onGenerateReport(sessionId, response);
      } else {
        setMessage(response.message || 'Failed to generate report');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while generating the report');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sampleId) => {
    setSessionId(sampleId);
    setMessage('');
    onSessionSelect && onSessionSelect(sampleId);
  };

  const handleCustomSessionSubmit = (e) => {
    e.preventDefault();
    if (sessionId.trim()) {
      onSessionSelect && onSessionSelect(sessionId.trim());
      setMessage('');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Generate Assessment Report</h3>
        <p className="text-gray-300">
          Select a session ID or enter a custom one to generate a comprehensive PDF report
        </p>
      </div>

      {/* Custom Session ID Input */}
      <form onSubmit={handleCustomSessionSubmit} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="sessionId" className="block text-sm font-medium text-gray-300 mb-2">
              Custom Session ID
            </label>
            <input
              type="text"
              id="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter session ID (e.g., session_001)"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!sessionId.trim()}
            >
              Select
            </button>
          </div>
        </div>
      </form>

      {/* Generate Report Button */}
      {sessionId && (
        <div className="mb-8">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Report...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </>
            )}
          </button>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          messageType === 'success'
            ? 'bg-green-900/20 border border-green-500 text-green-400'
            : 'bg-red-900/20 border border-red-500 text-red-400'
        }`}>
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${
              messageType === 'success' ? 'text-green-400' : 'text-red-400'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {messageType === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
      )}

      {/* Sample Sessions */}
      <div>
        <h4 className="text-xl font-semibold text-white mb-6">Available Sessions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleSessionIds.map((sample) => (
            <div
              key={sample.id}
              className={`border rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${
                sessionId === sample.id
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => handleSampleClick(sample.id)}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${
                  sessionId === sample.id ? 'bg-blue-600' : 'bg-gray-700'
                }`}>
                  {sample.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-lg font-semibold text-white">{sample.type}</h5>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      {sample.category}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{sample.description}</p>
                  <div className="flex items-center justify-between">
                    <code className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded">
                      {sample.id}
                    </code>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSampleClick(sample.id);
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      {sessionId === sample.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">How it works</h4>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
          <li>Select an available session or enter a custom session ID</li>
          <li>Click "Generate Report" to create a PDF report</li>
          <li>The system processes data according to the assessment type configuration</li>
          <li>Download the generated PDF report from the provided link</li>
        </ol>
      </div>
    </div>
  );
}
