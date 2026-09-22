import { Analytics } from "@vercel/analytics/react";
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
          <Analytics />
        </ReducedMotionProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
