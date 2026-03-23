import Invoice from '../models/Invoice';
import User from '../models/User';

export class TaxService {
  
  static calculateGST(amount: number, clientState: string, freelancerState: string) {
    const rate = 0.18; // Default 18%
    const gstAmount = amount * rate;
    const isIntraState = clientState === freelancerState;

    if (isIntraState) {
      return {
        total: Math.round(gstAmount),
        type: 'CGST+SGST',
        cgst: Math.round(gstAmount / 2),
        sgst: Math.round(gstAmount / 2),
        igst: 0
      };
    } else {
      return {
        total: Math.round(gstAmount),
        type: 'IGST',
        cgst: 0,
        sgst: 0,
        igst: Math.round(gstAmount)
      };
    }
  }

  static async generateInvoice(milestone: any, client: any, freelancer: any) {
    const amount = milestone.amount; // in paise
    const gst = this.calculateGST(amount, client.state || 'Maharashtra', freelancer.state || 'Maharashtra');

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const invoice = await Invoice.create({
      userId: freelancer._id,
      clientId: client._id,
      orderId: milestone.orderId,
      milestoneId: milestone._id,
      invoiceNumber,
      baseAmount: amount,
      gstAmount: gst.total,
      totalAmount: amount + gst.total,
      gstType: gst.type,
      taxBreakdown: {
        cgst: gst.cgst,
        sgst: gst.sgst,
        igst: gst.igst
      },
      status: 'paid'
    });

    return invoice;
  }
}
