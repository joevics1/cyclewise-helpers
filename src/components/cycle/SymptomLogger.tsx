import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { symptoms } from "@/types/symptoms";
import SymptomSection from "./SymptomSection";
import SymptomHistory from "./SymptomHistory";

const SymptomLogger = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomHistory, setSymptomHistory] = useState<Array<{
    date: string;
    symptoms: string[];
  }>>([]);
  const [showPregnancyDialog, setShowPregnancyDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedHistory = localStorage.getItem("symptomHistory");
    if (savedHistory) {
      setSymptomHistory(JSON.parse(savedHistory));
    }
  }, []);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const checkPregnancySymptoms = (selectedSymptomIds: string[]) => {
    const pregnancySymptoms = selectedSymptomIds.filter(id => 
      symptoms.find(s => s.id === id)?.category === "pregnancy"
    );
    return pregnancySymptoms.length >= 4;
  };

  const logSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No symptoms selected",
        description: "Please select at least one symptom to log",
        variant: "destructive",
      });
      return;
    }

    const newEntry = {
      date: format(new Date(), "yyyy-MM-dd"),
      symptoms: selectedSymptoms,
    };

    const updatedHistory = [...symptomHistory, newEntry];
    setSymptomHistory(updatedHistory);
    localStorage.setItem("symptomHistory", JSON.stringify(updatedHistory));

    if (checkPregnancySymptoms(selectedSymptoms)) {
      setShowPregnancyDialog(true);
    }

    toast({
      title: "Symptoms logged successfully",
      description: "Your symptoms have been recorded for today",
    });

    setSelectedSymptoms([]);
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
              selectedSymptoms={selectedSymptoms}
              onToggleSymptom={toggleSymptom}
            />
            <SymptomSection
              category="emotional"
              title="Emotional Symptoms"
              symptoms={symptoms}
              selectedSymptoms={selectedSymptoms}
              onToggleSymptom={toggleSymptom}
            />
            <SymptomSection
              category="other"
              title="Other Symptoms"
              symptoms={symptoms}
              selectedSymptoms={selectedSymptoms}
              onToggleSymptom={toggleSymptom}
            />
            <SymptomSection
              category="pregnancy"
              title="Additional Symptoms"
              symptoms={symptoms}
              selectedSymptoms={selectedSymptoms}
              onToggleSymptom={toggleSymptom}
            />
            
            <Button 
              onClick={logSymptoms}
              className="w-full mt-4"
            >
              Log Symptoms
            </Button>
          </div>
        </CardContent>
      </Card>

      <SymptomHistory history={symptomHistory} />

      <AlertDialog open={showPregnancyDialog} onOpenChange={setShowPregnancyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pregnancy Possibility</AlertDialogTitle>
            <AlertDialogDescription>
              You've logged several symptoms that could be associated with pregnancy. While these symptoms can have many causes, you may want to consider taking a pregnancy test or consulting with a healthcare provider.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Dismiss</AlertDialogCancel>
            <AlertDialogAction>Learn More</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SymptomLogger;