import { Request, Response } from 'express';
import Invoice from '../models/Invoice';
import aiService from '../services/aiService';

export const getTaxSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    // 1. Fetch total earnings & GST collected
    const invoices = await Invoice.find({ userId });
    const totalEarnings = invoices.reduce((acc, inv) => acc + inv.baseAmount, 0);
    const totalGst = invoices.reduce((acc, inv) => acc + inv.gstAmount, 0);

    // 2. AI Synthesis
    const summary = await aiService.generateTaxSummary({ 
       earnings: totalEarnings / 100, 
       gst: totalGst / 100 
    });

    res.json({
       totalEarnings: totalEarnings / 100,
       totalGst: totalGst / 100,
       invoiceCount: invoices.length,
       summary
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Tax summary failed', error: err.message });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err: any) {
    res.status(500).json({ message: 'Invoice fetch failed', error: err.message });
  }
};
