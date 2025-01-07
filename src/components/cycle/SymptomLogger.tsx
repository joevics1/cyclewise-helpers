import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Symptom {
  id: string;
  name: string;
  category: "physical" | "emotional" | "other";
}

const symptoms: Symptom[] = [
  { id: "cramps", name: "Cramps", category: "physical" },
  { id: "headache", name: "Headache", category: "physical" },
  { id: "bloating", name: "Bloating", category: "physical" },
  { id: "fatigue", name: "Fatigue", category: "physical" },
  { id: "breast_tenderness", name: "Breast Tenderness", category: "physical" },
  { id: "acne", name: "Acne", category: "physical" },
  { id: "anxiety", name: "Anxiety", category: "emotional" },
  { id: "mood_swings", name: "Mood Swings", category: "emotional" },
  { id: "insomnia", name: "Insomnia", category: "other" },
  { id: "food_cravings", name: "Food Cravings", category: "other" },
];

const SymptomLogger = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomHistory, setSymptomHistory] = useState<Array<{
    date: string;
    symptoms: string[];
  }>>([]);
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
            <div>
              <h3 className="text-lg font-medium mb-2">Physical Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {symptoms
                  .filter(s => s.category === "physical")
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
            <div>
              <h3 className="text-lg font-medium mb-2">Emotional Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {symptoms
                  .filter(s => s.category === "emotional")
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
            <div>
              <h3 className="text-lg font-medium mb-2">Other Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {symptoms
                  .filter(s => s.category === "other")
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
    </div>
  );
};

export default SymptomLogger;