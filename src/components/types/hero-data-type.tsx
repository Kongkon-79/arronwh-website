
export interface BannerApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: Banner[];
}

export interface Meta {
  limit: number;
  page: number;
  total: number;
}

export interface Banner {
  _id: string;
  firstTitle: string;
  secondTitle: string;
  subTitle: string;
  feature: string[]; 
  image: string;
  imageText: string;
  backgroundColor: string;
  textColor: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}