export interface Symptom {
  id: string;
  name: string;
  category: "physical" | "emotional" | "other" | "pregnancy";
}

export const symptoms: Symptom[] = [
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