import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./i18n";
import AppHeader from "./shared/components/AppHeader";
import { Toaster } from "./shared/components/ui/sonner";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import Dashboard from "./pages/dashboard";
import TokenDetail from "./pages/token";

function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Toaster />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/token/:symbol" element={<TokenDetail />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
