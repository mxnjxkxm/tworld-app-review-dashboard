#!/usr/bin/env tsx

import { prisma } from '../lib/prisma';
import { clusterReviews, KeywordCluster } from '../lib/text';
import { summarizeTopic, generateDailySummary } from '../lib/gemini';
import { Store } from '@prisma/client';
import { format, subDays } from 'date-fns';

interface TopicWithSummary extends KeywordCluster {
  aiSummary?: {
    summary: string;
    sentiment: "positive" | "neutral" | "negative";
    urgency: "low" | "medium" | "high";
    suggestion: string;
  };
}

async function main() {
  console.log('🧠 토픽 집계 및 요약 작업 시작');
  
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    // 어제 이후 수집된 리뷰들을 가져오기
    const cutoffDate = subDays(new Date(), 1);
    
    const apps = await prisma.app.findMany();
    
    if (apps.length === 0) {
      console.log('⚠️  등록된 앱이 없습니다.');
      return;
    }

    for (const app of apps) {
      console.log(`\n📱 ${app.name} (${app.store}) 토픽 분석 중...`);
      
      try {
        // 최근 리뷰 조회 (지난 24시간)
        const recentReviews = await prisma.review.findMany({
          where: {
            appId: app.id,
            fetchedAt: {
              gte: cutoffDate
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        if (recentReviews.length === 0) {
          console.log(`  신규 리뷰가 없습니다.`);
          continue;
        }

        console.log(`  분석할 리뷰: ${recentReviews.length}건`);

        // 리뷰 클러스터링
        const clusters = clusterReviews(recentReviews.map(review => ({
          text: review.text,
          rating: review.rating,
          id: review.id
        })));

        console.log(`  발견된 토픽: ${clusters.length}개`);

        // 각 클러스터에 대해 AI 요약 생성
        const topicsWithSummary: TopicWithSummary[] = [];
        
        for (const cluster of clusters) {
          try {
            console.log(`    "${cluster.topic}" 토픽 요약 생성 중... (${cluster.count}건)`);
            
            // 대표 리뷰 선택 (최대 5개)
            const sampleReviews = cluster.reviews.slice(0, 5);
            
            const aiSummary = await summarizeTopic(sampleReviews);
            
            topicsWithSummary.push({
              ...cluster,
              aiSummary
            });

            // API 레이트 리밋 방지
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.error(`    토픽 "${cluster.topic}" 요약 생성 실패:`, error);
            topicsWithSummary.push(cluster);
          }
        }

        // 전체 일일 요약 생성
        let dailySummary = '';
        try {
          const summaryData = topicsWithSummary.map(topic => ({
            topic: topic.topic,
            count: topic.count,
            sentiment: topic.aiSummary?.sentiment || topic.sentiment,
            urgency: topic.aiSummary?.urgency || 'medium',
            summary: topic.aiSummary?.summary || '요약 없음'
          }));

          dailySummary = await generateDailySummary(summaryData);
        } catch (error) {
          console.error('  일일 요약 생성 실패:', error);
          dailySummary = '일일 요약을 생성할 수 없습니다.';
        }

        // 데이터베이스에 저장
        const topicsJson = JSON.stringify(topicsWithSummary.map(topic => ({
          topic: topic.topic,
          keywords: topic.keywords,
          count: topic.count,
          sentiment: topic.sentiment,
          examples: topic.reviews.slice(0, 3), // 예시 리뷰 3개만 저장
          aiSummary: topic.aiSummary
        })));

        await prisma.summary.upsert({
          where: {
            store_appId_dateKey: {
              store: app.store,
              appId: app.id,
              dateKey: today
            }
          },
          update: {
            topicsJson,
            geminiSummary: dailySummary
          },
          create: {
            store: app.store,
            appId: app.id,
            dateKey: today,
            topicsJson,
            geminiSummary: dailySummary
          }
        });

        console.log(`  ✅ ${app.name} 요약 완료`);
        console.log(`     - 토픽: ${topicsWithSummary.length}개`);
        console.log(`     - AI 요약: ${topicsWithSummary.filter(t => t.aiSummary).length}개`);

      } catch (error) {
        console.error(`❌ ${app.name} 토픽 분석 실패:`, error);
      }
    }

    // 전체 통계 출력
    const totalSummaries = await prisma.summary.count({
      where: {
        dateKey: today
      }
    });

    console.log(`\n🎉 토픽 분석 완료! 오늘 생성된 요약: ${totalSummaries}개`);

    // 최근 요약 통계
    const recentSummaries = await prisma.summary.findMany({
      where: {
        dateKey: {
          in: [today, yesterday]
        }
      },
      include: {
        app: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('\n📊 최근 요약 현황:');
    recentSummaries.forEach(summary => {
      const topics = JSON.parse(summary.topicsJson);
      console.log(`  ${summary.dateKey} - ${summary.app.name}: ${topics.length}개 토픽`);
    });

  } catch (error) {
    console.error('❌ 토픽 분석 작업 실패:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
