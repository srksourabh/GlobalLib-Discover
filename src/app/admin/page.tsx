'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { UploadCloud, CheckCircle, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const logMessages = [
  '[INFO] Scraping Project Gutenberg...',
  '[SUCCESS] Found new metadata for ID: 8821',
  '[INFO] Updating Global Database...',
  '[SUCCESS] Copyright check passed for ID: 8821.',
  '[INFO] Indexing 1 new title...',
  '[INFO] AI model sync started.',
  '[DEBUG] User session initiated: admin@example.com',
  '[INFO] Cache cleared successfully.',
  '[SUCCESS] Database backup complete.',
  '[WARN] High memory usage detected: 92%',
  '[INFO] Pinging content delivery network...',
  '[SUCCESS] CDN connection healthy.',
];

export default function AdminPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Initializing system logs...']);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogs((prevLogs) => {
        const nextLog = logMessages[prevLogs.length % logMessages.length];
        const timestamp = new Date().toISOString();
        return [...prevLogs, `${timestamp} - ${nextLog}`].slice(-100); // Keep last 100 logs
      });
    }, 2000);

    return () => clearInterval(logInterval);
  }, []);
  
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);


  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsUploaded(true);
    setTimeout(() => setIsUploaded(false), 3000); // Reset after 3 seconds
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-5 w-5" />
              Upload Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isUploaded ? (
              <div className="flex flex-col items-center justify-center text-center p-10 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="mt-4 font-semibold text-green-700 dark:text-green-300">File uploaded to secure storage!</p>
              </div>
            ) : (
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                  'flex flex-col items-center justify-center text-center p-10 rounded-lg border-2 border-dashed transition-colors',
                  isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                )}
              >
                <UploadCloud className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Drop PDF/EPUB here or click to select
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              System Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={logContainerRef} className="h-80 bg-slate-900 text-green-400 font-mono text-xs rounded-lg p-4 overflow-y-auto">
              {logs.map((log, index) => (
                <p key={index}>{log}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
