import { useState, useEffect } from "react";
import "./App.css";

// Auth
import { AuthProvider } from "./Context/AuthContext";

// Pages
import Hero     from "./Pages/Hero";
import Flota    from "./Pages/Flota";
import Contacto from "./Pages/Contacto";

// Components
import Navbar    from "./Components/Navbar";
import Footer    from "./Components/Footer";
import StarField from "./Components/StarField";

export default function App() {
  const [page, setPage] = useState("hero");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const navigate = (target) => setPage(target);

  const renderPage = () => {
    switch (page) {
      case "hero":     return <Hero     navigate={navigate} />;
      case "flota":    return <Flota    navigate={navigate} />;
      case "contacto": return <Contacto navigate={navigate} />;
      default:         return <Hero     navigate={navigate} />;
    }
  };

  return (
    // 🔑 AuthProvider envuelve TODO para que cualquier componente acceda al login
    <AuthProvider>
      <StarField />
      <Navbar current={page} navigate={navigate} />
      <main className="page">
        <div className="page-inner">
          {renderPage()}
        </div>
      </main>
      <Footer navigate={navigate} />
    </AuthProvider>
  );
}