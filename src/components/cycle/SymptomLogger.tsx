import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { symptoms } from "@/types/symptoms";
import SymptomSection from "./SymptomSection";
import SymptomHistory from "./SymptomHistory";

// Symptom remedies mapping
const symptomRemedies: Record<string, { title: string; remedies: string[] }> = {
  cramps: {
    title: "Period Cramps Relief",
    remedies: [
      "Apply a heating pad to your lower abdomen",
      "Try gentle exercise like walking or yoga",
      "Stay hydrated and avoid caffeine",
      "Take warm baths",
      "Practice deep breathing exercises"
    ]
  },
  headache: {
    title: "Headache Relief",
    remedies: [
      "Rest in a quiet, dark room",
      "Apply cold or warm compress",
      "Stay hydrated",
      "Practice neck stretches",
      "Try aromatherapy with peppermint or lavender"
    ]
  },
  bloating: {
    title: "Bloating Relief",
    remedies: [
      "Avoid salty foods",
      "Drink peppermint or ginger tea",
      "Exercise regularly",
      "Eat smaller meals",
      "Try probiotics"
    ]
  },
  // Add more remedies for other symptoms...
};

const SymptomLogger = () => {
  const [symptomHistory, setSymptomHistory] = useState<Array<{
    date: string;
    symptoms: string[];
    timestamp: number;
  }>>([]);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [showRemedyDialog, setShowRemedyDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedHistory = localStorage.getItem("symptomHistory");
    if (savedHistory) {
      setSymptomHistory(JSON.parse(savedHistory));
    }
  }, []);

  const logSymptom = (symptomId: string) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const symptom = symptoms.find(s => s.id === symptomId);
    
    setSymptomHistory(prev => {
      const newHistory = [...prev];
      const todayEntry = newHistory.find(entry => entry.date === today);
      
      if (todayEntry) {
        if (!todayEntry.symptoms.includes(symptomId)) {
          todayEntry.symptoms.push(symptomId);
        }
      } else {
        newHistory.push({
          date: today,
          symptoms: [symptomId],
          timestamp: Date.now()
        });
      }
      
      localStorage.setItem("symptomHistory", JSON.stringify(newHistory));
      return newHistory;
    });

    toast({
      title: "Symptom logged",
      description: `${symptom?.name} has been recorded for today`,
    });

    // Show remedy dialog if remedies exist for this symptom
    if (symptomRemedies[symptomId]) {
      setSelectedSymptom(symptomId);
      setShowRemedyDialog(true);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SymptomSection
              category="physical"
              title="Physical Symptoms"
              symptoms={symptoms}
              selectedSymptoms={[]}
              onToggleSymptom={logSymptom}
            />
            <SymptomSection
              category="emotional"
              title="Emotional Symptoms"
              symptoms={symptoms}
              selectedSymptoms={[]}
              onToggleSymptom={logSymptom}
            />
            <SymptomSection
              category="other"
              title="Other Symptoms"
              symptoms={symptoms}
              selectedSymptoms={[]}
              onToggleSymptom={logSymptom}
            />
            <SymptomSection
              category="pregnancy"
              title="Additional Symptoms"
              symptoms={symptoms}
              selectedSymptoms={[]}
              onToggleSymptom={logSymptom}
            />
          </div>
        </CardContent>
      </Card>

      <SymptomHistory history={symptomHistory} />

      <Dialog open={showRemedyDialog} onOpenChange={setShowRemedyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSymptom && symptomRemedies[selectedSymptom]?.title}
            </DialogTitle>
            <DialogDescription className="space-y-2">
              {selectedSymptom && symptomRemedies[selectedSymptom]?.remedies.map((remedy, index) => (
                <p key={index} className="flex items-start gap-2">
                  <span className="text-sm">•</span>
                  <span>{remedy}</span>
                </p>
              ))}
              <p className="text-sm text-muted-foreground mt-4">
                Note: These are general suggestions. Always consult with a healthcare provider for medical advice.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SymptomLogger;