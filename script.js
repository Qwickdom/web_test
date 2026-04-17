const repoGrid = document.getElementById('repoGrid');
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const THEME_KEY = 'preferredTheme';

const buildRepoCard = (repo) => {
  const card = document.createElement('article');
  card.className = 'repo-card';

  const title = document.createElement('h4');
  title.textContent = repo.name;
  card.appendChild(title);

  const description = document.createElement('p');
  description.textContent = repo.description || 'Sin descripción disponible.';
  card.appendChild(description);

  return card;
};

const loadRepos = async () => {
  try {
    const response = await fetch('https://api.github.com/users/qwickdom/repos?per_page=100&sort=updated');
    if (!response.ok) throw new Error('No se pudieron cargar los repositorios.');
    const repos = await response.json();
    repoGrid.innerHTML = '';
    repos.forEach(repo => repoGrid.appendChild(buildRepoCard(repo)));
  } catch (error) {
    repoGrid.innerHTML = '<div class="repo-card"><p>Error al cargar el dashboard. Intenta recargar la página.</p></div>';
    console.error(error);
  }
};

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
  localStorage.setItem(THEME_KEY, theme);
};

const initTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
};

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

initTheme();
loadRepos();
