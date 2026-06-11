"use client";

import { MapPin } from "lucide-react";
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
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2">
        <LoadingButton
          loading={checkInLoading}
          loadingText="Checking in..."
          disabled={!status.canCheckIn || checkOutLoading}
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
          <MapPin className="size-4" />
          Check in with location
        </LoadingButton>
        <LoadingButton
          variant="outline"
          loading={checkOutLoading}
          loadingText="Checking out..."
          disabled={!status.canCheckOut || checkInLoading}
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
          Check out
        </LoadingButton>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Badge variant="secondary" className="text-xs">
          {status.remainingCheckIns === 0
            ? "No check-ins left today"
            : `${status.remainingCheckIns} of ${MAX_DAILY_CHECK_INS} check-ins left today`}
        </Badge>
        {location ? (
          <Badge variant="outline" className="font-mono text-xs">
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </Badge>
        ) : (
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => void captureLocation()}
            disabled={locating}
          >
            {locating ? "Getting location..." : "Preview location"}
          </button>
        )}
      </div>
    </div>
  );
}
