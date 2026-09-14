import { createFileRoute } from "@tanstack/react-router";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"]);

type PlantNetSpecies = {
  scientificName?: unknown;
  commonNames?: unknown;
  eppoCode?: unknown;
};
type PlantNetResult = {
  name?: unknown;
  score?: unknown;
  description?: unknown;
  species?: unknown;
};
type PlantNetPayload = {
  results?: unknown;
  version?: unknown;
  remainingIdentificationRequests?: unknown;
};

function jsonError(message: string, status: number, details?: string) {
  return Response.json({ error: true, message, details }, { status });
}

function getResultName(result: PlantNetResult) {
  if (typeof result.name === "string" && result.name.trim()) return result.name;

  if (typeof result.species !== "object" || result.species === null) return null;
  const species = result.species as PlantNetSpecies;
  if (typeof species.scientificName === "string" && species.scientificName.trim()) {
    return species.scientificName;
  }
  if (Array.isArray(species.commonNames)) {
    const commonName = species.commonNames.find(
      (name): name is string => typeof name === "string" && name.trim().length > 0,
    );
    if (commonName) return commonName;
  }
  if (typeof species.eppoCode === "string" && species.eppoCode.trim()) {
    return species.eppoCode;
  }

  return null;
}

function getResultDescription(result: PlantNetResult) {
  return typeof result.description === "string" && result.description.trim()
    ? result.description
    : undefined;
}

export const Route = createFileRoute("/api/plant/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["PLANTNET_API_KEY"];
        if (!apiKey) {
          return jsonError(
            "The AI service is not configured yet. Add a Pl@ntNet API key to the backend environment.",
            503,
          );
        }

        let formData: FormData;
        try {
          formData = await request.formData();
        } catch {
          return jsonError("Please upload a valid plant image.", 400);
        }

        const image = formData.get("image");
        if (!(image instanceof File)) {
          return jsonError("Please upload a valid plant image.", 400);
        }
        if (!ALLOWED_TYPES.has(image.type)) {
          return jsonError("Only JPEG and PNG images are supported.", 400);
        }
        if (image.size > MAX_IMAGE_BYTES) {
          return jsonError("Image is too large. Please try again with a smaller photo.", 413);
        }

        const providerForm = new FormData();
        providerForm.append("images", image, image.name || "plant-scan.jpg");
        providerForm.append("organs", String(formData.get("organ") || "leaf"));

        let providerResponse: Response;
        try {
          providerResponse = await fetch(
            `https://my-api.plantnet.org/v2/diseases/identify?lang=en&nb-results=5&api-key=${encodeURIComponent(apiKey)}`,
            { method: "POST", body: providerForm, signal: AbortSignal.timeout(30_000) },
          );
        } catch (error) {
          if (error instanceof DOMException && error.name === "TimeoutError") {
            return jsonError("The AI service took too long to respond. Please try again.", 504);
          }
          return jsonError("The AI service is temporarily unavailable. Please try again.", 502);
        }

        if (providerResponse.status === 401 || providerResponse.status === 403) {
          return jsonError(
            "The AI service key was rejected. Check the backend configuration.",
            502,
          );
        }
        if (providerResponse.status === 429) {
          return jsonError("AI service limit reached. Please try again later.", 429);
        }
        if (providerResponse.status === 400 || providerResponse.status === 422) {
          return jsonError(
            "The AI service could not find a reliable match in this image. Try a clear, well-lit photo of one affected leaf.",
            422,
          );
        }
        if (!providerResponse.ok) {
          return jsonError(
            "The AI service is temporarily unavailable. Please try again in a moment.",
            502,
          );
        }

        let payload: PlantNetPayload;
        try {
          payload = (await providerResponse.json()) as PlantNetPayload;
        } catch {
          return jsonError("We couldn't interpret the AI response. Please try another image.", 502);
        }

        const results = Array.isArray(payload.results)
          ? payload.results.filter(
              (item): item is PlantNetResult => typeof item === "object" && item !== null,
            )
          : [];
        const validResults = results.flatMap((item) => {
          const name = getResultName(item);
          if (!name || typeof item.score !== "number" || !Number.isFinite(item.score)) return [];
          return [{ name, score: item.score, description: getResultDescription(item) }];
        });
        const [topResult, ...alternatives] = validResults;

        if (!topResult) {
          return jsonError(
            "Unable to make a reliable diagnosis. Try a clear, well-lit image of the affected leaf.",
            422,
          );
        }

        return Response.json({
          success: true,
          diagnosis: {
            name: topResult.name,
            confidence: topResult.score,
            description:
              typeof topResult.description === "string" ? topResult.description : undefined,
          },
          alternatives: alternatives.map((item) => ({
            name: item.name,
            confidence: item.score,
            description: typeof item.description === "string" ? item.description : undefined,
          })),
          source: "plantnet",
          engineVersion: typeof payload.version === "string" ? payload.version : undefined,
          remainingRequests:
            typeof payload.remainingIdentificationRequests === "number"
              ? payload.remainingIdentificationRequests
              : undefined,
        });
      },
    },
  },
});
