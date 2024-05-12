type ThemeType = 'light' | 'dark';

export const useTheme = useState<ThemeType>('theme', () => 'light');
