
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Clock, Users, CalendarClock, AlertTriangle } from 'lucide-react';
import { MeetingData, calculateWastedTime, sampleMeetings } from '@/utils/meetingUtils';
import MeetingAnalyzer from './MeetingAnalyzer';
import MeetingSuggestions from './MeetingSuggestions';
import TimeSavingsCalculator from './TimeSavingsCalculator';

const Dashboard: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingData[]>(sampleMeetings);
  const [activeMeeting, setActiveMeeting] = useState<MeetingData | null>(null);
  
  // Calculate dashboard stats
  const totalMeetings = meetings.length;
  const lowValueMeetings = meetings.filter(m => m.valueScore < 5).length;
  const totalTime = meetings.reduce((acc, meeting) => acc + meeting.duration, 0);
  const totalParticipants = meetings.reduce((acc, meeting) => acc + meeting.participants, 0);
  const averageAttendees = Math.round(totalParticipants / totalMeetings);
  const wastedTimeMinutes = meetings.reduce((acc, meeting) => acc + calculateWastedTime(meeting), 0);
  
  // Data for charts
  const meetingTypeData = meetings.reduce((acc: Record<string, number>, meeting) => {
    acc[meeting.type] = (acc[meeting.type] || 0) + 1;
    return acc;
  }, {});
  
  const meetingTypeChartData = Object.entries(meetingTypeData).map(([type, count]) => ({
    name: type.replace('-', ' '),
    value: count,
  }));

  const valueDistributionData = meetings.map(meeting => ({
    name: meeting.title.length > 20 ? meeting.title.substring(0, 20) + '...' : meeting.title,
    value: meeting.valueScore,
    duration: meeting.duration,
    participants: meeting.participants,
    wastedMinutes: calculateWastedTime(meeting),
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const handleAddMeeting = (newMeeting: MeetingData) => {
    setMeetings([...meetings, newMeeting]);
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeetings}</div>
            <p className="text-xs text-muted-foreground">Analysis based on {totalMeetings} meetings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Low Value Meetings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowValueMeetings}</div>
            <p className="text-xs text-muted-foreground">{Math.round(lowValueMeetings/totalMeetings*100)}% of all meetings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Time Wasted</CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(wastedTimeMinutes / 60)} hrs</div>
            <p className="text-xs text-muted-foreground">{wastedTimeMinutes} person-minutes lost</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Avg. Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAttendees}</div>
            <p className="text-xs text-muted-foreground">Per meeting</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analyze">Analyze Meetings</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="savings">Time Savings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Value Distribution</CardTitle>
                <CardDescription>
                  Value score vs time consumption
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={valueDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="value" name="Value Score" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="wastedMinutes" name="Wasted Time (min)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Meeting Types</CardTitle>
                <CardDescription>
                  Distribution by purpose
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={meetingTypeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {meetingTypeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analyze">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Analyzer</CardTitle>
              <CardDescription>
                Analyze your meetings to identify their true value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MeetingAnalyzer onAddMeeting={handleAddMeeting} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="suggestions">
          <MeetingSuggestions meetings={meetings} />
        </TabsContent>
        <TabsContent value="savings">
          <TimeSavingsCalculator meetings={meetings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
