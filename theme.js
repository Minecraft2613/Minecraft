        const themePanel = document.getElementById('themePanel');
        const boxColorInput = document.getElementById('boxColor');
        const glowColorInput = document.getElementById('glowColor');
        const glowToggle = document.getElementById('glowToggle');
        const glowSpeedInput = document.getElementById('glowSpeed');
        const glowBrightnessInput = document.getElementById('glowBrightness');
        const bgThemeInput = document.getElementById('bgTheme');
        const textLightColorInput = document.getElementById('textLightColor');
        const accentGreenColorInput = document.getElementById('accentGreenColor');
        const accentBlueColorInput = document.getElementById('accentBlueColor');

        const root = document.documentElement;

        const defaultTheme = {
            '--box-color': '#0d0d0d',
            '--glow-color': 'transparent',
            '--glow-speed': '3s',
            '--glow-brightness': '0.6',
            '--bg-theme': 'linear-gradient(-45deg, #0a0a0a, #111111, #1a1a1a, #0d0d0d)',
            '--text-light': '#e0e0e0',
            '--accent-green': '#00ffcc',
            '--accent-blue': '#42a5f5'
        };

        function applyTheme(theme) {
            for (const key in theme) {
                root.style.setProperty(key, theme[key]);
            }
            // Update input values to reflect the current theme
            boxColorInput.value = theme['--box-color'];
            glowColorInput.value = theme['--glow-color'];
            glowToggle.checked = theme['--glow-color'] !== 'transparent';
            glowSpeedInput.value = parseFloat(theme['--glow-speed']);
            glowBrightnessInput.value = theme['--glow-brightness'];
            bgThemeInput.value = theme['--bg-theme'];
            textLightColorInput.value = theme['--text-light'];
            accentGreenColorInput.value = theme['--accent-green'];
            accentBlueColorInput.value = theme['--accent-blue'];
        }

        export function saveTheme() {
            const currentTheme = {
                '--box-color': boxColorInput.value,
                '--glow-color': glowToggle.checked ? glowColorInput.value : 'transparent',
                '--glow-speed': `${glowSpeedInput.value}s`,
                '--glow-brightness': glowBrightnessInput.value,
                '--bg-theme': bgThemeInput.value,
                '--text-light': textLightColorInput.value,
                '--accent-green': accentGreenColorInput.value,
                '--accent-blue': accentBlueColorInput.value
            };
            localStorage.setItem('customTheme', JSON.stringify(currentTheme));
            applyTheme(currentTheme);
        }

        export function resetTheme() {
            localStorage.removeItem('customTheme');
            applyTheme(defaultTheme);
        }

        export function loadTheme() {
            const savedTheme = localStorage.getItem('customTheme');
            if (savedTheme) {
                applyTheme(JSON.parse(savedTheme));
            } else {
                applyTheme(defaultTheme);
            }
        }
