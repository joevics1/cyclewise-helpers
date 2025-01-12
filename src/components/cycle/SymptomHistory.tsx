import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Symptom, symptoms } from "@/types/symptoms";

interface SymptomHistoryProps {
  history: Array<{
    date: string;
    symptoms: string[];
  }>;
}

const SymptomHistory = ({ history }: SymptomHistoryProps) => {
  if (history.length === 0) return null;

  // Group symptoms by date
  const groupedHistory = history.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date] = [...new Set([...acc[date], ...entry.symptoms])];
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Symptoms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(groupedHistory).slice(0, 5).map(([date, symptomIds]) => (
            <div key={date} className="border-b pb-2 last:border-0">
              <p className="font-medium">{format(new Date(date), "PPP")}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {symptomIds.map(symptomId => (
                  <Badge key={symptomId} variant="secondary">
                    {symptoms.find(s => s.id === symptomId)?.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomHistory;