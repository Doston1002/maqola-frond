export interface Mentor {
  _id: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  experience: number;
  studentsCount: number;
  specialization?: string[];
  email?: string;
  phone?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
  };
  courses?: string[]; // Course IDs
  rating?: number;
  reviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  languages?: string[];
  certificates?: {
    name: string;
    issuer: string;
    year: number;
    url?: string;
  }[];
}
