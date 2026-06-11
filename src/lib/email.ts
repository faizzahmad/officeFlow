import { Resend } from "resend";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ?? "Office Flow <onboarding@resend.dev>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email:skipped]", { to, subject });
    }
    return { success: true, skipped: true as const };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[email:error]", error);
    return { success: false, error: error.message };
  }

  return { success: true, skipped: false as const };
}

export function emailLayout({
  title,
  body,
  ctaLabel,
  ctaUrl,
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const href = ctaUrl ? `${appUrl}${ctaUrl}` : appUrl;

  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#2C4CFD;margin:0 0 16px">${title}</h2>
      <p style="color:#334155;line-height:1.6">${body}</p>
      ${
        ctaLabel
          ? `<p style="margin-top:24px"><a href="${href}" style="background:#2C4CFD;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">${ctaLabel}</a></p>`
          : ""
      }
      <p style="margin-top:32px;font-size:12px;color:#94a3b8">Office Flow — All-in-One Office CRM</p>
    </div>
  `;
}
