'use client';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">서비스 오류</h1>
          <p className="text-gray-600 mb-4">
            현재 서비스에 일시적인 문제가 발생했습니다.
          </p>
          <div className="bg-gray-50 rounded p-3 mb-4 text-sm text-left">
            <strong>가능한 원인:</strong>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• 데이터베이스 연결 오류</li>
              <li>• 환경변수 설정 누락</li>
              <li>• 서버 초기화 진행 중</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()} 
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              새로고침
            </button>
            <a 
              href="/api/health" 
              target="_blank"
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-center"
            >
              상태 확인
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
