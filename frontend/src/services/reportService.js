// Use global axios loaded from CDN

const reportApi = axios.create({
  baseURL: window.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
reportApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Make reportService globally available
window.reportService = {
  async generateReport(sessionId) {
    const response = await reportApi.post('/reports/generate', { session_id: sessionId });
    return response.data;
  },

  async getReportStatus(sessionId) {
    const response = await reportApi.get(`/reports/status/${sessionId}`);
    return response.data;
  },

  async downloadReport(sessionId) {
    const response = await reportApi.get(`/reports/download/${sessionId}`, {
      responseType: 'blob',
    });
    return response;
  },
};
