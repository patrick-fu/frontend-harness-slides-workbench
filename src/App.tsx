import {
  LanguageProvider,
  ReducedMotionProvider,
  ThemeProvider,
} from "./contexts";
import WorkbenchEnvelope from "./envelope/WorkbenchEnvelope";

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ReducedMotionProvider>
          <WorkbenchEnvelope />
        </ReducedMotionProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
