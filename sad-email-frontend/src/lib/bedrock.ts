import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export interface BedrockConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface ModelConfig {
  modelId: string;
  maxTokens: number;
  temperature: number;
  topP?: number;
}

export const BEDROCK_MODELS = {
  officer: {
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    // Available: "anthropic.claude-3-5-sonnet-20240620-v1:0" (ready to test)
    // Available: "us.anthropic.claude-opus-4-20250514-v1:0" (inference profile)
    maxTokens: 350, // Increased to prevent truncation
    temperature: 0.2, // Conservative, authoritative responses
    topP: 0.8
  },
  agent: {
    modelId: "anthropic.claude-3-haiku-20240307-v1:0", // Keep on Haiku - working well!
    maxTokens: 400, // Increased to prevent truncation
    temperature: 0.5, // Balanced, detailed responses
    topP: 0.9
  },
  monkey: {
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    // Available: "meta.llama3-70b-instruct-v1:0" (ready to test)
    // Available: "us.meta.llama3-1-70b-instruct-v1:0" (inference profile)
    maxTokens: 300, // Increased to prevent truncation
    temperature: 0.9, // Creative, chaotic responses
    topP: 0.95
  }
} as const;

export type PersonaType = keyof typeof BEDROCK_MODELS;

export class BedrockEmailGenerator {
  private client: BedrockRuntimeClient;

  constructor(config: BedrockConfig) {
    this.client = new BedrockRuntimeClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async generateForPersona(persona: PersonaType, prompt: string, userInput: string) {
    const modelConfig = BEDROCK_MODELS[persona];
    
    const fullPrompt = `${prompt}

User's sad content/idea: "${userInput}"

Please write a professional email based on the user's content. The email should:
1. Have a clear, professional subject line
2. Follow the character's personality and style
3. Be well-formatted and appropriate for business communication
4. Transform the user's sad content into a proper email

Format your response as JSON with "subject" and "body" fields.`;

    const payload = this.buildPayload(modelConfig.modelId, fullPrompt, modelConfig);
    
    // Since we're using foundation models only, no ARN conversion needed
    const actualModelId = modelConfig.modelId;
    
    console.log(`[${persona}] Using model ID: ${actualModelId} (temp: ${modelConfig.temperature})`);
    
    const command = new InvokeModelCommand({
      modelId: actualModelId,
      body: JSON.stringify(payload),
      contentType: "application/json",
      accept: "application/json",
    });

    try {
      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      return this.parseResponse(modelConfig.modelId, responseBody);
    } catch (error: unknown) {
      console.error(`Error generating email for ${persona}:`, error);
      throw error;
    }
  }

  private buildPayload(modelId: string, prompt: string, config: ModelConfig) {
    if (modelId.includes('anthropic.claude')) {
      return {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        top_p: config.topP,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      };
    } else if (modelId.includes('meta.llama')) {
      return {
        prompt: prompt,
        max_gen_len: config.maxTokens,
        temperature: config.temperature,
        top_p: config.topP,
      };
    }
    
    throw new Error(`Unsupported model: ${modelId}`);
  }

  private parseResponse(modelId: string, responseBody: unknown) {
    let responseText = "";
    
    if (modelId.includes('anthropic.claude')) {
      const claudeResponse = responseBody as { content: Array<{ text: string }> };
      responseText = claudeResponse.content[0].text;
    } else if (modelId.includes('meta.llama')) {
      const llamaResponse = responseBody as { generation: string };
      responseText = llamaResponse.generation;
    }

    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(responseText);
      if (parsed.subject && parsed.body) {
        return {
          subject: parsed.subject,
          body: parsed.body
        };
      }
    } catch {
      // If JSON parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed.subject && parsed.body) {
            return {
              subject: parsed.subject,
              body: parsed.body
            };
          }
        } catch {
          // Continue to fallback
        }
      }
      
      // Fallback: extract subject and body manually
      const lines = responseText.split('\n').filter(line => line.trim());
      
      let subject = 'Email';
      let body = responseText;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (line.includes('subject:') || line.includes('"subject"')) {
          subject = lines[i].replace(/.*subject:?\s*/i, '').replace(/^["']|["']$/g, '').replace(/^.*"subject"\s*:\s*["']?([^"']+)["']?.*$/, '$1');
          body = lines.slice(i + 1).join('\n');
          break;
        }
      }
      
      return {
        subject: subject || "Email",
        body: body || responseText
      };
    }

    // Final fallback
    return {
      subject: "Email",
      body: responseText
    };
  }
}