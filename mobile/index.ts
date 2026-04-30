import { registerRootComponent } from 'expo';
import { createElement, useEffect, useState, type ComponentType } from 'react';
import { View } from 'react-native';
import { loadThemePreference, applyPalette, theme } from './src/theme';

// Register the entry synchronously so AppRegistry finds it. The bootstrap
// component then loads the saved palette and dynamically imports `App`,
// ensuring screen modules evaluate AFTER `applyPalette` has mutated `theme`.
function Bootstrap() {
  const [App, setApp] = useState<ComponentType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const name = await loadThemePreference();
        if (name) applyPalette(name);
      } catch {
        // fall through with default palette
      }
      const mod = await import('./App');
      setApp(() => mod.default);
    })();
  }, []);

  if (!App) {
    return createElement(View, { style: { flex: 1, backgroundColor: theme.bg } });
  }
  return createElement(App);
}

registerRootComponent(Bootstrap);
