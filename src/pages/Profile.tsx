import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Calendar, LogOut } from "lucide-react";
import { ProfileIcon, RewardsIcon } from "@/assets/icons";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Unable to sign out. Please try again.");
      return;
    }

    toast.success("Signed out successfully");
    navigate("/auth", { replace: true });
  };

  if (loading || !profile) return null;

  return (
    <div className="min-h-screen bg-[#06090d] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00C836] to-[#00E53A] p-6 text-[#04080a] shadow-[0_4px_20px_rgba(0,229,58,0.3)]">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-[#04080a] hover:bg-black/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00C836] to-[#00E53A] flex items-center justify-center text-3xl font-bold text-[#04080a] shadow-[0_0_20px_rgba(0,229,58,0.3)]">
              {profile.full_name?.charAt(0) || "U"}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {profile.full_name}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#06090d] rounded-lg border border-[#00E53A]/20">
              <Mail className="w-5 h-5 text-[#00FF55]" />
              <div>
                <p className="text-sm text-[#94A3B8]">Email</p>
                <p className="font-medium text-white">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#06090d] rounded-lg border border-[#00E53A]/20">
              <RewardsIcon className="w-5 h-5 text-[#00E53A]" />
              <div>
                <p className="text-sm text-[#94A3B8]">Referral Code</p>
                <p className="font-medium text-white">
                  {profile.referral_code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#06090d] rounded-lg border border-[#00E53A]/20">
              <ProfileIcon className="w-5 h-5 text-[#00FF55]" />
              <div>
                <p className="text-sm text-[#94A3B8]">Total Referrals</p>
                <p className="font-medium text-white">
                  {profile.total_referrals || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#06090d] rounded-lg border border-[#00E53A]/20">
              <Calendar className="w-5 h-5 text-[#00E53A]" />
              <div>
                <p className="text-sm text-[#94A3B8]">Member Since</p>
                <p className="font-medium text-white">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSignOut}
              className="w-full bg-red-600/90 hover:bg-red-600 text-white font-semibold shadow-[0_0_15px_rgba(220,38,38,0.2)]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Profile;
