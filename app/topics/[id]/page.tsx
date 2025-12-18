import Link from 'next/link'
import { notFound } from 'next/navigation'
import frontKonData from '../../../data.json'
import TalkCard from '../../../components/TalkCard'
import { Talk, Speaker, Topic } from '../../../types'

export async function generateStaticParams() {
  return frontKonData.topics.map((topic) => ({
    id: topic.id,
  }))
}

export default function TopicDetail({ params }: { params: { id: string } }) {
  const topic = frontKonData.topics.find(t => t.id === params.id) as Topic | undefined
  
  if (!topic) {
    notFound()
  }

  const talks = frontKonData.talks.filter(t => t.topicIds.includes(topic.id)) as Talk[]

  return (
    <div className="detail-page">
      <Link href="/" className="back-link">← Zpět na seznam</Link>
      
      <div className="detail-header">
        <h1>{topic.name}</h1>
        <p className="detail-description">{topic.description}</p>
      </div>

      {talks.length > 0 && (
        <div className="related-section">
          <h2>Přednášky ({talks.length})</h2>
          <div className="grid">
            {talks.map(talk => {
              const speaker = frontKonData.speakers.find(s => s.id === talk.speakerId) as Speaker | undefined
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

