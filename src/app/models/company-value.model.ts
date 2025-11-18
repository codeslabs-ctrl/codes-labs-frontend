export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  iconName: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface CompanyValueResponse {
  success: boolean;
  data: CompanyValue[];
}

export interface SingleCompanyValueResponse {
  success: boolean;
  data: CompanyValue;
}

