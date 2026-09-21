import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Phone, ShieldCheck, Sprout } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LocationPicker } from "@/components/location-picker";
import { languages, useI18n } from "@/lib/i18n";
import { useSession, type GeoLocation, type Role } from "@/lib/session";
import { categories } from "@/lib/agri-data";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Log in — AgriXchange" },
      {
        name: "description",
        content:
          "Sign in to AgriXchange with your mobile number and a one-time password, choose your role and set up your farm or equipment business.",
      },
      { property: "og:title", content: "Log in to AgriXchange" },
      {
        property: "og:description",
        content: "Mobile OTP sign-in for farmers and equipment owners.",
      },
    ],
  }),
  component: AuthPage,
});

const MOCK_OTP = "123456";
const COUNTRY_CODES = ["+91", "+880", "+94", "+977", "+1", "+44"];
const CROPS = ["Cotton", "Paddy", "Maize", "Chilli", "Groundnut", "Sugarcane", "Vegetables", "Wheat"];
const FARMING_TYPES = ["Conventional", "Organic", "Natural farming", "Mixed / agroforestry"];

type Step = "mobile" | "otp" | "role" | "onboarding";

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { profile, signIn, updateProfile } = useSession();

  const [step, setStep] = useState<Step>("mobile");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [verified, setVerified] = useState(false);

  // Onboarding fields
  const [name, setName] = useState(profile?.name ?? "");
  const [farmName, setFarmName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [farmSize, setFarmSize] = useState("25");
  const [crop, setCrop] = useState("Cotton");
  const [farmingType, setFarmingType] = useState("Conventional");
  const [language, setLanguage] = useState("English");
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [picked, setPicked] = useState<string[]>(["Machinery"]);
  const [role, setRole] = useState<Role>("farmer");

  useEffect(() => {
    if (step !== "otp" || seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [step, seconds]);

  const masked = mobile.length >= 4 ? `${countryCode} XXXXX ${mobile.slice(-5)}` : `${countryCode} ${mobile}`;

  function sendOtp() {
    if (mobile.replace(/\D/g, "").length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setSeconds(30);
      setOtp("");
      toast.success("OTP sent", { description: `Demo OTP is ${MOCK_OTP}` });
    }, 800);
  }

  function verifyOtp() {
    if (otp.length !== 6) {
      setError("Enter the full 6-digit OTP");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (otp !== MOCK_OTP) {
        setError("That OTP is incorrect. Try again or resend.");
        return;
      }
      setError("");
      setVerified(true);
      signIn(`${mobile}`, countryCode);
      window.setTimeout(() => setStep("role"), 700);
    }, 800);
  }

  function completeSetup() {
    if (!name.trim()) {
      toast.error("Please add your full name");
      return;
    }
    if (!location) {
      toast.error("Please select your location");
      return;
    }
    updateProfile({
      role,
      name: name.trim(),
      farmName: farmName.trim() || `${name.trim()}'s Farm`,
      businessName: businessName.trim(),
      farmSize: Number(farmSize) || 0,
      crop,
      farmingType,
      language,
      location,
      categories: picked,
      onboarded: true,
    });
    toast.success(`Welcome to AgriXchange, ${name.trim()} 🌱`, {
      description: "Your profile is ready. Opening your dashboard.",
    });
    navigate({ to: "/dashboard" });
  }

  const showFarmer = role === "farmer" || role === "both";
  const showOwner = role === "owner" || role === "both";

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
      <div className="hidden lg:block">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-forest text-forest-foreground">
          <Sprout className="size-6" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight">
          {t("Welcome to AgriXchange")} 🌱
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          {t("Connect with farmers. Share resources. Grow smarter.")}
        </p>
        <div className="mt-8 grid gap-3 text-sm text-muted-foreground">
          <p>✓ Verified farmers and equipment owners</p>
          <p>✓ Distance-aware resource matching</p>
          <p>✓ Transparent rental contracts and ratings</p>
          <p>✓ Available in 9 Indian languages</p>
        </div>
      </div>

      <div className="surface w-full p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="mono-label text-primary">
            {step === "mobile"
              ? "Step 1 · Mobile"
              : step === "otp"
                ? "Step 2 · OTP"
                : step === "role"
                  ? "Step 3 · Role"
                  : "Step 4 · Setup"}
          </p>
          <LanguageSwitcher />
        </div>

        {step === "mobile" ? (
          <div className="mt-6 grid gap-5">
            <div>
              <h2 className="text-2xl font-bold lg:hidden">{t("Welcome to AgriXchange")} 🌱</h2>
              <p className="mt-2 text-sm text-muted-foreground lg:hidden">
                {t("Connect with farmers. Share resources. Grow smarter.")}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>{t("Mobile number")}</Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="h-14 w-28 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border px-3">
                  <Phone className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    value={mobile}
                    inputMode="numeric"
                    maxLength={10}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="98765 43210"
                    className="h-14 border-0 px-0 text-base shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>
            <Button onClick={sendOtp} disabled={loading} className="h-12 w-full rounded-full">
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {t("Send OTP")}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo mode — OTP is simulated, use <span className="font-mono">123456</span>. Ready for
              a real SMS provider.
            </p>
          </div>
        ) : null}

        {step === "otp" ? (
          <div className="mt-6 grid gap-5">
            {verified ? (
              <div className="grid justify-items-center gap-3 py-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ShieldCheck className="size-7" />
                </span>
                <p className="text-lg font-semibold">Mobile number verified</p>
                <p className="text-sm text-muted-foreground">Taking you to role selection…</p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Enter the 6-digit OTP sent to</p>
                  <p className="font-display text-lg font-semibold">{masked}</p>
                </div>

                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="size-12 rounded-xl border text-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                {error ? <p className="text-sm text-destructive">{error}</p> : null}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {seconds > 0 ? `Resend available in 0:${String(seconds).padStart(2, "0")}` : "Didn't receive the OTP?"}
                  </span>
                  <button
                    disabled={seconds > 0}
                    onClick={() => {
                      setSeconds(30);
                      setOtp("");
                      toast.success("OTP resent", { description: `Demo OTP is ${MOCK_OTP}` });
                    }}
                    className="font-medium text-primary disabled:text-muted-foreground"
                  >
                    {t("Resend OTP")}
                  </button>
                </div>

                <Button onClick={verifyOtp} disabled={loading} className="h-12 w-full rounded-full">
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  {t("Verify & Continue")}
                </Button>
                <button
                  onClick={() => {
                    setStep("mobile");
                    setOtp("");
                    setError("");
                  }}
                  className="text-sm text-muted-foreground underline"
                >
                  {t("Change mobile number")}
                </button>
              </>
            )}
          </div>
        ) : null}

        {step === "role" ? (
          <div className="mt-6 grid gap-4">
            <h2 className="text-2xl font-bold">{t("How will you use AgriXchange?")}</h2>
            {(
              [
                { key: "farmer", emoji: "👨‍🌾", label: t("Farmer"), body: "Find and book resources near your farm" },
                { key: "owner", emoji: "🚜", label: t("Equipment / Resource Owner"), body: "List equipment and earn from idle assets" },
                { key: "both", emoji: "🤝", label: t("Both Farmer & Owner"), body: "Share what you own, book what you need" },
              ] as const
            ).map((option) => (
              <button
                key={option.key}
                onClick={() => setRole(option.key)}
                className={
                  "flex items-start gap-4 rounded-2xl border p-5 text-left transition-colors " +
                  (role === option.key
                    ? "border-primary bg-secondary/70"
                    : "border-border hover:bg-secondary/50")
                }
              >
                <span className="text-2xl">{option.emoji}</span>
                <span>
                  <span className="block font-semibold">{option.label}</span>
                  <span className="block text-sm text-muted-foreground">{option.body}</span>
                </span>
              </button>
            ))}
            <Button onClick={() => setStep("onboarding")} className="h-12 w-full rounded-full">
              Continue
            </Button>
          </div>
        ) : null}

        {step === "onboarding" ? (
          <div className="mt-6 grid gap-4">
            <h2 className="text-2xl font-bold">
              Welcome{name ? `, ${name.split(" ")[0]}` : ""} 👋
            </h2>
            <p className="-mt-2 text-sm text-muted-foreground">
              {showOwner && !showFarmer ? "Let's set up your equipment business." : "Let's set up your farm."}
            </p>

            <div className="grid gap-2">
              <Label>{t("Full name")}</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anitha Reddy"
                className="h-12 rounded-2xl"
              />
            </div>

            <div className="grid gap-2">
              <Label>Mobile number</Label>
              <Input
                value={`${countryCode} ${mobile}`}
                readOnly
                className="h-12 rounded-2xl bg-secondary/60"
              />
            </div>

            {showFarmer ? (
              <>
                <div className="grid gap-2">
                  <Label>{t("Farm name")}</Label>
                  <Input
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="Green Valley Farm"
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>{t("Farm size")} (acres)</Label>
                    <Input
                      value={farmSize}
                      inputMode="numeric"
                      onChange={(e) => setFarmSize(e.target.value.replace(/\D/g, ""))}
                      className="h-12 rounded-2xl"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("Primary crop")}</Label>
                    <Select value={crop} onValueChange={setCrop}>
                      <SelectTrigger className="h-12 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CROPS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>{t("Farming type")}</Label>
                  <Select value={farmingType} onValueChange={setFarmingType}>
                    <SelectTrigger className="h-12 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FARMING_TYPES.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : null}

            {showOwner ? (
              <>
                <div className="grid gap-2">
                  <Label>Business / farm name</Label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ravi Agro Services"
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Resource categories you offer</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))
                        }
                        className={
                          picked.includes(c)
                            ? "rounded-full bg-lime px-3.5 py-1.5 text-sm font-medium text-lime-foreground"
                            : "rounded-full bg-secondary px-3.5 py-1.5 text-sm text-secondary-foreground hover:bg-muted"
                        }
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            <div className="grid gap-2">
              <Label>{showOwner && !showFarmer ? "Owner location" : t("Farm location")}</Label>
              <LocationPicker value={location} onChange={setLocation} />
            </div>

            <div className="grid gap-2">
              <Label>{t("Preferred language")}</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-12 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.code} value={l.label}>
                      {l.native} — {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={completeSetup} className="h-12 w-full rounded-full">
              {t("Complete Setup")}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
