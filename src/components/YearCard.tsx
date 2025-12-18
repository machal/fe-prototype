import { Year } from '../types';
import './Card.css';

interface YearCardProps {
  year: Year;
  talkCount: number;
}

export default function YearCard({ year, talkCount }: YearCardProps) {
  return (
    <div className="card year-card">
      <h3 className="card-title">FrontKon {year.year}</h3>
      {year.location && <p className="card-company">{year.location}</p>}
      {year.date && <p className="card-description">{year.date}</p>}
      <div className="card-footer">
        <span className="talk-count">{talkCount} přednášek</span>
      </div>
    </div>
  );
}


