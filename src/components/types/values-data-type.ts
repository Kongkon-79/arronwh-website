
export type ValuesHeader = {
  _id: string;
  valueTitle: string;
  valueDetail: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ValuesHeaderResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: ValuesHeader[];
};

export type ValueDataItem = {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  iconBg?: string;
  iconColor?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ValuesDataResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: ValueDataItem[];
};
