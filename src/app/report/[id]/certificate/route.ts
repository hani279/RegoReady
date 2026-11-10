import { getPpsrProvider } from "@/lib/ppsr";
import { getReport } from "@/lib/reports";

// Streams the official PPSR search certificate for a paid report. The
// provider's download URL needs our API key, so it is never shown to the
// buyer directly.
export async function GET(
  _request: Request,
  ctx: RouteContext<"/report/[id]/certificate">,
) {
  const { id } = await ctx.params;
  const report = await getReport(id);
  const provider = getPpsrProvider();
  if (!report?.record?.certificateUrl || !provider.certificate) {
    return new Response("Certificate not found", { status: 404 });
  }

  let upstream: Response;
  try {
    upstream = await provider.certificate(report.record);
  } catch (err) {
    console.error("Certificate download failed", id, err);
    return new Response("The certificate could not be downloaded. Try again shortly.", { status: 502 });
  }
  if (upstream.status === 202) {
    return new Response("The certificate is still being generated. Try again in a minute.", {
      status: 503,
      headers: { "Retry-After": "60" },
    });
  }
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="ppsr-certificate-${report.identifier}.pdf"`,
    },
  });
}
