const API = "https://3f078002-9b33-4178-83a2-fae9323238c7-00-8j76jo1ho9z7.spock.replit.dev/"; // ← ton URL Replit

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  return res.json();
}
