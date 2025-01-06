import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addDays, format, subDays } from "date-fns";
import CycleLengthSelector from "./cycle/CycleLengthSelector";
import ResultsDialog from "./cycle/ResultsDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationPreferences {
  beforePeriod: boolean;
  onPeriodStart: boolean;
  ovulation: boolean;
  reminderDays: string;
}

const CycleForm = () => {
  const [lastPeriod, setLastPeriod] = useState<Date>();
  const [cycleLength, setCycleLength] = useState("31"); // Changed default to 31
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    beforePeriod: true,
    onPeriodStart: true,
    ovulation: false,
    reminderDays: "7",
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem('cycleData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.lastPeriod) setLastPeriod(new Date(parsed.lastPeriod));
      if (parsed.cycleLength) setCycleLength(parsed.cycleLength);
      if (parsed.notificationsEnabled) setNotificationsEnabled(parsed.notificationsEnabled);
      if (parsed.notificationPrefs) setNotificationPrefs(parsed.notificationPrefs);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (lastPeriod || cycleLength !== "28" || notificationsEnabled) {
      localStorage.setItem('cycleData', JSON.stringify({
        lastPeriod,
        cycleLength,
        notificationsEnabled,
        notificationPrefs
      }));
    }
  }, [lastPeriod, cycleLength, notificationsEnabled, notificationPrefs]);

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
      scheduleNotifications(nextPeriod, ovulationDay);
    }

    setShowResults(true);
  };

  const scheduleNotifications = async (nextPeriod: Date, ovulationDay: Date) => {
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

    // Schedule notification for days before period
    if (notificationPrefs.beforePeriod) {
      const daysBefore = subDays(nextPeriod, parseInt(notificationPrefs.reminderDays));
      if (daysBefore > new Date()) {
        setTimeout(() => {
          new Notification("Period Reminder", {
            body: `Your period is expected in ${notificationPrefs.reminderDays} days. Prepare accordingly!`,
            icon: "/favicon.ico"
          });
        }, daysBefore.getTime() - new Date().getTime());
      }
    }

    // Schedule notification for period start
    if (notificationPrefs.onPeriodStart && nextPeriod > new Date()) {
      setTimeout(() => {
        new Notification("Period Start", {
          body: "Your period starts today. Stay prepared!",
          icon: "/favicon.ico"
        });
      }, nextPeriod.getTime() - new Date().getTime());
    }

    // Schedule notification for ovulation
    if (notificationPrefs.ovulation && ovulationDay > new Date()) {
      setTimeout(() => {
        new Notification("Ovulation Day", {
          body: "Your ovulation is expected today. This is your most fertile day.",
          icon: "/favicon.ico"
        });
      }, ovulationDay.getTime() - new Date().getTime());
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

      <div className="space-y-4 bg-[#FFE5EC] p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-[#FF69B4]" />
          <Label htmlFor="notifications" className="flex-1">Enable notifications</Label>
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={handleNotificationToggle}
          />
        </div>

        {notificationsEnabled && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="beforePeriod"
                checked={notificationPrefs.beforePeriod}
                onCheckedChange={(checked) => 
                  setNotificationPrefs(prev => ({ ...prev, beforePeriod: checked }))
                }
              />
              <Label htmlFor="beforePeriod">Notify before period</Label>
            </div>

            {notificationPrefs.beforePeriod && (
              <Select
                value={notificationPrefs.reminderDays}
                onValueChange={(value) => 
                  setNotificationPrefs(prev => ({ ...prev, reminderDays: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select days before" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="5">5 days before</SelectItem>
                  <SelectItem value="7">7 days before</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="periodStart"
                checked={notificationPrefs.onPeriodStart}
                onCheckedChange={(checked) => 
                  setNotificationPrefs(prev => ({ ...prev, onPeriodStart: checked }))
                }
              />
              <Label htmlFor="periodStart">Notify on period start</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ovulation"
                checked={notificationPrefs.ovulation}
                onCheckedChange={(checked) => 
                  setNotificationPrefs(prev => ({ ...prev, ovulation: checked }))
                }
              />
              <Label htmlFor="ovulation">Notify on ovulation day</Label>
            </div>
          </div>
        )}
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
