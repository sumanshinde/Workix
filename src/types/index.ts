// Principal Entities
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Freelancer' | 'Client' | 'Admin';
  avatar?: string;
  verified?: boolean;
}

export interface Gig {
  _id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  userId: Partial<User>;
  image?: string;
  badge?: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  clientId: Partial<User>;
  createdAt: string;
  location?: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}
