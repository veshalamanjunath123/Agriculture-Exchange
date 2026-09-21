import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/language-switcher";
import { agriPulse, resources, smartMatch } from "@/lib/agri-data";
import { useI18n } from "@/lib/i18n";
import { activeBooking, useSession } from "@/lib/session";

type Msg = { role: "user" | "ai"; text: string; verified?: boolean };

const TOPICS = [
  { icon: "🌧", label: "Weather" },
  { icon: "💧", label: "Irrigation" },
  { icon: "🌱", label: "Crops" },
  { icon: "🐛", label: "Pest risks" },
  { icon: "🚜", label: "Equipment" },
  { icon: "💰", label: "Marketplace" },
];

const RAIN_LINE = "Rain is expected in the next 18 hours.";

export function AgriAiAssistant() {
  const { t, lang } = useI18n();
  const { profile, bookings } = useSession();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const name = profile?.name || "farmer";

  useEffect(() => {
    setMessages([
      {
        role: "ai",
        text: `Hello ${name} 👋 ${t("How can I help with your farm?")}`,
      },
    ]);
  }, [lang, name, t]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function answer(question: string): Msg {
    const q = question.toLowerCase();
    const booking = activeBooking(bookings);

    if (/(rain|weather|forecast|వర్ష|बारिश)/.test(q)) {
      return {
        role: "ai",
        text: `${t(RAIN_LINE)} Regional models agree at ${agriPulse.metrics[1]?.value} probability over ${agriPulse.region}. Source: pooled weather stations (verified sensor data).`,
        verified: true,
      };
    }
    if (/(irrigat|water|moisture|నీ|सिंचाई|पानी)/.test(q)) {
      return {
        role: "ai",
        text: `${t(RAIN_LINE)} Soil moisture is at ${agriPulse.metrics[0]?.value}, so irrigation can likely wait about 12 hours — an estimated 1,240 L/acre saved. AI recommendation, confidence ${agriPulse.confidence}%.`,
      };
    }
    if (/(pest|worm|disease|कीट|పురుగు)/.test(q)) {
      return {
        role: "ai",
        text: `Pest risk is ${agriPulse.metrics[2]?.value.toLowerCase()} — fall armyworm confirmed on 3 farms within 9 km (verified sightings). Scout maize whorls and young cotton early morning.`,
        verified: true,
      };
    }
    if (/(tractor|drone|harvester|pump|equipment|rent|machine|ट्रैक्टर|ట్రాక్టర్)/.test(q)) {
      const matches = smartMatch({ text: question, radiusKm: 20, days: 2, crop: profile?.crop || "Cotton", maxPrice: 10000 });
      const top = matches[0];
      if (top) {
        return {
          role: "ai",
          text: `I found ${matches.length} matching options within 20 km. Closest available: ${top.resource.title} from ${top.resource.owner}, ${top.resource.distanceKm} km away, ₹${top.resource.price.toLocaleString("en-IN")}/${top.resource.unit}, ⭐ ${top.resource.rating}. Open the Resource Map or Smart Resource Match to request it.`,
        };
      }
    }
    if (/(track|where|eta|delivery)/.test(q)) {
      return booking
        ? {
            role: "ai",
            text: `${booking.title} is at stage "${["Booking confirmed", "Owner preparing equipment", "Equipment on the way", "Arrived at farm", "Rental active", "Return initiated", "Returned", "Completed"][booking.stage]}", ${booking.distanceKm} km away, ETA ${booking.etaMinutes || 0} minutes. Open booking ${booking.id} to see live tracking.`,
            verified: true,
          }
        : { role: "ai", text: "You have no active booking right now. Search the marketplace to book equipment." };
    }
    if (/(fertil|compost|urea|खाद|ఎరువు)/.test(q)) {
      return {
        role: "ai",
        text: `For cotton at flowering, split the remaining nitrogen into two doses. Organic vermicompost is listed at ₹6,400/tonne, 11.5 km away. AI recommendation — confirm with your soil test report.`,
      };
    }
    if (/(price|market|sell|buy|बाज़ार)/.test(q)) {
      return {
        role: "ai",
        text: `There are ${resources.length} live listings near you across machinery, seeds, fertiliser, irrigation, energy, storage and labour. Rent rates range ₹450–₹3,600 per day.`,
      };
    }
    if (/(yield|harvest|profit)/.test(q)) {
      return {
        role: "ai",
        text: `Yield model projects 14.2 quintals/acre for your cotton block, ±8%. AI prediction from pooled regional data, not a guarantee.`,
      };
    }
    return {
      role: "ai",
      text: `I can help with weather, irrigation, crops, pest risk, equipment, marketplace listings, AgriPulse insights and navigating AgriXchange. Try "Find me a tractor nearby" or "Should I irrigate today?".`,
    };
  }

  function send(text: string) {
    const question = text.trim();
    if (!question) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, answer(question)]);
      setThinking(false);
    }, 650);
  }

  return (
    <>
      {open ? null : (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-full bg-forest px-4 py-3 text-sm font-medium text-forest-foreground shadow-lift transition-transform hover:-translate-y-0.5 md:bottom-6"
        >
          <Bot className="size-5 text-lime" />
          {t("Ask AgriAI")}
        </button>
      )}

      {open ? (
        <div className="fixed bottom-20 left-3 right-3 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lift md:bottom-6 md:right-auto md:w-96">
          <div className="flex items-center gap-2 bg-forest px-4 py-3 text-forest-foreground">
            <Bot className="size-5 text-lime" />
            <p className="flex-1 font-display font-semibold">AgriAI Assistant</p>
            <LanguageSwitcher compact />
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            <div className="flex flex-wrap gap-1.5">
              {TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => send(topic.label)}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground hover:bg-muted"
                >
                  {topic.icon} {t(topic.label)}
                </button>
              ))}
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[90%] text-sm text-foreground"
                  }
                >
                  {m.role === "ai" ? (
                    <span className="mono-label mb-1 block text-primary">
                      {m.verified ? "Verified data" : "AI recommendation"}
                    </span>
                  ) : null}
                  {m.text}
                </div>
              </div>
            ))}

            {thinking ? (
              <p className="animate-pulse text-sm text-muted-foreground">Thinking…</p>
            ) : null}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="h-11 rounded-full"
            />
            <Button type="submit" size="icon" className="size-11 shrink-0 rounded-full">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      ) : null}
    </>
  );
}
