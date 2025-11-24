'use client';

import { useState } from 'react';
import { Form, ApiResponse } from '@/components/form';
import { PLATFORMS } from '@/lib/constants/platforms';

export default function Home() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-xl mx-auto bg-white p-6 rounded-lg shadow-xl'>
        <h1 className='text-3xl font-bold text-left mb-6 text-gray-800'>
          All Solved!
        </h1>

        <Form
          onResult={setResult}
        />

        {isLoading && (
          <div className='text-center mt-6'>
            <p className='text-blue-600'>Loading...</p>
          </div>
        )}

        {result && !isLoading && (
          <div className='mt-8 border-t pt-6'>
            <h2 className='text-2xl font-bold mb-4'>
              Total Solved Problems: {result.totalSolved}
            </h2>

            <div className="space-y-3">
                {PLATFORMS.map(platform => {
                    const handle = result.handles[platform.handleKey];
                    const count = result.details[platform.id as keyof typeof result.details];
                    
                    if (!handle) {
                        return null; // 핸들이 없으면 표시하지 않음
                    }
                    
                    return (
                        <div key={platform.id} className="flex justify-between p-3 bg-gray-50 rounded-md">
                            <span className="font-medium text-gray-700">
                                {platform.name} (
                                {count === -1 ? (
                                    <span className="text-gray-500">{handle}</span>
                                ) : (
                                    <a 
                                        href={platform.userPageUrl(handle)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        {handle}
                                    </a>
                                )}
                                )
                            </span>
                            <span className={`font-bold text-lg ${
                                count === -1 ? 'text-red-400' : 
                                count === 0 ? 'text-gray-400' : ''
                            }`}>
                                {count === -1 ? 'N/A' : count}
                            </span>
                        </div>
                    );
                })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}