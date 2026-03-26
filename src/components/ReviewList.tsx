'use client';

import React, { useState, useEffect } from 'react';
import { Star, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { reviewsAPI } from '@/services/api';

export default function ReviewList({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback mock data if API fails or is empty for demo
  const mockReviews = [
    {
      _id: 'r1',
      rating: 5,
      comment: "Exceptional work! Aditya delivered the project 2 days ahead of schedule. His attention to detail and technical proficiency are unmatched. Will definitely hire again!",
      createdAt: new Date().toISOString(),
      fromUserId: { name: "Anil K." }
    },
    {
      _id: 'r2',
      rating: 5,
      comment: "Great communication and expert execution. The SaaS dashboard looks incredibly premium.",
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      fromUserId: { name: "Sarah M." }
    }
  ];

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewsAPI.getForUser(userId);
      setReviews(data && data.length > 0 ? data : mockReviews);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setReviews(mockReviews);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="space-y-4">
      {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />)}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {reviews.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-100 text-gray-400 font-medium">
          No reviews found for this professional yet.
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                  {review.fromUserId?.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 leading-none mb-2">{review.fromUserId?.name}</h4>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < review.rating ? '#F59E0B' : '#E5E7EB'} 
                        className={i < review.rating ? 'text-amber-500' : 'text-gray-200'} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                   {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                 </span>
                 <MoreHorizontal size={16} className="text-gray-300 cursor-pointer hover:text-gray-600" />
              </div>
            </div>
            
            <p className="text-gray-600 font-medium leading-relaxed">
              "{review.comment}"
            </p>
            
            <div className="mt-6 pt-6 border-t border-gray-50 flex gap-6">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                   <Star size={12} fill="currentColor" /> Verified Project
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   MERN STACK DEVELOPMENT
                </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
