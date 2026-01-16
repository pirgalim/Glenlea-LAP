const themeToggle = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;
        const iconSun = document.querySelector('.icon-sun');
        const iconMoon = document.querySelector('.icon-moon');
        const siteLogo = document.getElementById('site-logo');

        function updateIcons(theme) {
            if (theme === 'dark') {
                iconSun.style.display = 'block';
                iconMoon.style.display = 'none';
                siteLogo.src = 'visuals/logo-dark.svg';
            } else {
                iconSun.style.display = 'none';
                iconMoon.style.display = 'block';
                siteLogo.src = 'visuals/logo.svg';
            }
        }

        // Check for saved user preference, if any, on load of the website
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            htmlElement.setAttribute('data-theme', savedTheme);
            updateIcons(savedTheme);
        } else {
            // Optional: Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                htmlElement.setAttribute('data-theme', 'dark');
                updateIcons('dark');
            } else {
                updateIcons('light');
            }
        }

        themeToggle.addEventListener('click', () => {
            if (htmlElement.getAttribute('data-theme') === 'dark') {
                htmlElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                updateIcons('light');
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateIcons('dark');
            }
        });