import { Request, Response } from 'express';
import Lead from '../models/Lead';

export const captureLead = async (req: Request, res: Response) => {
  try {
    const { name, email, company, requirement, source } = req.body;
    
    // 1. Create Lead
    const lead = await Lead.create({ name, email, company, requirement, source });

    // 2. Mock Auto-Action: Send Welcome Email
    console.log(`[EMAIL] To: ${email} - Welcome to GigIndia! Our growth team will reach out.`);

    res.status(201).json({ success: true, message: 'Lead captured', lead });
  } catch (err: any) {
    res.status(500).json({ message: 'Lead capture failed', error: err.message });
  }
};

export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err: any) {
    res.status(500).json({ message: 'Fetch leads failed', error: err.message });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    res.json({ message: 'Status updated', lead });
  } catch (err: any) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

export const addLeadNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const adminId = (req as any).user.id;

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.notes.push({ text, adminId });
    await lead.save();

    res.json({ message: 'Note added', lead });
  } catch (err: any) {
    res.status(500).json({ message: 'Add note failed', error: err.message });
  }
};
