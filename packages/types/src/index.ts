export interface User {
  id: string;
  auth0Id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCreate {
  auth0Id: string;
  name: string;
  email: string;
}
