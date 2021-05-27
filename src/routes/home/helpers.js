export const goToSignup = () => {
  window.location.href = `/signup${window.location.search}`;
};

export const goToLogin = () => {
  window.location.href = `/login${window.location.search}`;
}
