import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Smile, Frown, Meh, Heart, HeartCrack, 
  PartyPopper, Coffee, Cloud, Sun, Moon,
  Zap, Battery, Flame
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, subDays, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface MoodEntry {
  date: Date;
  mood: string;
  timestamp: number;
}

const moods = [
  { icon: PartyPopper, label: 'Ecstatic', color: 'text-purple-500 hover:bg-purple-100', value: 10, bg: 'bg-purple-100' },
  { icon: Zap, label: 'Energetic', color: 'text-yellow-500 hover:bg-yellow-100', value: 9, bg: 'bg-yellow-100' },
  { icon: Heart, label: 'Happy', color: 'text-pink-500 hover:bg-pink-100', value: 8, bg: 'bg-pink-100' },
  { icon: Sun, label: 'Content', color: 'text-orange-500 hover:bg-orange-100', value: 7, bg: 'bg-orange-100' },
  { icon: Coffee, label: 'Tired', color: 'text-brown-500 hover:bg-amber-100', value: 6, bg: 'bg-amber-100' },
  { icon: Cloud, label: 'Meh', color: 'text-gray-500 hover:bg-gray-100', value: 5, bg: 'bg-gray-100' },
  { icon: Battery, label: 'Low Energy', color: 'text-blue-500 hover:bg-blue-100', value: 4, bg: 'bg-blue-100' },
  { icon: Flame, label: 'Irritated', color: 'text-red-500 hover:bg-red-100', value: 3, bg: 'bg-red-100' },
  { icon: Frown, label: 'Sad', color: 'text-indigo-500 hover:bg-indigo-100', value: 2, bg: 'bg-indigo-100' },
  { icon: HeartCrack, label: 'Stressed', color: 'text-rose-500 hover:bg-rose-100', value: 1, bg: 'bg-rose-100' },
];

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedMoods = localStorage.getItem('moodEntries');
    if (savedMoods) {
      setMoodEntries(JSON.parse(savedMoods).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      })));
    }
  }, []);

  const saveMoodEntry = (mood: string) => {
    const newEntry: MoodEntry = {
      date: new Date(),
      mood: mood,
      timestamp: Date.now()
    };

    const updatedEntries = [...moodEntries, newEntry];
    setMoodEntries(updatedEntries);
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));

    toast({
      title: "Mood logged successfully",
      description: `You're feeling ${mood.toLowerCase()} on ${format(new Date(), 'PPP')}`,
    });
  };

  const getTodaysMood = () => {
    return moodEntries.find(entry => 
      isSameDay(new Date(entry.date), new Date())
    )?.mood;
  };

  const getMoodStats = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      const mood = moodEntries.find(entry => isSameDay(new Date(entry.date), date));
      return {
        date: format(date, 'MMM dd'),
        value: mood ? moods.find(m => m.label === mood.mood)?.value || 0 : null
      };
    }).reverse();

    return last7Days;
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
          <CardDescription>Select your current mood</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {moods.map(({ icon: Icon, label, color, bg }) => (
              <Button
                key={label}
                variant="outline"
                className={`flex flex-col items-center p-4 h-auto transition-all ${color} ${bg} ${
                  getTodaysMood() === label ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => saveMoodEntry(label)}
              >
                <Icon className={`h-8 w-8`} />
                <span className="mt-2 text-sm">{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
          <CardDescription>Your emotional journey over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getMoodStats()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  name="Mood Level"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Mood Logs</CardTitle>
          <CardDescription>Your latest recorded moods</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              {moodEntries.slice().reverse().map((entry, index) => {
                const mood = moods.find(m => m.label === entry.mood);
                const Icon = mood?.icon || Meh;
                return (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <Icon className={`h-5 w-5 ${mood?.color}`} />
                    <div>
                      <p className="font-medium">{entry.mood}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(entry.date), 'PPP')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;