import Link from 'next/link'
import { notFound } from 'next/navigation'
import frontKonData from '../../../data.json'
import TalkCard from '../../../components/TalkCard'
import { Talk, Speaker, Topic } from '../../../types'

export async function generateStaticParams() {
  return frontKonData.speakers.map((speaker) => ({
    id: speaker.id,
  }))
}

export default function SpeakerDetail({ params }: { params: { id: string } }) {
  const speaker = frontKonData.speakers.find(s => s.id === params.id) as Speaker | undefined
  
  if (!speaker) {
    notFound()
  }

  const talks = frontKonData.talks.filter(t => t.speakerId === speaker.id)

  return (
    <div className="detail-page">
      <Link href="/" className="back-link">← Zpět na seznam</Link>
      
      <div className="detail-header">
        <div className="speaker-avatar-large">
          {speaker.avatar ? (
            <img src={speaker.avatar} alt={speaker.name} />
          ) : (
            <div className="avatar-placeholder-image" />
          )}
        </div>
        <h1>{speaker.name}</h1>
        {speaker.company && <p className="detail-company">{speaker.company}</p>}
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <h2>O speakerovi</h2>
          <p className="detail-description">{speaker.bio}</p>

          {(speaker.twitter || speaker.github || speaker.website || speaker.linkedin) && (
            <div className="detail-links">
              <h3>Odkazy</h3>
              <div className="links-list">
                {speaker.twitter && (
                  <a href={`https://twitter.com/${speaker.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                )}
                {speaker.github && (
                  <a href={`https://github.com/${speaker.github}`} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
                {speaker.website && (
                  <a href={speaker.website} target="_blank" rel="noopener noreferrer">
                    Web
                  </a>
                )}
                {speaker.linkedin && (
                  <a href={`https://linkedin.com/in/${speaker.linkedin}`} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {talks.length > 0 && (
        <div className="related-section">
          <h2>Přednášky ({talks.length})</h2>
          <div className="grid">
            {talks.map(talk => {
              const topics = frontKonData.topics.filter(t => talk.topicIds.includes(t.id)) as Topic[]
              return (
                <Link key={talk.id} href={`/talks/${talk.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <TalkCard
                    talk={talk as Talk}
                    speaker={speaker}
                    topics={topics}
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

