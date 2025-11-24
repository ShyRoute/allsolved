import { PLATFORMS } from '@/lib/constants/platforms';

export async function getCodeforcesSolveCount(handle?: string): Promise<number> {
    if (!handle) {
        return 0;
    }

    const platform = PLATFORMS.find(p => p.id === 'codeforces');
    if (!platform) {
        console.error('Codeforces platform not found');
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
            console.error(`Codeforces API HTTP error for handle ${handle}: ${response.status}`);
            return 0;
        }
        
        const data = await response.json();

        if (data.status !== 'OK') {
            // 사용자를 찾을 수 없는 경우
            if (data.comment && data.comment.includes('not found')) {
                return -1;
            }
            console.error(`Codeforces API error for handle ${handle}:`, data.comment);
            return 0;
        }

        const results = data.result;
        if (!Array.isArray(results)) {
            console.error(`Codeforces API unexpected result type for handle ${handle}`);
            return 0;
        }
        
        const solvedProblems = new Set<string>();

        results.forEach((sub: any) => {
            if (sub.verdict === 'OK') {
                const problemId = sub.problem.contestId + '-' + sub.problem.index;
                solvedProblems.add(problemId);
            }
        });

        return solvedProblems.size;
        
    } catch (error) {
        console.error(`Error fetching Codeforces data for handle ${handle}:`, error);
        return 0;
    }
}