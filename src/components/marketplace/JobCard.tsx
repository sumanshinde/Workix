'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { Job } from '@/types';
import { useRouter } from 'next/navigation';
import { BRANDING } from '@/lib/config';

export const JobCard = ({ job, index }: { job: Job, index: number }) => {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="saas-card saas-card-hover p-5 flex flex-col md:flex-row gap-6 group relative overflow-hidden"
    >
      <div className="flex-1 space-y-4">
         <div className="flex items-center gap-3">
            <span className="badge badge-blue">
               {job.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
               <Clock size={14} /> 
               <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
         </div>
         
         <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
               {job.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 max-w-3xl">
               {job.description}
            </p>
         </div>

         <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-blue-600" />
               <span className="text-xs font-medium text-gray-500">
                 Client: <span className="text-gray-900">{job.clientId?.name || 'Enterprise'}</span>
               </span>
            </div>
            <div className="flex items-center gap-3">
               <MapPin size={14} className="text-gray-400" />
               <span className="text-xs font-medium text-gray-500">{job.location || 'Remote'}</span>
            </div>
         </div>
      </div>

      <div className="shrink-0 flex flex-col justify-between items-end gap-4 md:border-l border-gray-100 md:pl-8 min-w-[180px]">
         <div className="text-right">
            <p className="text-xs font-medium text-gray-500 mb-0.5">Budget</p>
            <h4 className="text-xl font-bold text-blue-600">₹{job.budget?.toLocaleString()}</h4>
         </div>
         <button 
           onClick={() => router.push(`/jobs/${job._id}`)}
           className="btn-primary w-full shadow-sm"
         >
            Apply Now <ArrowRight size={16} />
         </button>
      </div>
    </motion.div>
  );
};
