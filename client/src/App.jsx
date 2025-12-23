import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";

import Home from "./pages/Home.jsx";
import Journals from "./pages/Journals.jsx";
import JournalDetail from "./pages/JournalDetail.jsx";
import Articles from "./pages/Articles.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import SubmitWork from "./pages/SubmitWork.jsx";
import Admin from "./pages/Admin.jsx";
import MyWork from "./pages/MyWork.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/journals" element={<Journals />} />
            <Route path="/journals/:id" element={<JournalDetail />} />

            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />

            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />

            <Route path="/search" element={<SearchResults />} />

            {/* Writer / Editor only */}
            <Route element={<ProtectedRoute roles={["writer", "editor"]} />}>
              <Route path="/submit" element={<SubmitWork />} />
              <Route path="/my-work" element={<MyWork />} />
            </Route>

            {/* Admin only */}
            <Route element={<ProtectedRoute roles={["administrator"]} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </SearchProvider>
    </AuthProvider>
  );
}
