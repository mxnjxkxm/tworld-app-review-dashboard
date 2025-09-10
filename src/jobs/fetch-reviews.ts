#!/usr/bin/env tsx

import { prisma } from '../lib/prisma';
import { safelyFetchReviews } from '../lib/scrapers';
import { detectLanguage } from '../lib/text';
import { Store } from '@prisma/client';

async function main() {
  console.log('🚀 리뷰 수집 작업 시작');
  
  try {
    // 환경변수에서 앱 ID 가져오기
    const iosAppId = process.env.APPSTORE_APP_ID;
    const androidAppId = process.env.GOOGLE_PLAY_APP_ID;

    if (!iosAppId || !androidAppId) {
      throw new Error('앱 ID 환경변수가 설정되지 않았습니다.');
    }

    // 데이터베이스에서 앱 정보 조회
    const apps = await prisma.app.findMany();
    
    if (apps.length === 0) {
      console.log('⚠️  등록된 앱이 없습니다. 시드 데이터를 실행하세요.');
      return;
    }

    let totalNewReviews = 0;

    // 각 앱에 대해 리뷰 수집
    for (const app of apps) {
      console.log(`\n📱 ${app.name} (${app.store}) 리뷰 수집 중...`);
      
      try {
        // 리뷰 수집
        const rawReviews = await safelyFetchReviews(
          app.store.toLowerCase() as 'ios' | 'android',
          app.appId,
          app.store === Store.IOS ? { pageCount: 5 } : { numReviews: 500 }
        );

        console.log(`수집된 리뷰: ${rawReviews.length}건`);

        // 데이터베이스에 저장 (upsert)
        let newReviewsCount = 0;
        
        for (const review of rawReviews) {
          try {
            const language = detectLanguage(review.text);
            
            const result = await prisma.review.upsert({
              where: {
                store_reviewId: {
                  store: app.store,
                  reviewId: review.id
                }
              },
              update: {
                fetchedAt: new Date()
              },
              create: {
                appId: app.id,
                store: app.store,
                reviewId: review.id,
                author: review.author,
                rating: review.rating,
                title: review.title || null,
                text: review.text,
                language,
                version: review.version || null,
                country: review.country || 'KR',
                createdAt: review.date,
                fetchedAt: new Date()
              }
            });

            // 새로 생성된 경우만 카운트 (업데이트는 제외)
            if (result.fetchedAt.getTime() === result.createdAt.getTime()) {
              newReviewsCount++;
            }
          } catch (error) {
            console.error(`리뷰 저장 오류 (ID: ${review.id}):`, error);
          }
        }

        console.log(`✅ ${app.name}: 신규 ${newReviewsCount}건, 업데이트 ${rawReviews.length - newReviewsCount}건`);
        totalNewReviews += newReviewsCount;

      } catch (error) {
        console.error(`❌ ${app.name} 리뷰 수집 실패:`, error);
      }
    }

    console.log(`\n🎉 리뷰 수집 완료! 총 신규 리뷰: ${totalNewReviews}건`);

    // 통계 출력
    const stats = await prisma.review.groupBy({
      by: ['store'],
      _count: {
        id: true
      }
    });

    console.log('\n📊 현재 데이터베이스 통계:');
    stats.forEach(stat => {
      console.log(`  ${stat.store}: ${stat._count.id}건`);
    });

  } catch (error) {
    console.error('❌ 리뷰 수집 작업 실패:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
