import { Speaker } from '../types'

interface SpeakerCardProps {
  speaker: Speaker
  talkCount: number
}

export default function SpeakerCard({ speaker, talkCount }: SpeakerCardProps) {
  return (
    <div className="card speaker-card">
      <div className="speaker-avatar">
        {speaker.avatar ? (
          <img src={speaker.avatar} alt={speaker.name} />
        ) : (
          <div className="avatar-placeholder">
            <div className="avatar-placeholder-image" />
          </div>
        )}
      </div>
      <h3 className="card-title">{speaker.name}</h3>
      {speaker.company && <p className="card-company">{speaker.company}</p>}
      <p className="card-description">{speaker.bio}</p>
      <div className="card-footer">
        <span className="talk-count">{talkCount} přednášek</span>
      </div>
    </div>
  )
}

