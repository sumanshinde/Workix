export interface InvoiceParams {
  amount: number;
  clientState: string;
  freelancerState: string;
  platformFeePercent: number; // e.g., 0.10 for 10%
}

export interface GSTBreakdown {
  baseAmount: number;
  platformFee: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGST: number;
  totalInvoiceAmount: number;
  freelancerPayout: number;
}

/**
 * GigIndia GST & Commission Logic
 * Calculates split payments and GST breakdown for freelancers and clients.
 */
export function calculateGSTAndCommission(params: InvoiceParams): GSTBreakdown {
  const { amount, clientState, freelancerState, platformFeePercent } = params;
  
  const platformFee = amount * platformFeePercent;
  const isIntrastate = clientState.toLowerCase() === freelancerState.toLowerCase();
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let totalGST = 0;
  
  const gstRate = 0.18; // Standard 18% GST for services
  
  if (isIntrastate) {
    cgst = platformFee * (gstRate / 2);
    sgst = platformFee * (gstRate / 2);
  } else {
    igst = platformFee * gstRate;
  }
  
  totalGST = cgst + sgst + igst;
  const totalInvoiceAmount = amount + totalGST;
  const freelancerPayout = amount - platformFee;
  
  return {
    baseAmount: amount,
    platformFee,
    cgst,
    sgst,
    igst,
    totalGST,
    totalInvoiceAmount,
    freelancerPayout
  };
}
