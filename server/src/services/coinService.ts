import User from '../models/User';
import CoinTransaction from '../models/CoinTransaction';

export const CoinService = {
  addCoins: async (userId: string, amount: number, reason: string) => {
    await User.findByIdAndUpdate(userId, { $inc: { coins: amount } });
    await CoinTransaction.create({
      userId,
      amount,
      type: 'CREDIT',
      reason
    });
  },

  deductCoins: async (userId: string, amount: number, reason: string) => {
    const user = await User.findById(userId);
    if (!user || user.coins < amount) {
      throw new Error(`Insufficient coins for ${reason}. Required: ${amount}, Available: ${user?.coins || 0}`);
    }

    await User.findByIdAndUpdate(userId, { $inc: { coins: -amount } });
    await CoinTransaction.create({
      userId,
      amount,
      type: 'DEBIT',
      reason
    });
    return true;
  },

  getCosts: () => ({
    DESIGN: 35,
    TECHNOLOGY: 55,
    MARKETING: 45
  })
}
