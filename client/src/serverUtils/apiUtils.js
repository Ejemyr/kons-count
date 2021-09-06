const serverUrl = process.env.REACT_APP_SERVER_URL;

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 500 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
        credentials: 'include',
    });
    clearTimeout(id);
  
    return response;
  }

export const getApi = async (endpoint, timeout) => {
    const response = await fetchWithTimeout(serverUrl + endpoint, { timeout: timeout });
    return await response.json();
}

export const postApi = async (endpoint, data, timeout) => {
    const response = await fetchWithTimeout(
        serverUrl + endpoint,
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: timeout
        }
    );
    return await response.json();
}
