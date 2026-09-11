export type PlantAlternative = {
  name: string;
  confidence: number;
};

export type PlantAnalysis = {
  success: true;
  plant?: { name: string };
  diagnosis?: { name: string; confidence: number };
  alternatives: PlantAlternative[];
  source: "plantnet";
  engineVersion?: string;
  remainingRequests?: number;
};

export type PlantApiError = {
  error?: string;
  message?: string;
  details?: string;
};

export async function analyzePlantImage(image: Blob): Promise<PlantAnalysis> {
  const formData = new FormData();
  formData.append("image", image, "plant-scan.jpg");
  formData.append("organ", "leaf");

  const response = await fetch("/api/plant/analyze", {
    method: "POST",
    body: formData,
  });

  const body = (await response.json()) as PlantAnalysis | PlantApiError;
  if (!response.ok) {
    throw new Error(
      "message" in body && body.message
        ? body.message
        : "The AI service could not analyze this image.",
    );
  }

  return body as PlantAnalysis;
}