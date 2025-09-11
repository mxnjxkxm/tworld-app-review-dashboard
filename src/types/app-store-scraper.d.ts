declare module 'app-store-scraper' {
  export interface ReviewOptions {
    id: string;
    sort?: string;
    page?: number;
    country?: string;
  }

  export interface Review {
    id: string;
    userName: string;
    score: number;
    title?: string;
    text: string;
    version?: string;
    date?: string | Date;
  }

  export const sort: {
    RECENT: string;
    HELPFUL: string;
  };

  export function reviews(options: ReviewOptions): Promise<Review[]>;
  
  const store: {
    reviews: (options: ReviewOptions) => Promise<Review[]>;
    sort: {
      RECENT: string;
      HELPFUL: string;
    };
  };

  export default store;
}
