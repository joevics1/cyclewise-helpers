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
import { format, subDays, isSameDay } from 'date-fns';
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
  { icon: PartyPopper, label: 'Ecstatic', color: 'text-[#8B5CF6] hover:bg-[#8B5CF6]/10', value: 10, bg: 'bg-[#8B5CF6]/10' },
  { icon: Zap, label: 'Energetic', color: 'text-[#D946EF] hover:bg-[#D946EF]/10', value: 9, bg: 'bg-[#D946EF]/10' },
  { icon: Heart, label: 'Happy', color: 'text-[#F97316] hover:bg-[#F97316]/10', value: 8, bg: 'bg-[#F97316]/10' },
  { icon: Sun, label: 'Content', color: 'text-[#0EA5E9] hover:bg-[#0EA5E9]/10', value: 7, bg: 'bg-[#0EA5E9]/10' },
  { icon: Coffee, label: 'Tired', color: 'text-amber-500 hover:bg-amber-100', value: 6, bg: 'bg-amber-100' },
  { icon: Cloud, label: 'Meh', color: 'text-gray-500 hover:bg-gray-100', value: 5, bg: 'bg-gray-100' },
  { icon: Battery, label: 'Low Energy', color: 'text-blue-600 hover:bg-blue-100', value: 4, bg: 'bg-blue-100' },
  { icon: Flame, label: 'Irritated', color: 'text-red-600 hover:bg-red-100', value: 3, bg: 'bg-red-100' },
  { icon: Frown, label: 'Sad', color: 'text-indigo-600 hover:bg-indigo-100', value: 2, bg: 'bg-indigo-100' },
  { icon: HeartCrack, label: 'Stressed', color: 'text-rose-600 hover:bg-rose-100', value: 1, bg: 'bg-rose-100' },
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

  const groupMoodsByDate = () => {
    const grouped = moodEntries.reduce((acc, entry) => {
      const date = format(new Date(entry.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {} as Record<string, typeof moodEntries>);

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());
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
      <Card>
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
          <CardTitle>Recent Mood Logs</CardTitle>
          <CardDescription>Your latest recorded moods</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {groupMoodsByDate().map(([date, entries]) => (
                <div key={date} className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-500">
                    {format(new Date(date), 'PPPP')}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {entries.map((entry, index) => {
                      const mood = moods.find(m => m.label === entry.mood);
                      const Icon = mood?.icon || Meh;
                      return (
                        <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${mood?.bg}`}>
                          <Icon className={mood?.color} />
                          <div>
                            <p className="font-medium">{entry.mood}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(entry.date), 'p')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
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
    </div>
  );
};

export default MoodTracker;
