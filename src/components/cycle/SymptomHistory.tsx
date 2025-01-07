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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Symptoms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.slice(-5).reverse().map((entry, index) => (
            <div key={index} className="border-b pb-2 last:border-0">
              <p className="font-medium">{format(new Date(entry.date), "PPP")}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {entry.symptoms.map(symptomId => (
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