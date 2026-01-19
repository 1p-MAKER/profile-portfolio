'use client';

import { useEffect } from 'react';

interface XTimelineProps {
    xUsername: string;
}

export default function XTimeline({ xUsername }: XTimelineProps) {
    useEffect(() => {
        // Twitter widgets.js のロード
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        document.body.appendChild(script);

        return () => {
            // クリーンアップ
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="x-timeline-container">
            <a
                className="twitter-timeline"
                data-theme="dark"
                data-height="600"
                href={`https://twitter.com/${xUsername}`}
            >
                Tweets by {xUsername}
            </a>
            <style jsx>{`
        .x-timeline-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }
      `}</style>
        </div>
    );
}
