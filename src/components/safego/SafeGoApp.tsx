import { useEffect, useState } from "react";
import {
  MapPin, Navigation, Car, Calendar, ChevronRight, Home as HomeIcon, Briefcase, Heart, Info,
  Wine, Moon, Thermometer, PartyPopper, Sparkles, Zap, Phone, MessageCircle, Share2, Headphones,
  CheckCircle2, Copy, Bell, Repeat, KeyRound, ShieldCheck, Megaphone, Settings, CreditCard, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroNight from "@/assets/hero-night.jpg";
import officeImg from "@/assets/office.jpg";
import weddingImg from "@/assets/wedding.jpg";
import tiredImg from "@/assets/tired.jpg";
import {
  savedPlaces, suggestions, myVehicles, sampleDriver, recentBookings, situations, scheduleScenarios,
  estimateFare, type SituationId,
} from "./data";
import {
  TopBar, SafeGoMark, SampleTag, Card, CTA, Chip, MapPreview, DriverAvatar, Rating, RouteLines,
  BottomNav, Sheet, Field, inputCls, type Tab,
} from "./ui";

type Screen = "home" | "situation" | "book" | "schedule" | "matching" | "confirm" | "journey" | "campaign" | "activity" | "account";
type SheetKind = null | "share" | "driver" | "support" | "pickup" | "destination";

const situationIcons: Record<SituationId, typeof Wine> = {
  drinking: Wine, tired: Moon, unwell: Thermometer, event: PartyPopper, convenience: Sparkles, just: Zap,
};

export function SafeGoApp() {
  const [stack, setStack] = useState<Screen[]>(["home"]);
  const screen = stack[stack.length - 1];
  const go = (s: Screen) => setStack((st) => [...st, s]);
  const back = () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
  const reset = (s: Screen) => setStack([s]);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleId, setVehicleId] = useState(myVehicles[0]!.id);
  const [transmission, setTransmission] = useState("Automatic");
  const [makeModel, setMakeModel] = useState("Toyota Aqua");
  const [plate, setPlate] = useState("CAB-4521");
  const [note, setNote] = useState("");
  const [situation, setSituation] = useState<SituationId | null>(null);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const vehicle = myVehicles.find((v) => v.id === vehicleId)!;

  const tab: Tab = screen === "activity" ? "activity" : screen === "account" ? "account" : "home";
  const showNav = (["home", "activity", "account", "campaign"] as Screen[]).includes(screen as Screen);

  const ctx = {
    go, back, reset, pickup, setPickup, destination, setDestination, vehicle, vehicleId, setVehicleId,
    transmission, setTransmission, makeModel, setMakeModel, plate, setPlate, note, setNote, situation, setSituation, setSheet,
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div key={screen} className="animate-rise no-scrollbar flex-1 overflow-y-auto">
        {screen === "home" && <HomeScreen {...ctx} />}
        {screen === "situation" && <SituationScreen {...ctx} />}
        {screen === "book" && <BookScreen {...ctx} />}
        {screen === "schedule" && <ScheduleScreen {...ctx} />}
        {screen === "matching" && <MatchingScreen {...ctx} />}
        {screen === "confirm" && <ConfirmScreen {...ctx} />}
        {screen === "journey" && <JourneyScreen {...ctx} />}
        {screen === "campaign" && <CampaignScreen {...ctx} />}
        {screen === "activity" && <ActivityScreen {...ctx} />}
        {screen === "account" && <AccountScreen />}
      </div>
      {showNav && <BottomNav tab={tab} onTab={(t) => reset(t === "home" ? "home" : t)} />}

      <LocationSheet open={sheet === "pickup"} title="Where should your driver meet you?" onClose={() => setSheet(null)} onPick={(v) => { setPickup(v); setSheet(null); }} current />
      <LocationSheet open={sheet === "destination"} title="Where are you going?" onClose={() => setSheet(null)} onPick={(v) => { setDestination(v); setSheet(null); }} />
      <ShareSheet open={sheet === "share"} onClose={() => setSheet(null)} />
      <Sheet open={sheet === "driver"} onClose={() => setSheet(null)} title="Contact your driver">
        <div className="mb-4 flex items-center gap-3">
          <DriverAvatar initials={sampleDriver.initials} size={48} />
          <div><div className="font-bold">{sampleDriver.name}</div><div className="text-xs text-muted-foreground">Calls are masked for privacy · Demo only</div></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CTA variant="dark"><Phone className="h-5 w-5" /> Call</CTA>
          <CTA variant="outline"><MessageCircle className="h-5 w-5" /> Message</CTA>
        </div>
        <SampleTag className="mt-4">Mock contact — no call is placed</SampleTag>
      </Sheet>
      <Sheet open={sheet === "support"} onClose={() => setSheet(null)} title="SafeGo support">
        <div className="space-y-2">
          {["Call PickMe support", "Chat with us", "Report an issue with my trip", "Lost item in my vehicle"].map((s) => (
            <button key={s} className="flex w-full items-center justify-between rounded-xl bg-muted px-4 py-3.5 text-sm font-semibold">
              {s} <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
        <SampleTag className="mt-4">Demonstration only</SampleTag>
      </Sheet>
    </div>
  );
}

type Ctx = {
  go: (s: Screen) => void; back: () => void; reset: (s: Screen) => void;
  pickup: string; setPickup: (v: string) => void; destination: string; setDestination: (v: string) => void;
  vehicle: (typeof myVehicles)[number]; vehicleId: string; setVehicleId: (v: string) => void;
  transmission: string; setTransmission: (v: string) => void; makeModel: string; setMakeModel: (v: string) => void;
  plate: string; setPlate: (v: string) => void; note: string; setNote: (v: string) => void;
  situation: SituationId | null; setSituation: (v: SituationId | null) => void; setSheet: (s: SheetKind) => void;
};

function LocationInputs({ pickup, destination, setSheet }: Pick<Ctx, "pickup" | "destination" | "setSheet">) {
  return (
    <div className="rounded-2xl bg-card shadow-card">
      <button onClick={() => setSheet("pickup")} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
        <span className="h-3 w-3 shrink-0 rounded-full border-[3px] border-secondary" />
        <span className={cn("truncate text-sm font-semibold", !pickup && "font-medium text-muted-foreground")}>{pickup || "Where should your driver meet you?"}</span>
      </button>
      <div className="ml-10 border-t border-border" />
      <button onClick={() => setSheet("destination")} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
        <span className="h-3 w-3 shrink-0 rounded-full bg-primary" />
        <span className={cn("truncate text-sm font-semibold", !destination && "font-medium text-muted-foreground")}>{destination || "Where are you going?"}</span>
      </button>
    </div>
  );
}

function HomeScreen(c: Ctx) {
  const placeIcons = { home: HomeIcon, work: Briefcase, fav: Heart } as const;
  return (
    <div className="pb-6">
      <div className="bg-hero px-5 pb-16 pt-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <SafeGoMark inverted />
          <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">Driver for your car</span>
        </div>
        <h1 className="mt-6 text-[28px] font-extrabold leading-tight">Need a driver for your own car?</h1>
        <p className="mt-2 text-sm opacity-90">Book a verified driver to take you and your vehicle where you need to go.</p>
      </div>

      <div className="-mt-10 space-y-4 px-4">
        <LocationInputs {...c} />

        <Card className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary"><Car className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Your vehicle</div>
            <div className="text-sm font-bold">{c.vehicle.name} · {c.vehicle.plate}</div>
          </div>
          <div className="flex gap-1">
            {myVehicles.map((v) => (
              <button key={v.id} onClick={() => c.setVehicleId(v.id)} className={cn("h-2.5 w-2.5 rounded-full", v.id === c.vehicleId ? "bg-primary" : "bg-border")} aria-label={v.name} />
            ))}
          </div>
        </Card>

        <CTA onClick={() => c.go("situation")}><KeyRound className="h-5 w-5" /> Book a Driver</CTA>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {savedPlaces.map((p) => {
            const Icon = placeIcons[p.id as keyof typeof placeIcons];
            return (
              <button key={p.id} onClick={() => c.setDestination(p.address)} className="flex shrink-0 items-center gap-2 rounded-full bg-card px-3.5 py-2 text-sm font-semibold shadow-card">
                <Icon className="h-4 w-4 text-primary" /> {p.label}
              </button>
            );
          })}
        </div>

        <MapPreview height={150} route={!!(c.pickup && c.destination)} label={c.pickup && c.destination ? "Your planned route" : "Drivers nearby"} />

        <Card onClick={() => c.go("schedule")} className="flex items-center gap-3 bg-secondary text-secondary-foreground">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground"><Calendar className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="font-bold">Schedule a Driver</div>
            <div className="text-xs opacity-75">Book ahead for a wedding, function or appointment</div>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2 font-bold"><Info className="h-4 w-4 text-primary" /> How SafeGo works</div>
          <ol className="space-y-3">
            {[
              ["Book", "Tell us where to meet you and where you're going."],
              ["Meet", "A verified driver arrives on foot or by bike."],
              ["Ride in your car", "They drive you and your vehicle to your destination."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                <div className="text-sm"><span className="font-bold">{t}. </span><span className="text-muted-foreground">{d}</span></div>
              </li>
            ))}
          </ol>
          <div className="mt-3 rounded-xl bg-muted p-3 text-xs text-muted-foreground">Not a taxi — PickMe does not supply a vehicle. Your driver drives <b className="text-foreground">your</b> car.</div>
        </Card>

        <button onClick={() => c.go("campaign")} className="relative block h-36 w-full overflow-hidden rounded-2xl text-left">
          <img src={heroNight} alt="Driver driving a customer's own car at night" className="absolute inset-0 h-full w-full object-cover" width={1024} height={768} loading="lazy" />
          <div className="absolute inset-0 bg-night-fade" />
          <div className="absolute bottom-3 left-4 right-4 text-primary-foreground">
            <div className="text-xs font-semibold opacity-80">SafeGo</div>
            <div className="text-lg font-extrabold leading-tight">Your car doesn't have to stay behind.</div>
          </div>
        </button>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold">Recent driver bookings</h2><SampleTag />
          </div>
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <Card key={b.id} className="flex items-center gap-3 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted"><KeyRound className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{b.from} → {b.to}</div>
                  <div className="text-xs text-muted-foreground">{b.date}</div>
                </div>
                <button onClick={() => { c.setPickup(b.from); c.setDestination(b.to); c.go("book"); }} className="text-xs font-bold text-primary">Rebook</button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SituationScreen(c: Ctx) {
  const sel = situations.find((s) => s.id === c.situation);
  return (
    <div className="flex min-h-full flex-col">
      <TopBar onBack={c.back} right={<button onClick={() => { c.setSituation(null); c.go("book"); }} className="text-sm font-bold text-primary">Skip</button>} />
      <div className="flex-1 px-5">
        <h1 className="text-2xl font-extrabold">How can SafeGo help?</h1>
        <p className="mt-1 text-sm text-muted-foreground">Optional — this just helps us tailor your experience. We don't store details.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {situations.map((s) => {
            const Icon = situationIcons[s.id];
            const active = c.situation === s.id;
            return (
              <button key={s.id} onClick={() => c.setSituation(active ? null : s.id)} className={cn("flex flex-col items-start gap-3 rounded-2xl border-2 bg-card p-4 text-left transition", active ? "border-primary bg-primary-soft" : "border-transparent shadow-card")}>
                <div className={cn("grid h-10 w-10 place-items-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-muted")}><Icon className="h-5 w-5" /></div>
                <span className="text-sm font-bold leading-snug">{s.title}</span>
              </button>
            );
          })}
        </div>
        {sel && (
          <div key={sel.id} className="animate-rise mt-4 flex gap-3 rounded-2xl bg-success-soft p-4">
            <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
            <p className="text-sm font-medium">{sel.guidance}</p>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 bg-background p-4">
        <CTA onClick={() => c.go("book")}>{sel ? "Continue to booking" : "Just book a driver"}</CTA>
      </div>
    </div>
  );
}

function BookScreen(c: Ctx) {
  const ready = c.pickup && c.destination;
  const est = estimateFare(c.pickup, c.destination);
  return (
    <div className="flex min-h-full flex-col">
      <TopBar title="Book a driver" onBack={c.back} />
      <div className="flex-1 space-y-4 px-4 pb-4">
        <LocationInputs {...c} />
        <MapPreview height={140} route={!!ready} label={ready ? `${est.km} km · ~${est.mins} min` : "Add both locations"} />

        <div>
          <div className="mb-2 text-sm font-bold">Your vehicle is</div>
          <div className="grid grid-cols-3 gap-2">
            {["Automatic", "Manual", "EV/Hybrid"].map((t) => (
              <button key={t} onClick={() => c.setTransmission(t)} className={cn("rounded-xl border-2 py-3 text-sm font-bold", c.transmission === t ? "border-primary bg-primary-soft text-primary" : "border-border bg-card")}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Make & model (optional)"><input className={inputCls} value={c.makeModel} onChange={(e) => c.setMakeModel(e.target.value)} placeholder="e.g. Toyota Aqua" /></Field>
          <Field label="Registration (optional)"><input className={inputCls} value={c.plate} onChange={(e) => c.setPlate(e.target.value.toUpperCase())} placeholder="CAB-1234" /></Field>
        </div>
        <Field label="Note for driver (optional)">
          <input className={inputCls} value={c.note} onChange={(e) => c.setNote(e.target.value)} placeholder="e.g. Car is in basement parking, level B2" />
        </Field>

        <Card className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Driver arrives in</div>
            <div className="text-lg font-extrabold">{ready ? "~12 min" : "—"}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Estimated fare</div>
            <div className="text-lg font-extrabold">{ready ? `LKR ${est.fare}` : "—"}</div>
          </div>
        </Card>
        <p className="text-center text-[11px] text-muted-foreground">Arrival time and fare are illustrative samples for this prototype.</p>
      </div>
      <div className="sticky bottom-0 bg-background p-4">
        <CTA disabled={!ready} onClick={() => c.go("matching")}>Find a Driver</CTA>
      </div>
    </div>
  );
}

function ScheduleScreen(c: Ctx) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return { key: i, dow: d.toLocaleDateString("en-GB", { weekday: "short" }), day: d.getDate(), full: d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) };
  });
  const times = ["8:00 AM", "12:30 PM", "5:30 PM", "8:00 PM", "10:30 PM", "11:45 PM"];
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("10:30 PM");
  const [scenario, setScenario] = useState("Wedding");
  const [reminder, setReminder] = useState(true);
  const [ret, setRet] = useState(false);
  const [done, setDone] = useState(false);
  const ready = c.pickup && c.destination;

  if (done) {
    return (
      <div className="flex min-h-full flex-col">
        <TopBar title="Booking summary" onBack={() => setDone(false)} />
        <div className="flex-1 space-y-4 px-4">
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle2 className="h-14 w-14 text-success" />
            <h1 className="mt-2 text-xl font-extrabold">Your driver is planned</h1>
            <p className="text-sm text-muted-foreground">{days[day]!.full} · {time}</p>
          </div>
          <Card className="space-y-4">
            <RouteLines from={c.pickup} to={c.destination} />
            <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
              <div><div className="text-xs text-muted-foreground">Occasion</div><div className="font-bold">{scenario}</div></div>
              <div><div className="text-xs text-muted-foreground">Vehicle</div><div className="font-bold">{c.transmission}</div></div>
              <div><div className="text-xs text-muted-foreground">Reminder</div><div className="font-bold">{reminder ? "1 hour before" : "Off"}</div></div>
              <div><div className="text-xs text-muted-foreground">Return journey</div><div className="font-bold">{ret ? "Included" : "No"}</div></div>
            </div>
          </Card>
          <div className="rounded-2xl border border-dashed border-muted-foreground/50 p-4 text-sm text-muted-foreground">
            This prototype does not create a real reservation. No driver has been booked.
          </div>
        </div>
        <div className="p-4"><CTA onClick={() => c.reset("home")}>Back to SafeGo home</CTA></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <TopBar title="Schedule a driver" onBack={c.back} />
      <div className="flex-1 space-y-5 px-4 pb-4">
        <h1 className="text-2xl font-extrabold leading-tight">Plan ahead.<br />Your car, your driver.</h1>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {scheduleScenarios.map((s) => <Chip key={s} active={scenario === s} onClick={() => setScenario(s)}>{s}</Chip>)}
        </div>
        <LocationInputs {...c} />
        <div>
          <div className="mb-2 text-sm font-bold">Date</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {days.map((d) => (
              <button key={d.key} onClick={() => setDay(d.key)} className={cn("flex w-14 shrink-0 flex-col items-center rounded-2xl py-2.5", day === d.key ? "bg-primary text-primary-foreground shadow-cta" : "bg-card shadow-card")}>
                <span className="text-xs font-semibold opacity-80">{d.dow}</span>
                <span className="text-lg font-extrabold">{d.day}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-bold">Preferred pickup time</div>
          <div className="grid grid-cols-3 gap-2">
            {times.map((t) => <Chip key={t} active={time === t} onClick={() => setTime(t)}>{t}</Chip>)}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-bold">Vehicle</div>
          <div className="grid grid-cols-3 gap-2">
            {["Automatic", "Manual", "EV/Hybrid"].map((t) => <Chip key={t} active={c.transmission === t} onClick={() => c.setTransmission(t)}>{t}</Chip>)}
          </div>
        </div>
        <Card className="space-y-3">
          <Toggle icon={Bell} label="Remind me 1 hour before" on={reminder} set={setReminder} />
          <div className="border-t border-border" />
          <Toggle icon={Repeat} label="Add a return journey" on={ret} set={setRet} />
        </Card>
      </div>
      <div className="sticky bottom-0 bg-background p-4">
        <CTA disabled={!ready} onClick={() => setDone(true)}>Review booking</CTA>
      </div>
    </div>
  );
}

function Toggle({ icon: Icon, label, on, set }: { icon: typeof Bell; label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button onClick={() => set(!on)} className="flex w-full items-center gap-3 text-left">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <span className={cn("relative h-7 w-12 rounded-full transition", on ? "bg-primary" : "bg-border")}>
        <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-card transition-all", on ? "left-6" : "left-1")} />
      </span>
    </button>
  );
}

function MatchingScreen(c: Ctx) {
  const [found, setFound] = useState(false);
  useEffect(() => { const t = setTimeout(() => setFound(true), 2200); return () => clearTimeout(t); }, []);
  return (
    <div className="flex min-h-full flex-col">
      <TopBar onBack={c.back} title={found ? "Driver found" : "Finding a driver"} />
      <div className="flex-1 space-y-4 px-4">
        <MapPreview height={260} route={false} label={found ? "Sample driver · 1.8 km away" : "Searching nearby verified drivers…"} />
        {!found ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
            <p className="font-bold">Matching you with a driver for your {c.makeModel || "car"}</p>
            <p className="text-sm text-muted-foreground">Mock matching — no real driver is contacted</p>
          </div>
        ) : (
          <Card className="animate-rise">
            <div className="flex items-center gap-3">
              <DriverAvatar initials={sampleDriver.initials} />
              <div className="flex-1">
                <div className="font-bold">{sampleDriver.name}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Rating value={sampleDriver.rating} /> · {sampleDriver.trips} trips</div>
              </div>
              <SampleTag>Sample profile</SampleTag>
            </div>
            <div className="mt-3 rounded-xl bg-muted p-3 text-sm">Can drive <b>{c.transmission}</b> vehicles · arrives in <b>~12 min</b></div>
          </Card>
        )}
      </div>
      <div className="p-4">
        <CTA disabled={!found} onClick={() => c.go("confirm")}>Confirm Driver Booking</CTA>
      </div>
    </div>
  );
}

function ConfirmScreen(c: Ctx) {
  const est = estimateFare(c.pickup, c.destination);
  return (
    <div className="pb-6">
      <TopBar title="Booking confirmed" onBack={c.back} right={<SampleTag>Demo</SampleTag>} />
      <div className="space-y-4 px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-success-soft p-4">
          <CheckCircle2 className="h-6 w-6 text-success" />
          <div className="flex-1"><div className="font-bold">Driver on the way</div><div className="text-xs text-muted-foreground">Arriving in ~12 min · sample estimate</div></div>
        </div>
        <MapPreview height={150} progress={0.15} label="Driver heading to you" />
        <Card>
          <div className="flex items-center gap-3">
            <DriverAvatar initials={sampleDriver.initials} />
            <div className="flex-1">
              <div className="font-bold">{sampleDriver.name}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Rating value={sampleDriver.rating} /> · {sampleDriver.years} yrs experience</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 font-semibold text-success"><ShieldCheck className="h-3.5 w-3.5" /> ID checked (illustrative)</span>
            <span className="rounded-full bg-muted px-2.5 py-1 font-semibold">{sampleDriver.licence}</span>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary"><KeyRound className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">{sampleDriver.name.split(" ")[0]} will drive your vehicle</div>
            <div className="text-sm font-bold">{c.makeModel || c.vehicle.name} · {c.plate || "—"} · {c.transmission}</div>
          </div>
        </Card>
        <Card className="space-y-3">
          <RouteLines from={c.pickup} to={c.destination} />
          <div className="flex justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Booking ref</span><span className="font-mono font-bold">SG-{20500 + est.mins}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated fare <SampleTag className="ml-1" /></span><span className="font-bold">LKR {est.fare}</span>
          </div>
        </Card>
        <ActionRow setSheet={c.setSheet} shareLabel="Share Booking" />
        <CTA variant="dark" onClick={() => c.go("journey")}>Driver has arrived — start journey</CTA>
        <p className="text-center text-[11px] text-muted-foreground">Prototype: no real driver has been assigned.</p>
      </div>
    </div>
  );
}

function ActionRow({ setSheet, shareLabel }: { setSheet: (s: SheetKind) => void; shareLabel: string }) {
  const items = [
    { label: "Contact Driver", Icon: Phone, s: "driver" as const },
    { label: shareLabel, Icon: Share2, s: "share" as const },
    { label: "Contact Support", Icon: Headphones, s: "support" as const },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ label, Icon, s }) => (
        <button key={label} onClick={() => setSheet(s)} className="flex flex-col items-center gap-1.5 rounded-2xl bg-card py-3 text-xs font-bold shadow-card">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary"><Icon className="h-4 w-4" /></span>
          {label}
        </button>
      ))}
    </div>
  );
}

function JourneyScreen(c: Ctx) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setP((v) => Math.min(1, v + 0.02)), 120);
    return () => clearInterval(t);
  }, []);
  const done = p >= 1;
  const est = estimateFare(c.pickup, c.destination);
  const left = Math.max(0, Math.round(est.mins * (1 - p)));
  return (
    <div className="pb-6">
      <TopBar title={done ? "You've arrived" : "Journey in progress"} onBack={c.back} right={<SampleTag>Demo</SampleTag>} />
      <div className="space-y-4 px-4">
        <MapPreview height={230} progress={p} label={done ? "Arrived at destination" : `Your car · ${left} min to go`} />
        <div className="h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${p * 100}%` }} /></div>

        {done ? (
          <Card className="animate-rise text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h2 className="mt-2 text-lg font-extrabold">You and your {c.makeModel || "car"} have arrived</h2>
            <p className="text-sm text-muted-foreground">Parked at {c.destination}. Keys returned to you.</p>
            <div className="mt-3 rounded-xl bg-muted p-3 text-sm">Sample fare <b>LKR {est.fare}</b> · {est.km} km</div>
          </Card>
        ) : (
          <Card className="flex items-center gap-3">
            <DriverAvatar initials={sampleDriver.initials} size={48} />
            <div className="flex-1">
              <div className="font-bold">{sampleDriver.name} is driving</div>
              <div className="text-xs text-muted-foreground">{c.makeModel || c.vehicle.name} · {c.plate}</div>
            </div>
            <Rating value={sampleDriver.rating} />
          </Card>
        )}
        <Card><RouteLines from={c.pickup} to={c.destination} /></Card>
        {!done && <ActionRow setSheet={c.setSheet} shareLabel="Share Trip" />}
        {done && <CTA onClick={() => c.reset("home")}>Done</CTA>}
      </div>
    </div>
  );
}

function CampaignScreen(c: Ctx) {
  const tiles = [
    { img: officeImg, label: "Leaving work" },
    { img: weddingImg, label: "Family wedding" },
    { img: tiredImg, label: "After a long day" },
    { img: heroNight, label: "A night out with friends" },
  ];
  return (
    <div className="pb-6">
      <div className="relative h-80">
        <img src={heroNight} alt="SafeGo driver at the wheel of a customer's car" className="absolute inset-0 h-full w-full object-cover" width={1024} height={768} />
        <div className="absolute inset-0 bg-night-fade" />
        <div className="absolute left-4 top-4"><button onClick={c.back} className="rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold">← Back</button></div>
        <div className="absolute bottom-5 left-5 right-5 text-primary-foreground">
          <SafeGoMark inverted />
          <h1 className="mt-2 text-[28px] font-extrabold leading-tight">Your car doesn't have to stay behind.</h1>
        </div>
      </div>
      <div className="space-y-5 px-4 pt-5">
        <p className="text-sm text-muted-foreground">Whether you're heading home after an event, feeling too tired to drive, or simply want someone else behind the wheel, book a driver for your own vehicle with SafeGo.</p>
        <div className="grid grid-cols-2 gap-3">
          {tiles.map((t) => (
            <div key={t.label} className="relative aspect-square overflow-hidden rounded-2xl">
              <img src={t.img} alt={t.label} className="h-full w-full object-cover" loading="lazy" width={816} height={816} />
              <div className="absolute inset-0 bg-night-fade" />
              <span className="absolute bottom-2 left-3 right-3 text-sm font-bold text-primary-foreground">{t.label}</span>
            </div>
          ))}
        </div>
        <Card className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">Or simply because you'd rather not drive today.</span>
        </Card>
        <CTA onClick={() => c.go("situation")}><KeyRound className="h-5 w-5" /> Book a Driver</CTA>
      </div>
    </div>
  );
}

function ActivityScreen(c: Ctx) {
  return (
    <div>
      <TopBar title="Activity" />
      <div className="space-y-3 px-4">
        <div className="flex gap-2"><Chip active>SafeGo drivers</Chip><Chip>PickMe rides</Chip></div>
        {recentBookings.map((b) => (
          <Card key={b.id}>
            <div className="flex justify-between text-xs text-muted-foreground"><span>{b.date}</span><span className="font-mono">{b.id}</span></div>
            <div className="mt-2"><RouteLines from={b.from} to={b.to} /></div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-bold">{b.fare} <SampleTag className="ml-1" /></span>
              <button onClick={() => { c.setPickup(b.from); c.setDestination(b.to); c.go("book"); }} className="text-sm font-bold text-primary">Rebook</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AccountScreen() {
  return (
    <div>
      <TopBar title="Account" />
      <div className="space-y-3 px-4">
        <Card className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">MN</div>
          <div><div className="font-bold">Mihinsa N.</div><div className="text-xs text-muted-foreground">Sample account</div></div>
        </Card>
        <Card className="space-y-1 p-2">
          {[
            [Car, "My vehicles"], [MapPin, "Saved places"], [CreditCard, "Payment"], [Megaphone, "SafeGo offers"], [Settings, "Settings"], [LogOut, "Sign out"],
          ].map(([Icon, l]) => {
            const I = Icon as typeof Car;
            return (
              <button key={l as string} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted">
                <I className="h-5 w-5 text-muted-foreground" /><span className="flex-1 text-left">{l as string}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

function LocationSheet({ open, title, onClose, onPick, current }: { open: boolean; title: string; onClose: () => void; onPick: (v: string) => void; current?: boolean }) {
  const [q, setQ] = useState("");
  const list = [...savedPlaces.map((p) => `${p.label} — ${p.address}`), ...suggestions].filter((s) => s.toLowerCase().includes(q.toLowerCase()));
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <input autoFocus className={inputCls} placeholder="Search a place" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && q) onPick(q); }} />
      <div className="no-scrollbar mt-3 max-h-72 space-y-1 overflow-y-auto">
        {current && (
          <button onClick={() => onPick("Current location — Dutch Hospital, Colombo 01")} className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left text-sm font-semibold text-primary">
            <Navigation className="h-4 w-4" /> Use my current location
          </button>
        )}
        {q && !list.includes(q) && (
          <button onClick={() => onPick(q)} className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left text-sm font-semibold"><MapPin className="h-4 w-4 text-muted-foreground" /> “{q}”</button>
        )}
        {list.map((s) => (
          <button key={s} onClick={() => onPick(s.includes(" — ") ? s.split(" — ")[1]! : s)} className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left text-sm font-medium hover:bg-muted">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" /> {s}
          </button>
        ))}
      </div>
    </Sheet>
  );
}

function ShareSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <Sheet open={open} onClose={() => { setCopied(false); onClose(); }} title="Share your trip">
      <p className="mb-4 text-sm text-muted-foreground">Let someone follow your driver and vehicle live until you arrive.</p>
      <div className="mb-4 grid grid-cols-4 gap-3 text-center text-xs font-semibold">
        {["WhatsApp", "Viber", "SMS", "Messenger"].map((a) => (
          <button key={a} className="flex flex-col items-center gap-1.5"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-muted"><Share2 className="h-5 w-5" /></span>{a}</button>
        ))}
      </div>
      <button onClick={() => setCopied(true)} className="flex w-full items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm">
        <span className="font-mono">pickme.lk/safego/t/demo123</span>
        <span className="flex items-center gap-1 font-bold text-primary"><Copy className="h-4 w-4" />{copied ? "Copied" : "Copy"}</span>
      </button>
      <SampleTag className="mt-4">Demo link — not live</SampleTag>
    </Sheet>
  );
}
