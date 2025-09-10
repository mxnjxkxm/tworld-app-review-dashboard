interface Topic {
  topic: string;
  keywords: string[];
  count: number;
  sentiment: "positive" | "neutral" | "negative";
  examples: string[];
  aiSummary?: {
    summary: string;
    sentiment: "positive" | "neutral" | "negative";
    urgency: "low" | "medium" | "high";
    suggestion: string;
  };
}

interface TopicTableProps {
  topics: Topic[];
}

export default function TopicTable({ topics }: TopicTableProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">반복 토픽 분석</h3>
            <p className="text-sm text-gray-600">AI가 발견한 주요 이슈와 피드백</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                토픽
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                빈도
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                감성
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                긴급도
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AI 요약
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                개선 제안
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topics.map((topic, index) => (
              <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-base font-semibold text-gray-900 mb-2">
                      {topic.topic}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {topic.keywords.map((keyword, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-blue-600">{topic.count}</span>
                    </div>
                    <span className="text-sm text-gray-500">건</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(topic.aiSummary?.sentiment || topic.sentiment)}`}>
                    {topic.aiSummary?.sentiment || topic.sentiment}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {topic.aiSummary?.urgency && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(topic.aiSummary.urgency)}`}>
                      {topic.aiSummary.urgency}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {topic.aiSummary?.summary || '요약 없음'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800 leading-relaxed">
                        💡 {topic.aiSummary?.suggestion || '제안 없음'}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

