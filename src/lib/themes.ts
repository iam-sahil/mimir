import { Theme, ThemeConfig } from "@/types";

// Define theme configurations with their properties
export const themes: Record<Theme, ThemeConfig> = {
  // Light Themes
  "light-pink": {
    name: "Light with Pink Accent",
    theme: "light",
    colors: {
      background: "0 0% 100%",
      foreground: "240 10% 3.9%",
      card: "0 0% 100%",
      "card-foreground": "240 10% 3.9%",
      popover: "0 0% 100%",
      "popover-foreground": "240 10% 3.9%",
      primary: "336 80% 58%", // Pink accent
      "primary-foreground": "0 0% 100%",
      secondary: "240 4.8% 95.9%",
      "secondary-foreground": "240 5.9% 10%",
      muted: "240 4.8% 95.9%",
      "muted-foreground": "240 3.8% 46.1%",
      accent: "336 80% 95%", // Light pink accent background
      "accent-foreground": "336 80% 58%",
      destructive: "0 84.2% 60.2%",
      "destructive-foreground": "0 0% 98%",
      border: "240 5.9% 90%",
      input: "240 5.9% 90%",
      ring: "336 80% 58%",
      sidebar: "0 0% 98%",
      "sidebar-foreground": "240 10% 3.9%",
      "sidebar-border": "240 5.9% 90%",
    },
  },
  "light-green": {
    name: "Light with Green Accent",
    theme: "light",
    colors: {
      background: "0 0% 100%",
      foreground: "240 10% 3.9%",
      card: "0 0% 100%",
      "card-foreground": "240 10% 3.9%",
      popover: "0 0% 100%",
      "popover-foreground": "240 10% 3.9%",
      primary: "142 70% 45%", // Green accent
      "primary-foreground": "0 0% 100%",
      secondary: "240 4.8% 95.9%",
      "secondary-foreground": "240 5.9% 10%",
      muted: "240 4.8% 95.9%",
      "muted-foreground": "240 3.8% 46.1%",
      accent: "142 50% 95%", // Light green accent background
      "accent-foreground": "142 70% 45%",
      destructive: "0 84.2% 60.2%",
      "destructive-foreground": "0 0% 98%",
      border: "240 5.9% 90%",
      input: "240 5.9% 90%",
      ring: "142 70% 45%",
      sidebar: "0 0% 98%",
      "sidebar-foreground": "240 10% 3.9%",
      "sidebar-border": "240 5.9% 90%",
    },
  },
  // Dark Themes
  "dark-pink": {
    name: "Dark with Pink Accent",
    theme: "dark",
    colors: {
      background: "240 10% 4%",
      foreground: "0 0% 98%",
      card: "240 10% 4%",
      "card-foreground": "0 0% 98%",
      popover: "240 10% 4%",
      "popover-foreground": "0 0% 98%",
      primary: "336 80% 65%", // Pink accent
      "primary-foreground": "0 0% 98%",
      secondary: "240 3.7% 15.9%",
      "secondary-foreground": "0 0% 98%",
      muted: "240 3.7% 15.9%",
      "muted-foreground": "240 5% 64.9%",
      accent: "336 50% 25%", // Dark pink accent background
      "accent-foreground": "0 0% 98%",
      destructive: "0 62.8% 30.6%",
      "destructive-foreground": "0 0% 98%",
      border: "240 3.7% 15.9%",
      input: "240 3.7% 15.9%",
      ring: "336 80% 65%",
      sidebar: "240 10% 7%",
      "sidebar-foreground": "0 0% 98%",
      "sidebar-border": "240 3.7% 15.9%",
    },
  },
  "dark-green": {
    name: "Dark with Green Accent",
    theme: "dark",
    colors: {
      background: "240 10% 4%",
      foreground: "0 0% 98%",
      card: "240 10% 4%",
      "card-foreground": "0 0% 98%",
      popover: "240 10% 4%",
      "popover-foreground": "0 0% 98%",
      primary: "142 70% 45%", // Green accent
      "primary-foreground": "0 0% 98%",
      secondary: "240 3.7% 15.9%",
      "secondary-foreground": "0 0% 98%",
      muted: "240 3.7% 15.9%",
      "muted-foreground": "240 5% 64.9%",
      accent: "142 40% 20%", // Dark green accent background
      "accent-foreground": "0 0% 98%",
      destructive: "0 62.8% 30.6%",
      "destructive-foreground": "0 0% 98%",
      border: "240 3.7% 15.9%",
      input: "240 3.7% 15.9%",
      ring: "142 70% 45%",
      sidebar: "240 10% 7%",
      "sidebar-foreground": "0 0% 98%",
      "sidebar-border": "240 3.7% 15.9%",
    },
  },
  "github-light": {
    name: "GitHub Light",
    theme: "light",
    colors: {
      background: "0 0% 100%",
      foreground: "212 12% 16%",
      card: "0 0% 100%",
      "card-foreground": "212 12% 16%",
      popover: "0 0% 100%",
      "popover-foreground": "212 12% 16%",
      primary: "212 92% 45%", // Blue
      "primary-foreground": "0 0% 100%",
      secondary: "210 33% 96%",
      "secondary-foreground": "212 12% 16%",
      muted: "210 33% 96%",
      "muted-foreground": "215 8% 47%",
      accent: "206 92% 90%", // Lighter blue
      "accent-foreground": "212 12% 16%",
      destructive: "0 80% 63%",
      "destructive-foreground": "210 33% 99%",
      border: "214 32% 91%",
      input: "214 32% 91%",
      ring: "212 92% 45%",
      sidebar: "210 33% 98%",
      "sidebar-foreground": "212 12% 16%",
      "sidebar-border": "214 32% 91%",
    },
  },
  "github-dark": {
    name: "GitHub Dark",
    theme: "dark",
    colors: {
      background: "220 13% 18%",
      foreground: "210 17% 82%",
      card: "220 13% 18%",
      "card-foreground": "210 17% 82%",
      popover: "220 13% 18%",
      "popover-foreground": "210 17% 82%",
      primary: "212 92% 45%", // Blue
      "primary-foreground": "0 0% 100%",
      secondary: "220 14% 22%",
      "secondary-foreground": "210 17% 82%",
      muted: "220 14% 22%",
      "muted-foreground": "215 16% 56%",
      accent: "213 50% 25%", // Darker blue
      "accent-foreground": "210 17% 82%",
      destructive: "0 80% 50%",
      "destructive-foreground": "210 17% 82%",
      border: "220 14% 22%",
      input: "220 14% 22%",
      ring: "212 92% 45%",
      sidebar: "222 14% 15%",
      "sidebar-foreground": "210 17% 82%",
      "sidebar-border": "220 14% 22%",
    },
  },
  "catppuccin": {
    name: "Catppuccin Mocha",
    theme: "dark",
    colors: {
      background: "240 21% 15%",
      foreground: "226 64% 88%",
      card: "240 21% 15%",
      "card-foreground": "226 64% 88%",
      popover: "240 21% 15%",
      "popover-foreground": "226 64% 88%",
      primary: "267 84% 81%", // Mauve
      "primary-foreground": "240 21% 15%",
      secondary: "240 21% 22%",
      "secondary-foreground": "226 64% 88%",
      muted: "240 21% 22%",
      "muted-foreground": "228 24% 72%",
      accent: "267 50% 30%", // Darker mauve
      "accent-foreground": "226 64% 88%",
      destructive: "343 81% 75%", // Red
      "destructive-foreground": "240 21% 15%",
      border: "240 21% 22%",
      input: "240 21% 22%",
      ring: "267 84% 81%",
      sidebar: "240 22% 14%",
      "sidebar-foreground": "226 64% 88%",
      "sidebar-border": "240 21% 22%",
    },
  },
  "tokyo-night": {
    name: "Tokyo Night",
    theme: "dark",
    colors: {
      background: "230 26% 12%",
      foreground: "230 20% 80%",
      card: "230 26% 12%",
      "card-foreground": "230 20% 80%",
      popover: "230 26% 12%",
      "popover-foreground": "230 20% 80%",
      primary: "265 89% 78%", // Purple
      "primary-foreground": "230 20% 98%",
      secondary: "227 27% 18%", 
      "secondary-foreground": "230 20% 80%",
      muted: "227 27% 18%",
      "muted-foreground": "220 15% 60%",
      accent: "217 92% 76%", // Blue
      "accent-foreground": "230 20% 98%",
      destructive: "0 63% 60%",
      "destructive-foreground": "230 20% 98%",
      border: "227 27% 20%",
      input: "227 27% 20%",
      ring: "265 89% 78%",
      sidebar: "230 28% 10%",
      "sidebar-foreground": "230 20% 80%",
      "sidebar-border": "227 27% 20%",
    },
  },
  "nord": {
    name: "Nord",
    theme: "dark",
    colors: {
      background: "220 16% 22%",
      foreground: "218 27% 92%",
      card: "220 16% 22%",
      "card-foreground": "218 27% 92%",
      popover: "220 16% 22%",
      "popover-foreground": "218 27% 92%",
      primary: "210 34% 63%", // Blue
      "primary-foreground": "220 16% 22%",
      secondary: "220 16% 28%",
      "secondary-foreground": "218 27% 92%",
      muted: "220 16% 28%",
      "muted-foreground": "220 16% 65%",
      accent: "213 32% 52%", // Deep blue accent
      "accent-foreground": "218 27% 92%",
      destructive: "354 42% 56%",
      "destructive-foreground": "218 27% 92%",
      border: "220 16% 28%",
      input: "220 16% 28%",
      ring: "210 34% 63%",
      sidebar: "220 16% 19%",
      "sidebar-foreground": "218 27% 92%",
      "sidebar-border": "220 16% 28%",
    },
  },
  "gruvbox": {
    name: "Gruvbox Hard",
    theme: "dark",
    colors: {
      background: "50 11% 10%", // Darker background
      foreground: "50 13% 80%",
      card: "50 11% 14%",
      "card-foreground": "50 13% 80%",
      popover: "50 11% 10%",
      "popover-foreground": "50 13% 80%",
      primary: "42 85% 57%", // Yellow accent
      "primary-foreground": "50 11% 10%",
      secondary: "50 11% 18%",
      "secondary-foreground": "50 13% 80%",
      muted: "50 11% 18%",
      "muted-foreground": "50 13% 60%",
      accent: "42 40% 30%", // Darker yellow
      "accent-foreground": "50 13% 80%",
      destructive: "0 65% 45%",
      "destructive-foreground": "0 0% 98%",
      border: "50 11% 18%",
      input: "50 11% 18%",
      ring: "42 85% 57%",
      sidebar: "50 11% 8%",
      "sidebar-foreground": "50 13% 80%",
      "sidebar-border": "50 11% 18%",
    },
  },
  "one-dark": {
    name: "One Dark",
    theme: "dark",
    colors: {
      background: "220 13% 18%",
      foreground: "220 14% 71%",
      card: "220 13% 18%",
      "card-foreground": "220 14% 71%",
      popover: "220 13% 18%",
      "popover-foreground": "220 14% 71%",
      primary: "207 82% 66%", // Blue
      "primary-foreground": "0 0% 98%",
      secondary: "220 13% 22%",
      "secondary-foreground": "220 14% 71%",
      muted: "220 13% 22%",
      "muted-foreground": "220 10% 55%",
      accent: "219 56% 55%", // Lighter blue
      "accent-foreground": "0 0% 98%",
      destructive: "0 70% 50%",
      "destructive-foreground": "0 0% 98%",
      border: "220 13% 22%",
      input: "220 13% 22%",
      ring: "207 82% 66%",
      sidebar: "220 13% 15%",
      "sidebar-foreground": "220 14% 71%",
      "sidebar-border": "220 13% 22%",
    },
  },
  "dracula": {
    name: "Dracula",
    theme: "dark",
    colors: {
      background: "231 15% 18%",
      foreground: "60 30% 96%",
      card: "232 14% 18%",
      "card-foreground": "60 30% 96%",
      popover: "232 14% 18%",
      "popover-foreground": "60 30% 96%",
      primary: "265 89% 78%", // Purple
      "primary-foreground": "60 30% 96%",
      secondary: "232 14% 24%",
      "secondary-foreground": "60 30% 96%",
      muted: "232 14% 24%",
      "muted-foreground": "60 30% 60%",
      accent: "291 56% 65%", // Pink
      "accent-foreground": "60 30% 96%",
      destructive: "347 87% 72%",
      "destructive-foreground": "60 30% 96%",
      border: "232 14% 24%",
      input: "232 14% 24%",
      ring: "265 89% 78%",
      sidebar: "232 14% 15%",
      "sidebar-foreground": "60 30% 96%",
      "sidebar-border": "232 14% 24%",
    },
  },
  // New themes
  "ayu": {
    name: "Ayu",
    theme: "light",
    colors: {
      background: "220 20% 95%",  // Very light gray
      foreground: "220 10% 30%",  // Darker gray-blue
      card: "220 20% 98%",
      "card-foreground": "220 10% 30%",
      popover: "220 20% 98%",
      "popover-foreground": "220 10% 30%",
      primary: "180 50% 40%",    // Teal
      "primary-foreground": "0 0% 100%",
      secondary: "220 15% 90%",
      "secondary-foreground": "220 10% 30%",
      muted: "220 15% 90%",
      "muted-foreground": "220 8% 45%", // Enhanced contrast from 50% to 45%
      accent: "40 80% 60%",     // Yellow-orange
      "accent-foreground": "220 10% 20%", // Enhanced contrast from 30% to 20%
      destructive: "0 60% 50%",
      "destructive-foreground": "0 0% 100%",
      border: "220 10% 85%",
      input: "220 10% 85%",
      ring: "180 50% 40%",
      sidebar:  "220 15% 93%",
      "sidebar-foreground": "220 10% 30%",
      "sidebar-border": "220 10% 85%"
    }
  },
  
  "cyberpunk-2077": {
    name: "Cyberpunk 2077",
    theme: "dark",
    colors: {
      background: "232 15% 15%",    // Slightly lighter background for better contrast
      foreground: "55 100% 85%",    // Brighter yellowish text for better readability
      card: "232 15% 18%",
      "card-foreground": "55 100% 85%",
      popover: "232 15% 18%",
      "popover-foreground": "55 100% 85%",
      primary: "55 100% 55%",    // Vibrant neon yellow
      "primary-foreground": "0 0% 0%",
      secondary: "232 20% 22%",
      "secondary-foreground": "55 100% 85%",
      muted: "232 20% 22%",
      "muted-foreground": "55 80% 70%", 
      accent: "330 100% 60%",   // Bright hot pink/red
      "accent-foreground": "330 100% 90%",
      destructive: "0 100% 60%",
      "destructive-foreground": "0 0% 0%",
      border: "232 20% 25%",
      input: "232 20% 25%",
      ring: "55 100% 55%",
      sidebar: "232 15% 12%",   // Slightly darker sidebar
      "sidebar-foreground": "55 100% 85%",
      "sidebar-border": "232 20% 25%"
    }
  },
  
  "synthwave-84": {
    name: "Synthwave '84",
    theme: "dark",
    colors: {
      background: "250 15% 10%",   // Dark purple
      foreground: "0 0% 90%",    // Lighter gray for better contrast
      card: "250 15% 13%",
      "card-foreground": "0 0% 90%",
      popover: "250 15% 13%",
      "popover-foreground": "0 0% 90%",
      primary: "300 90% 65%",   // Brightened Neon Pink for better contrast
      "primary-foreground": "0 0% 0%",
      secondary: "250 10% 20%",
      "secondary-foreground": "0 0% 90%",
      muted: "250 10% 20%",
      "muted-foreground": "250 5% 70%", // Enhanced contrast from 60% to 70%
      accent: "210 90% 60%",   // Brightened Electric Blue for better contrast
      "accent-foreground": "210 90% 100%",
      destructive: "0 90% 60%", // Brightened red for better contrast
      "destructive-foreground": "0 0% 0%",
      border: "250 10% 25%",
      input: "250 10% 25%",
      ring: "300 90% 65%",
      sidebar: "250 15% 15%",
      "sidebar-foreground": "0 0% 90%",
      "sidebar-border": "250 10% 25%"
    }
  },
  
  "neon-synthwave": {
    name: "Neon Synthwave",
    theme: "dark",
    colors: {
      background: "265 25% 15%",   // Rich dark purple background
      foreground: "0 0% 95%",      // Almost white text
      card: "265 25% 18%",
      "card-foreground": "0 0% 95%",
      popover: "265 25% 18%",
      "popover-foreground": "0 0% 95%",
      primary: "320 100% 65%",     // Hot neon pink
      "primary-foreground": "0 0% 0%",
      secondary: "265 25% 25%",
      "secondary-foreground": "0 0% 95%",
      muted: "265 25% 25%",
      "muted-foreground": "320 15% 80%",
      accent: "200 100% 60%",      // Bright cyan/blue
      "accent-foreground": "200 100% 100%",
      destructive: "350 100% 60%",
      "destructive-foreground": "0 0% 0%",
      border: "265 25% 30%",
      input: "265 25% 30%",
      ring: "320 100% 65%",
      sidebar: "265 30% 12%",      // Darker purple sidebar
      "sidebar-foreground": "0 0% 95%",
      "sidebar-border": "265 25% 30%"
    }
  },
  
  "panda": {
    name: "Panda Theme",
    theme: "dark",
    colors: {
      background: "270 10% 12%",   // Dark purple/gray
      foreground: "60 10% 85%",    // Lightened yellowish gray for better contrast
      card: "270 10% 15%",
      "card-foreground": "60 10% 85%",
      popover: "270 10% 15%",
      "popover-foreground": "60 10% 85%",
      primary: "200 70% 55%",   // Brightened Teal/Cyan for better contrast
      "primary-foreground": "0 0% 100%",
      secondary: "270 5% 20%",
      "secondary-foreground": "60 10% 85%",
      muted: "270 5% 20%",
      "muted-foreground": "270 3% 65%", // Enhanced contrast from 55% to 65%
      accent: "30 60% 55%",    // Brightened Orange for better contrast
      "accent-foreground": "0 0% 100%",
      destructive: "0 70% 55%", // Brightened red for better contrast
      "destructive-foreground": "0 0% 100%",
      border: "270 5% 25%",
      input: "270 5% 25%",
      ring: "200 70% 55%",
      sidebar: "270 10% 10%",
      "sidebar-foreground": "60 10% 85%",
      "sidebar-border": "270 5% 25%"
    }
  },
  
  "atom-one-dark": {
    name: "Atom One Dark",
    theme: "dark",
    colors: {
      background: "220 13% 18%",   // Dark gray
      foreground: "220 14% 80%",    // Lightened medium gray for better contrast
      card: "220 13% 21%",
      "card-foreground": "220 14% 80%",
      popover: "220 13% 21%",
      "popover-foreground": "220 14% 80%",
      primary: "207 82% 70%",   // Brightened Blue for better contrast
      "primary-foreground": "0 0% 98%",
      secondary: "220 13% 22%",
      "secondary-foreground": "220 14% 80%",
      muted: "220 13% 22%",
      "muted-foreground": "220 10% 65%", // Enhanced contrast from 55% to 65%
      accent: "219 56% 60%",    // Brightened lighter blue for better contrast
      "accent-foreground": "0 0% 98%",
      destructive: "0 70% 55%", // Brightened red for better contrast
      "destructive-foreground": "0 0% 98%",
      border: "220 13% 22%",
      input: "220 13% 22%",
      ring: "207 82% 70%",
      sidebar: "220 13% 15%",
      "sidebar-foreground": "220 14% 80%",
      "sidebar-border": "220 13% 22%"
    }
  },
  
  "frosted-glass": {
    name: "Frosted Glass",
    theme: "light",
    colors: {
      background: "180 20% 97%",    // Very light cyan/gray
      foreground: "240 10% 30%",    // Darkened medium gray-blue for better contrast
      card: "180 15% 95%",
      "card-foreground": "240 10% 30%",
      popover: "180 15% 95%",
      "popover-foreground": "240 10% 30%",
      primary: "210 50% 45%",    // Slightly darker soft blue for better contrast
      "primary-foreground": "0 0% 100%",
      secondary: "180 10% 90%",
      "secondary-foreground": "240 10% 30%",
      muted: "180 10% 90%",
      "muted-foreground": "240 5% 45%", // Enhanced contrast from 50% to 45%
      accent: "30 30% 65%",     // Darkened light orange/peach for better contrast
      "accent-foreground": "240 10% 30%",
      destructive: "0 60% 45%", // Slightly darker red for better contrast
      "destructive-foreground": "0 0% 100%",
      border: "180 5% 85%",
      input: "180 5% 85%",
      ring: "210 50% 45%",
      sidebar: "180 10% 93%",
      "sidebar-foreground": "240 10% 30%",
      "sidebar-border": "180 5% 85%"
    }
  },
};

// A function to get CSS variables for a theme
export function getThemeVariables(theme: Theme) {
  const themeConfig = themes[theme];
  
  return Object.entries(themeConfig.colors).reduce((vars, [key, value]) => {
    vars[`--${key}`] = value;
    return vars;
  }, {} as Record<string, string>);
}
