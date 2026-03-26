import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import PayoutRequest from '../models/PayoutRequest';
import mongoose from 'mongoose';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

export const getFinancialReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Platform Revenue & Transaction Stats
    const transStats = await Transaction.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$platformRevenue' },
          totalTransactions: { $count: {} },
          totalOriginalAmount: { $sum: '$originalAmount' },
          totalClientFees: { $sum: '$clientFee' },
          totalFreelancerFees: { $sum: '$freelancerFee' }
        }
      }
    ]);

    // Payout Stats
    const payoutStats = await PayoutRequest.aggregate([
      { 
        $match: { 
          status: 'processed',
          createdAt: { $gte: start, $lte: end }
        } 
      },
      {
        $group: {
          _id: null,
          totalPayouts: { $sum: '$amount' }
        }
      }
    ]);

    // Daily Trend
    const trend = await Transaction.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$platformRevenue" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const stats = transStats[0] || { totalRevenue: 0, totalTransactions: 0, totalOriginalAmount: 0, totalClientFees: 0, totalFreelancerFees: 0 };
    const payouts = payoutStats[0] || { totalPayouts: 0 };

    res.json({
      summary: {
        totalRevenue: stats.totalRevenue,
        totalTransactions: stats.totalTransactions,
        totalVolume: stats.totalOriginalAmount,
        totalPayouts: payouts.totalPayouts,
        netProfit: stats.totalRevenue, // Revenue is already net for platform
        avgOrderValue: stats.totalTransactions > 0 ? stats.totalOriginalAmount / stats.totalTransactions : 0,
        feeSplit: {
          client: stats.totalClientFees,
          freelancer: stats.totalFreelancerFees
        }
      },
      trend
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate report', error: err });
  }
};

export const exportCSV = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await Transaction.find({
      createdAt: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) }
    }).populate('clientId freelancerId', 'name email');

    const fields = ['createdAt', 'clientId.name', 'freelancerId.name', 'originalAmount', 'clientFee', 'freelancerFee', 'platformRevenue', 'status'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(transactions);

    res.header('Content-Type', 'text/csv');
    res.attachment(`GigIndia_Financial_Report_${startDate}_to_${endDate}.csv`);
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'CSV export failed', error: err });
  }
};

export const exportPDF = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Fetch data for the report
    const transactions = await Transaction.find({
      createdAt: { $gte: start, $lte: end }
    }).populate('clientId freelancerId', 'name').sort({ createdAt: -1 });

    const transStats = await Transaction.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$platformRevenue' },
          totalTransactions: { $count: {} },
          totalVolume: { $sum: '$originalAmount' }
        }
      }
    ]);

    const stats = transStats[0] || { totalRevenue: 0, totalTransactions: 0, totalVolume: 0 };

    const doc = new PDFDocument({ margin: 50 });
    res.header('Content-Type', 'application/pdf');
    res.attachment(`GigIndia_Report_${startDate}.pdf`);
    doc.pipe(res);

    // Header
    doc.fillColor('#2563EB').fontSize(24).text('GigIndia', { continued: true }).fillColor('#0F172A').text(' | Financial Intelligence');
    doc.fontSize(10).fillColor('#64748B').text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(2);

    // Title & Date Range
    doc.fillColor('#1E293B').fontSize(20).text('Monthly Performance Report', { underline: true });
    doc.fontSize(12).fillColor('#475569').text(`Period: ${startDate} to ${endDate}`);
    doc.moveDown(2);

    // Stats Grid
    const startY = doc.y;
    doc.rect(50, startY, 160, 80).fill('#F8FAFC').stroke('#E2E8F0');
    doc.fillColor('#2563EB').fontSize(10).text('TOTAL REVENUE', 60, startY + 15);
    doc.fillColor('#0F172A').fontSize(16).text(`₹${(stats.totalRevenue / 100).toLocaleString()}`, 60, startY + 35);

    doc.rect(220, startY, 160, 80).fill('#F8FAFC').stroke('#E2E8F0');
    doc.fillColor('#10B981').fontSize(10).text('TOTAL VOLUME', 230, startY + 15);
    doc.fillColor('#0F172A').fontSize(16).text(`₹${(stats.totalVolume / 100).toLocaleString()}`, 230, startY + 35);

    doc.rect(390, startY, 155, 80).fill('#F8FAFC').stroke('#E2E8F0');
    doc.fillColor('#F59E0B').fontSize(10).text('TRANSACTIONS', 400, startY + 15);
    doc.fillColor('#0F172A').fontSize(16).text(`${stats.totalTransactions}`, 400, startY + 35);
    doc.moveDown(6);

    // Transaction Table Header
    doc.fillColor('#1E293B').fontSize(14).text('Recent Transactions Breakdown', { continued: false });
    doc.moveDown();

    const tableTop = doc.y;
    const itemHeight = 25;
    
    doc.fillColor('#64748B').fontSize(10);
    doc.text('DATE', 50, tableTop);
    doc.text('DESCRIPTION', 120, tableTop);
    doc.text('AMOUNT', 350, tableTop);
    doc.text('REVENUE', 450, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke('#CBD5E1');

    // Table Content
    let currentY = tableTop + 25;
    transactions.slice(0, 15).forEach((item: any, index) => {
      doc.fillColor('#334155').fontSize(9);
      doc.text(new Date(item.createdAt).toLocaleDateString(), 50, currentY);
      doc.text(`${item.clientId?.name} -> ${item.freelancerId?.name}`, 120, currentY, { width: 220 });
      doc.text(`₹${(item.originalAmount / 100).toLocaleString()}`, 350, currentY);
      doc.fillColor('#10B981').text(`₹${(item.platformRevenue / 100).toLocaleString()}`, 450, currentY);
      
      currentY += itemHeight;
      if (index === 14) doc.text('... and more', 50, currentY);
    });

    // Footer
    doc.fontSize(10).fillColor('#94A3B8').text(
      'Confidential - GigIndia Internal Financial Document',
      50,
      730,
      { align: 'center', width: 500 }
    );

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'PDF export failed', error: err });
  }
};

export const getAnalyticsSummary = async (req: Request, res: Response) => {
  try {
    const { getGrowthMetrics } = await import('../services/AnalyticsService');
    const stats = await getGrowthMetrics();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err });
  }
};

export const trackAnalyticsEvent = async (req: any, res: Response) => {
  try {
    const { event, category, metadata } = req.body;
    const { trackEvent } = await import('../services/AnalyticsService');
    await trackEvent(event, category, req.user.id, metadata);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Tracking failed', error: err });
  }
};
