// Vercel API Route - Proxy to Railway backend
export default async function handler(req, res) {
  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  const BACKEND_URL = 'https://web-production-5b6ab.up.railway.app';
  const targetUrl = `${BACKEND_URL}/${apiPath}`;
  
  console.log('🔄 Proxying request:', {
    method: req.method,
    originalUrl: req.url,
    targetUrl: targetUrl,
    headers: req.headers
  });
  
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Prepare headers for backend request
    const headers = {
      'Content-Type': 'application/json',
      ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
    };
    
    // Make request to backend
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      ...(req.method !== 'GET' && req.method !== 'HEAD' && { 
        body: JSON.stringify(req.body) 
      })
    });
    
    const data = await response.text();
    
    console.log('✅ Backend response:', {
      status: response.status,
      statusText: response.statusText
    });
    
    // Forward response
    res.status(response.status);
    
    // Try to parse as JSON, fallback to text
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch {
      res.send(data);
    }
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy Error',
      message: error.message 
    });
  }
}
