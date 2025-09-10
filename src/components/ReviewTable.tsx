'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState, useMemo } from 'react';

interface Review {
  id: string;
  store: string;
  author: string;
  rating: number;
  title?: string;
  text: string;
  version?: string;
  createdAt: Date;
}

interface ReviewTableProps {
  reviews: Review[];
}

// 개별 리뷰 행 컴포넌트
function ReviewRow({ review, index }: { review: Review; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStoreIcon = (store: string) => {
    return store === 'IOS' ? '🍎' : '🤖';
  };

  const getStarRating = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const maskAuthor = (author: string) => {
    if (author.length <= 2) return author;
    return author[0] + '*'.repeat(author.length - 2) + author[author.length - 1];
  };

  // 텍스트가 길면 자르기 (약 150자 기준)
  const shouldTruncate = review.text.length > 150;
  const displayText = isExpanded ? review.text : review.text.slice(0, 150);

  return (
    <tr className="hover:bg-blue-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
          <span className="text-lg">
            {getStoreIcon(review.store)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-xs font-bold text-white">{index + 1}</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{maskAuthor(review.author)}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-lg">{getStarRating(review.rating)}</span>
          <span className="ml-2 text-sm text-gray-500">({review.rating}/5)</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
          {review.version || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(review.createdAt), 'MM/dd HH:mm', { locale: ko })}
      </td>
      <td className="px-6 py-4">
        <div className="max-w-md">
          {review.title && (
            <div className="font-semibold text-gray-900 mb-2 text-sm">{review.title}</div>
          )}
          <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3 border-l-4 border-blue-200">
            <div className={isExpanded ? '' : 'line-clamp-4'}>
              {displayText}
              {!isExpanded && shouldTruncate && '...'}
            </div>
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    접기
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    더 보기
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function ReviewTable({ reviews }: ReviewTableProps) {
  // 탭 필터 상태 관리
  const [activeFilters, setActiveFilters] = useState<Set<string>>(() => {
    const filters = new Set<string>();
    filters.add('ALL'); // 기본적으로 전체 보기
    return filters;
  });

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  // 필터링된 리뷰 계산
  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    // 스토어 필터
    if (!activeFilters.has('ALL')) {
      filtered = filtered.filter(review => {
        if (activeFilters.has('IOS') && review.store === 'IOS') return true;
        if (activeFilters.has('ANDROID') && review.store === 'ANDROID') return true;
        return false;
      });
    }

    // 검색어 필터
    if (searchTerm.trim()) {
      filtered = filtered.filter(review => 
        review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 평점 필터
    if (selectedRating) {
      filtered = filtered.filter(review => review.rating === parseInt(selectedRating));
    }

    return filtered;
  }, [reviews, activeFilters, searchTerm, selectedRating]);

  // 탭 필터 토글
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      
      if (filter === 'ALL') {
        // 전체 선택 시 다른 모든 필터 제거
        newFilters.clear();
        newFilters.add('ALL');
      } else {
        // 개별 필터 토글
        if (newFilters.has(filter)) {
          newFilters.delete(filter);
        } else {
          newFilters.add(filter);
          newFilters.delete('ALL'); // 개별 필터 선택 시 전체 해제
        }
        
        // 아무것도 선택되지 않으면 전체 선택
        if (newFilters.size === 0) {
          newFilters.add('ALL');
        }
      }
      
      return newFilters;
    });
  };

  // 통계 계산
  const stats = {
    total: reviews.length,
    ios: reviews.filter(r => r.store === 'IOS').length,
    android: reviews.filter(r => r.store === 'ANDROID').length,
    filtered: filteredReviews.length
  };

  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">리뷰 목록</h3>
              <p className="text-sm text-gray-600">
                {stats.filtered}건 표시 중 (전체 {stats.total}건)
                {searchTerm && ` • 검색: "${searchTerm}"`}
                {selectedRating && ` • ${selectedRating}⭐`}
              </p>
            </div>
          </div>

          {/* 탭 필터 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleFilter('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilters.has('ALL')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체 ({stats.total})
            </button>
            <button
              onClick={() => toggleFilter('IOS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilters.has('IOS')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🍎 iOS ({stats.ios})
            </button>
            <button
              onClick={() => toggleFilter('ANDROID')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilters.has('ANDROID')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🤖 Android ({stats.android})
            </button>
          </div>

          {/* 검색 및 평점 필터 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="리뷰 내용, 제목, 작성자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">전체 평점</option>
              <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
              <option value="4">⭐⭐⭐⭐ (4점)</option>
              <option value="3">⭐⭐⭐ (3점)</option>
              <option value="2">⭐⭐ (2점)</option>
              <option value="1">⭐ (1점)</option>
            </select>
            {(searchTerm || selectedRating) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRating('');
                }}
                className="btn-secondary whitespace-nowrap"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                검색 초기화
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                스토어
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                평점
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                버전
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                리뷰 내용
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review, index) => (
                <ReviewRow key={review.id} review={review} index={index} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">검색 결과가 없습니다</p>
                      <p className="text-sm">다른 검색어나 필터를 시도해보세요</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
