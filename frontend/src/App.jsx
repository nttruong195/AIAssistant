import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import CompoundInterestPage from './pages/CompoundInterestPage'
import LoanPage from './pages/LoanPage'
import SalaryPage from './pages/SalaryPage'
import SavingsPage from './pages/SavingsPage'
import GoalPlannerPage from './pages/GoalPlannerPage'
import RentVsBuyPage from './pages/RentVsBuyPage'
import RoiPage from './pages/RoiPage'
import InsurancePage from './pages/InsurancePage'
import BudgetPage from './pages/BudgetPage'
import TaxInvestmentPage from './pages/TaxInvestmentPage'
import FirePage from './pages/FirePage'
import BreakevenPage from './pages/BreakevenPage'
import InflationPage from './pages/InflationPage'
import CvAnalyzerPage from './pages/CvAnalyzerPage'
import CoverLetterPage from './pages/CoverLetterPage'
import EmailPage from './pages/EmailPage'
import JdPage from './pages/JdPage'
import LinkedInPage from './pages/LinkedInPage'
import SalaryNegotiationPage from './pages/SalaryNegotiationPage'
import InterviewPrepPage from './pages/InterviewPrepPage'
import PerformanceReviewPage from './pages/PerformanceReviewPage'
import ContractSummaryPage from './pages/ContractSummaryPage'
import ContactPage from './pages/ContactPage'
import ShopAgentPage from './pages/ShopAgentPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                   element={<CompoundInterestPage />} />
          <Route path="/home-loan"          element={<LoanPage type="home" />} />
          <Route path="/car-loan"           element={<LoanPage type="car" />} />
          <Route path="/salary"             element={<SalaryPage />} />
          <Route path="/savings"            element={<SavingsPage />} />
          <Route path="/goal-planner"       element={<GoalPlannerPage />} />
          <Route path="/rent-vs-buy"        element={<RentVsBuyPage />} />
          <Route path="/roi"                element={<RoiPage />} />
          <Route path="/insurance"          element={<InsurancePage />} />
          <Route path="/budget"             element={<BudgetPage />} />
          <Route path="/tax-investment"     element={<TaxInvestmentPage />} />
          <Route path="/fire"               element={<FirePage />} />
          <Route path="/breakeven"          element={<BreakevenPage />} />
          <Route path="/inflation"          element={<InflationPage />} />
          <Route path="/cv-analyzer"        element={<CvAnalyzerPage />} />
          <Route path="/cover-letter"       element={<CoverLetterPage />} />
          <Route path="/email"              element={<EmailPage />} />
          <Route path="/jd"                 element={<JdPage />} />
          <Route path="/linkedin"           element={<LinkedInPage />} />
          <Route path="/salary-negotiation" element={<SalaryNegotiationPage />} />
          <Route path="/interview-prep"     element={<InterviewPrepPage />} />
          <Route path="/performance-review" element={<PerformanceReviewPage />} />
          <Route path="/contract-summary"   element={<ContractSummaryPage />} />
          <Route path="/contact"            element={<ContactPage />} />
          <Route path="/shop"               element={<ShopAgentPage />} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-gray-300 py-8 mt-8 border-t border-gray-100">
        <span className="font-semibold text-gray-400">CareerAI</span> &nbsp;·&nbsp; Công cụ tham khảo, không phải tư vấn chuyên nghiệp
      </footer>
    </div>
  )
}
