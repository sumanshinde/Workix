import { Request, Response } from 'express';
import Review from '../models/Review';
import { createNotification } from '../services/notificationService';

export const submitReview = async (req: Request, res: Response) => {
  try {
    const { jobId, fromUserId, toUserId, rating, comment, role } = req.body;

    const review = new Review({
      jobId,
      fromUserId,
      toUserId,
      rating,
      comment,
      role
    });

    await review.save();

    // Notify the user who received the review
    await createNotification(
      toUserId,
      'New Review Received!',
      `You received a ${rating}-star review for your recent project.`,
      'system',
      `/profile/${toUserId}`
    );

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit review', error: err });
  }
};

export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ toUserId: userId })
      .populate('fromUserId', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err });
  }
};
