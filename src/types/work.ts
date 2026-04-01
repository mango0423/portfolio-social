export interface WorkUser {
  id: string;
  name: string;
  image: string | null;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  user: WorkUser;
  likeCount: number;
  commentCount: number;
  tags: string[];
  isLikedByUser?: boolean;
}

export interface WorksResponse {
  works: Work[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}