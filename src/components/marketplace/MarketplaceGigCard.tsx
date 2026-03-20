'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, 
  CheckCircle2, ArrowRight, Bookmark, 
  DollarSign, Star, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const MarketplaceGigCard = ({ gig, index }: { gig: any, index: number }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="saas-card relative group transition-all"
    >
      {/* Bookmark — top right */}
      <button className="absolute top-5 right-5 text-gray-300 hover:text-blue-500 transition-colors">
        <Bookmark size={18} />
      </button>

      <div className="flex flex-col md:flex-row gap-6">

        {/* ── LEFT: Main Content ── */}
        <div className="flex-1 space-y-4">

          {/* Category + Time */}
          <div className="flex items-center gap-3">
            <span className="badge badge-blue">{gig.category}</span>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Clock size={12} />
              <span>{gig.postedTime || '2h ago'}</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h3
              onClick={() => router.push(`/gigs/${gig._id}`)}
              className="mb-3 hover:text-blue-600 transition-colors pr-8 cursor-pointer text-sm font-semibold"
            >
              {gig.title}
            </h3>
            <p className="line-clamp-2 text-sm text-gray-500">
              {gig.description || 'Looking for an expert to help scale our enterprise-grade application. Must have deep experience with performance optimization and high-availability infrastructure.'}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3">
             {(gig.tags || ['Next.js', 'TypeScript', 'Node.js']).map((tag: string) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg border border-gray-100 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Mobile price row */}
          <div className="flex items-center gap-6 md:hidden pt-2 border-t border-gray-100">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-0.5">Budget</p>
              <p className="text-xl font-bold text-gray-900">₹{gig.price?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-0.5">Level</p>
              <p className="text-sm font-semibold text-gray-700">Expert</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Metadata + CTA ── */}
        <div className="md:w-56 md:border-l md:border-gray-100 md:pl-6 flex flex-col justify-between gap-6 shrink-0">
          
          {/* Price */}
          <div className="hidden md:block">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign size={13} className="text-blue-500" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Estimate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">₹{gig.price?.toLocaleString()}</p>
          </div>

          {/* Meta pills */}
          <div className="hidden md:flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <MapPin size={13} className="text-gray-400 shrink-0" />
              <span>{gig.location || 'Remote'}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <Zap size={13} className="text-amber-500 shrink-0" />
              <span>Expert Level</span>
            </div>
          </div>

          {/* Client Info */}
          <div className="hidden md:flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
              {gig.userId?.avatar
                ? <img src={gig.userId.avatar} alt="avatar" className="w-full h-full object-cover" />
                : gig.userId?.name?.[0] || 'C'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-xs font-semibold text-gray-800 truncate">{gig.userId?.name || 'Enterprise Client'}</p>
                <CheckCircle2 size={10} className="text-blue-500 shrink-0" />
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={10} fill="#F59E0B" className="text-amber-400" />
                <span className="text-xs text-gray-500 font-medium">4.9 / 5.0</span>
              </div>
            </div>
          </div>

           {/* Apply Button */}
          <button
            onClick={() => router.push(`/gigs/${gig._id}`)}
            className="btn-primary w-full px-5"
          >
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};
