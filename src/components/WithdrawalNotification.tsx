import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const names = [
  "Vera Friday",
  "Chioma Okafor",
  "Blessing Eze",
  "Faith Nwosu",
  "Grace Onyeka",
  "Mercy Adebayo",
  "Joy Okoro",
  "Peace Ugwu",
  "Rose Nnamdi",
  "Gloria Emeka",
  "Gift Chukwu",
  "Divine Ibrahim",
  "Praise Okon",
  "Success Oluwaseun",
  "Favour Chidi",
  "Treasure Amara",
  "Victory Chiamaka",
  "Precious Ifeoma",
  "Loveth Ngozi",
  "Miracle Ebere",
  "Emmanuel Obi",
  "Daniel Odenigbo",
  "David Ezekiel",
  "Samuel Chukwuemeka",
  "Joseph Ikenna",
  "Michael Chinedu",
  "Benjamin Obinna",
  "James Uzochukwu",
  "John Ifeanyi",
  "Peter Nnamdi",
  "Esther Adaeze",
  "Mary Chinelo",
  "Sarah Nneka",
  "Ruth Chidinma",
  "Deborah Amarachi",
  "Hannah Chidimma",
  "Rebecca Obiageli",
  "Rachael Ugochi",
  "Lydia Oluchi",
  "Naomi Chioma",
];

const generateRandomAmount = () => {
  // Generate amounts between 75,000 and 2,000,000
  return Math.floor(Math.random() * (2000000 - 75000 + 1)) + 75000;
};

export const WithdrawalNotification = () => {
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState({
    name: "",
    amount: 0,
  });

  useEffect(() => {
    const showNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAmount = generateRandomAmount();

      setCurrentNotification({ name: randomName, amount: randomAmount });
      setVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setVisible(false);
      }, 4000);
    };

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showNotification, 3000);

    // Show notifications randomly between 8-15 seconds
    const interval = setInterval(
      () => {
        showNotification();
      },
      Math.random() * (15000 - 8000) + 8000,
    );

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
      <Card className="bg-gradient-to-r from-[#00C836]/95 to-[#00E53A]/95 backdrop-blur-lg border-[#00E53A]/50 shadow-lg shadow-[#00E53A]/20">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-white">
            <p className="text-sm font-semibold">
              {currentNotification.name} just withdrew
            </p>
            <p className="text-xs font-bold">
              ₦{currentNotification.amount.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
