import { Category } from './category.model';

export interface MenuItem {
    id: string | number;  // Support both string and number IDs
    slug?: string; // Added slug for routerLink and menu data
    name: string;
    description?: string;
    about?: string; // Optional about field for details page
    price: number;
    mrp: number;
    img: string;  // Changed from imgUrl to match your data
    cat: string;  // Added category string
    veg: boolean;
    customizable: boolean;
    rating: number;
    pop: number;  // Changed from popularity to match your data
    off: number;  // Added discount percentage
    category?: Category;
}
