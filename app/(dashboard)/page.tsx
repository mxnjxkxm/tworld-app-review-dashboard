import { prisma } from '@/lib/prisma';
import KPICard from '@/components/KPICard';
import TopicTable from '@/components/TopicTable';
import ReviewTable from '@/components/ReviewTable';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';

interface SearchParams {
  search?: string;
  store?: string;
  rating?: string;
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // searchParams를 await로 해결
  const resolvedSearchParams = await searchParams;
  const today = new Date();
  const oneMonthAgo = subDays(today, 30);
  const threeMonthsAgo = subDays(today, 90);
  const todayKey = format(today, 'yyyy-MM-dd');

  // KPI 데이터 조회 (3개월 기준)
  const recentMonthReviewsCount = await prisma.review.count({
    where: {
      createdAt: {
        gte: oneMonthAgo,
      },
    },
  });

  const threeMonthReviewsCount = await prisma.review.count({
    where: {
      createdAt: {
        gte: threeMonthsAgo,
      },
    },
  });

  // 3개월 평균 평점 계산
  const avgRatingResult = await prisma.review.aggregate({
    where: {
      createdAt: {
        gte: threeMonthsAgo,
      },
    },
    _avg: {
      rating: true,
    },
  });

  const avgRating = avgRatingResult._avg.rating || 0;

  // 월간 증감률 계산 (최근 1개월 vs 이전 2개월 평균)
  const prevTwoMonthsCount = threeMonthReviewsCount - recentMonthReviewsCount;
  const prevMonthlyAverage = prevTwoMonthsCount / 2;
  const reviewChangePercent = prevMonthlyAverage > 0
    ? ((recentMonthReviewsCount - prevMonthlyAverage) / prevMonthlyAverage) * 100
    : 0;

  // 최신 3개월 토픽 요약 조회
  const quarterlySummaries = await prisma.summary.findMany({
    where: {
      dateKey: todayKey,
    },
    include: {
      app: true,
    },
  });

  // 토픽 데이터 파싱
  const allTopics: any[] = [];
  quarterlySummaries.forEach(summary => {
    try {
      const topics = JSON.parse(summary.topicsJson);
      allTopics.push(...topics);
    } catch (error) {
      console.error('토픽 데이터 파싱 오류:', error);
    }
  });

  // 최근 3개월 리뷰 목록 조회
  const reviews = await prisma.review.findMany({
    where: {
      createdAt: {
        gte: threeMonthsAgo,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 200, // 3개월 분석이므로 더 많은 리뷰 표시
    include: {
      app: true,
    },
  });

  // 3개월 종합 요약 가져오기
  const quarterlySummary = quarterlySummaries.length > 0 
    ? quarterlySummaries[0].geminiSummary 
    : '3개월 종합 분석이 아직 생성되지 않았습니다.';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">T world 리뷰 분석</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {format(today, 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <form action="/api/reviews/refresh" method="POST">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  수동 갱신
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="최근 1개월 리뷰"
            value={recentMonthReviewsCount}
            change={{
              value: Math.round(reviewChangePercent),
              label: "월평균 대비"
            }}
            icon={<span className="text-2xl">📝</span>}
          />
          <KPICard
            title="3개월 총 리뷰"
            value={threeMonthReviewsCount}
            icon={<span className="text-2xl">📊</span>}
          />
          <KPICard
            title="3개월 평균 평점"
            value={avgRating.toFixed(1)}
            icon={<span className="text-2xl">⭐</span>}
          />
          <KPICard
            title="발견된 토픽"
            value={allTopics.length}
            icon={<span className="text-2xl">🏷️</span>}
          />
        </div>

        {/* AI 3개월 종합 요약 */}
        {quarterlySummary && (
          <div className="card mb-8">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">AI 3개월 종합 분석</h3>
                  <p className="text-sm text-gray-600">Gemini 2.5 Flash가 분석한 3개월 트렌드 인사이트</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                  {quarterlySummary}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 토픽 테이블 */}
        {allTopics.length > 0 && (
          <div className="mb-8">
            <TopicTable topics={allTopics} />
          </div>
        )}

        {/* 리뷰 테이블 */}
        <ReviewTable 
          reviews={reviews.map(review => ({
            id: review.id,
            store: review.store,
            author: review.author,
            rating: review.rating,
            title: review.title || undefined,
            text: review.text,
            version: review.version || undefined,
            createdAt: review.createdAt,
          }))}
        />
      </div>
    </div>
  );
}
