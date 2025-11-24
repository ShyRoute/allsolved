import { NextRequest, NextResponse } from "next/server";
import { PLATFORMS } from "@/lib/constants/platforms";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // 입력 검증
        if (!body || typeof body !== 'object') {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }
        
        // handle 값 검증 및 sanitize
        const sanitizedBody: Record<string, string | null> = {};
        for (const [key, value] of Object.entries(body)) {
            if (typeof value === 'string' && value.trim().length > 0) {
                // 길이 제한 (최대 50자)
                const trimmed = value.trim().substring(0, 50);
                // 안전한 문자만 허용 (영문, 숫자, 언더스코어, 하이픈)
                if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
                    sanitizedBody[key] = trimmed;
                } else {
                    // 유효하지 않은 문자가 포함된 경우 null로 표시
                    sanitizedBody[key] = null;
                }
            }
        }
        
        const fetchPromises = PLATFORMS.map(platform => {
            const handle = sanitizedBody[platform.handleKey];
            // null인 경우 (유효하지 않은 handle) -1 반환하는 Promise
            if (handle === null) {
                return Promise.resolve(-1);
            }
            return platform.fetchFunction(handle);
        });

        const solveCounts = await Promise.all(fetchPromises);
        
        const details: Record<string, number> = {};
        let totalSolveCount = 0;

        solveCounts.forEach((count: number, index: number) => {
            const platformId = PLATFORMS[index].id;
            details[platformId] = count;
            // -1(N/A)은 합계에서 제외
            if (count > 0) {
                totalSolveCount += count;
            }
        });

        const response = NextResponse.json(
            { totalSolved: totalSolveCount, details: details },
            { status: 200 }
        );

        response.headers.set(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=59'
        );
        
        // Security headers
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }
}