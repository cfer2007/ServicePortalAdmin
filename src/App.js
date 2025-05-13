import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SkillList from './controllers/SkillList';
import NewProfessional from './controllers/NewProfessional';
import ProfessionList from './controllers/ProfessionList';
import ProfessionalList from './controllers/ProfessionalList';

const Home = () => <h2>🏠 Bienvenido a la aplicación</h2>;
const About = () => <h2>ℹ️ Acerca de esta aplicación</h2>;

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/profession">Profesiones</Link></li>
            <li><Link to="/skill">Habilidades</Link></li>
            <li><Link to="/professional">Profesionales</Link></li>            
            <li><Link to="/about">Acerca de</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profession" element={<ProfessionList />} />
          <Route path="/skill" element={<SkillList />} />
          <Route path="/professional" element={<ProfessionalList />} />
          <Route path="/newProfessional/:id" element={<NewProfessional />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
