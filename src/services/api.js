export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const newToken = res.headers.get('x-new-token');
  if (newToken) {
    localStorage.setItem('token', newToken);
  }

  return res;
};


export const apiFetchFormData = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const newToken = res.headers.get('x-new-token');
  if (newToken) {
    localStorage.setItem('token', newToken);
  }

  return res;
};
