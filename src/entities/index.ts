/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: projects
 * Interface for Projects
 */
export interface Projects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectTitle?: string;
  /** @wixFieldType text */
  projectDescription?: string;
  /** @wixFieldType text */
  technologiesUsed?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  projectImage?: string;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType url */
  projectUrl?: string;
  /** @wixFieldType date */
  completionDate?: Date | string;
}


/**
 * Collection ID: services
 * Interface for Services
 */
export interface Services {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  serviceName?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType text */
  detailedDescription?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  serviceImage?: string;
  /** @wixFieldType text */
  slug?: string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
}


/**
 * Collection ID: teammembers
 * Interface for TeamMembers
 */
export interface TeamMembers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  jobTitle?: string;
  /** @wixFieldType text */
  bio?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profilePhoto?: string;
  /** @wixFieldType url */
  linkedInUrl?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType date */
  joiningDate?: Date | string;
  /** @wixFieldType number */
  displayOrder?: number;
}


/**
 * Collection ID: testimonials
 * Interface for Testimonials
 */
export interface Testimonials {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType text */
  reviewText?: string;
  /** @wixFieldType text */
  clientRoleCompany?: string;
  /** @wixFieldType number */
  rating?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  clientImage?: string;
  /** @wixFieldType date */
  datePosted?: Date | string;
}
