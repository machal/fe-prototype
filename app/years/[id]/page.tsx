import Link from 'next/link'
import { notFound } from 'next/navigation'
import frontKonData from '../../../data.json'
import TalkCard from '../../../components/TalkCard'
import { Talk, Speaker, Topic, Year } from '../../../types'

export async function generateStaticParams() {
  return frontKonData.years.map((year) => ({
    id: year.id,
  }))
}

export default function YearDetail({ params }: { params: { id: string } }) {
  const year = frontKonData.years.find(y => y.id === params.id) as Year | undefined
  
  if (!year) {
    notFound()
  }

  const talks = frontKonData.talks.filter(t => t.yearId === year.id) as Talk[]

  return (
    <div className="detail-page">
      <Link href="/" className="back-link">← Zpět na seznam</Link>
      
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

