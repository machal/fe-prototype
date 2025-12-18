import Link from 'next/link'
import { notFound } from 'next/navigation'
import frontKonData from '../../../data.json'
import TalkCard from '../../../components/TalkCard'
import { Talk, Speaker, Topic, Year } from '../../../types'

export async function generateStaticParams() {
  return frontKonData.talks.map((talk) => ({
    id: talk.id,
  }))
}

export default function TalkDetail({ params }: { params: { id: string } }) {
  const talk = frontKonData.talks.find(t => t.id === params.id) as Talk | undefined
  
  if (!talk) {
    notFound()
  }

  const speaker = frontKonData.speakers.find(s => s.id === talk.speakerId) as Speaker | undefined
  const topics = frontKonData.topics.filter(t => talk.topicIds.includes(t.id)) as Topic[]
  const year = frontKonData.years.find(y => y.id === talk.yearId) as Year | undefined
  
  const relatedTalks = frontKonData.talks
    .filter(t => 
      t.id !== talk.id && (
        t.speakerId === talk.speakerId ||
        t.topicIds.some(topicId => talk.topicIds.includes(topicId)) ||
        t.yearId === talk.yearId
      )
    )
    .slice(0, 6)

  const levelLabels = {
    beginner: 'Začátečník',
    intermediate: 'Pokročilý',
    advanced: 'Expert',
  }

  return (
    <div className="detail-page">
      <Link href="/" className="back-link">← Zpět na seznam</Link>
      
      <div className="detail-header">
        <div className="detail-badge">
          {year && <Link href={`/years/${year.id}/`} className="year-link">FrontKon {year.year}</Link>}
        </div>
        <h1>{talk.title}</h1>
        {speaker && (
          <p className="detail-speaker">
            <Link href={`/speakers/${speaker.id}/`}>{speaker.name}</Link>
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
                <strong>Ročník:</strong> <Link href={`/years/${year.id}/`}>FrontKon {year.year}</Link>
              </div>
            )}
          </div>

          <div className="detail-topics">
            <h3>Témata</h3>
            <div className="topics">
              {topics.map(topic => (
                <Link key={topic.id} href={`/topics/${topic.id}/`} className="topic-tag">
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
              const relatedSpeaker = frontKonData.speakers.find(s => s.id === relatedTalk.speakerId) as Speaker | undefined
              const relatedTopics = frontKonData.topics.filter(t => relatedTalk.topicIds.includes(t.id)) as Topic[]
              return (
                <Link key={relatedTalk.id} href={`/talks/${relatedTalk.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <TalkCard
                    talk={relatedTalk as Talk}
                    speaker={relatedSpeaker}
                    topics={relatedTopics}
                  />
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

