import { markNotificationReadFormAction } from "@/actions/notification-forms";
import { getNotifications } from "@/actions/notifications";
import { ActionForm } from "@/components/action-form";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent } from "@/components/ui/card";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Task assignments, leave updates, and salary alerts."
      />

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No notifications yet.
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{notification.title}</p>
                    <Badge variant="outline">{notification.type}</Badge>
                    {!notification.isRead ? (
                      <Badge>New</Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead ? (
                  <ActionForm
                    action={markNotificationReadFormAction}
                    successMessage="Marked as read"
                  >
                    <input
                      type="hidden"
                      name="notificationId"
                      value={notification.id}
                    />
                    <SubmitButton size="sm" variant="outline" loadingText="...">
                      Mark read
                    </SubmitButton>
                  </ActionForm>
                ) : null}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
