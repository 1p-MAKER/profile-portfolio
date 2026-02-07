'use client';

import { SNSAccount } from '@/types/content';
import { FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaFacebook, FaLinkedin, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa';

interface SNSCardProps {
    account: SNSAccount;
}

// Platform icon and brand color mapping
const getPlatformConfig = (platformType?: string) => {
    switch (platformType) {
        case 'instagram':
            return {
                icon: FaInstagram,
                gradient: 'from-purple-600 via-pink-500 to-orange-400',
                hoverBg: 'hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50',
                iconColor: 'text-pink-600'
            };
        case 'x':
            return {
                icon: FaTwitter,
                gradient: 'from-stone-900 to-stone-700',
                hoverBg: 'hover:bg-stone-50',
                iconColor: 'text-stone-900'
            };
        case 'youtube':
            return {
                icon: FaYoutube,
                gradient: 'from-red-600 to-red-500',
                hoverBg: 'hover:bg-red-50',
                iconColor: 'text-red-600'
            };
        case 'tiktok':
            return {
                icon: FaTiktok,
                gradient: 'from-black via-cyan-400 to-pink-500',
                hoverBg: 'hover:bg-gradient-to-br hover:from-cyan-50 hover:to-pink-50',
                iconColor: 'text-black'
            };
        case 'facebook':
            return {
                icon: FaFacebook,
                gradient: 'from-blue-600 to-blue-500',
                hoverBg: 'hover:bg-blue-50',
                iconColor: 'text-blue-600'
            };
        case 'linkedin':
            return {
                icon: FaLinkedin,
                gradient: 'from-blue-700 to-blue-600',
                hoverBg: 'hover:bg-blue-50',
                iconColor: 'text-blue-700'
            };
        case 'sora':
            return {
                icon: FaGlobe,
                gradient: 'from-violet-600 to-indigo-600',
                hoverBg: 'hover:bg-gradient-to-br hover:from-violet-50 hover:to-indigo-50',
                iconColor: 'text-violet-600'
            };
        default:
            return {
                icon: FaGlobe,
                gradient: 'from-stone-600 to-stone-500',
                hoverBg: 'hover:bg-stone-50',
                iconColor: 'text-stone-600'
            };
    }
};

export default function SNSCard({ account }: SNSCardProps) {
    const config = getPlatformConfig(account.platformType);
    const IconComponent = config.icon;

    return (
        <a
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group block bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700 
                hover:shadow-xl transition-all duration-300 h-full ${config.hoverBg}`}
        >
            {/* Thumbnail Image */}
            {account.thumbnailUrl && (
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={account.thumbnailUrl}
                        alt={account.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <IconComponent className={`absolute bottom-3 right-3 text-3xl text-white drop-shadow-lg`} />
                </div>
            )}

            {/* Card Content */}
            <div className="p-6 flex flex-col gap-4">
                {/* Platform Icon */}
                <div className="flex items-center justify-between">
                    <IconComponent className={`text-5xl ${config.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                    <FaExternalLinkAlt className="text-stone-400 group-hover:text-stone-600 transition-colors" />
                </div>

                {/* Title & Category */}
                <div>
                    <h3 className="font-bold text-xl mb-1 group-hover:text-accent transition-colors">
                        {account.title}
                    </h3>
                    {account.tagline && (
                        <p className="text-sm text-accent font-medium mb-2">
                            {account.tagline}
                        </p>
                    )}
                    <p className={`text-sm text-stone-600 dark:text-stone-400 ${account.platformType === 'instagram' ? 'whitespace-pre-wrap' : ''}`}>
                        {account.description}
                    </p>
                </div>

                {/* Category Badge */}
                <div className="mt-auto">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${config.gradient} text-white`}>
                        {account.category}
                    </span>
                </div>
            </div>
        </a>
    );
}
