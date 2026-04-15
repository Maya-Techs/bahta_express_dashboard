export function isLoggedIn() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('serviceatoken');
    return !!token; // true if token exists
  }
  return false;
}
