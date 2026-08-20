import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const History = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    return type === "credit" ? TrendingUp : TrendingDown;
  };

  return (
    <div className="min-h-screen liquid-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00C836] to-[#00E53A] p-6 text-[#04080a] shadow-[0_4px_20px_rgba(0,229,58,0.3)]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-[#04080a] hover:bg-black/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Transaction History</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {loading ? (
          <p className="text-center text-[#94A3B8]">Loading...</p>
        ) : transactions.length === 0 ? (
          <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-8 text-center shadow-[0_0_20px_rgba(0,229,58,0.05)]">
            <Gift className="w-12 h-12 mx-auto mb-4 text-[#64748B]" />
            <p className="text-[#94A3B8]">No transactions yet</p>
          </Card>
        ) : (
          transactions.map((transaction) => {
            const Icon = getIcon(transaction.type);
            const isCredit = transaction.type === "credit";
            return (
              <Card
                key={transaction.id}
                className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-4 hover:border-[#00E53A]/50 transition-all shadow-[0_0_20px_rgba(0,229,58,0.05)]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCredit ? "bg-[#00E53A]/10" : "bg-red-500/10"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isCredit ? "text-[#00FF55]" : "text-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-[#94A3B8]">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      isCredit ? "text-[#00FF55]" : "text-red-500"
                    }`}
                  >
                    {isCredit ? "+" : "-"}₦
                    {Number(transaction.amount).toLocaleString()}
                  </p>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default History;
