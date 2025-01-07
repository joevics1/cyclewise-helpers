import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface Symptom {
  id: string;
  name: string;
  category: "physical" | "emotional" | "other" | "pregnancy";
}

const symptoms: Symptom[] = [
  // Physical Symptoms
  { id: "cramps", name: "Cramps", category: "physical" },
  { id: "headache", name: "Headache", category: "physical" },
  { id: "bloating", name: "Bloating", category: "physical" },
  { id: "fatigue", name: "Fatigue", category: "physical" },
  { id: "breast_tenderness", name: "Breast Tenderness", category: "physical" },
  { id: "acne", name: "Acne", category: "physical" },
  { id: "backache", name: "Backache", category: "physical" },
  { id: "nausea", name: "Nausea", category: "physical" },
  { id: "dizziness", name: "Dizziness", category: "physical" },
  { id: "constipation", name: "Constipation", category: "physical" },
  { id: "diarrhea", name: "Diarrhea", category: "physical" },
  
  // Emotional Symptoms
  { id: "anxiety", name: "Anxiety", category: "emotional" },
  { id: "mood_swings", name: "Mood Swings", category: "emotional" },
  { id: "irritability", name: "Irritability", category: "emotional" },
  { id: "depression", name: "Depression", category: "emotional" },
  { id: "crying_spells", name: "Crying Spells", category: "emotional" },
  
  // Other Symptoms
  { id: "insomnia", name: "Insomnia", category: "other" },
  { id: "food_cravings", name: "Food Cravings", category: "other" },
  { id: "appetite_changes", name: "Appetite Changes", category: "other" },
  { id: "hot_flashes", name: "Hot Flashes", category: "other" },
  
  // Pregnancy-Related Symptoms
  { id: "missed_period", name: "Missed Period", category: "pregnancy" },
  { id: "morning_sickness", name: "Morning Sickness", category: "pregnancy" },
  { id: "frequent_urination", name: "Frequent Urination", category: "pregnancy" },
  { id: "food_aversions", name: "Food Aversions", category: "pregnancy" },
  { id: "metallic_taste", name: "Metallic Taste", category: "pregnancy" },
  { id: "heightened_smell", name: "Heightened Sense of Smell", category: "pregnancy" },
  { id: "light_spotting", name: "Light Spotting", category: "pregnancy" },
  { id: "breast_changes", name: "Breast Changes", category: "pregnancy" },
];

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

  const checkPregnancySymptoms = (symptoms: string[]) => {
    const pregnancySymptoms = symptoms.filter(
      id => symptoms.find(s => s === id)?.category === "pregnancy"
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

  const renderSymptomSection = (category: "physical" | "emotional" | "other" | "pregnancy", title: string) => (
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {symptoms
          .filter(s => s.category === category)
          .map(symptom => (
            <Badge
              key={symptom.id}
              variant={selectedSymptoms.includes(symptom.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleSymptom(symptom.id)}
            >
              {symptom.name}
            </Badge>
          ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderSymptomSection("physical", "Physical Symptoms")}
            {renderSymptomSection("emotional", "Emotional Symptoms")}
            {renderSymptomSection("other", "Other Symptoms")}
            {renderSymptomSection("pregnancy", "Additional Symptoms")}
            
            <Button 
              onClick={logSymptoms}
              className="w-full mt-4"
            >
              Log Symptoms
            </Button>
          </div>
        </CardContent>
      </Card>

      {symptomHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {symptomHistory.slice(-5).reverse().map((entry, index) => (
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
      )}

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
