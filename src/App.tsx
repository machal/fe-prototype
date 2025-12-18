import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { frontKonData } from './data';
import Home from './pages/Home';
import TalkDetail from './pages/TalkDetail';
import SpeakerDetail from './pages/SpeakerDetail';
import TopicDetail from './pages/TopicDetail';
import YearDetail from './pages/YearDetail';
import './App.css';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app">
      <header className="header">
        <Link to="/">
          <h1>FrontKon</h1>
        </Link>
        {!isHome && (
          <p className="subtitle">Databáze přednášek, speakerů a témat</p>
        )}
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/talks/:id" element={<TalkDetail />} />
        <Route path="/speakers/:id" element={<SpeakerDetail />} />
        <Route path="/topics/:id" element={<TopicDetail />} />
        <Route path="/years/:id" element={<YearDetail />} />
      </Routes>
    </div>
  );
}

export default App;
