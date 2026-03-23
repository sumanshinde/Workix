import GSTInvoice from '../models/GSTInvoice';
import crypto from 'crypto';

export const GSTService = {
  /**
   * Calculates GST components based on location.
   * taxableAmount is in paise (to avoid floating point issues).
   */
  calculateGST: (taxableAmount: number, clientState: string, freelancerState: string) => {
    const isIntrastate = clientState.toLowerCase() === freelancerState.toLowerCase();
    const ratePercent = 18; // Standard GST for IT/Design services
    
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    
    if (isIntrastate) {
      cgst = Math.round(taxableAmount * (ratePercent / 2) / 100);
      sgst = cgst; // Both share 9%
    } else {
      igst = Math.round(taxableAmount * ratePercent / 100);
    }
    
    const totalTax = cgst + sgst + igst;
    
    return {
      taxableAmount,
      cgst,
      sgst,
      igst,
      totalTax,
      totalAmount: taxableAmount + totalTax,
      ratePercent
    };
  },

  /**
   * Creates a formal GST invoice record.
   */
  generateInvoice: async (data: any) => {
    const timestamp = Date.now();
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    const invoiceNumber = `BGST-${timestamp}-${random}`;

    const { 
      transactionId, 
      orderId, 
      taxableAmount, 
      clientState, 
      freelancerState, 
      clientDetails, 
      freelancerDetails 
    } = data;

    const taxes = GSTService.calculateGST(taxableAmount, clientState, freelancerState);

    const invoice = new GSTInvoice({
      invoiceNumber,
      transactionId,
      orderId,
      taxableAmount: taxes.taxableAmount,
      cgst: taxes.cgst,
      sgst: taxes.sgst,
      igst: taxes.igst,
      totalTax: taxes.totalTax,
      totalAmount: taxes.totalAmount,
      clientName: clientDetails.name,
      freelancerName: freelancerDetails.name,
      clientAddress: clientDetails.address || '',
      freelancerAddress: freelancerDetails.address || '',
      gstinClient: clientDetails.gstin || '',
      gstinFreelancer: freelancerDetails.gstin || '',
      hsnSacCode: '998311' // Default SAC for Software Consultancy
    });

    await invoice.save();
    return invoice;
  }
};
