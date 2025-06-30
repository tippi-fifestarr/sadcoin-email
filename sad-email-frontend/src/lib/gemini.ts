
export interface EmailGenerationRequest {
  userInput: string;
  useAWS?: boolean; // Optional parameter for AWS Bedrock
}

export interface EmailGenerationResponse {
  agentInitialEmail: EmailContent;
  officerInitialEmail: EmailContent;
  monkeyInitialEmail: EmailContent;
  success: boolean;
  error?: string;
}

export interface EmailContent {
  subject: string;
  body: string;
}

export async function generateEmail(request: EmailGenerationRequest): Promise<EmailGenerationResponse> {
  try {
    const response = await fetch('/api/generate-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: request.userInput,
        useAWS: request.useAWS || false
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      return {
        agentInitialEmail: { subject: "Error", body: "Failed to generate agent email" },
        officerInitialEmail: { subject: "Error", body: "Failed to generate officer email" },
        monkeyInitialEmail: { subject: "Error", body: "Failed to generate monkey email" },
        success: false,
        error: data.error
      };
    }

    return {
      agentInitialEmail: data.agentInitialEmail || { subject: "Agent Email", body: "" },
      officerInitialEmail: data.officerInitialEmail || { subject: "Officer Email", body: "" },
      monkeyInitialEmail: data.monkeyInitialEmail || { subject: "Monkey Email", body: "" },
      success: data.success || false,
      error: data.error
    };

  } catch (error) {
    console.error("Error generating email with Gemini:", error);
    return {
      agentInitialEmail: { subject: "Error", body: "Failed to generate agent email" },
      officerInitialEmail: { subject: "Error", body: "Failed to generate officer email" },
      monkeyInitialEmail: { subject: "Error", body: "Failed to generate monkey email" },
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
} 