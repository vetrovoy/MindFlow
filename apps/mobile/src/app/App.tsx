import { ThemeProvider } from "./providers/theme-provider";
import { HomeScreen } from "../pages/home";

export function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}
