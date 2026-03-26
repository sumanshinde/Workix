import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn('GEMINI_API_KEY is not defined in .env. AI features will not work.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export class AIService {
  private model: any = null;

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  async generateJobDescription(title: string, category: string): Promise<string> {
    if (!this.model) return 'AI Service temporarily unavailable. Please complete manually.';
    const prompt = `Generate a professional job description for ${title} in ${category}. Use bullet points for requirements.`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e: any) { 
      console.error('[AI] Job Description generation failed:', e.message);
      return 'AI Generation failed. Please try again or type manually.'; 
    }
  }

  async suggestSkills(title: string, description: string): Promise<string[]> {
    if (!this.model) return [];
    const prompt = `Extract exactly top 5-8 relevant technical skills for this job: "${title}". Job description: "${description}". Return ONLY a JSON string array like ["skill1", "skill2"]. No other text.`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const match = text.match(/\[.*\]/s);
      return match ? JSON.parse(match[0]) : [];
    } catch (e: any) { 
      console.error('[AI] Skill suggestion failed:', e.message);
      return []; 
    }
  }

  async generateProposal(jobDescription: string, freelancerProfile: string): Promise<string> {
    if (!this.model) return 'AI Service unavailable.';
    const prompt = `Write a winning, professional freelancing proposal. 
      Job details: ${jobDescription}. 
      My profile summary: ${freelancerProfile}. 
      Focus on value proposition and relevant experience. Keep it under 250 words.`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e: any) { 
      console.error('[AI] Proposal generation failed:', e.message);
      return 'Failed to generate proposal automatically. Please draft one manually.'; 
    }
  }

  async calculateMatchScore(jobDescription: string, freelancerProfile: string): Promise<{ score: number, reasoning: string }> {
    if (!this.model) return { score: 0, reasoning: 'AI Service down' };
    const prompt = `Evaluate the match between this job and freelancer. 
      Job: ${jobDescription}. 
      Freelancer: ${freelancerProfile}. 
      Return ONLY valid JSON: { "score": number (0-100), "reasoning": string (1 sentence) }`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const match = text.match(/\{.*\}/s);
      return match ? JSON.parse(match[0]) : { score: 0, reasoning: 'Failed to parse AI response' };
    } catch (e: any) { 
      console.error('[AI] Match score calculation failed:', e.message);
      return { score: 0, reasoning: 'Error during calculation' }; 
    }
  }

  async analyzeDispute(disputeInfo: string, chatHistory: string, milestoneDetails: string): Promise<{ summary: string, clientFault: number, freelancerFault: number, recommendation: string }> {
    if (!this.model) return { summary: 'Service down', clientFault: 50, freelancerFault: 50, recommendation: 'partial' };
    const prompt = `Analyze this dispute objectively. 
      Context: ${disputeInfo}. 
      Chat: ${chatHistory}. 
      Milestones: ${milestoneDetails}. 
      Return JSON: { "summary": "short text", "clientFault": number (0-100), "freelancerFault": number (0-100), "recommendation": "text" }`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const match = response.text().match(/\{.*\}/s);
      return match ? JSON.parse(match[0]) : { summary: 'Analysis failed', clientFault: 50, freelancerFault: 50, recommendation: 'Review manually' };
    } catch (e: any) { 
      console.error('[AI] Dispute analysis failed:', e.message);
      return { summary: 'AI Analysis error', clientFault: 50, freelancerFault: 50, recommendation: 'Manual review required' }; 
    }
  }

  async analyzeProfile(profile: any): Promise<{ score: number, breakdown: any, suggestions: string[], missingElements: string[], weakAreas: string[] }> {
    if (!this.model) return { score: 50, breakdown: {}, suggestions: [], missingElements: [], weakAreas: [] };
    const prompt = `Review this freelancer profile for quality. 
      Bio: ${profile.bio}. 
      Skills: ${profile.skills}. 
      Pricing: ${profile.pricing}. 
      Return JSON: { "score": number, "breakdown": { "skills": number, "portfolio": number, "trust": number, "activity": number, "pricing": number }, "suggestions": string[], "missingElements": string[], "weakAreas": string[] }`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const match = response.text().match(/\{.*\}/s);
      return match ? JSON.parse(match[0]) : { score: 50, breakdown: {}, suggestions: [], missingElements: [], weakAreas: [] };
    } catch (e: any) { 
      console.error('[AI] Profile analysis failed:', e.message);
      return { score: 50, breakdown: {}, suggestions: ['Improve your profile'], missingElements: [], weakAreas: [] }; 
    }
  }

  async rewriteBio(currentBio: string, skills: string[]): Promise<string> {
    if (!this.model) return currentBio;
    const prompt = `Rewrite this freelancer bio to be more impactful. Highlight skills: ${skills.join(', ')}. Original bio: ${currentBio}`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e: any) { 
      console.error('[AI] Bio rewrite failed:', e.message);
      return currentBio; 
    }
  }

  async calculateCreditScore(metrics: any): Promise<{ score: number, reasoning: string, level: string, benefits: string[] }> {
    if (!this.model) return { score: 500, reasoning: 'Service down', level: 'Bronze', benefits: [] };
    const prompt = `Assess platform credit score (300-900). 
      Rating: ${metrics.rating}/5
      Disputes: ${metrics.disputes}
      Earnings: ₹${metrics.earnings}
      Response: ${metrics.responseTime}min
      KYC: ${metrics.kyc}
      Return JSON: { "score": number, "reasoning": "string", "level": "string", "benefits": string[] }`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const match = response.text().match(/\{.*\}/s);
      return match ? JSON.parse(match[0]) : { score: 500, reasoning: 'Analysis failed', level: 'Bronze', benefits: [] };
    } catch (e: any) { 
      console.error('[AI] Credit score calculation failed:', e.message);
      return { score: 500, reasoning: 'Error during analysis', level: 'Bronze', benefits: [] }; 
    }
  }

  async generateTaxSummary(data: { earnings: number, gst: number }): Promise<{ summary: string, suggestions: string[], filingStatus: string }> {
    if (!this.model) return { summary: 'Service down', suggestions: [], filingStatus: 'Pending' };
    const prompt = `Analyze GST compliance. Earnings: ₹${data.earnings}. GST: ₹${data.gst}. Threshold: ₹20L. 
      Return JSON: { "summary": "string", "suggestions": string[], "filingStatus": "Required" | "Optional" | "Pending" }`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const match = response.text().match(/\{.*\}/s);
      return match ? JSON.parse(match[0]) : { summary: 'Parsing error', suggestions: [], filingStatus: 'Pending' };
    } catch (e: any) { 
      console.error('[AI] Tax summary generation failed:', e.message);
      return { summary: 'AI Generation error', suggestions: [], filingStatus: 'Pending' }; 
    }
  }
}

export default new AIService();
