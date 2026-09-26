import { Resend } from "resend";
import { isMockMode } from "@/lib/mock-data";

function createResend() {
  if (isMockMode()) return null;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendRegistrationEmail(
  to: string,
  teamName: string,
  teamId: string,
  leaderName: string
): Promise<boolean> {
  if (isMockMode()) {
    console.log(`[MOCK] Registration email to ${to}: Team ID = ${teamId}`);
    return true;
  }

  const resend = createResend();
  if (!resend) {
    console.log("Resend not configured — skipping email");
    return false;
  }

  try {
    await resend.emails.send({
      from: "CYBERHUNT <noreply@hwijdcoem.in>",
      to,
      subject: `Welcome to CYBERHUNT — Your Team ID: ${teamId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; background: #0A0E1A; color: #E5E7EB; margin: 0; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2d45; border-radius: 12px; overflow: hidden; }
            .header { background: #1a2235; padding: 24px; text-align: center; border-bottom: 1px solid #1f2d45; }
            .logo { font-size: 20px; font-weight: 700; }
            .logo .green { color: #00FF88; }
            .content { padding: 32px 24px; }
            .team-id-box { background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.25); border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0; }
            .team-id { font-family: 'Courier New', monospace; font-size: 24px; font-weight: 700; color: #00FF88; letter-spacing: 0.1em; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1f2d45; font-size: 14px; }
            .info-label { color: #9CA3AF; }
            .info-value { color: #E5E7EB; font-weight: 500; }
            .warning { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); border-radius: 8px; padding: 16px; margin: 24px 0; font-size: 13px; color: #FCD34D; }
            .footer { padding: 16px 24px; text-align: center; font-size: 12px; color: #4B5563; border-top: 1px solid #1f2d45; }
            .btn { display: inline-block; background: #00FF88; color: #0A0E1A; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">&lt; <span class="green">CYBERHUNT</span> /&gt;</div>
            </div>
            <div class="content">
              <h2 style="color: #E5E7EB; margin-bottom: 8px;">Welcome, Agent ${leaderName}!</h2>
              <p style="color: #9CA3AF; font-size: 14px;">Your team has been registered for CYBERHUNT. Save your Team ID.</p>
              <div class="team-id-box">
                <div style="font-size: 11px; color: #9CA3AF; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em;">Your Team ID</div>
                <div class="team-id">${teamId}</div>
              </div>
              <div style="margin: 24px 0;">
                <div class="info-row">
                  <span class="info-label">Team Name</span>
                  <span class="info-value">${teamName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Event Date</span>
                  <span class="info-value">5 July 2026</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Duration</span>
                  <span class="info-value">90 Minutes</span>
                </div>
              </div>
              <div class="warning">
                Keep your Team ID safe. You'll need both your email and Team ID to log in.
              </div>
              <div style="text-align: center;">
                <a href="https://cyberhunt.techalfa.in/login" class="btn">Go to Login</a>
              </div>
            </div>
            <div class="footer">
              &lt;CYBERHUNT /&gt; &copy; 2026 HWIJDCOEM
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}
