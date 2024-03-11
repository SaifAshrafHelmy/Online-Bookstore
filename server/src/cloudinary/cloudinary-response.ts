import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

// Create a union to represent the API response
export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
