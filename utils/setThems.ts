export const setTheme = (theme: string) => {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark-theme');
  } else {
    root.classList.remove('dark-theme');
  }
}
