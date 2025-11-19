import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Sun className={`h-4 w-4 ${isDark ? 'text-muted-foreground' : 'text-yellow-400'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={(val) => setTheme(val ? 'dark' : 'light')}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      />
      <Moon className={`h-4 w-4 ${isDark ? 'text-blue-200' : 'text-muted-foreground'}`} />
    </div>
  );
}
