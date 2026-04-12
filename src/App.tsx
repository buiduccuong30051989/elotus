import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./i18n";
import Dashboard from "./pages/Dashboard";
import TokenDetail from "./pages/TokenDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/token/:symbol" element={<TokenDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
