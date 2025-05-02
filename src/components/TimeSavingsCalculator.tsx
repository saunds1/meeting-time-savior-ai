
import React, { useState } from 'react';
import { MeetingData, calculateTimeSaved } from '@/utils/meetingUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Clock, Calendar, Users, CreditCard } from 'lucide-react';

interface TimeSavingsCalculatorProps {
  meetings: MeetingData[];
}

const TimeSavingsCalculator: React.FC<TimeSavingsCalculatorProps> = ({ meetings }) => {
  const [replacementPercentage, setReplacementPercentage] = useState<number>(50);
  const [averageHourlyRate, setAverageHourlyRate] = useState<number>(75);
  
  // Filter to low-value meetings that can be replaced
  const replacableMeetings = meetings.filter(meeting => meeting.valueScore < 6);
  
  // Calculate raw metrics
  const totalMeetingTime = meetings.reduce((total, meeting) => 
    total + (meeting.duration * meeting.participants), 0);
  
  const lowValueMeetingTime = replacableMeetings.reduce((total, meeting) => 
    total + (meeting.duration * meeting.participants), 0);
  
  // Calculate time that could be saved based on replacement percentage
  const alternativeTime = lowValueMeetingTime * 0.2; // Assume alternatives take 20% of original time
  const potentialTimeSaved = Math.round(lowValueMeetingTime - alternativeTime);
  
  const actualTimeSaved = Math.round(potentialTimeSaved * (replacementPercentage / 100));
  const timeConvertedToHours = Math.round(actualTimeSaved / 60);
  
  // Calculate cost savings
  const moneySaved = Math.round(timeConvertedToHours * averageHourlyRate);
  
  // Annual projections
  const annualHoursSaved = timeConvertedToHours * 52; // Assuming weekly schedule
  const annualMoneySaved = moneySaved * 52;
  
  // Data for chart
  const chartData = [
    { name: 'Total Meeting Time', minutes: totalMeetingTime },
    { name: 'Low-Value Meeting Time', minutes: lowValueMeetingTime },
    { name: 'Time Saved', minutes: actualTimeSaved },
    { name: 'Alternative Time', minutes: alternativeTime * (replacementPercentage / 100) },
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time & Cost Savings Calculator</CardTitle>
          <CardDescription>
            Estimate the impact of replacing low-value meetings with asynchronous alternatives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium leading-none">
                    Percentage of Low-Value Meetings to Replace
                  </h3>
                  <span className="text-sm text-muted-foreground">{replacementPercentage}%</span>
                </div>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={5}
                  onValueChange={(value) => setReplacementPercentage(value[0])}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <p className="text-xs text-muted-foreground">
                  What percentage of your low-value meetings would you realistically replace?
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium leading-none">
                    Average Hourly Cost per Employee
                  </h3>
                  <span className="text-sm text-muted-foreground">${averageHourlyRate}</span>
                </div>
                <Slider
                  defaultValue={[75]}
                  min={25}
                  max={200}
                  step={5}
                  onValueChange={(value) => setAverageHourlyRate(value[0])}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <p className="text-xs text-muted-foreground">
                  Include salary, benefits, and overhead costs.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-500" />
                        Time Saved (Weekly)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{timeConvertedToHours} hours</div>
                      <p className="text-xs text-muted-foreground">
                        {actualTimeSaved} person-minutes
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        Cost Saved (Weekly)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">${moneySaved.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        Based on ${averageHourlyRate}/hr rate
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-brand-50/50 border-brand-200">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-brand-500" />
                        Annual Time Saved
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{annualHoursSaved.toLocaleString()} hours</div>
                      <p className="text-xs text-muted-foreground">
                        {(annualHoursSaved / 40).toFixed(1)} work weeks
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-brand-50/50 border-brand-200">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        Annual Cost Saved
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">${annualMoneySaved.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        That could fund {Math.floor(annualMoneySaved / 75000)} full-time employees
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-4">Time Breakdown (Weekly Minutes)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} minutes`, 'Time']} />
                  <Bar dataKey="minutes" fill="#0087af" />
                  <ReferenceLine
                    y={totalMeetingTime / 2}
                    stroke="#ff0000"
                    strokeDasharray="3 3"
                    label={{ value: '50% of total time', position: 'insideBottomRight' }}
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-4">
                This chart shows how much time you're currently spending in meetings vs. the potential time you could save.
                The red line represents 50% of your total meeting time, which is a common goal for reducing meeting burden.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSavingsCalculator;
