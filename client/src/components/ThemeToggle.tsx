import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/components/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'switch';
  showLabel?: boolean;
}

export function ThemeToggle({ variant = 'button', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'switch') {
    return (
      <div className="flex items-center space-x-2">
        <Sun className="h-4 w-4" />
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
          aria-label="Toggle dark mode"
        />
        <Moon className="h-4 w-4" />
        {showLabel && (
          <span className="text-sm text-muted-foreground ml-2">
            {theme === 'dark' ? 'Dark' : 'Light'} mode
          </span>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-auto px-3"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" />
          {showLabel && <span className="ml-2">Light</span>}
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          {showLabel && <span className="ml-2">Dark</span>}
        </>
      )}
    </Button>
  );
}