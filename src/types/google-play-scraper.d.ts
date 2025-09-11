declare module 'google-play-scraper' {
  export interface ReviewsOptions {
    appId: string;
    sort?: string;
    num?: number;
    lang?: string;
    country?: string;
  }

  export interface Review {
    id: string;
    userName: string;
    score: number;
    text: string;
    version?: string;
    date: string | Date;
  }

  export interface ReviewsResult {
    data: Review[];
    nextPaginationToken?: string;
  }

  export const sort: {
    NEWEST: string;
    RATING: string;
    HELPFULNESS: string;
  };

  export function reviews(options: ReviewsOptions): Promise<ReviewsResult>;

  const gplay: {
    reviews: (options: ReviewsOptions) => Promise<ReviewsResult>;
    sort: {
      NEWEST: string;
      RATING: string;
      HELPFULNESS: string;
    };
  };

  export default gplay;
}
