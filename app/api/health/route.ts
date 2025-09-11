import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 환경변수 확인
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      APPSTORE_APP_ID: !!process.env.APPSTORE_APP_ID,
      GOOGLE_PLAY_APP_ID: !!process.env.GOOGLE_PLAY_APP_ID,
    };

    // 데이터베이스 연결 테스트
    let dbStatus = 'disconnected';
    let dbError = null;
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Unknown error';
    }

    // 앱 데이터 확인
    let appCount = 0;
    try {
      appCount = await prisma.app.count();
    } catch (error) {
      // 테이블이 없을 수 있음
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        ...envCheck
      },
      database: {
        status: dbStatus,
        error: dbError,
        appCount
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
