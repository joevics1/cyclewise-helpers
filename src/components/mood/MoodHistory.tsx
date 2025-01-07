import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MoodHistoryProps {
  entries: Array<{
    date: Date;
    mood: string;
    timestamp: number;
  }>;
}

const MoodHistory = ({ entries }: MoodHistoryProps) => {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Mood</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map((entry, index) => (
              <TableRow key={entry.timestamp}>
                <TableCell>{format(new Date(entry.date), 'PPP')}</TableCell>
                <TableCell>{format(new Date(entry.date), 'p')}</TableCell>
                <TableCell>{entry.mood}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MoodHistory;