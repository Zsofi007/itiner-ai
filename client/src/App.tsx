import { Route, Routes, useLocation } from "react-router-dom";
import { SavedTripsDrawerProvider } from "@/context/SavedTripsDrawerContext";
import { useTheme } from "@/hooks/useTheme";
import { LandingPage } from "@/pages/LandingPage";
import { TripPage } from "@/pages/TripPage";

export default function App() {
  const location = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <SavedTripsDrawerProvider>
      <div key={location.pathname}>
        <Routes>
          <Route
            path="/"
            element={<LandingPage theme={theme} onToggleTheme={toggle} />}
          />
          <Route
            path="/trip"
            element={<TripPage theme={theme} onToggleTheme={toggle} />}
          />
        </Routes>
      </div>
    </SavedTripsDrawerProvider>
  );
}
