import CycleForm from "@/components/CycleForm";
import MoodTracker from "@/components/mood/MoodTracker";
import SymptomLogger from "@/components/cycle/SymptomLogger";
import PhaseInsights from "@/components/cycle/PhaseInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cycle-purple to-cycle-pink p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-cycle-text text-center mb-6">
          Menstrual Cycle Tracker
        </h1>
        <Tabs defaultValue="cycle" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="cycle">Cycle Tracker</TabsTrigger>
            <TabsTrigger value="mood">Mood Tracker</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="insights">Phase Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="cycle">
            <CycleForm />
          </TabsContent>
          <TabsContent value="mood">
            <MoodTracker />
          </TabsContent>
          <TabsContent value="symptoms">
            <SymptomLogger />
          </TabsContent>
          <TabsContent value="insights">
            <PhaseInsights />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;