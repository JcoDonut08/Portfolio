import type { ContactSubmission } from "@/lib/contact";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

export function createContactEmailContent(submission: ContactSubmission) {
  const subject = `[Portfolio] ${submission.category} inquiry from ${submission.name}`;
  const escapedName = escapeHtml(submission.name);
  const escapedEmail = escapeHtml(submission.email);
  const escapedCategory = escapeHtml(submission.category);
  const escapedMessage = escapeHtml(submission.message);
  const replyHref = `mailto:${escapedEmail}?subject=${encodeURIComponent(`Re: ${submission.category} inquiry`).replace(/%20/g, "+")}`;
  const preheader = `New ${submission.category} inquiry from ${submission.name}.`;
  const text = [
    "NEW PORTFOLIO INQUIRY",
    "",
    `From: ${submission.name}`,
    `Email: ${submission.email}`,
    `Category: ${submission.category}`,
    "",
    "Message",
    submission.message,
    "",
    `Reply to ${submission.name}: ${submission.email}`,
  ].join("\n");
  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="color-scheme" content="dark">
        <meta name="supported-color-schemes" content="dark">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHtml(subject)}</title>
        <style>
          @media only screen and (max-width: 620px) {
            .email-shell {
              width: 100% !important;
            }

            .email-pad {
              padding-left: 22px !important;
              padding-right: 22px !important;
            }

            .email-title {
              font-size: 34px !important;
              line-height: 1 !important;
            }

            .email-meta-cell {
              display: block !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }

            .email-meta-cell + .email-meta-cell {
              padding-top: 18px !important;
            }

            .email-reply {
              display: block !important;
              text-align: center !important;
            }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;background:#060711;color:#f8f8ff;font-family:Arial,'Helvetica Neue',sans-serif">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}</div>
        <div style="display:none;max-height:0;overflow:hidden">&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%;background:#060711;background-image:radial-gradient(circle at 16% 0%,#18204a 0,#0b0d20 31%,#060711 66%)">
          <tr>
            <td align="center" style="padding:38px 14px 44px">
              <table class="email-shell" role="presentation" width="640" border="0" cellspacing="0" cellpadding="0" style="width:640px;max-width:640px">
                <tr>
                  <td style="height:5px;font-size:0;line-height:0;background:#32e6e2;background-image:linear-gradient(90deg,#32e6e2 0%,#6f89ff 48%,#ff4d8d 100%)">&nbsp;</td>
                </tr>

                <tr>
                  <td class="email-pad" style="border:1px solid #303a68;border-top:0;background:#0d1027;background-image:radial-gradient(circle at 90% 2%,#231b4d 0,#11142f 30%,#0d1027 66%);padding:30px 38px 38px">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="middle">
                          <p style="margin:0;color:#f5f7ff;font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase">
                            Jericho Salvador
                          </p>
                          <p style="margin:5px 0 0;color:#9ba9d0;font-size:10px;letter-spacing:1.2px;text-transform:uppercase">
                            Portfolio
                          </p>
                        </td>
                        <td align="right" valign="middle">
                          <span style="color:#8fa3df;font-size:15px;letter-spacing:8px">
                            &#10022;&nbsp;&middot;&nbsp;&#10022;&nbsp;&middot;&nbsp;&#8226;
                          </span>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-top:42px">
                          <p style="margin:0 0 12px;color:#46eee8;font-size:11px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase">
                            New portfolio inquiry
                          </p>
                          <h1 class="email-title" style="margin:0;max-width:540px;color:#ffffff;font-family:'Arial Narrow','Roboto Condensed','Segoe UI',Arial,sans-serif;font-size:46px;font-stretch:condensed;font-weight:800;letter-spacing:-1.8px;line-height:1;text-transform:uppercase">
                            ${escapedCategory}
                          </h1>
                          <p style="margin:17px 0 0;color:#c0c9e3;font-size:15px;line-height:1.65">
                            <strong style="color:#ffffff">${escapedName}</strong> sent you a new message through your portfolio.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:28px">
                      <tr>
                        <td width="72" style="width:72px;height:2px;background:#32e6e2;font-size:0;line-height:0">&nbsp;</td>
                        <td style="height:2px;background:#303960;font-size:0;line-height:0">&nbsp;</td>
                        <td width="10" style="width:10px;height:2px;background:#ff4d8d;font-size:0;line-height:0">&nbsp;</td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:26px">
                      <tr>
                        <td class="email-meta-cell" width="50%" valign="top" style="width:50%;padding:0 5px 0 0">
                          <p style="margin:0 0 8px;color:#8594bd;font-size:10px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase">From</p>
                          <p style="margin:0;color:#ffffff;font-size:16px;font-weight:700;line-height:1.45">${escapedName}</p>
                        </td>
                        <td class="email-meta-cell" width="50%" valign="top" style="width:50%;padding:0 0 0 5px">
                          <p style="margin:0 0 8px;color:#8594bd;font-size:10px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase">Email</p>
                          <p style="margin:0;font-size:15px;font-weight:700;line-height:1.45;word-break:break-word">
                            <a href="mailto:${escapedEmail}" style="color:#54eee9;text-decoration:none">${escapedEmail}</a>
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:34px">
                      <tr>
                        <td style="border-left:3px solid #ff4d8d;background:#10142d;padding:20px 22px 22px">
                          <p style="margin:0 0 13px;color:#9eabd0;font-size:10px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase">
                            Message
                          </p>
                          <p style="margin:0;color:#f7f8ff;font-size:17px;line-height:1.75;white-space:pre-wrap">${escapedMessage}</p>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:24px">
                      <tr>
                        <td>
                          <a class="email-reply" href="${replyHref}" style="display:inline-block;border-radius:8px;background:#32e6e2;color:#041012;font-size:14px;font-weight:800;line-height:1;padding:16px 21px;text-decoration:none">
                            Reply to ${escapedName}&nbsp;&nbsp;&#8599;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="email-pad" style="padding:18px 36px 0">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="color:#7783a5;font-size:10px;letter-spacing:0.8px;line-height:1.6;text-transform:uppercase">
                          Sent from your portfolio contact form
                        </td>
                        <td align="right" style="color:#3f496c;font-family:'Courier New',monospace;font-size:12px;letter-spacing:4px">
                          &#10022;&nbsp;&middot;&nbsp;&#10022;
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `.trim();

  return {
    html,
    subject,
    text,
  };
}
