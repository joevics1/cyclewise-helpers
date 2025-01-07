import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Smile, Frown, Meh, Heart, HeartCrack, 
  PartyPopper, Coffee, Cloud, Sun, Moon 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, subDays, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MoodEntry {
  date: Date;
  mood: string;
  timestamp: number;
}

const moods = [
  { icon: PartyPopper, label: 'Excited', color: 'text-purple-500', value: 5 },
  { icon: Heart, label: 'Happy', color: 'text-pink-500', value: 4 },
  { icon: Sun, label: 'Content', color: 'text-yellow-500', value: 3 },
  { icon: Cloud, label: 'Meh', color: 'text-gray-500', value: 2 },
  { icon: Frown, label: 'Sad', color: 'text-blue-500', value: 1 },
  { icon: HeartCrack, label: 'Stressed', color: 'text-red-500', value: 0 },
];

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');

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
  };

  const getTodaysMood = () => {
    return moodEntries.find(entry => 
      isSameDay(new Date(entry.date), new Date())
    )?.mood;
  };

  const getMoodStats = () => {
    const today = new Date();
    const lastWeek = subDays(today, 7);
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const monthlyData = moods.map(mood => ({
      name: mood.label,
      count: moodEntries.filter(entry => 
        entry.date >= monthStart && 
        entry.date <= monthEnd && 
        entry.mood === mood.label
      ).length
    }));

    return monthlyData;
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
          <CardDescription>Select your current mood</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {moods.map(({ icon: Icon, label, color }) => (
              <Button
                key={label}
                variant="outline"
                className={`flex flex-col items-center p-4 h-auto ${
                  getTodaysMood() === label ? 'ring-2 ring-pink-500' : ''
                }`}
                onClick={() => saveMoodEntry(label)}
              >
                <Icon className={`h-8 w-8 ${color}`} />
                <span className="mt-2 text-sm">{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mood Analysis</CardTitle>
          <CardDescription>Track your emotional patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMoodStats()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;