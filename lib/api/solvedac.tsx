import { PLATFORMS } from '@/lib/constants/platforms';

export async function getSolvedacSolveCount(handle?: string): Promise<number> {
    if (!handle) {
        return 0;
    }

    const platform = PLATFORMS.find(p => p.id === 'solvedac');
    if (!platform) {
        console.error('Solvedac platform not found');
        return 0;
    }

    const URL = platform.fetchUrl(handle);

    try {
        const response = await fetch(URL);
        
        if (!response.ok) {
            // 404, 400 등 사용자가 존재하지 않는 경우
            if (response.status === 404 || response.status === 400) {
                return -1;
            }
            console.error(`Solvedac API HTTP error for handle ${handle}: ${response.status}`);
            return 0;
        }
        
        const data = await response.json();

        // API 응답 구조 확인 필요 - solvedCount 필드 위치 확인
        if (typeof data.solvedCount === 'number') {
            return data.solvedCount;
        }
        
        // 또는 result.solvedCount 구조일 수도 있음
        if (data.result && typeof data.result.solvedCount === 'number') {
            return data.result.solvedCount;
        }

        console.error(`Solvedac API unexpected response for handle ${handle}:`, data);
        return 0;

    } catch (error) {
        console.error(`Error fetching Solvedac data for handle ${handle}:`, error);
        return 0;
    }
}