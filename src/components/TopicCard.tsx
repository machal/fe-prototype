import { Topic } from '../types';
import './Card.css';

interface TopicCardProps {
  topic: Topic;
  talkCount: number;
}

export default function TopicCard({ topic, talkCount }: TopicCardProps) {
  return (
    <div className="card topic-card">
      <div className="topic-color-bar" />
      <h3 className="card-title">{topic.name}</h3>
      <p className="card-description">{topic.description}</p>
      <div className="card-footer">
        <span className="talk-count">{talkCount} přednášek</span>
      </div>
    </div>
  );
}

