
import React from 'react';
import { MeetingData, AlternativeSuggestion, generateAlternatives } from '@/utils/meetingUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Calendar } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface MeetingSuggestionsProps {
  meetings: MeetingData[];
}

const MeetingSuggestions: React.FC<MeetingSuggestionsProps> = ({ meetings }) => {
  // Filter to low-value meetings that can be replaced
  const replacableMeetings = meetings.filter(meeting => meeting.valueScore < 6);
  
  if (replacableMeetings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meeting Alternatives</CardTitle>
          <CardDescription>
            All your meetings appear to be valuable. Great job!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-center text-gray-600">
              No low-value meetings found that need replacement.
              <br />
              Keep up the good work and continue to monitor your meetings!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Meeting Alternatives</h2>
      <p className="text-muted-foreground">
        We found {replacableMeetings.length} meetings that could be replaced with more efficient alternatives.
      </p>
      
      {replacableMeetings.map(meeting => {
        const alternatives = generateAlternatives(meeting);
        const totalTimeSaved = meeting.duration * meeting.participants - 
          (alternatives[0]?.timeToComplete ?? 0) * meeting.participants;
        
        return (
          <Card key={meeting.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{meeting.title}</CardTitle>
                  <CardDescription>
                    {meeting.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} • 
                    {meeting.duration} min • 
                    {meeting.participants} participants
                  </CardDescription>
                </div>
                <Badge variant={meeting.valueScore < 4 ? "destructive" : "outline"}>
                  Value: {meeting.valueScore}/10
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center text-green-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Potential time savings: {totalTimeSaved} person-minutes</span>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Suggested Alternatives</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {alternatives.map((alternative, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{alternative.title}</CardTitle>
                      <CardDescription className="text-xs">Using {alternative.tool}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">{alternative.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between text-sm text-muted-foreground">
                      <span>Est. time: {alternative.timeToComplete}min</span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="benefits">
                  <AccordionTrigger>Why replace this meeting?</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {meeting.type === 'status-update' && (
                        <li>Status updates don't require real-time synchronous communication</li>
                      )}
                      {meeting.type === 'information-sharing' && (
                        <li>Information can be consumed at individual pace, saving collective time</li>
                      )}
                      {!meeting.hasAgenda && (
                        <li>Meetings without agendas often lack focus and clear outcomes</li>
                      )}
                      {meeting.participants > 8 && (
                        <li>Large meetings have diminishing returns on participant engagement</li>
                      )}
                      {meeting.duration > 45 && (
                        <li>Longer meetings tend to drift and lose focus after 30-45 minutes</li>
                      )}
                      <li>Written communication creates documentation for future reference</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 py-3">
              <Button variant="secondary" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Replace Meeting
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default MeetingSuggestions;
