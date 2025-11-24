import { PLATFORMS } from '@/lib/constants/platforms';

export async function getAtcoderSolveCount(handle?: string): Promise<number> {
    if (!handle) {
        return 0;
    }

    const platform = PLATFORMS.find(p => p.id === 'atcoder');
    if (!platform) {
        console.error('Atcoder platform not found');
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
            console.error(`Atcoder API HTTP error for handle ${handle}: ${response.status}`);
            return 0;
        }
        
        const data = await response.json();

        // API 응답 구조: { count: number, rank: number }
        if (typeof data.count === 'number') {
            return data.count;
        }

        console.error(`Atcoder API unexpected response for handle ${handle}:`, data);
        return 0;
        
    } catch (error) {
        console.error(`Error fetching Atcoder data for handle ${handle}:`, error);
        return 0;
    }
}