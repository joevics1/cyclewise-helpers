import React from "react";
import { Badge } from "@/components/ui/badge";
import { Symptom } from "@/types/symptoms";

interface SymptomSectionProps {
  category: "physical" | "emotional" | "other" | "pregnancy";
  title: string;
  symptoms: Symptom[];
  selectedSymptoms: string[];
  onToggleSymptom: (symptomId: string) => void;
}

const SymptomSection = ({
  category,
  title,
  symptoms,
  selectedSymptoms,
  onToggleSymptom,
}: SymptomSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {symptoms
          .filter((s) => s.category === category)
          .map((symptom) => (
            <Badge
              key={symptom.id}
              variant={selectedSymptoms.includes(symptom.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onToggleSymptom(symptom.id)}
            >
              {symptom.name}
            </Badge>
          ))}
      </div>
    </div>
  );
};

export default SymptomSection;