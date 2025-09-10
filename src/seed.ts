#!/usr/bin/env tsx

import { prisma } from './lib/prisma';
import { Store } from '@prisma/client';

async function main() {
  console.log('🌱 시드 데이터 생성 시작');

  try {
    // 기존 데이터 정리
    await prisma.summary.deleteMany();
    await prisma.review.deleteMany();
    await prisma.app.deleteMany();

    // 앱 데이터 생성
    const apps = await Promise.all([
      prisma.app.create({
        data: {
          store: Store.IOS,
          appId: process.env.APPSTORE_APP_ID || '428872117',
          name: 'T world - iOS',
        },
      }),
      prisma.app.create({
        data: {
          store: Store.ANDROID,
          appId: process.env.GOOGLE_PLAY_APP_ID || 'com.sktelecom.minit',
          name: 'T world - Android',
        },
      }),
    ]);

    console.log('✅ 앱 데이터 생성 완료:');
    apps.forEach(app => {
      console.log(`  - ${app.name} (${app.store}): ${app.appId}`);
    });

    // 샘플 리뷰 데이터 생성 (테스트용)
    const sampleReviews = [
      {
        appId: apps[0].id,
        store: Store.IOS,
        reviewId: 'ios-sample-1',
        author: '김철수',
        rating: 5,
        title: '정말 편리해요',
        text: '요금제 변경이나 데이터 사용량 확인이 정말 편리합니다. UI도 깔끔하고 속도도 빠르네요.',
        language: 'ko',
        version: '8.2.1',
        country: 'KR',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
      },
      {
        appId: apps[0].id,
        store: Store.IOS,
        reviewId: 'ios-sample-2',
        author: '박영희',
        rating: 2,
        title: '로그인 문제',
        text: '자꾸 로그인이 풀려서 불편해요. 지문인식도 잘 안되고 앱이 느려졌어요.',
        language: 'ko',
        version: '8.2.1',
        country: 'KR',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4시간 전
      },
      {
        appId: apps[1].id,
        store: Store.ANDROID,
        reviewId: 'android-sample-1',
        author: '이민수',
        rating: 4,
        title: '',
        text: '전체적으로 만족스럽지만 가끔 앱이 멈춰요. 업데이트 부탁드려요.',
        language: 'ko',
        version: '8.2.0',
        country: 'KR',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1시간 전
      },
      {
        appId: apps[1].id,
        store: Store.ANDROID,
        reviewId: 'android-sample-2',
        author: '최지영',
        rating: 1,
        title: '',
        text: '강제 업데이트 때문에 짜증나요. 이전 버전이 더 좋았는데 왜 바꾼 거죠?',
        language: 'ko',
        version: '8.2.0',
        country: 'KR',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
      },
    ];

    await Promise.all(
      sampleReviews.map(review =>
        prisma.review.create({ data: review })
      )
    );

    console.log('✅ 샘플 리뷰 데이터 생성 완료: 4건');

    // 통계 출력
    const totalApps = await prisma.app.count();
    const totalReviews = await prisma.review.count();

    console.log('\n📊 시드 데이터 생성 완료:');
    console.log(`  - 앱: ${totalApps}개`);
    console.log(`  - 리뷰: ${totalReviews}건`);
    console.log('\n🚀 이제 다음 명령어로 실제 리뷰를 수집할 수 있습니다:');
    console.log('  pnpm fetch && pnpm summarize');

  } catch (error) {
    console.error('❌ 시드 데이터 생성 실패:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
