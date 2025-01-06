import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Smile, Frown, Meh, Heart, HeartCrack } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MoodEntry {
  date: Date;
  mood: string;
  notes?: string;
}

const moods = [
  { icon: Smile, label: 'Happy', color: 'text-green-500' },
  { icon: Heart, label: 'Loved', color: 'text-pink-500' },
  { icon: Meh, label: 'Neutral', color: 'text-yellow-500' },
  { icon: Frown, label: 'Sad', color: 'text-blue-500' },
  { icon: HeartCrack, label: 'Stressed', color: 'text-red-500' },
];

const MoodTracker = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

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
      date: selectedDate,
      mood: mood
    };

    const updatedEntries = [...moodEntries.filter(entry => 
      entry.date.toDateString() !== selectedDate.toDateString()
    ), newEntry];

    setMoodEntries(updatedEntries);
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
  };

  const getMoodForDate = (date: Date) => {
    return moodEntries.find(entry => 
      entry.date.toDateString() === date.toDateString()
    )?.mood;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mood Tracker</CardTitle>
        <CardDescription>Track your daily mood and emotional well-being</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border"
        />
        
        <div className="grid grid-cols-3 gap-2">
          {moods.map(({ icon: Icon, label, color }) => (
            <Button
              key={label}
              variant="outline"
              className={`flex flex-col items-center p-4 ${
                getMoodForDate(selectedDate) === label ? 'ring-2 ring-pink-500' : ''
              }`}
              onClick={() => saveMoodEntry(label)}
            >
              <Icon className={`h-6 w-6 ${color}`} />
              <span className="mt-1 text-sm">{label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;