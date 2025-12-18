import { useParams, Link } from 'react-router-dom';
import { frontKonData } from '../data';
import TalkCard from '../components/TalkCard';
import '../App.css';

export default function YearDetail() {
  const { id } = useParams<{ id: string }>();
  const year = frontKonData.years.find(y => y.id === id);
  
  if (!year) {
    return <div>Ročník nenalezen</div>;
  }

  const talks = frontKonData.talks.filter(t => t.yearId === year.id);

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Zpět na seznam</Link>
      
      <div className="detail-header">
        <h1>FrontKon {year.year}</h1>
        {year.location && <p className="detail-company">{year.location}</p>}
        {year.date && <p className="detail-description">{year.date}</p>}
      </div>

      {talks.length > 0 && (
        <div className="related-section">
          <h2>Přednášky ({talks.length})</h2>
          <div className="grid">
            {talks.map(talk => {
              const speaker = frontKonData.speakers.find(s => s.id === talk.speakerId);
              const topics = frontKonData.topics.filter(t => talk.topicIds.includes(t.id));
              return (
                <Link key={talk.id} to={`/talks/${talk.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <TalkCard
                    talk={talk}
                    speaker={speaker}
                    topics={topics}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


