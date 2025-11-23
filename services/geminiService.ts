import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BoosterType, MaterialType, DesignStyle, TechnicalSpecs } from "../types";

// Initialize the client
// Note: In a real production app, this should be handled more securely or via proxy.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a photorealistic concept image of the signal booster.
 */
export const generateBoosterConcept = async (
  type: BoosterType,
  material: MaterialType,
  style: DesignStyle,
  details: string
): Promise<string> => {
  
  // Using a mix of Chinese for description and English for technical rendering terms often yields best results
  const prompt = `
    Professional industrial design product photography of a mobile signal booster (手机信号放大器).
    Type/Category: ${type}.
    Material: ${material}.
    Style: ${style}.
    Key Details: ${details || 'Standard configuration'}.
    Specific features for this device class: visible heat sink fins for cooling (散热鳍片), RF connector ports (N-Type or SMA), LED status indicators, signal strength display.
    Lighting: Studio lighting, cinematic, 8k resolution, unreal engine 5 render quality, neutral dark background.
    View: Isometric perspective.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Gemini 未返回图像数据。");

  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

/**
 * Generates technical specifications and marketing copy based on the visual concept.
 */
export const generateBoosterSpecs = async (
  type: BoosterType,
  material: MaterialType,
  style: DesignStyle
): Promise<TechnicalSpecs> => {

  const prompt = `
    为一款假设的手机信号放大器产品生成合理的技术规格（Technical Specs）。请使用中文回答。
    产品属性如下:
    类型: ${type}
    材质: ${material}
    风格: ${style}
    
    请提供：尺寸 (Dimensions), 散热方案 (Cooling), IP防护等级 (IP Rating), 材质详情, 接口类型 (Connectors), 预估重量, 以及一句朗朗上口的中文营销口号 (Tagline)。
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      dimensions: { type: Type.STRING, description: "长x宽x高 (mm)" },
      coolingSolution: { type: Type.STRING, description: "散热管理描述 (例如：被动式铝制散热鳍片)" },
      ipRating: { type: Type.STRING, description: "IP防护等级 (例如：IP65, IP54)" },
      materialComposition: { type: Type.STRING, description: "详细材质成分" },
      connectorType: { type: Type.STRING, description: "射频接口类型 (例如：N-Female, SMA)" },
      estimatedWeight: { type: Type.STRING, description: "重量 (kg 或 g)" },
      marketingTagline: { type: Type.STRING, description: "简短有力的营销口号" },
    },
    required: ["dimensions", "coolingSolution", "ipRating", "materialComposition", "connectorType", "estimatedWeight", "marketingTagline"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("未返回规格文本。");
    
    return JSON.parse(text) as TechnicalSpecs;

  } catch (error) {
    console.error("Spec generation error:", error);
    // Fallback mock data in case of error to prevent app crash
    return {
      dimensions: "200mm x 150mm x 40mm",
      coolingSolution: "被动式铝合金散热阵列",
      ipRating: "IP54",
      materialComposition: "6063 航空级铝合金",
      connectorType: "N型母头 (N-Female)",
      estimatedWeight: "1.2kg",
      marketingTagline: "信号无死角，连接更自由。",
    };
  }
};