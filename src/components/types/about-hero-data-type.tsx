

export type AboutUsApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    limit: number;
    page: number;
    total: number;
  };
  data: AboutUs[];
};

export type AboutUs = {
  _id: string;
  headerTitle: string;
  headerDescription: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};