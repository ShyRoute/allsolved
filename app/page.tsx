'use client';

import { useState } from 'react';
import { Form, ApiResponse } from '@/components/form';
import { PLATFORMS } from '@/lib/constants/platforms';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className='min-h-screen p-8' style={{ background: 'var(--background)' }}>
      <div className='max-w-xl mx-auto p-6 rounded-lg shadow-xl' style={{ background: 'var(--card-background)' }}>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-left' style={{ color: 'var(--text-primary)' }}>
            All Solved!
          </h1>
          <ThemeToggle />
        </div>

        <Form
          onResult={setResult}
        />

        {isLoading && (
          <div className='text-center mt-6'>
            <p className='text-blue-600'>Loading...</p>
          </div>
        )}

        {result && !isLoading && (
          <div className='mt-8 border-t pt-6' style={{ borderColor: 'var(--border-color)' }}>
            <h2 className='text-2xl font-bold mb-4' style={{ color: 'var(--text-primary)' }}>
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
                        <div key={platform.id} className="flex justify-between p-3 rounded-md" style={{ background: 'var(--card-secondary)' }}>
                            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                                {platform.name} (
                                {count === -1 ? (
                                    <span className="text-gray-500 dark:text-gray-400">{handle}</span>
                                ) : (
                                    <a 
                                        href={platform.userPageUrl(handle)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                        style={{ color: 'var(--link-color)' }}
                                    >
                                        {handle}
                                    </a>
                                )}
                                )
                            </span>
                            <span 
                                className="font-bold text-lg"
                                style={{
                                    color: count === -1 ? 'var(--error-text)' : 
                                           count === 0 ? 'var(--text-secondary)' : 
                                           'var(--text-primary)'
                                }}
                            >
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