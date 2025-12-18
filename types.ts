export interface Speaker {
  id: string
  name: string
  bio: string
  avatar?: string
  company?: string
  twitter?: string
  github?: string
  website?: string
  linkedin?: string
}

export interface Topic {
  id: string
  name: string
  description: string
  color?: string
}

export interface Talk {
  id: string
  title: string
  description: string
  duration: number
  speakerId: string
  topicIds: string[]
  yearId: string
  level: 'beginner' | 'intermediate' | 'advanced'
  language: 'cs' | 'en'
  slidesUrl?: string
  videoUrl?: string
  youtubeId?: string
}

export interface Year {
  id: string
  year: number
  location?: string
  date?: string
}

export interface FrontKonData {
  speakers: Speaker[]
  topics: Topic[]
  talks: Talk[]
  years: Year[]
}

