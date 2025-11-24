'use client';

import React, { useState } from 'react';
import { PLATFORMS, PlatformId } from '@/lib/constants/platforms';

export type ResultDetails = Record<PlatformId, number>;

export interface ApiResponse {
    totalSolved: number;
    details: ResultDetails;
    handles: Record<string, string>;
}

interface FormProps {
    onResult: (data: ApiResponse | null) => void;
}

export const Form: React.FC<FormProps> = ({ onResult }) => {
    const [handles, setHandles] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (key: string, value: string) => {
        setHandles(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        onResult(null);

        const requestBody = Object.entries(handles).reduce((acc, [key, value]) => {
            if(value.trim()) {
                acc[key] = value.trim();
            }
            return acc;
        }, {} as {[key: string]: string});

        if(Object.keys(requestBody).length === 0) {
            setError('Please enter at least one handle.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/total-solve-count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if(!response.ok || data.error) {
                setError(data.error || 'Failed to fetch data. Please try again.');
            } else {
                onResult({ ...data, handles: requestBody });
            }

        } catch (err) {
            console.error('Fetch error:', err);
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {PLATFORMS.map(platform => (
                <div key={platform.id}>
                    <label htmlFor={platform.handleKey} className='block text-sm font-medium flex items-center gap-2'>
                        <span className='text-base'>{platform.name}</span>
                        <a 
                            href={platform.siteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            tabIndex={-1}
                        >
                            🔗
                        </a>
                    </label>
                    <input
                        id={platform.handleKey}
                        type='text'
                        onChange={(e) => handleChange(platform.handleKey, e.target.value)}
                        placeholder='Enter handle'
                        className='mt-1 block w-full border rounded-md shadow-sm p-2'
                        style={{ 
                            background: 'var(--input-bg)', 
                            borderColor: 'var(--input-border)',
                            color: 'var(--text-primary)'
                        }}
                        autoComplete='off'
                    />
                </div>
            ))}

            {error && (
                <div className='border p-3 rounded-md' style={{
                    color: 'var(--error-text)',
                    borderColor: 'var(--error-border)',
                    background: 'var(--error-bg)'
                }}>
                    {error}
                </div>
            )}

            <button
                type='submit'
                className='w-full py-2 px-4 text-white rounded-md font-semibold shadow-md disabled:opacity-50 transition-colors'
                style={{ background: 'var(--button-bg)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--button-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--button-bg)'}
                disabled={isLoading}
            >
                {isLoading ? 'Calculating...' : 'Submit'}    
            </button>
        </form>
    );
};