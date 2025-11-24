import { getSolvedacSolveCount } from "@/lib/api/solvedac";
import { getCodeforcesSolveCount } from "@/lib/api/codeforces";
import { getAtcoderSolveCount } from "@/lib/api/atcoder";

export interface Platform {
    id: string;
    name: string;
    handleKey: string;
    siteUrl: string;
    userPageUrl: (handle: string) => string;
    fetchUrl: (handle: string) => string;
    fetchFunction: (handle: string) => Promise<number>;
}

export const SOLVED_BASE_URL = "https://solved.ac/api/v3";
export const CODEFORCES_BASE_URL = " https://codeforces.com/api";
export const ATCODER_BASE_URL = "https://kenkoooo.com/atcoder/atcoder-api/v3";

export const PLATFORMS: Platform[] = [
    {
        id: "solvedac",
        name: "solved.ac",
        handleKey: "solvedacHandle",
        siteUrl: "https://solved.ac",
        userPageUrl: (handle: string) => `https://solved.ac/profile/${handle}`,
        fetchUrl: (handle: string) => `${SOLVED_BASE_URL}/user/show?handle=${handle}`,
        fetchFunction: getSolvedacSolveCount,
    },
    {
        id: "codeforces",
        name: "Codeforces",
        handleKey: "codeforcesHandle",
        siteUrl: "https://codeforces.com",
        userPageUrl: (handle: string) => `https://codeforces.com/profile/${handle}`,
        fetchUrl: (handle: string) => `${CODEFORCES_BASE_URL}/user.status?handle=${handle}`,
        fetchFunction: getCodeforcesSolveCount,
    },
    {
        id: "atcoder",
        name: "AtCoder",
        handleKey: "atcoderHandle",
        siteUrl: "https://atcoder.jp",
        userPageUrl: (handle: string) => `https://atcoder.jp/users/${handle}`,
        fetchUrl: (handle: string) => `${ATCODER_BASE_URL}/user/ac_rank?user=${handle}`,
        fetchFunction: getAtcoderSolveCount,
    },
]

export type PlatformId = typeof PLATFORMS[number]['id'];