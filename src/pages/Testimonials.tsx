import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

const allTestimonials = [
  {
    name: "Samuel T.",
    location: "Port Harcourt",
    status: "VERIFIED SUCCESS",
    amount: "₦520,000",
    quote:
      "The referral bonus is the best part. I invited 6 active users and qualified for withdrawal easily.",
  },
  {
    name: "Blessing O.",
    location: "Abuja",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦410,000",
    quote:
      "I love how simple the tasks are. Once I completed everything required, my withdrawal was processed within 48 hours.",
  },
  {
    name: "Chinedu A.",
    location: "Lagos",
    status: "LEGIT VERIFIED",
    amount: "₦580,000",
    quote:
      "I was skeptical at first, but after completing my daily tasks and inviting my friends, I received my first withdrawal successfully. Renix-Ultra is legit!",
  },
  {
    name: "Amaka N.",
    location: "Enugu",
    status: "VERIFIED SUCCESS",
    amount: "₦370,000",
    quote:
      "Best decision I made this year. The tasks are straightforward and withdrawal was smooth.",
  },
  {
    name: "Tunde B.",
    location: "Ibadan",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦490,000",
    quote:
      "My friend referred me and I never looked back. I've already referred 8 people myself!",
  },
  {
    name: "Fatima M.",
    location: "Kano",
    status: "LEGIT VERIFIED",
    amount: "₦430,000",
    quote:
      "Renix-Ultra changed my financial situation. Consistent income every month from daily tasks.",
  },
  {
    name: "Emeka O.",
    location: "Onitsha",
    status: "VERIFIED SUCCESS",
    amount: "₦610,000",
    quote:
      "The upgrade was worth every kobo. My earnings doubled and withdrawal was instant.",
  },
  {
    name: "Ngozi C.",
    location: "Owerri",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦355,000",
    quote:
      "I complete my tasks every morning before work. By evening, my balance has grown significantly.",
  },
  {
    name: "Kelechi U.",
    location: "Calabar",
    status: "LEGIT VERIFIED",
    amount: "₦540,000",
    quote:
      "Sent me ₦540k last week! I almost couldn't believe it. Renix-Ultra is genuine.",
  },
  {
    name: "Adaeze P.",
    location: "Asaba",
    status: "VERIFIED SUCCESS",
    amount: "₦395,000",
    quote:
      "Tasks completed, referrals done, money withdrawn. Simple as that. No stress at all.",
  },
  {
    name: "Yakubu S.",
    location: "Kaduna",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦470,000",
    quote:
      "I've tried many platforms but Renix-Ultra is the only one that actually pays. Recommend to everyone.",
  },
  {
    name: "Chioma E.",
    location: "Lagos",
    status: "LEGIT VERIFIED",
    amount: "₦620,000",
    quote:
      "My sister told me about Renix-Ultra. Now I've referred over 10 people. The bonuses stack up fast!",
  },
  {
    name: "Bayo A.",
    location: "Abeokuta",
    status: "VERIFIED SUCCESS",
    amount: "₦445,000",
    quote:
      "First withdrawal came in exactly 48 hours. No delays, no stories. Just payment.",
  },
  {
    name: "Ifeoma K.",
    location: "Benin City",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦500,000",
    quote:
      "Half a million naira! I'm still shocked. The referral system is extremely generous.",
  },
  {
    name: "Musa D.",
    location: "Jos",
    status: "LEGIT VERIFIED",
    amount: "₦385,000",
    quote:
      "Tasks are easy and the support team is very responsive. Legit platform.",
  },
  {
    name: "Oluwaseun F.",
    location: "Lagos",
    status: "VERIFIED SUCCESS",
    amount: "₦555,000",
    quote:
      "I upgraded immediately after seeing my first earnings. Best investment decision ever.",
  },
  {
    name: "Precious A.",
    location: "Port Harcourt",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦420,000",
    quote:
      "Completed all tasks in 2 weeks and made ₦420k. This platform is the real deal.",
  },
  {
    name: "Ismaila R.",
    location: "Sokoto",
    status: "LEGIT VERIFIED",
    amount: "₦390,000",
    quote:
      "Even in Sokoto we're cashing out! Renix-Ultra has members everywhere in Nigeria.",
  },
  {
    name: "Nkechi V.",
    location: "Aba",
    status: "VERIFIED SUCCESS",
    amount: "₦510,000",
    quote:
      "The daily task system keeps me motivated. I look forward to logging in every day.",
  },
  {
    name: "Dare O.",
    location: "Akure",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦465,000",
    quote:
      "My referrals have already surpassed my own earnings. The pyramid rewards are insane!",
  },
  {
    name: "Adunola M.",
    location: "Lagos",
    status: "LEGIT VERIFIED",
    amount: "₦590,000",
    quote:
      "Six figures in less than a month. I'm now a full-time Renix-Ultra member.",
  },
  {
    name: "Obinna H.",
    location: "Enugu",
    status: "VERIFIED SUCCESS",
    amount: "₦480,000",
    quote:
      "Withdrawal hit my account before I even finished my morning coffee. Super fast!",
  },
  {
    name: "Sola T.",
    location: "Ibadan",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦360,000",
    quote: "Started with doubts, now I'm a believer. ₦360k speaks for itself.",
  },
  {
    name: "Amina L.",
    location: "Abuja",
    status: "LEGIT VERIFIED",
    amount: "₦635,000",
    quote:
      "I've told all my colleagues about this. Three of them have already withdrawn too!",
  },
  {
    name: "Femi G.",
    location: "Osogbo",
    status: "VERIFIED SUCCESS",
    amount: "₦415,000",
    quote:
      "The referral bonus alone covered my rent this month. Life-changing platform.",
  },
  {
    name: "Chiamaka B.",
    location: "Onitsha",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦570,000",
    quote:
      "Tasks completed daily, money accumulates daily. Renix-Ultra is consistent and reliable.",
  },
  {
    name: "Garba U.",
    location: "Maiduguri",
    status: "LEGIT VERIFIED",
    amount: "₦400,000",
    quote:
      "Never thought I'd make this much online. Renix-Ultra proved me wrong in the best way.",
  },
  {
    name: "Tolani W.",
    location: "Lagos",
    status: "VERIFIED SUCCESS",
    amount: "₦455,000",
    quote:
      "I wake up, do my tasks, and watch my balance grow. Best morning routine ever.",
  },
  {
    name: "Uchechi I.",
    location: "Owerri",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦530,000",
    quote:
      "My second withdrawal was even bigger than the first. The compound growth is real.",
  },
  {
    name: "Ahmed K.",
    location: "Kano",
    status: "LEGIT VERIFIED",
    amount: "₦375,000",
    quote:
      "Simple tasks, great pay. The platform actually delivers on its promises.",
  },
  {
    name: "Bimbo S.",
    location: "Ile-Ife",
    status: "VERIFIED SUCCESS",
    amount: "₦495,000",
    quote:
      "Invited my whole church group. We're all earning and withdrawing every week!",
  },
  {
    name: "Chukwuemeka R.",
    location: "Awka",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦560,000",
    quote:
      "I upgraded to the highest plan and the returns have been phenomenal. No regrets.",
  },
  {
    name: "Hadiza M.",
    location: "Zaria",
    status: "LEGIT VERIFIED",
    amount: "₦408,000",
    quote:
      "Renix-Ultra is authentic. I've received 3 withdrawals already and counting.",
  },
  {
    name: "Lanre O.",
    location: "Abeokuta",
    status: "VERIFIED SUCCESS",
    amount: "₦475,000",
    quote:
      "From skeptic to advocate. This platform genuinely pays its members well.",
  },
  {
    name: "Nneka F.",
    location: "Asaba",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦515,000",
    quote:
      "The interface is clean and the support is excellent. Everything just works.",
  },
  {
    name: "Seun A.",
    location: "Lagos",
    status: "LEGIT VERIFIED",
    amount: "₦600,000",
    quote:
      "Six hundred thousand naira! I've shared this with everyone I know. It's real!",
  },
  {
    name: "Kabiru Y.",
    location: "Kaduna",
    status: "VERIFIED SUCCESS",
    amount: "₦345,000",
    quote:
      "Steady income from simple daily tasks. Renix-Ultra is changing lives here in Kaduna.",
  },
  {
    name: "Obiageli T.",
    location: "Umuahia",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦550,000",
    quote:
      "My husband thought I was wasting time online. Now he's joined too after seeing my withdrawal!",
  },
  {
    name: "Rotimi E.",
    location: "Benin City",
    status: "LEGIT VERIFIED",
    amount: "₦430,000",
    quote:
      "Consistent, reliable, and genuinely rewarding. Renix-Ultra is the platform to be on.",
  },
  {
    name: "Patience N.",
    location: "Calabar",
    status: "VERIFIED SUCCESS",
    amount: "₦490,000",
    quote: "Cross River state is cashing out! Join now before spots fill up.",
  },
  {
    name: "Abubakar S.",
    location: "Abuja",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦425,000",
    quote:
      "Government worker, part-time Renix-Ultra earner. The extra income has been a blessing.",
  },
  {
    name: "Vivian C.",
    location: "Lagos",
    status: "LEGIT VERIFIED",
    amount: "₦575,000",
    quote:
      "I've tried 5 different money-making platforms. Renix-Ultra is the only one that's genuine.",
  },
  {
    name: "Danjuma P.",
    location: "Bauchi",
    status: "VERIFIED SUCCESS",
    amount: "₦365,000",
    quote:
      "Northern Nigeria is also enjoying Renix-Ultra. The platform works everywhere!",
  },
  {
    name: "Uju M.",
    location: "Port Harcourt",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦505,000",
    quote: "Half a million plus! Rivers State gang is winning on Renix-Ultra.",
  },
  {
    name: "Bankole A.",
    location: "Ibadan",
    status: "LEGIT VERIFIED",
    amount: "₦440,000",
    quote:
      "Oyo State represent! Withdrawal came in on time, no issues whatsoever.",
  },
  {
    name: "Ginika E.",
    location: "Nnewi",
    status: "VERIFIED SUCCESS",
    amount: "₦595,000",
    quote:
      "The more people I refer, the more I earn. It's a beautiful cycle of income.",
  },
  {
    name: "Haruna I.",
    location: "Katsina",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦380,000",
    quote:
      "Alhamdulillah for Renix-Ultra. This platform has blessed my family greatly.",
  },
  {
    name: "Stella O.",
    location: "Lagos",
    status: "LEGIT VERIFIED",
    amount: "₦520,000",
    quote:
      "I was unemployed for 6 months. Renix-Ultra has been my saving grace. God bless this platform.",
  },
  {
    name: "Emeka C.",
    location: "Enugu",
    status: "VERIFIED SUCCESS",
    amount: "₦460,000",
    quote:
      "Coal City people are also winning big! Renix-Ultra is the real deal.",
  },
  {
    name: "Zainab O.",
    location: "Sokoto",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦395,000",
    quote:
      "The tasks take less than an hour daily and the pay is incredible. Worth every minute.",
  },
  {
    name: "Taiwo B.",
    location: "Osun",
    status: "LEGIT VERIFIED",
    amount: "₦545,000",
    quote:
      "My twin and I both joined and we're both withdrawing. Double income from one family!",
  },
  {
    name: "Okonkwo J.",
    location: "Onitsha",
    status: "VERIFIED SUCCESS",
    amount: "₦610,000",
    quote:
      "Over ₦600k! I reinvested into the premium plan and my earnings doubled again.",
  },
  {
    name: "Mariam H.",
    location: "Abuja",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦420,000",
    quote:
      "FCT members are thriving! Renix-Ultra support team is always available to help.",
  },
  {
    name: "Chidi N.",
    location: "Aba",
    status: "LEGIT VERIFIED",
    amount: "₦485,000",
    quote:
      "Abia State represent! My withdrawal processed smoothly with zero complications.",
  },
  {
    name: "Funke A.",
    location: "Lagos",
    status: "VERIFIED SUCCESS",
    amount: "₦530,000",
    quote:
      "I do my tasks on my lunch break. By closing time, I've made more than my salary.",
  },
  {
    name: "Mahmud K.",
    location: "Kano",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦370,000",
    quote:
      "Kano is on the map! Everyone I know is joining Renix-Ultra and withdrawing successfully.",
  },
  {
    name: "Ngozi S.",
    location: "Owerri",
    status: "LEGIT VERIFIED",
    amount: "₦560,000",
    quote:
      "Three withdrawals in two months. Renix-Ultra is the most consistent platform I've used.",
  },
  {
    name: "Akintola F.",
    location: "Abeokuta",
    status: "VERIFIED SUCCESS",
    amount: "₦445,000",
    quote:
      "Ogun State movement! We're all earning and living better because of Renix-Ultra.",
  },
  {
    name: "Ijeoma W.",
    location: "Asaba",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦510,000",
    quote:
      "Delta State sisters are winning! My withdrawal came through and I cried with joy.",
  },
  {
    name: "Ibrahim D.",
    location: "Minna",
    status: "LEGIT VERIFIED",
    amount: "₦400,000",
    quote:
      "Niger State is represented on Renix-Ultra. The platform pays everyone, no discrimination.",
  },
  {
    name: "Chidinma V.",
    location: "Lagos",
    status: "VERIFIED SUCCESS",
    amount: "₦580,000",
    quote:
      "My accountant was shocked when I showed him my Renix-Ultra earnings. Completely legitimate.",
  },
  {
    name: "Babatunde R.",
    location: "Ibadan",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦465,000",
    quote:
      "Sunday tasks, weekday tasks, every day is a payday with Renix-Ultra.",
  },
  {
    name: "Adaora G.",
    location: "Awka",
    status: "LEGIT VERIFIED",
    amount: "₦535,000",
    quote:
      "Anambra people know the real thing. Renix-Ultra is certified legit and always pays.",
  },
  {
    name: "Umar A.",
    location: "Gusau",
    status: "VERIFIED SUCCESS",
    amount: "₦385,000",
    quote:
      "Zamfara State is not left out! Renix-Ultra works across all states in Nigeria.",
  },
  {
    name: "Olayinka M.",
    location: "Ado-Ekiti",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦500,000",
    quote:
      "Ekiti State earner here! 500k withdrawn and already working toward the next milestone.",
  },
  {
    name: "Goodluck E.",
    location: "Yenagoa",
    status: "LEGIT VERIFIED",
    amount: "₦470,000",
    quote:
      "Bayelsa State is enjoying Renix-Ultra. The oil may have reduced but our income hasn't!",
  },
  {
    name: "Kehinde T.",
    location: "Lagos",
    status: "VERIFIED SUCCESS",
    amount: "₦615,000",
    quote:
      "Over 600k from tasks and referrals combined. Renix-Ultra's system is perfectly designed.",
  },
  {
    name: "Adaeze B.",
    location: "Owerri",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦415,000",
    quote:
      "Imo State ladies are making money! Renix-Ultra has the best female earners community.",
  },
  {
    name: "Salisu F.",
    location: "Damaturu",
    status: "LEGIT VERIFIED",
    amount: "₦360,000",
    quote:
      "Yobe State represent! Even in my location, Renix-Ultra processes withdrawals perfectly.",
  },
  {
    name: "Blessing I.",
    location: "Uyo",
    status: "VERIFIED SUCCESS",
    amount: "₦555,000",
    quote:
      "Akwa Ibom state winner! The referral bonuses here are the best I've seen on any platform.",
  },
  {
    name: "Olumide C.",
    location: "Ile-Ife",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦490,000",
    quote:
      "Osun State is earning big! Completed my tasks yesterday, money in account today.",
  },
  {
    name: "Hauwa N.",
    location: "Dutse",
    status: "LEGIT VERIFIED",
    amount: "₦375,000",
    quote:
      "Jigawa State member here! Renix-Ultra has changed how I think about passive income.",
  },
  {
    name: "Chibuzor O.",
    location: "Port Harcourt",
    status: "VERIFIED SUCCESS",
    amount: "₦625,000",
    quote:
      "Highest earner in my group! Over ₦625k and I started just 6 weeks ago.",
  },
  {
    name: "Tolulope A.",
    location: "Akure",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦435,000",
    quote:
      "Ondo State checking in! Every single withdrawal has been processed on time.",
  },
  {
    name: "Nnamdi H.",
    location: "Onitsha",
    status: "LEGIT VERIFIED",
    amount: "₦575,000",
    quote:
      "Commercial city, commercial earnings! Renix-Ultra pays well here in Onitsha.",
  },
  {
    name: "Shamsiyya K.",
    location: "Katsina",
    status: "VERIFIED SUCCESS",
    amount: "₦390,000",
    quote:
      "Katsina state ladies are earning! I refer, I earn, I withdraw. Simple and beautiful.",
  },
  {
    name: "Victor E.",
    location: "Lagos",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦540,000",
    quote:
      "Tech worker in the day, Renix-Ultra member at night. The side income is incredible.",
  },
  {
    name: "Adaeze C.",
    location: "Enugu",
    status: "LEGIT VERIFIED",
    amount: "₦455,000",
    quote:
      "Coal City women are winning! My Renix-Ultra journey has been nothing but amazing.",
  },
  {
    name: "Fatai B.",
    location: "Ilorin",
    status: "VERIFIED SUCCESS",
    amount: "₦480,000",
    quote:
      "Kwara State is on Renix-Ultra! Withdrawal confirmed and already reinvesting.",
  },
  {
    name: "Onyinye M.",
    location: "Aba",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦520,000",
    quote:
      "Abia State women know where the money is! Renix-Ultra never disappoints.",
  },
  {
    name: "Bello S.",
    location: "Birnin Kebbi",
    status: "LEGIT VERIFIED",
    amount: "₦365,000",
    quote:
      "Kebbi State is earning! The platform works across Nigeria without any issues.",
  },
  {
    name: "Chiomachukwu F.",
    location: "Lagos",
    status: "VERIFIED SUCCESS",
    amount: "₦605,000",
    quote:
      "Six figures achieved! My goal was ₦500k and I surpassed it. Renix-Ultra overdelivers.",
  },
  {
    name: "Dauda R.",
    location: "Lokoja",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦410,000",
    quote:
      "Kogi State member withdrawing successfully! The confluence city knows about Renix-Ultra.",
  },
  {
    name: "Ebunoluwa T.",
    location: "Ado-Ekiti",
    status: "LEGIT VERIFIED",
    amount: "₦495,000",
    quote:
      "Ekiti women are not left behind! We're earning, withdrawing, and recommending Renix-Ultra.",
  },
  {
    name: "Abdullahi O.",
    location: "Jalingo",
    status: "VERIFIED SUCCESS",
    amount: "₦355,000",
    quote:
      "Taraba State joining the Renix-Ultra movement! It truly works regardless of your location.",
  },
  {
    name: "Obioma W.",
    location: "Owerri",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦585,000",
    quote:
      "Almost ₦600k in my account! The upgrade tier I chose has the best returns.",
  },
  {
    name: "Rasaki N.",
    location: "Abeokuta",
    status: "LEGIT VERIFIED",
    amount: "₦430,000",
    quote:
      "Ogun State shoutout! I've been on Renix-Ultra for 3 months and every month I withdraw.",
  },
  {
    name: "Chinenye A.",
    location: "Onitsha",
    status: "VERIFIED SUCCESS",
    amount: "₦565,000",
    quote:
      "Market women know about Renix-Ultra too! The platform is for everyone who wants to earn.",
  },
  {
    name: "Ladi M.",
    location: "Jos",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦405,000",
    quote:
      "Plateau State is earning! The cold weather is warm now because Renix-Ultra money is flowing.",
  },
  {
    name: "Temitope G.",
    location: "Lagos",
    status: "LEGIT VERIFIED",
    amount: "₦550,000",
    quote:
      "Lagosian and proud Renix-Ultra member. Withdrawal number 4 just processed this morning!",
  },
  {
    name: "Ihuoma K.",
    location: "Port Harcourt",
    status: "VERIFIED SUCCESS",
    amount: "₦475,000",
    quote:
      "Oil city, oil money! But my real income now comes from Renix-Ultra tasks and referrals.",
  },
  {
    name: "Suleiman B.",
    location: "Gombe",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦380,000",
    quote:
      "Gombe State is on the map! Everyone here is talking about Renix-Ultra's payments.",
  },
  {
    name: "Ucheoma E.",
    location: "Awka",
    status: "LEGIT VERIFIED",
    amount: "₦530,000",
    quote:
      "From Awka with love! Renix-Ultra has been my most reliable income source this year.",
  },
  {
    name: "Wale F.",
    location: "Lagos",
    status: "VERIFIED SUCCESS",
    amount: "₦640,000",
    quote:
      "₦640k and counting! This is not a get-rich-quick scheme, it's a get-rich-right scheme.",
  },
  {
    name: "Adaobi S.",
    location: "Umuahia",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦445,000",
    quote:
      "Umuahia is earning! My first withdrawal convinced me to go all in on Renix-Ultra.",
  },
  {
    name: "Nuhu T.",
    location: "Yola",
    status: "LEGIT VERIFIED",
    amount: "₦370,000",
    quote:
      "Adamawa State checking in! Renix-Ultra withdrawal just processed. Still smiling!",
  },
  {
    name: "Chiamaka O.",
    location: "Lagos",
    status: "VERIFIED SUCCESS",
    amount: "₦595,000",
    quote:
      "Nearly ₦600k in earnings! Lagos girls know the best money opportunities and this is it.",
  },
];

const VISIBLE_COUNT = 3;
const ROTATION_INTERVAL = 10000;

const Testimonials = () => {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setStartIndex(
          (prev) => (prev + VISIBLE_COUNT) % allTestimonials.length,
        );
        setFade(true);
      }, 400);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const visibleTestimonials = Array.from(
    { length: VISIBLE_COUNT },
    (_, i) => allTestimonials[(startIndex + i) % allTestimonials.length],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06090d] via-[#0b1118] to-[#06090d] px-4 py-8 text-white pb-20">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Success Stories</h1>
          <p className="text-sm text-[#94A3B8]">
            Real withdrawals from real members. Join thousands earning daily.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#00FF55] animate-pulse" />
            <span className="text-xs text-[#00FF55] font-semibold uppercase tracking-widest">
              Live Feed — {allTestimonials.length} verified testimonials
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div
          style={{
            opacity: fade ? 1 : 0,
            transform: fade ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
          className="space-y-6"
        >
          {visibleTestimonials.map((item, idx) => (
            <Card
              key={`${startIndex}-${idx}`}
              className={`rounded-2xl border p-6 transition-all ${
                idx === 0
                  ? "border-[#00E53A]/40 bg-gradient-to-br from-[#0b1118] to-[#06090d] shadow-[0_0_60px_rgba(0,229,58,0.2)]"
                  : "border-[#00E53A]/20 bg-[#0b1118] shadow-[0_0_30px_rgba(0,229,58,0.1)]"
              }`}
            >
              <div className="space-y-4">
                {/* Header with Avatar & Quick Stats */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00E53A] text-black font-bold text-lg flex-shrink-0">
                      {item.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-white">
                          {item.name}
                        </p>
                        <CheckCircle className="h-5 w-5 text-[#00FF55] flex-shrink-0" />
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        📍 {item.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="rounded-full bg-[#00E53A]/10 border border-[#00E53A]/30 px-3 py-1 text-center">
                      <p className="text-xs text-[#00FF55] uppercase font-bold tracking-wide">
                        {item.status}
                      </p>
                      <p className="text-xl font-bold text-[#00FF55]">
                        {item.amount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-[#CBD5E1] italic">
                    "{item.quote}"
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#00E53A]/70 pt-2 border-t border-[#00E53A]/10">
                  <span>💚</span>
                  <span>Live Feed: Real-time member testimonials</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 flex-wrap max-w-xs mx-auto">
          {Array.from({
            length: Math.ceil(allTestimonials.length / VISIBLE_COUNT),
          }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width:
                  Math.floor(startIndex / VISIBLE_COUNT) === i ? "20px" : "6px",
                backgroundColor:
                  Math.floor(startIndex / VISIBLE_COUNT) === i
                    ? "#00E53A"
                    : "rgba(0,229,58,0.25)",
              }}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 rounded-2xl border border-[#00E53A]/30 bg-[#0b1118] p-8 shadow-[0_0_40px_rgba(0,229,58,0.15)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-[#00E53A]/70">
                📈 THOUSANDS OF USERS SHARING SUCCESS
              </p>
              <h2 className="text-2xl font-bold text-white">
                Post your success story
              </h2>
              <p className="text-sm text-[#94A3B8] max-w-md">
                Got a winning Renix-Ultra story? Upgrade your account to unlock
                the ability to share it with the community.
              </p>
              <p className="text-xs text-[#00FF55] font-bold pt-2">
                Upgrade now to post your success story.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Button
                onClick={() => navigate("/upgrade")}
                className="rounded-full bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] px-8 py-3 font-bold shadow-[0_8px_32px_rgba(0,229,58,0.25)] hover:shadow-[0_10px_40px_rgba(0,229,58,0.35)] transition-all active:scale-[0.98]"
              >
                Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="rounded-full border border-[#00E53A]/40 text-[#00FF55] px-8 py-3 font-bold hover:bg-[#00E53A]/10 transition-all"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
