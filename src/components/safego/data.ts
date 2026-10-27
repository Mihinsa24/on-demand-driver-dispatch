export const SAMPLE = "Sample";

export const savedPlaces = [
  { id: "home", label: "Home", address: "42 Flower Rd, Colombo 07" },
  { id: "work", label: "Work", address: "WTC West Tower, Colombo 01" },
  { id: "fav", label: "Mum's place", address: "18 Lake Dr, Rajagiriya" },
];

export const suggestions = [
  "Cinnamon Grand, Colombo 03",
  "Shangri-La Hotel, Colombo 02",
  "Nelum Pokuna Theatre, Colombo 07",
  "Water's Edge, Battaramulla",
  "One Galle Face Mall, Colombo 02",
  "Mount Lavinia Hotel",
];

export const myVehicles = [
  { id: "v1", name: "Toyota Aqua", plate: "CAB-4521", transmission: "Automatic", colour: "Pearl White" },
  { id: "v2", name: "Suzuki Wagon R", plate: "CBE-1187", transmission: "Automatic", colour: "Silver" },
];

export const sampleDriver = {
  name: "Nuwan Perera",
  initials: "NP",
  rating: 4.8,
  trips: 312,
  years: 6,
  languages: "Sinhala, English",
  licence: "Light vehicle · Auto & Manual",
};

export const recentBookings = [
  { id: "SG-20431", from: "Water's Edge", to: "Home", date: "Sat, 24 Oct · 11:40 PM", fare: "LKR 2,450" },
  { id: "SG-19877", from: "Work", to: "Lanka Hospitals", date: "Tue, 13 Oct · 2:15 PM", fare: "LKR 1,380" },
];

export type SituationId = "drinking" | "tired" | "unwell" | "event" | "convenience" | "just";

export const situations: { id: SituationId; title: string; guidance: string }[] = [
  { id: "drinking", title: "I've been drinking", guidance: "It's safer not to drive after drinking. Book a driver to take you and your car home." },
  { id: "tired", title: "I'm feeling tired", guidance: "Take a break from driving. Let a driver handle the journey." },
  { id: "unwell", title: "I'm not feeling well", guidance: "If you don't feel fit to drive, a personal driver can help you get where you need to go." },
  { id: "event", title: "I'm leaving an event", guidance: "Enjoy your event without worrying about driving your car home." },
  { id: "convenience", title: "I'd like a driver for convenience", guidance: "Sit back, catch up on calls or rest. Your driver takes the wheel." },
  { id: "just", title: "Just book a driver", guidance: "No reason needed. Let's get your booking started." },
];

export const scheduleScenarios = ["Office function", "Wedding", "Appointment", "Concert", "Long work day"];

export function estimateFare(from: string, to: string) {
  const seed = (from.length * 7 + to.length * 13) % 9;
  const km = 6 + seed * 1.4;
  const fare = Math.round((900 + km * 140) / 10) * 10;
  return { km: km.toFixed(1), fare: fare.toLocaleString("en-LK"), mins: Math.round(km * 2.6 + 6) };
}
