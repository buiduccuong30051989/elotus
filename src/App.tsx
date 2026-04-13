import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./i18n";
import AppHeader from "./shared/components/AppHeader";
import { Toaster } from "./shared/components/ui/sonner";
import Dashboard from "./pages/dashboard";
import TokenDetail from "./pages/token";

function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Toaster />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/token/:symbol" element={<TokenDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
