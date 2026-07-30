const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_REGIONS = new Set(["mumbai", "tokyo", "discuss"]);
const ALLOWED_TEAM_SIZES = new Set(["1-5", "6-20", "21-50", "51+"]);
const ALLOWED_HIRING_VOLUMES = new Set(["1-25", "26-100", "101-500", "500+"]);

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  let body;
  try {
    body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : (request.body || {});
  } catch {
    return sendJson(response, 400, { error: "Invalid request body." });
  }
  if (clean(body.website, 200)) return sendJson(response, 200, { ok: true });

  const lead = {
    full_name: clean(body.full_name, 120),
    work_email: clean(body.work_email, 200).toLowerCase(),
    company: clean(body.company, 180),
    job_title: clean(body.title, 140),
    team_size: clean(body.team_size, 20),
    hiring_volume: clean(body.hiring_volume, 20),
    preferred_region: clean(body.region, 20),
    message: clean(body.message, 2000),
    source: "valases_website",
    status: "new",
  };

  if (!lead.full_name || !EMAIL_PATTERN.test(lead.work_email) || !lead.company || !lead.job_title) {
    return sendJson(response, 400, { error: "Complete all required contact fields." });
  }
  if (!ALLOWED_TEAM_SIZES.has(lead.team_size) || !ALLOWED_HIRING_VOLUMES.has(lead.hiring_volume)) {
    return sendJson(response, 400, { error: "Select valid organization details." });
  }
  if (!ALLOWED_REGIONS.has(lead.preferred_region) || body.consent !== "yes") {
    return sendJson(response, 400, { error: "Select a region and accept the privacy notice." });
  }

  const supabaseUrl = clean(process.env.SUPABASE_URL, 500).replace(/\/$/, "");
  const supabaseKey = clean(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY, 2000);
  if (!supabaseUrl || !supabaseKey) {
    return sendJson(response, 503, { error: "Demo requests are being configured. Email hello@valases.com." });
  }

  try {
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/website_demo_requests`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
    });
    if (!insertResponse.ok) throw new Error(`Supabase insert failed with ${insertResponse.status}`);

    const resendKey = clean(process.env.RESEND_API_KEY, 1000);
    const recipient = clean(process.env.DEMO_RECIPIENT_EMAIL, 300);
    if (resendKey && recipient) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.DEMO_FROM_EMAIL || "Valases Website <website@valases.com>",
          to: [recipient],
          reply_to: lead.work_email,
          subject: `Valases briefing request: ${lead.company}`,
          text: [
            `Name: ${lead.full_name}`,
            `Email: ${lead.work_email}`,
            `Company: ${lead.company}`,
            `Title: ${lead.job_title}`,
            `Team: ${lead.team_size}`,
            `Hiring volume: ${lead.hiring_volume}`,
            `Region: ${lead.preferred_region}`,
            `Message: ${lead.message || "-"}`,
          ].join("\n"),
        }),
      });
    }
    return sendJson(response, 201, { ok: true });
  } catch (error) {
    console.error("demo_request_failed", error instanceof Error ? error.message : String(error));
    return sendJson(response, 500, { error: "Your request could not be saved. Email hello@valases.com." });
  }
};
