import { useParams, Link } from 'react-router-dom';
import { frontKonData } from '../data';
import TalkCard from '../components/TalkCard';
import '../App.css';

export default function TalkDetail() {
  const { id } = useParams<{ id: string }>();
  const talk = frontKonData.talks.find(t => t.id === id);
  
  if (!talk) {
    return <div>Přednáška nenalezena</div>;
  }

  const speaker = frontKonData.speakers.find(s => s.id === talk.speakerId);
  const topics = frontKonData.topics.filter(t => talk.topicIds.includes(t.id));
  const year = frontKonData.years.find(y => y.id === talk.yearId);
  
  // Související přednášky - stejný speaker, topic nebo year
  const relatedTalks = frontKonData.talks
    .filter(t => 
      t.id !== talk.id && (
        t.speakerId === talk.speakerId ||
        t.topicIds.some(topicId => talk.topicIds.includes(topicId)) ||
        t.yearId === talk.yearId
      )
    )
    .slice(0, 6);

  const levelLabels = {
    beginner: 'Začátečník',
    intermediate: 'Pokročilý',
    advanced: 'Expert',
  };

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Zpět na seznam</Link>
      
      <div className="detail-header">
        <div className="detail-badge">
          {year && <Link to={`/years/${year.id}`} className="year-link">FrontKon {year.year}</Link>}
        </div>
        <h1>{talk.title}</h1>
        {speaker && (
          <p className="detail-speaker">
            <Link to={`/speakers/${speaker.id}`}>{speaker.name}</Link>
            {speaker.company && <span> • {speaker.company}</span>}
          </p>
        )}
      </div>

      {talk.youtubeId && (
        <div className="video-container">
          <div className="video-placeholder">
            <div className="video-placeholder-content">
              <div className="play-icon">▶</div>
              <p>YouTube Video</p>
            </div>
          </div>
        </div>
      )}

      <div className="detail-content">
        <div className="detail-main">
          <h2>Popis</h2>
          <p className="detail-description">{talk.description}</p>

          <div className="detail-info">
            <div className="info-item">
              <strong>Délka:</strong> {talk.duration} minut
            </div>
            <div className="info-item">
              <strong>Úroveň:</strong> {levelLabels[talk.level]}
            </div>
            <div className="info-item">
              <strong>Jazyk:</strong> {talk.language === 'cs' ? 'Čeština' : 'Angličtina'}
            </div>
            {year && (
              <div className="info-item">
                <strong>Ročník:</strong> <Link to={`/years/${year.id}`}>FrontKon {year.year}</Link>
              </div>
            )}
          </div>

          <div className="detail-topics">
            <h3>Témata</h3>
            <div className="topics">
              {topics.map(topic => (
                <Link key={topic.id} to={`/topics/${topic.id}`} className="topic-tag">
                  {topic.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {relatedTalks.length > 0 && (
        <div className="related-section">
          <h2>Související přednášky</h2>
          <div className="grid">
            {relatedTalks.map(relatedTalk => {
              const relatedSpeaker = frontKonData.speakers.find(s => s.id === relatedTalk.speakerId);
              const relatedTopics = frontKonData.topics.filter(t => relatedTalk.topicIds.includes(t.id));
              return (
                <Link key={relatedTalk.id} to={`/talks/${relatedTalk.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <TalkCard
                    talk={relatedTalk}
                    speaker={relatedSpeaker}
                    topics={relatedTopics}
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


