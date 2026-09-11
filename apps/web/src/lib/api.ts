export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
  _count?: { courses: number };
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

export interface Feedback {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

type FetchOptions = RequestInit & { token?: string | null };

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers: initHeaders, body, ...rest } = options;
  const headers = new Headers(initHeaders);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (!isFormData && body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
    body,
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

function jsonBody(data: unknown) {
  return JSON.stringify(data);
}

export const getMezmurCategories = async (): Promise<MezmurCategory[]> => {
  const data = await fetchApi<{ categories: MezmurCategory[] }>("/api/mezmur/categories-get");
  return data.categories;
};

export const createMezmurCategory = async (
  payload: { name: string; description: string },
  token?: string | null,
) => {
  const data = await fetchApi<{ category: MezmurCategory }>("/api/mezmur/categories-add", {
    method: "POST",
    body: jsonBody(payload),
    token,
  });
  return data.category;
};

export const updateMezmurCategory = async (
  id: number,
  payload: Partial<{ name: string; description: string }>,
  token?: string | null,
) => {
  const data = await fetchApi<{ category: MezmurCategory }>(
    `/api/mezmur/categories-update/${id}`,
    { method: "PATCH", body: jsonBody(payload), token },
  );
  return data.category;
};

export const deleteMezmurCategory = async (id: number, token?: string | null) => {
  await fetchApi(`/api/mezmur/categories-delete/${id}`, { method: "DELETE", token });
};

export const getMezmurs = async (): Promise<Mezmur[]> => {
  const data = await fetchApi<{ mezmurs: Mezmur[] }>("/api/mezmur/get");
  return data.mezmurs;
};

export const getMezmurById = async (id: number | string): Promise<Mezmur> => {
  const data = await fetchApi<{ mezmur: Mezmur }>(`/api/mezmur/get/${id}`);
  return data.mezmur;
};

export const deleteMezmur = async (id: number | string, token?: string | null) => {
  await fetchApi(`/api/mezmur/delete/${id}`, { method: "DELETE", token });
};

export const getCourseCategories = async (): Promise<CourseCategory[]> => {
  const data = await fetchApi<{ categories: CourseCategory[] }>("/api/course/categories");
  return data.categories;
};

export const createCourseCategory = async (
  payload: { name: string; description: string },
  token?: string | null,
) => {
  const data = await fetchApi<{ category: CourseCategory }>("/api/course/categories", {
    method: "POST",
    body: jsonBody(payload),
    token,
  });
  return data.category;
};

export const updateCourseCategory = async (
  id: number,
  payload: Partial<{ name: string; description: string }>,
  token?: string | null,
) => {
  const data = await fetchApi<{ category: CourseCategory }>(`/api/course/categories/${id}`, {
    method: "PATCH",
    body: jsonBody(payload),
    token,
  });
  return data.category;
};

export const deleteCourseCategory = async (id: number, token?: string | null) => {
  await fetchApi(`/api/course/categories/${id}`, { method: "DELETE", token });
};

export const getCourses = async (): Promise<Course[]> => {
  const data = await fetchApi<{ courses: Course[] }>("/api/course/get");
  return data.courses;
};

export const getCourseById = async (id: number | string): Promise<Course> => {
  const data = await fetchApi<{ course: Course }>(`/api/course/get/${id}`);
  return data.course;
};

export const deleteCourse = async (id: number | string, token?: string | null) => {
  await fetchApi(`/api/course/delete/${id}`, { method: "DELETE", token });
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const data = await fetchApi<{ announcements: Announcement[] }>("/api/announcement/get");
  return data.announcements;
};

export const getAnnouncementById = async (id: number | string): Promise<Announcement> => {
  const data = await fetchApi<{ announcement: Announcement }>(`/api/announcement/get/${id}`);
  return data.announcement;
};

export const deleteAnnouncement = async (id: number | string, token?: string | null) => {
  await fetchApi(`/api/announcement/delete/${id}`, { method: "DELETE", token });
};

export const getFeedbackList = async (
  token?: string | null,
  params?: { page?: number; limit?: number; sort?: "asc" | "desc" },
) => {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.sort) search.set("sort", params.sort);
  const query = search.toString();
  return fetchApi<{ feedbacks: Feedback[]; pagination: Pagination }>(
    `/api/feedback${query ? `?${query}` : ""}`,
    { token },
  );
};

export const deleteFeedback = async (id: number, token?: string | null) => {
  await fetchApi(`/api/feedback/${id}`, { method: "DELETE", token });
};

export const submitFeedback = async (payload: {
  name: string;
  email: string;
  message: string;
}) => {
  return fetchApi<{ feedback: Feedback }>("/api/feedback", {
    method: "POST",
    body: jsonBody(payload),
  });
};
