import { useState, useEffect } from "react";
import "./App.css";

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

  // Scroll to top on page change
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
    <>
      <StarField />
      <Navbar current={page} navigate={navigate} />
      
      {/* Cambiamos <main> por un contenedor que use tus clases de centrado.
        '.page' asegura que el fondo sea oscuro/ancho y 
        '.page-inner' centra el contenido a 1200px.
      */}
      <main className="page">
        <div className="page-inner">
          {renderPage()}
        </div>
      </main>

      <Footer navigate={navigate} />
    </>
  );
}