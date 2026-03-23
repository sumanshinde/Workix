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
    const prompt = `Generate a job description for ${title} in ${category}. Bullet points.`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e) { return 'Failed'; }
  }

  async suggestSkills(title: string, description: string): Promise<string[]> {
    const prompt = `Skills for ${title}. Return JSON array.`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const match = text.match(/\[.*\]/s);
      return match ? JSON.parse(match[0]) : [];
    } catch (e) { return []; }
  }

  async generateProposal(jobDescription: string, freelancerProfile: string): Promise<string> {
    const prompt = `Write a proposal. Job: ${jobDescription}. Profile: ${freelancerProfile}`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e) { return 'Failed'; }
  }

  async calculateMatchScore(jobDescription: string, freelancerProfile: string): Promise<{ score: number, reasoning: string }> {
    const prompt = `Score match 0-100. Job: ${jobDescription}. Profile: ${freelancerProfile}. Return JSON: {score, reasoning}`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const match = response.text().match(/\{.*\}/s);
      return match ? JSON.parse(match[0]) : { score: 0, reasoning: 'Failed' };
    } catch (e) { return { score: 0, reasoning: 'Error' }; }
  }

  async analyzeDispute(disputeInfo: string, chatHistory: string, milestoneDetails: string): Promise<{ summary: string, clientFault: number, freelancerFault: number, recommendation: string }> {
    const prompt = `Analyze dispute. Info: ${disputeInfo}. Return JSON: {summary, clientFault, freelancerFault, recommendation}`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const match = response.text().match(/\{.*\}/s);
      return match ? JSON.parse(match[0]) : { summary: 'Failed', clientFault: 50, freelancerFault: 50, recommendation: 'partial' };
    } catch (e) { return { summary: 'Error', clientFault: 50, freelancerFault: 50, recommendation: 'partial' }; }
  }

  async analyzeProfile(profile: any): Promise<{ score: number, breakdown: any, suggestions: string[], missingElements: string[], weakAreas: string[] }> {
    const prompt = `Analyze freelancer profile. Bio: ${profile.bio}. Skills: ${profile.skills}. Pricing: ${profile.pricing}. Return JSON: {score, breakdown: {skills, portfolio, trust, activity, pricing}, suggestions[], missingElements[], weakAreas[]}`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const match = response.text().match(/\{.*\}/s);
      return match ? JSON.parse(match[0]) : { score: 50, breakdown: {}, suggestions: [], missingElements: [], weakAreas: [] };
    } catch (e) { return { score: 50, breakdown: {}, suggestions: [], missingElements: [], weakAreas: [] }; }
  }

  async rewriteBio(currentBio: string, skills: string[]): Promise<string> {
    const prompt = `Rewrite bio focused on skills: ${skills.join(', ')}. Bio: ${currentBio}. Professional.`;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e) { return currentBio; }
  }

  /**
   * Calculates a freelancer credit score for platform trust and benefits.
   */
  async calculateCreditScore(metrics: any): Promise<{ score: number, reasoning: string, level: string, benefits: string[] }> {
    const prompt = `Calculate a freelancer credit score (300-900). 
      Rating: ${metrics.rating}
      Disputes: ${metrics.disputes}
      Earnings: ₹${metrics.earnings}
      Response Time: ${metrics.responseTime} mins
      KYC: ${metrics.kyc}
      
      Return JSON: {score, reasoning, level (Bronze/Silver/Gold/Platinum), benefits[]}`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const match = response.text().match(/\{.*\}/s);
      return match ? JSON.parse(match[0]) : { score: 500, reasoning: 'Default', level: 'Bronze', benefits: [] };
    } catch (e) { return { score: 500, reasoning: 'Error', level: 'Bronze', benefits: [] }; }
  }

  /**
   * Generates a tax and GST filing summary using AI.
   */
  async generateTaxSummary(data: { earnings: number, gst: number }): Promise<{ summary: string, suggestions: string[], filingStatus: string }> {
    const prompt = `Evaluate GST and tax status for a freelancer. 
      Total Earnings: ₹${data.earnings}
      GST Collected: ₹${data.gst}
      Is GST threshold (₹20L) exceeded? ${data.earnings > 2000000}
      
      Return JSON: {summary, suggestions[], filingStatus ("Required" | "Optional" | "Pending")}`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const match = response.text().match(/\{.*\}/s);
      return match ? JSON.parse(match[0]) : { summary: 'Tax summary error', suggestions: [], filingStatus: 'Pending' };
    } catch (e) { return { summary: 'AI service unavailable', suggestions: [], filingStatus: 'Pending' }; }
  }
}

export default new AIService();
