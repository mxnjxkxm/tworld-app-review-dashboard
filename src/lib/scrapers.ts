import store from 'app-store-scraper';
import gplay from 'google-play-scraper';
import { detectLanguage } from './text';

export interface RawReview {
  id: string;
  author: string;
  rating: number;
  title?: string;
  text: string;
  version?: string;
  date: Date;
  country?: string;
}

// iOS App Store 리뷰 수집
export async function fetchIosReviews(appId: string, pageCount: number = 5): Promise<RawReview[]> {
  const reviews: RawReview[] = [];
  
  console.log(`iOS 리뷰 수집 시작 (앱 ID: ${appId}, 페이지: ${pageCount})`);
  
  try {
    // 여러 국가에서 리뷰 수집 시도
    const countries = ['kr', 'us']; // 한국 우선, 미국 보조
    
    for (const country of countries) {
      console.log(`📍 ${country.toUpperCase()} 스토어에서 리뷰 수집 중...`);
      
      try {
        for (let page = 1; page <= pageCount; page++) {
          console.log(`iOS 페이지 ${page}/${pageCount} 수집 중... (${country.toUpperCase()})`);
          
          const pageReviews = await store.reviews({
            id: appId, // 'appId' 대신 'id' 사용
            sort: store.sort.RECENT,
            page,
            country: country
          });

          if (!pageReviews || pageReviews.length === 0) {
            console.log(`페이지 ${page}에서 리뷰를 찾을 수 없습니다. (${country.toUpperCase()})`);
            break;
          }

          const processedReviews = pageReviews.map((review: any, index: number) => {
            // 날짜 처리 개선 - app-store-scraper에서 date가 undefined로 오는 문제 해결
            let reviewDate = new Date();
            
            if (review.date) {
              try {
                reviewDate = new Date(review.date);
                if (isNaN(reviewDate.getTime())) {
                  reviewDate = new Date();
                }
              } catch (error) {
                reviewDate = new Date();
              }
            } else {
              // date가 없는 경우, 페이지와 인덱스를 기반으로 대략적인 날짜 생성
              // 최신 리뷰일수록 더 최근 날짜로 설정
              const daysAgo = (page - 1) * 50 + index; // 페이지당 50개씩 가정
              reviewDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
            }

            return {
              id: review.id || `${country}-${review.userName}-${Date.now()}-${Math.random()}`,
              author: review.userName || '익명',
              rating: review.score || 0,
              title: review.title || '',
              text: review.text || '',
              version: review.version || '',
              date: reviewDate,
              country: country.toUpperCase()
            };
          });

          reviews.push(...processedReviews);
          
          // API 레이트 리밋 방지
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`${country.toUpperCase()} 스토어에서 ${reviews.length}건 수집 완료`);
        
        // 한국에서 충분한 리뷰를 얻었으면 다른 국가는 스킵
        if (country === 'kr' && reviews.length >= 50) {
          console.log('한국 스토어에서 충분한 리뷰를 수집했습니다.');
          break;
        }
        
      } catch (countryError) {
        console.error(`${country.toUpperCase()} 스토어 수집 오류:`, countryError);
        continue; // 다음 국가로 시도
      }
    }

    console.log(`iOS 리뷰 수집 완료: 총 ${reviews.length}건`);
    return reviews;
  } catch (error) {
    console.error('iOS 리뷰 수집 오류:', error);
    throw new Error(`iOS 리뷰 수집 실패: ${error}`);
  }
}

// Android Google Play 리뷰 수집
export async function fetchAndroidReviews(appId: string, numReviews: number = 500): Promise<RawReview[]> {
  console.log(`Android 리뷰 수집 시작 (패키지: ${appId}, 최대 ${numReviews}건)`);
  
  try {
    const result = await gplay.reviews({
      appId,
      sort: gplay.sort.NEWEST,
      num: numReviews,
      lang: 'ko',
      country: 'kr'
    });

    const reviews = result.data.map((review: any) => ({
      id: review.id,
      author: review.userName || '익명',
      rating: review.score || 0,
      title: '', // Google Play는 제목이 없음
      text: review.text || '',
      version: review.version || '',
      date: new Date(review.date),
      country: 'KR'
    }));

    console.log(`Android 리뷰 수집 완료: ${reviews.length}건`);
    return reviews;
  } catch (error) {
    console.error('Android 리뷰 수집 오류:', error);
    throw new Error(`Android 리뷰 수집 실패: ${error}`);
  }
}

// 리뷰 데이터 검증 및 정제
export function validateAndCleanReview(review: RawReview): RawReview | null {
  // 필수 필드 검증
  if (!review.id || !review.text || review.rating < 1 || review.rating > 5) {
    return null;
  }

  // 날짜 검증 (이미 스크래퍼에서 처리됨)
  let validDate = review.date;

  // 텍스트 정제
  const cleanText = review.text
    .trim()
    .replace(/\s+/g, ' ') // 연속 공백 제거
    .slice(0, 2000); // 최대 길이 제한

  if (cleanText.length < 10) {
    return null; // 너무 짧은 리뷰 제외
  }

  return {
    ...review,
    text: cleanText,
    author: review.author.slice(0, 50), // 작성자명 길이 제한
    title: review.title?.slice(0, 200) || '',
    version: review.version?.slice(0, 50) || '',
    date: validDate,
  };
}

// 재시도 로직이 포함된 안전한 수집 함수
export async function safelyFetchReviews(
  store: 'ios' | 'android',
  appId: string,
  options: { pageCount?: number; numReviews?: number } = {}
): Promise<RawReview[]> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`${store.toUpperCase()} 리뷰 수집 시도 ${attempt}/${maxRetries}`);
      
      let rawReviews: RawReview[];
      
      if (store === 'ios') {
        rawReviews = await fetchIosReviews(appId, options.pageCount || 5);
      } else {
        rawReviews = await fetchAndroidReviews(appId, options.numReviews || 500);
      }

      // 리뷰 검증 및 정제
      const validReviews = rawReviews
        .map(validateAndCleanReview)
        .filter((review): review is RawReview => review !== null);

      console.log(`유효한 리뷰: ${validReviews.length}/${rawReviews.length}건`);
      return validReviews;

    } catch (error) {
      lastError = error as Error;
      console.error(`시도 ${attempt} 실패:`, error);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 지수 백오프
        console.log(`${delay}ms 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('알 수 없는 오류');
}

