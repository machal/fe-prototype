import { Link } from 'react-router-dom';
import { Talk, Speaker, Topic } from '../types';
import './Card.css';

interface TalkCardProps {
  talk: Talk;
  speaker?: Speaker;
  topics: Topic[];
}

export default function TalkCard({ talk, speaker, topics }: TalkCardProps) {
  const levelStyles = {
    beginner: { backgroundColor: 'rgba(0, 0, 34, 0.05)', borderColor: 'rgba(0, 0, 34, 0.2)' },
    intermediate: { backgroundColor: 'rgba(0, 0, 34, 0.1)', borderColor: 'rgba(0, 0, 34, 0.4)' },
    advanced: { backgroundColor: 'rgba(0, 0, 34, 0.15)', borderColor: 'rgb(0, 0, 34)' },
  };

  const levelLabels = {
    beginner: 'Začátečník',
    intermediate: 'Pokročilý',
    advanced: 'Expert',
  };

  return (
    <div className="card talk-card">
      <div className="card-header">
        <h3 className="card-title">{talk.title}</h3>
        <span
          className="level-badge"
          style={levelStyles[talk.level]}
        >
          {levelLabels[talk.level]}
        </span>
      </div>
      <p className="card-description">{talk.description}</p>
      <div className="card-footer">
        <div className="card-meta">
          <span className="duration">{talk.duration} min</span>
          {speaker && (
            <Link to={`/speakers/${speaker.id}`} className="speaker-name" onClick={(e) => e.stopPropagation()}>
              {speaker.name}
            </Link>
          )}
        </div>
        <div className="topics">
          {topics.map(topic => (
            <Link
              key={topic.id}
              to={`/topics/${topic.id}`}
              className="topic-tag"
              onClick={(e) => e.stopPropagation()}
            >
              {topic.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

