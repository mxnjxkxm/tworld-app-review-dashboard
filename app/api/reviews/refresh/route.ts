import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    console.log('수동 리뷰 갱신 요청');
    
    // 리뷰 수집 실행
    const { stdout: fetchOutput } = await execAsync('pnpm fetch');
    console.log('리뷰 수집 완료:', fetchOutput);
    
    // 토픽 요약 실행
    const { stdout: summarizeOutput } = await execAsync('pnpm summarize');
    console.log('토픽 요약 완료:', summarizeOutput);
    
    return NextResponse.json({
      success: true,
      message: '리뷰 갱신이 완료되었습니다.',
      fetchOutput,
      summarizeOutput
    });
    
  } catch (error) {
    console.error('수동 갱신 오류:', error);
    
    return NextResponse.json({
      success: false,
      message: '리뷰 갱신 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
}
