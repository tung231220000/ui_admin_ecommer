import { Currency, TimeUnit } from '../@types/price';
import { AttributeKey } from '@/@types/product';

export const phoneRegExp = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;

/**
 * CONSTANT BY ENUM
 */
export const GENDERS = ['Ông', 'Bà'];
export const CURRENCIES: Currency[] = [Currency.VND];
export const TIME_UNITS: TimeUnit[] = [TimeUnit.MONTH];
export const ATTRIBUTE_KEYS: AttributeKey[] = [
  AttributeKey.VCPU,
  AttributeKey.RAM,
  AttributeKey.SSD,
  AttributeKey.BANDWIDTH,
  AttributeKey.TRANSMISSION_TRAFFIC,
  AttributeKey.IP,
];
/**
 * * API DOMAINS
 */
export const API_DOMAIN = 'http://localhost:8082';

// ? AUTH ENDPOINTS
export const AUTH_SERVICE_SIGN_IN_ENDPOINT = '/auth/sign-in';
export const AUTH_SERVICE_GET_USER_ENDPOINT = '/auth/me';
// ? CATEGORY ENDPOINTS
export const CATEGORY_SERVICE_UPLOAD_ICON_ENDPOINT = '/category/icon';
// ? SOLUTION CATEGORY ENDPOINTS
export const SOLUTION_CATEGORY_SERVICE_UPLOAD_ICON_ENDPOINT = '/solution-category/icon';
// ? INFORMATION ENDPOINTS
export const INFORMATION_SERVICE_UPLOAD_ASSETS_ENDPOINT = '/information/assets';
export const INFORMATION_SERVICE_UPLOAD_VARIANT_IMAGE_ENDPOINT = '/information/variant-image';
export const INFORMATION_SERVICE_UPLOAD_VARIANT_IMAGES_ENDPOINT = '/information/variant-images';
// ? PARTNER ENDPOINTS
export const PARTNER_SERVICE_UPLOAD_LOGO_ENDPOINT = '/partner/logo';
// ? TRADEMARK ENDPOINTS
export const TRADEMARK_SERVICE_UPLOAD_LOGO_ENDPOINT = '/trademark/logo';
// ? PAGE ENDPOINTS
export const PAGE_SERVICE_UPLOAD_BANNER_IMAGE_ENDPOINT = '/page/banner';
export const PAGE_SERVICE_UPLOAD_CAROUSEL_IMAGE_ENDPOINT = '/page/carousel';
// ? POST ENDPOINTS
export const POST_SERVICE_UPLOAD_COVER_IMAGE_ENDPOINT = '/post/cover';
// ? PRODUCT ENDPOINTS
export const PRODUCT_SERVICE_UPLOAD_BANNER_IMAGE_ENDPOINT = '/product/banner';
// ? SOLUTION ENDPOINTS
export const SOLUTION_SERVICE_UPLOAD_BANNER_IMAGE_ENDPOINT = '/solution/banner';
// ? SERVICE ENDPOINTS
export const SERVICE_SERVICE_UPLOAD_THUMBNAIL_ENDPOINT = '/service/thumbnail';
