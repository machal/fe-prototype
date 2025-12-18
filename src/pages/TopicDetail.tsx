import { useParams, Link } from 'react-router-dom';
import { frontKonData } from '../data';
import TalkCard from '../components/TalkCard';
import '../App.css';

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const topic = frontKonData.topics.find(t => t.id === id);
  
  if (!topic) {
    return <div>Téma nenalezeno</div>;
  }

  const talks = frontKonData.talks.filter(t => t.topicIds.includes(topic.id));

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Zpět na seznam</Link>
      
      <div className="detail-header">
        <h1>{topic.name}</h1>
        <p className="detail-description">{topic.description}</p>
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


