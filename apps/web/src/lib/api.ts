export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Types
export interface MezmurCategory {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count?: { Mezmurs: number };
}

export interface Mezmur {
  id: number;
  title: string;
  description: string | null;
  categoryId: number;
  thumbnailUrl: string | null;
  thumbnailStorageId: string | null;
  pdfUrl: string | null;
  pdfStorageId: string | null;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
  category: { id: number; name: string };
}

export interface CourseCategory {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count?: { Mezmurs: number }; // In backend it's named Mezmurs in CourseCategory due to copy paste bug
}

export interface Course {
  id: number;
  title: string;
  description: string | null;
  grade: number;
  categoryId: number;
  thumbnailUrl: string | null;
  thumbnailStorageId: string | null;
  pdfUrl: string | null;
  pdfStorageId: string | null;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
  category: { id: number; name: string };
}

export interface Announcement {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl: string | null;
  thumbnailStorageId: string | null;
  uploadedById: string;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Fetch Helpers
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

// Mezmur API
export const getMezmurCategories = async (): Promise<MezmurCategory[]> => {
  const data = await fetchApi<{ categories: MezmurCategory[] }>("/api/mezmur/categories");
  return data.categories;
};

export const getMezmurs = async (): Promise<Mezmur[]> => {
  const data = await fetchApi<{ mezmurs: Mezmur[] }>("/api/mezmur/mezmurs");
  return data.mezmurs;
};

export const getMezmurById = async (id: number | string): Promise<Mezmur> => {
  const data = await fetchApi<{ mezmur: Mezmur }>(`/api/mezmur/mezmurs/${id}`);
  return data.mezmur;
};

// Course API
export const getCourseCategories = async (): Promise<CourseCategory[]> => {
  const data = await fetchApi<{ categories: CourseCategory[] }>("/api/course/categories");
  return data.categories;
};

export const getCourses = async (): Promise<Course[]> => {
  const data = await fetchApi<{ courses: Course[] }>("/api/course/get");
  return data.courses;
};

export const getCourseById = async (id: number | string): Promise<Course> => {
  const data = await fetchApi<{ course: Course }>(`/api/course/get/${id}`);
  return data.course;
};

// Announcement API
export const getAnnouncements = async (): Promise<Announcement[]> => {
  const data = await fetchApi<{ announcements: Announcement[] }>("/api/announcement/get");
  return data.announcements;
};

export const getAnnouncementById = async (id: number | string): Promise<Announcement> => {
  const data = await fetchApi<{ announcement: Announcement }>(`/api/announcement/get/${id}`);
  return data.announcement;
};
