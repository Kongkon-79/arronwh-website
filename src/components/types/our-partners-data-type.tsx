

export interface PartnerApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: Partner[];
}

export interface Meta {
  limit: number;
  page: number;
  total: number;
}

export interface Partner {
  _id: string;
  excellent: string;
  title: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}