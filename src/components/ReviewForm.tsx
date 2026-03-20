'use client';

import React, { useState } from 'react';
import { Star, Send, X } from 'lucide-react';

interface ReviewFormProps {
  jobId: string;
  fromUserId: string;
  toUserId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReviewForm({ jobId, fromUserId, toUserId, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          fromUserId,
          toUserId,
          rating,
          comment,
          role: 'client'
        })
      });
      if (res.ok) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm max-w-md w-full relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#111827]">Leave a Review</h3>
        <button 
          onClick={onCancel} 
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 mb-4">How was your experience?</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-95"
              >
                <Star 
                  size={32} 
                  fill={(hover || rating) >= star ? '#F59E0B' : 'none'} 
                  className={(hover || rating) >= star ? 'text-amber-500' : 'text-gray-200'} 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#111827]">Share your feedback</label>
          <textarea
            required
            placeholder="What was it like working together?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-32 p-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none text-sm"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-sm shadow-blue-500/10 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <><Send size={18} /> Submit Review</>
          )}
        </button>
      </form>
    </div>
  );
}
