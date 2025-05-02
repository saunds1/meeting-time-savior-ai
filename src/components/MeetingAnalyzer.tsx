
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MeetingData, MeetingType, analyzeMeetingValue } from '@/utils/meetingUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface MeetingAnalyzerProps {
  onAddMeeting: (meeting: MeetingData) => void;
}

const meetingFormSchema = z.object({
  title: z.string().min(3, {
    message: "Meeting title must be at least 3 characters.",
  }),
  type: z.enum(
    ['status-update', 'information-sharing', 'decision-making', 
     'problem-solving', 'brainstorming', 'team-building',
     'one-on-one', 'client-meeting', 'other']
  ),
  duration: z.number().min(5).max(240),
  participants: z.number().min(1).max(100),
  hasAgenda: z.boolean(),
  hasActionItems: z.boolean(),
});

const MeetingAnalyzer: React.FC<MeetingAnalyzerProps> = ({ onAddMeeting }) => {
  const [valueScore, setValueScore] = useState<number>(5);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof meetingFormSchema>>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: '',
      type: 'status-update',
      duration: 30,
      participants: 5,
      hasAgenda: false,
      hasActionItems: false,
    },
  });

  const analyzeFormValues = (values: z.infer<typeof meetingFormSchema>) => {
    const meetingData: Omit<MeetingData, 'id' | 'valueScore'> = {
      title: values.title,
      type: values.type as MeetingType,
      duration: values.duration,
      participants: values.participants,
      hasAgenda: values.hasAgenda,
      hasActionItems: values.hasActionItems,
    };
    
    const score = analyzeMeetingValue({
      ...meetingData,
      id: '',
      valueScore: 0,
    });
    
    setValueScore(score);
  };

  const onSubmit = (values: z.infer<typeof meetingFormSchema>) => {
    const newMeeting: MeetingData = {
      id: Date.now().toString(),
      title: values.title,
      type: values.type as MeetingType,
      duration: values.duration,
      participants: values.participants,
      hasAgenda: values.hasAgenda,
      hasActionItems: values.hasActionItems,
      valueScore,
    };
    
    onAddMeeting(newMeeting);
    toast({
      title: "Meeting analyzed and added",
      description: `"${values.title}" has a value score of ${valueScore.toFixed(1)}/10`,
    });
    
    form.reset();
    setValueScore(5);
  };
  
  // Watch form values to update analysis in real-time
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (value.title && value.type && value.duration && value.participants !== undefined) {
        analyzeFormValues(value as z.infer<typeof meetingFormSchema>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Title</FormLabel>
                <FormControl>
                  <Input placeholder="Weekly Team Status" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meeting type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="status-update">Status Update</SelectItem>
                    <SelectItem value="information-sharing">Information Sharing</SelectItem>
                    <SelectItem value="decision-making">Decision Making</SelectItem>
                    <SelectItem value="problem-solving">Problem Solving</SelectItem>
                    <SelectItem value="brainstorming">Brainstorming</SelectItem>
                    <SelectItem value="team-building">Team Building</SelectItem>
                    <SelectItem value="one-on-one">One-on-One</SelectItem>
                    <SelectItem value="client-meeting">Client Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={5} 
                    max={240}
                    placeholder="30" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Participants</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    max={100}
                    placeholder="5" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hasAgenda"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Has a Clear Agenda</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hasActionItems"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Has Clear Action Items</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <Card className={
          valueScore > 7 ? "border-green-500" : 
          valueScore > 4 ? "border-amber-500" : 
          "border-red-500"
        }>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Meeting Value Score</span>
              <span className={`text-xl font-bold ${
                valueScore > 7 ? "text-green-600" : 
                valueScore > 4 ? "text-amber-600" : 
                "text-red-600"
              }`}>
                {valueScore.toFixed(1)}/10
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  valueScore > 7 ? "bg-green-500" : 
                  valueScore > 4 ? "bg-amber-500" : 
                  "bg-red-500"
                }`} 
                style={{ width: `${valueScore * 10}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {valueScore > 7 
                ? "This meeting appears to be valuable and worth keeping."
                : valueScore > 4
                ? "This meeting might provide some value, but consider alternatives."
                : "This meeting could likely be replaced with an async alternative."
              }
            </p>
          </CardContent>
        </Card>
        
        <Button type="submit" className="w-full">Analyze & Add Meeting</Button>
      </form>
    </Form>
  );
};

export default MeetingAnalyzer;
