# AWS Bedrock Integration Optimization Plan

## Current Status
✅ **Working**: AWS Bedrock integration with Claude 3 Haiku  
✅ **Working**: Agent persona producing good character-specific responses  
❌ **Issues**: Token limits too low causing truncation  
❌ **Issues**: Inconsistent JSON formatting between personas  
🔄 **Pending**: Access to Claude 3.5 Sonnet and Llama 3 70B Instruct  

## Phase 1: Fix Current Issues (Immediate)

### 1.1 Increase Token Limits
**Current limits causing truncation:**
- Officer: 150 tokens → **350 tokens**
- Agent: 200 tokens → **400 tokens** 
- Monkey: 120 tokens → **300 tokens**

### 1.2 Remove Artificial Delays
- Remove 1-second delays between API calls
- Foundation models don't have throttling issues like inference profiles
- Return to parallel processing for faster response times

### 1.3 Fix JSON Formatting Consistency
**Problem**: Bedrock responses are inconsistent with JSON structure
**Solution**: Update Bedrock prompt to explicitly request JSON format while maintaining character personality

**Current Bedrock prompt structure:**
```
${characterPrompt}

User's sad content/idea: "${userInput}"

Please write a professional email based on the user's content following the character's personality and style. Format your response as JSON with "subject" and "body" fields.
```

**New Bedrock prompt structure:**
```
${characterPrompt}

User's sad content/idea: "${userInput}"

Respond in character as described above, but format your entire response as valid JSON with exactly these fields:
{
  "subject": "Your character-appropriate email subject line",
  "body": "Your full character response including all required phrases and formatting"
}

Ensure the JSON is valid and complete.
```

## Phase 2: Multi-Model Configuration (When Access Granted)

### 2.1 Enhanced Model Configuration
```typescript
export const BEDROCK_MODELS = {
  officer: {
    // Current: Foundation model (reliable, no throttling)
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    // Future: When ready to test - Claude 3.5 Sonnet for superior reasoning
    preferredModelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
    maxTokens: 350,
    temperature: 0.2, // Conservative, authoritative
    topP: 0.8
  },
  agent: {
    // Keep Agent on Haiku - it's working well!
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    // Agent stays on Haiku for consistency and reliability
    maxTokens: 400,
    temperature: 0.5, // Balanced, detailed
    topP: 0.9
  },
  monkey: {
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    // Future: Llama 3 70B for creative, chaotic responses
    preferredModelId: "meta.llama3-70b-instruct-v1:0",
    maxTokens: 300, // Note: Llama 3 has 8k max, but we keep it concise for character
    temperature: 0.9, // Creative, chaotic
    topP: 0.95
  }
}
```

### 2.2 IAM Policy Updates
**Add ALL model ARNs to IAM policy (access granted to all 5 models):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/meta.llama3-70b-instruct-v1:0",
        "arn:aws:bedrock:us-east-1:444660174198:inference-profile/us.anthropic.claude-opus-4-20250514-v1:0",
        "arn:aws:bedrock:us-east-1:444660174198:inference-profile/us.meta.llama3-1-70b-instruct-v1:0"
      ]
    }
  ]
}
```

### 2.2 Model Access Detection
```typescript
// Environment variable to control model access level
AWS_BEDROCK_MODEL_ACCESS_LEVEL=basic|enhanced
// basic = foundation models only
// enhanced = inference profiles and advanced models
```

### 2.3 Automatic Model Selection Logic
```typescript
function getModelId(persona: PersonaType): string {
  const config = BEDROCK_MODELS[persona];
  const accessLevel = process.env.AWS_BEDROCK_MODEL_ACCESS_LEVEL || 'basic';
  
  if (accessLevel === 'enhanced' && config.preferredModelId) {
    return config.preferredModelId;
  }
  return config.modelId; // fallback to foundation model
}
```

## Phase 3: Performance Optimization

### 3.1 Parallel Processing
- Remove sequential calls with delays
- Process all three personas simultaneously
- Faster response times (3-5 seconds vs 15+ seconds)

### 3.2 Error Handling Enhancement
- Graceful fallback to foundation models if preferred models fail
- Better error messages for quota/access issues
- Retry logic only for transient errors, not access errors

## Implementation Priority

### High Priority (Fix Now)
1. ✅ Increase token limits to prevent truncation
2. ✅ Fix JSON formatting consistency 
3. ✅ Remove artificial delays
4. ✅ Return to parallel processing

### Medium Priority (Prepare for Future)
1. 🔄 Add multi-model configuration structure
2. 🔄 Implement model access detection
3. 🔄 Add automatic model selection logic

### Low Priority (Nice to Have)
1. 📋 Add model performance monitoring
2. 📋 Add cost tracking per model
3. 📋 Add A/B testing between models

## Expected Results After Phase 1

### Before (Current Issues):
```
Officer: "Want you on this. LET'S START WITH THE BASICS",
"body": "Want you on this. LET'S START WITH THE BASICS:\n\n- Recipient & Purpose: Clearly identify who this email is intended for and the specific reason - is this a procurement request, budget inquiry, etc.? Be precise in your ask.\n\n- Justification: Articulate the strategic value and how this 'vending machine for the house' aligns with our organizational priorities. The Message Has Got to Go Out ASAP.\n\n- Structure & Tone: Maintain a professional, formal tone throughout. Ensure the email
```
**Issues**: Truncated, malformed JSON

### After (Expected Results):
```json
{
  "subject": "Vending Machine Procurement - Action Required",
  "body": "Want you on this. LET'S START WITH THE BASICS:\n\n• Recipient & Purpose: Clearly identify who this email is intended for and the specific reason - is this a procurement request, budget inquiry, etc.? Be precise in your ask.\n\n• Justification: Articulate the strategic value and how this 'vending machine for the house' aligns with our organizational priorities. The Message Has Got to Go Out ASAP.\n\n• Structure & Tone: Maintain a professional, formal tone throughout. Ensure the email follows proper business communication standards.\n\nTo discuss send a message or come see me in the OFFICE."
}
```
**Improvements**: Complete response, valid JSON, maintains character voice

## Model Access Status

### Currently Available (Access Granted to All 5):
- ✅ `anthropic.claude-3-haiku-20240307-v1:0` (Foundation Model) - **Working Well**
- ✅ `anthropic.claude-3-5-sonnet-20240620-v1:0` (Foundation Model) - **Ready to Test**
- ✅ `anthropic.claude-3-opus-20240229-v1:0` (Foundation Model) - **Post-Hackathon**
- ✅ `meta.llama3-70b-instruct-v1:0` (Foundation Model) - **Ready to Test**
- ✅ `us.anthropic.claude-opus-4-20250514-v1:0` (Inference Profile) - **Post-Hackathon**
- ✅ `us.meta.llama3-1-70b-instruct-v1:0` (Inference Profile) - **Post-Hackathon**

### Integration Challenges Documentation (For Post-Hackathon Analysis)

**Successful Integration:**
- ✅ **Agent + Claude 3 Haiku**: Perfect character responses, proper formatting
- ✅ **Foundation Models**: No throttling issues, reliable performance

**Challenging Integrations (Documented for Future):**
- ❌ **Inference Profiles**: Severe throttling with promotional credits
  - `us.anthropic.claude-opus-4-20250514-v1:0`: Consistent ThrottlingException
  - `us.meta.llama3-1-70b-instruct-v1:0`: Rate limit exceeded immediately
  - **Root Cause**: Promotional AWS credits have stricter quotas on inference profiles
  - **Workaround**: Use foundation models instead
  - **Future Solution**: Upgrade to paid AWS account or request quota increases

**Character-Specific Formatting Issues:**
- ❌ **Officer + Monkey**: JSON formatting inconsistencies, truncation
- **Root Cause**: Token limits too low, prompt engineering mismatch
- **Workaround**: Increase token limits, improve JSON prompt structure
- **Lesson Learned**: Character prompts need explicit JSON formatting instructions

**Performance Issues:**
- ❌ **Sequential Processing**: 15+ second response times with delays
- **Root Cause**: Unnecessary throttling protection for foundation models
- **Workaround**: Remove delays, return to parallel processing
- **Lesson Learned**: Foundation models ≠ Inference profiles in terms of rate limits

### Requested (Pending Approval):
- 🔄 `anthropic.claude-3-5-sonnet-20241022-v2:0` (For Officer & Agent)
- 🔄 `meta.llama3-70b-instruct-v1:0` (For Monkey)

### Future Considerations:
- 📋 `anthropic.claude-3-opus-20240229-v1:0` (Premium option)
- 📋 `us.anthropic.claude-3-5-sonnet-20241022-v2:0` (Inference Profile)

## Next Steps

1. **Immediate**: Implement Phase 1 fixes (token limits, JSON formatting, remove delays)
2. **Monitor**: AWS model access approval status
3. **Prepare**: Phase 2 multi-model configuration 
4. **Test**: Verify improvements with actual frontend testing
5. **Deploy**: Update production environment when ready

## Success Metrics

- ✅ No more truncated responses
- ✅ Consistent JSON formatting across all personas
- ✅ Response time under 5 seconds (vs current 15+ seconds)
- ✅ Maintain character personality and game immersion
- 🔄 Easy model switching when access is granted