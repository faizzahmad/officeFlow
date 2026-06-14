"use client";

import { LogIn, LogOut, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  checkInWithGeoAction,
  checkOutAction,
  type TodayAttendanceStatus,
} from "@/actions/attendance";
import { LoadingButton } from "@/components/loading-button";
import { Badge } from "@/components/ui/badge";
import { MAX_DAILY_CHECK_INS } from "@/lib/attendance";
import { showActionToast } from "@/lib/toast-action";

export function AttendanceActions({
  status,
}: {
  status: TodayAttendanceStatus;
}) {
  const router = useRouter();
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locating, setLocating] = useState(false);

  async function captureLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device");
      return null;
    }

    setLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        },
      );

      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setLocation(coords);
      return coords;
    } catch {
      toast.error("Unable to get your location. Check permissions.");
      return null;
    } finally {
      setLocating(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[240px]">
      <div className="grid gap-2 sm:grid-cols-1">
        <LoadingButton
          loading={checkInLoading}
          loadingText="Checking in..."
          disabled={!status.canCheckIn || checkOutLoading}
          className="w-full"
          onClick={async () => {
            setCheckInLoading(true);
            try {
              const coords = location ?? (await captureLocation());
              const formData = new FormData();
              if (coords) {
                formData.set("latitude", String(coords.latitude));
                formData.set("longitude", String(coords.longitude));
              }
              const result = await checkInWithGeoAction(formData);
              showActionToast(result, "Checked in successfully");
              if (result.ok) router.refresh();
            } catch {
              toast.error("Check-in failed");
            } finally {
              setCheckInLoading(false);
            }
          }}
        >
          <LogIn className="size-4" />
          Check in
        </LoadingButton>
        <LoadingButton
          variant="outline"
          loading={checkOutLoading}
          loadingText="Checking out..."
          disabled={!status.canCheckOut || checkInLoading}
          className="w-full"
          onClick={async () => {
            setCheckOutLoading(true);
            try {
              const result = await checkOutAction();
              showActionToast(result, "Checked out successfully");
              if (result.ok) router.refresh();
            } catch {
              toast.error("Check-out failed");
            } finally {
              setCheckOutLoading(false);
            }
          }}
        >
          <LogOut className="size-4" />
          Check out
        </LoadingButton>
      </div>

      <div className="space-y-2">
        <Badge variant="secondary" className="w-full justify-center text-xs">
          {status.remainingCheckIns === 0
            ? "Daily check-in limit reached"
            : `${status.remainingCheckIns} of ${MAX_DAILY_CHECK_INS} check-ins remaining`}
        </Badge>
        {location ? (
          <Badge variant="outline" className="w-full justify-center font-mono text-xs">
            <MapPin className="size-3" />
            Location captured
          </Badge>
        ) : (
          <button
            type="button"
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
            onClick={() => void captureLocation()}
            disabled={locating}
          >
            {locating ? "Getting location..." : "Preview location before check-in"}
          </button>
        )}
      </div>
    </div>
  );
}
