import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addDays, format, subDays } from "date-fns";
import CycleLengthSelector from "./cycle/CycleLengthSelector";
import ResultsDialog from "./cycle/ResultsDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";

const CycleForm = () => {
  const [lastPeriod, setLastPeriod] = useState<Date>();
  const [cycleLength, setCycleLength] = useState("28");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('cycleData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.lastPeriod) setLastPeriod(new Date(parsed.lastPeriod));
      if (parsed.cycleLength) setCycleLength(parsed.cycleLength);
      if (parsed.notificationsEnabled) setNotificationsEnabled(parsed.notificationsEnabled);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (lastPeriod || cycleLength !== "28" || notificationsEnabled) {
      localStorage.setItem('cycleData', JSON.stringify({
        lastPeriod,
        cycleLength,
        notificationsEnabled
      }));
    }
  }, [lastPeriod, cycleLength, notificationsEnabled]);

  const calculateDates = () => {
    if (!lastPeriod) {
      toast({
        title: "Please select your last period start date",
        variant: "destructive",
      });
      return;
    }

    const nextPeriod = addDays(lastPeriod, parseInt(cycleLength));
    const ovulationDay = subDays(nextPeriod, 14);
    const fertileWindowStart = subDays(ovulationDay, 5);
    const fertileWindowEnd = addDays(ovulationDay, 1);
    const follicularPhaseStart = addDays(lastPeriod, 5);
    const follicularPhaseEnd = subDays(fertileWindowStart, 1);

    setResults({
      nextPeriod,
      ovulationDay,
      fertileWindowStart,
      fertileWindowEnd,
      follicularPhaseStart,
      follicularPhaseEnd,
    });

    // Schedule notifications if enabled
    if (notificationsEnabled && "Notification" in window) {
      scheduleNotifications(nextPeriod);
    }

    setShowResults(true);
  };

  const scheduleNotifications = async (nextPeriod: Date) => {
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast({
          title: "Notifications permission denied",
          description: "Enable notifications in your browser settings to receive alerts",
          variant: "destructive",
        });
        return;
      }
    }

    // Schedule notification for 7 days before
    const sevenDaysBefore = subDays(nextPeriod, 7);
    if (sevenDaysBefore > new Date()) {
      setTimeout(() => {
        new Notification("Period Reminder", {
          body: "Your period is expected in 7 days. Prepare accordingly!",
          icon: "/favicon.ico"
        });
      }, sevenDaysBefore.getTime() - new Date().getTime());
    }

    // Schedule notification for the start day
    if (nextPeriod > new Date()) {
      setTimeout(() => {
        new Notification("Period Start", {
          body: "Your period starts today. Stay prepared!",
          icon: "/favicon.ico"
        });
      }, nextPeriod.getTime() - new Date().getTime());
    }
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications enabled",
          description: "You'll receive reminders about your cycle",
        });
      } else {
        toast({
          title: "Notifications permission denied",
          description: "Enable notifications in your browser settings to receive alerts",
          variant: "destructive",
        });
        setNotificationsEnabled(false);
      }
    } else {
      setNotificationsEnabled(checked);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-cycle-text">Last Period Start Date</h2>
        <Calendar
          mode="single"
          selected={lastPeriod}
          onSelect={setLastPeriod}
          className="rounded-lg border shadow bg-[#F1F0FB] max-h-[300px]"
        />
      </div>

      <CycleLengthSelector cycleLength={cycleLength} setCycleLength={setCycleLength} />

      <div className="flex items-center space-x-2 bg-[#FFE5EC] p-4 rounded-lg">
        <Bell className="w-5 h-5 text-[#FF69B4]" />
        <Label htmlFor="notifications" className="flex-1">Enable notifications</Label>
        <Switch
          id="notifications"
          checked={notificationsEnabled}
          onCheckedChange={handleNotificationToggle}
        />
      </div>

      <Button 
        onClick={calculateDates}
        className="w-full bg-cycle-accent hover:bg-cycle-accent/90 text-white"
      >
        Calculate Cycle
      </Button>

      <ResultsDialog 
        open={showResults} 
        onOpenChange={setShowResults}
        results={results}
      />
    </div>
  );
};

export default CycleForm;