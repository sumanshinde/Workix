import mongoose from 'mongoose';

const gstInvoiceSchema = new mongoose.Schema({
  transactionId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  orderId:           { type: String, required: true },
  hsnSacCode:        { type: String, default: '998311' }, // IT Design/Dev services
  
  // Taxpayer Details
  gstinClient:       { type: String },
  gstinFreelancer:   { type: String },
  clientName:        { type: String, required: true },
  freelancerName:    { type: String, required: true },
  clientAddress:     { type: String },
  freelancerAddress: { type: String },

  // Tax breakdown (in paise)
  taxableAmount:     { type: Number, required: true },
  cgst:              { type: Number, default: 0 },
  sgst:              { type: Number, default: 0 },
  igst:              { type: Number, default: 0 },
  totalTax:          { type: Number, required: true },
  totalAmount:       { type: Number, required: true },
  
  invoiceDate:       { type: Date, default: Date.now },
  invoiceNumber:     { type: String, unique: true },
  pdfUrl:            { type: String }
}, { timestamps: true });

export default mongoose.model('GSTInvoice', gstInvoiceSchema);
