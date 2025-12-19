
import { GoogleGenAI } from "@google/genai";
import { MaterialType, AdditionalCost } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getBoothExpertAdvice(
  dimensions: { p: number; l: number; t: number },
  material: MaterialType,
  totalPrice: number,
  additionalCosts: AdditionalCost[]
) {
  try {
    const activeAddons = additionalCosts.filter(a => a.enabled).map(a => a.name).join(", ");
    
    const prompt = `
      Bertindaklah sebagai ahli kontraktor booth pameran profesional.
      Detail Booth:
      - Dimensi: ${dimensions.p}m (P) x ${dimensions.l}m (L) x ${dimensions.t}m (T)
      - Material Utama: ${material}
      - Estimasi Total Harga: Rp ${totalPrice.toLocaleString('id-ID')}
      - Tambahan: ${activeAddons || "Tidak ada"}

      Berikan saran singkat (maksimal 3 poin) mengenai:
      1. Apakah material ini cocok untuk dimensi tersebut?
      2. Saran durabilitas dan perawatan.
      3. Tips agar booth lebih menarik perhatian pengunjung.
      
      Gunakan bahasa Indonesia yang profesional dan ramah. Format dalam bullet points.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, saran AI saat ini tidak tersedia. Silakan hubungi konsultan kami untuk detail lebih lanjut.";
  }
}
