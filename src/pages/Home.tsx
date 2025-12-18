import { useState } from 'react';
import { Link } from 'react-router-dom';
import { frontKonData } from '../data';
import TalkCard from '../components/TalkCard';
import SpeakerCard from '../components/SpeakerCard';
import TopicCard from '../components/TopicCard';
import YearCard from '../components/YearCard';
import '../App.css';

type View = 'talks' | 'speakers' | 'topics' | 'years';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('talks');

  const getSpeakerById = (id: string) => {
    return frontKonData.speakers.find(s => s.id === id);
  };

  const getTopicsByIds = (ids: string[]) => {
    return frontKonData.topics.filter(t => ids.includes(t.id));
  };

  return (
    <>
      <nav className="nav">
        <button
          className={`nav-button ${currentView === 'talks' ? 'active' : ''}`}
          onClick={() => setCurrentView('talks')}
        >
          Přednášky
        </button>
        <button
          className={`nav-button ${currentView === 'speakers' ? 'active' : ''}`}
          onClick={() => setCurrentView('speakers')}
        >
          Speakři
        </button>
        <button
          className={`nav-button ${currentView === 'topics' ? 'active' : ''}`}
          onClick={() => setCurrentView('topics')}
        >
          Témata
        </button>
        <button
          className={`nav-button ${currentView === 'years' ? 'active' : ''}`}
          onClick={() => setCurrentView('years')}
        >
          Ročníky
        </button>
      </nav>

      <main className="main">
        {currentView === 'talks' && (
          <div className="grid">
            {frontKonData.talks.map(talk => {
              const speaker = getSpeakerById(talk.speakerId);
              const topics = getTopicsByIds(talk.topicIds);
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
        )}

        {currentView === 'speakers' && (
          <div className="grid">
            {frontKonData.speakers.map(speaker => {
              const talks = frontKonData.talks.filter(t => t.speakerId === speaker.id);
              return (
                <Link key={speaker.id} to={`/speakers/${speaker.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <SpeakerCard
                    speaker={speaker}
                    talkCount={talks.length}
                  />
                </Link>
              );
            })}
          </div>
        )}

        {currentView === 'topics' && (
          <div className="grid">
            {frontKonData.topics.map(topic => {
              const talks = frontKonData.talks.filter(t => t.topicIds.includes(topic.id));
              return (
                <Link key={topic.id} to={`/topics/${topic.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <TopicCard
                    topic={topic}
                    talkCount={talks.length}
                  />
                </Link>
              );
            })}
          </div>
        )}

        {currentView === 'years' && (
          <div className="grid">
            {frontKonData.years.map(year => {
              const talks = frontKonData.talks.filter(t => t.yearId === year.id);
              return (
                <Link key={year.id} to={`/years/${year.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <YearCard
                    year={year}
                    talkCount={talks.length}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}


