import { Route, Routes } from "react-router-dom";
import BorrowerPage from "@/pages/BorrowerPage";
import LandingPage from "@/pages/LandingPage";
import LenderPage from "@/pages/LenderPage";
import PricingPage from "@/pages/PricingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/borrower" element={<BorrowerPage />} />
      <Route path="/lender" element={<LenderPage />} />
      <Route path="/pricing" element={<PricingPage />} />
    </Routes>
  );
}
