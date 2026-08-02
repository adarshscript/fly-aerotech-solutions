export const ADMIN_THEME_KEY = "fly-admin-theme";

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('${ADMIN_THEME_KEY}');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
