const { useState } = window.React;

function ReportGenerator() {
  // Make ReportGenerator component globally available
  window.ReportGenerator = ReportGenerator;

  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const sampleSessionIds = [
    { id: 'session_001', type: 'Health & Fitness Assessment', description: 'Comprehensive health evaluation' },
    { id: 'session_002', type: 'Cardiac Assessment', description: 'Cardiac health evaluation' },
  ];

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!sessionId) {
      setMessage('Please enter a session ID');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await reportService.generateReport(sessionId);

      if (response.success) {
        setMessage(`Report generated successfully! Download available at: ${response.downloadUrl}`);
        setMessageType('success');
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
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20">
        <div className="px-6 py-8 sm:p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">
              Generate Assessment Report
            </h3>
            <p className="text-gray-300">
              Create comprehensive PDF reports from your assessment data
            </p>
          </div>

          <div className="mb-8">
            <label htmlFor="sessionId" className="block text-sm font-medium text-gray-300 mb-3">
              Session ID
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

          <div className="mb-8">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Report...
                </div>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-900/20 border border-green-500 text-green-400'
                : 'bg-red-900/20 border border-red-500 text-red-400'
            }`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="mt-8">
            <h4 className="text-xl font-semibold text-white mb-6">Sample Session IDs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleSessionIds.map((sample) => (
                <div
                  key={sample.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 cursor-pointer transition-all transform hover:scale-105"
                  onClick={() => handleSampleClick(sample.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="text-lg font-medium text-white">{sample.type}</h5>
                      <p className="text-gray-300 mt-2">{sample.description}</p>
                      <p className="text-sm text-gray-400 mt-2 font-mono">{sample.id}</p>
                    </div>
                    <div className="ml-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSampleClick(sample.id);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h4 className="text-xl font-semibold text-white mb-4">How it works</h4>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li className="text-sm">Enter a valid session ID from your assessment data</li>
              <li className="text-sm">Click "Generate Report" to create a PDF report</li>
              <li className="text-sm">The system will process the data according to the assessment type configuration</li>
              <li className="text-sm">Download the generated PDF report from the provided link</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}


