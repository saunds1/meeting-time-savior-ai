
export type MeetingType = 
  | 'status-update'
  | 'information-sharing'
  | 'decision-making'
  | 'problem-solving'
  | 'brainstorming'
  | 'team-building'
  | 'one-on-one'
  | 'client-meeting'
  | 'other';

export interface MeetingData {
  id: string;
  title: string;
  type: MeetingType;
  duration: number; // in minutes
  participants: number;
  hasAgenda: boolean;
  hasActionItems: boolean;
  valueScore: number;
}

export interface AlternativeSuggestion {
  title: string;
  description: string;
  tool: string;
  timeToComplete: number; // in minutes
  benefits: string[];
}

// Calculate time wasted in a meeting
export const calculateWastedTime = (meeting: MeetingData): number => {
  // Simple calculation: low value meetings waste most of their time
  const wastePercentage = 1 - (meeting.valueScore / 10);
  return Math.round(meeting.duration * meeting.participants * wastePercentage);
};

// Calculate total time saved
export const calculateTimeSaved = (
  meetings: MeetingData[], 
  alternativeTime: number
): number => {
  const totalMeetingTime = meetings.reduce((acc, meeting) => {
    return acc + (meeting.duration * meeting.participants);
  }, 0);
  
  const wastedTime = meetings.reduce((acc, meeting) => {
    return acc + calculateWastedTime(meeting);
  }, 0);
  
  return wastedTime - alternativeTime;
};

// Analyze meeting value
export const analyzeMeetingValue = (meeting: MeetingData): number => {
  let score = 5; // Start with neutral score
  
  // Type-based adjustment
  if (meeting.type === 'status-update' || meeting.type === 'information-sharing') {
    score -= 2; // These are often low value and could be async
  } else if (meeting.type === 'decision-making' || meeting.type === 'problem-solving') {
    score += 2; // These often benefit from synchronous communication
  }
  
  // Factor in meeting preparation
  if (!meeting.hasAgenda) score -= 2;
  if (!meeting.hasActionItems) score -= 1;
  
  // Adjust for participant count (more people = higher cost)
  if (meeting.participants > 8) score -= 1;
  if (meeting.participants > 15) score -= 1;
  
  // Adjust for duration (longer meetings tend to have diminishing returns)
  if (meeting.duration > 60) score -= 1;
  
  // Ensure score stays within 0-10 range
  return Math.max(0, Math.min(10, score));
};

// Generate alternative suggestions based on meeting type
export const generateAlternatives = (meeting: MeetingData): AlternativeSuggestion[] => {
  const alternatives: AlternativeSuggestion[] = [];
  
  if (meeting.type === 'status-update') {
    alternatives.push({
      title: 'Asynchronous Status Update',
      description: 'Have team members post updates in a shared document or channel',
      tool: 'Slack/Teams/Notion',
      timeToComplete: 5,
      benefits: [
        'No synchronous time required',
        'Updates can be referenced later',
        'People can consume at their own pace'
      ]
    });
  }
  
  if (meeting.type === 'information-sharing') {
    alternatives.push({
      title: 'Pre-recorded Video Update',
      description: 'Record a short video explaining the information and share it with the team',
      tool: 'Loom/Vidyard',
      timeToComplete: 15,
      benefits: [
        'Can be watched at 1.5x speed',
        'Can be referenced later',
        'Visual information is preserved'
      ]
    });
    
    alternatives.push({
      title: 'Documentation Update',
      description: 'Document the information in a shared wiki or knowledge base',
      tool: 'Notion/Confluence',
      timeToComplete: 20,
      benefits: [
        'Creates permanent reference material',
        'Easier to find information later',
        'Can be updated incrementally'
      ]
    });
  }
  
  if (meeting.type === 'decision-making' && meeting.valueScore < 5) {
    alternatives.push({
      title: 'Decision Document with Comments',
      description: 'Create a document outlining the decision to be made and have stakeholders comment',
      tool: 'Google Docs/Notion',
      timeToComplete: 30,
      benefits: [
        'Thoughtful written responses',
        'Decision process is documented',
        'Everyone can contribute equally'
      ]
    });
  }
  
  if (meeting.type === 'brainstorming' && meeting.valueScore < 6) {
    alternatives.push({
      title: 'Async Brainstorming Board',
      description: 'Set up a digital board where people can add ideas over a set period',
      tool: 'Miro/Figjam',
      timeToComplete: 20,
      benefits: [
        'More time for reflection',
        'Avoids groupthink',
        'Everyone can contribute equally'
      ]
    });
  }
  
  // Add some default alternatives for all meeting types
  alternatives.push({
    title: 'Email Thread',
    description: 'Send an email with the key points and ask for responses',
    tool: 'Email',
    timeToComplete: 10,
    benefits: [
      'No scheduling required',
      'Creates written record',
      'Can be processed when convenient'
    ]
  });
  
  if (meeting.participants <= 3) {
    alternatives.push({
      title: 'Quick Chat',
      description: 'Have a brief 5-minute conversation instead of a formal meeting',
      tool: 'In person/Call',
      timeToComplete: 5,
      benefits: [
        'Drastically reduced time commitment',
        'Gets to the point quickly',
        'Maintains personal connection'
      ]
    });
  }
  
  return alternatives;
};

// Sample data for initial demo
export const sampleMeetings: MeetingData[] = [
  {
    id: '1',
    title: 'Weekly Team Status Update',
    type: 'status-update',
    duration: 60,
    participants: 12,
    hasAgenda: false,
    hasActionItems: false,
    valueScore: 3,
  },
  {
    id: '2',
    title: 'Product Roadmap Planning',
    type: 'decision-making',
    duration: 90,
    participants: 8,
    hasAgenda: true,
    hasActionItems: true,
    valueScore: 8,
  },
  {
    id: '3',
    title: 'Monthly All-Hands',
    type: 'information-sharing',
    duration: 60,
    participants: 50,
    hasAgenda: true,
    hasActionItems: false,
    valueScore: 4,
  },
  {
    id: '4',
    title: 'Design Review Meeting',
    type: 'problem-solving',
    duration: 45,
    participants: 6,
    hasAgenda: false,
    hasActionItems: true,
    valueScore: 7,
  },
  {
    id: '5',
    title: 'Project Kickoff',
    type: 'brainstorming',
    duration: 60,
    participants: 10,
    hasAgenda: true,
    hasActionItems: true,
    valueScore: 9,
  },
];
