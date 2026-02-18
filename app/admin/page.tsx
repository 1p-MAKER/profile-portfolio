'use client';

import { useState, useEffect } from 'react';
import { ContentData, Product, TabItem, SketchMarkItem, OfficeItem } from '@/types/content';
import Image from 'next/image';
import DraggableList from '@/components/DraggableList';

// Helper Component for Image Upload with Auto Resize
interface ImageInputProps {
    currentImage?: string;
    onImageChange: (base64: string) => void;
    label?: string;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
}

const ImageInput = ({
    currentImage,
    onImageChange,
    label = '画像をアップロード',
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8
}: ImageInputProps) => {
    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions while maintaining aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Canvas context not available'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression
                    const base64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(base64);
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const resizedBase64 = await resizeImage(file);
            onImageChange(resizedBase64);
        } catch (error) {
            console.error('Image resize error:', error);
            alert('画像の処理に失敗しました');
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 bg-stone-100 rounded overflow-hidden border border-stone-200 flex-shrink-0">
                {currentImage ? (
                    <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-stone-400">No Image</div>
                )}
            </div>
            <label className="cursor-pointer bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                <span>{label}</span>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                />
            </label>
            {currentImage && (
                <button
                    onClick={() => onImageChange('')}
                    className="text-red-500 text-xs hover:underline"
                >
                    削除
                </button>
            )}
        </div>
    );
};

export default function AdminPage() {
    const [data, setData] = useState<ContentData | null>(null);
    const [status, setStatus] = useState<string>('');

    const [isDeploying, setIsDeploying] = useState(false);
    const [activeAdminTab, setActiveAdminTab] = useState<string>('home');

    // Furusato Item Input State


    const [newFurusatoUrl, setNewFurusatoUrl] = useState('');
    const [newFurusatoTitle, setNewFurusatoTitle] = useState('');
    const [newFurusatoImage, setNewFurusatoImage] = useState('');
    const [newFurusatoSite, setNewFurusatoSite] = useState('');
    const [isFetchingMeta, setIsFetchingMeta] = useState(false);

    // Note Input State
    const [newNoteUrl, setNewNoteUrl] = useState('');
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteImage, setNewNoteImage] = useState('');
    const [newNoteSite, setNewNoteSite] = useState('');

    // Brain Input State
    const [newBrainUrl, setNewBrainUrl] = useState('');
    const [newBrainTitle, setNewBrainTitle] = useState('');
    const [newBrainImage, setNewBrainImage] = useState('');
    const [newBrainSite, setNewBrainSite] = useState('');

    // iOS App Input State
    const [newAppId, setNewAppId] = useState('');

    // YouTube Video Input State
    const [newYouTubeUrl, setNewYouTubeUrl] = useState('');
    const [newYouTubeTitle, setNewYouTubeTitle] = useState('');

    // Video Production Input State
    const [newVideoProductionUrl, setNewVideoProductionUrl] = useState('');
    const [newVideoProductionTitle, setNewVideoProductionTitle] = useState('');

    // Audio (BGM) Input State
    const [newAudioTitle, setNewAudioTitle] = useState('');
    const [newAudioDescription, setNewAudioDescription] = useState('');
    const [newAudioFile, setNewAudioFile] = useState<File | null>(null);
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);

    // Settings State
    const [xUsername, setXUsername] = useState('');
    const [siteTitle, setSiteTitle] = useState('');
    const [profileName, setProfileName] = useState('');
    const [profileTagline, setProfileTagline] = useState('');
    const [featuredIntro, setFeaturedIntro] = useState('');
    const [videoProductionIntro, setVideoProductionIntro] = useState('');
    const [audioIntro, setAudioIntro] = useState('');
    const [noteIntro, setNoteIntro] = useState('');
    const [brainIntro, setBrainIntro] = useState('');
    const [officeIntro, setOfficeIntro] = useState(''); // New Office
    const [sunoBgmUrl, setSunoBgmUrl] = useState(''); // Suno BGM URL

    // TikTok Input State
    const [newTikTokUrl, setNewTikTokUrl] = useState('');
    const [newTikTokTitle, setNewTikTokTitle] = useState('');
    const [newTikTokPlatform, setNewTikTokPlatform] = useState<'tiktok' | 'instagram'>('tiktok');


    // Sketch Mark State
    const [fetchedSketchMarkItems, setFetchedSketchMarkItems] = useState<SketchMarkItem[]>([]);
    const [isFetchingSketchMark, setIsFetchingSketchMark] = useState(false);

    useEffect(() => {
        // 1. Try to load from LocalStorage first
        const localData = localStorage.getItem('portfolio_admin_data_v2');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                console.log('Loaded data from LocalStorage');
                setData(parsed);
                // Update local state from loaded data
                if (parsed.settings?.xUsername) setXUsername(parsed.settings.xUsername);
                if (parsed.settings?.siteTitle) setSiteTitle(parsed.settings.siteTitle);
                if (parsed.settings?.profileName) setProfileName(parsed.settings.profileName);
                if (parsed.settings?.profileTagline) setProfileTagline(parsed.settings.profileTagline);
                if (parsed.settings?.featuredIntro) setFeaturedIntro(parsed.settings.featuredIntro);
                if (parsed.settings?.videoProductionIntro) setVideoProductionIntro(parsed.settings.videoProductionIntro);
                if (parsed.settings?.audioIntro) setAudioIntro(parsed.settings.audioIntro);
                if (parsed.settings?.audioIntro) setAudioIntro(parsed.settings.audioIntro);
                if (parsed.settings?.noteIntro) setNoteIntro(parsed.settings.noteIntro);
                if (parsed.settings?.brainIntro) setBrainIntro(parsed.settings.brainIntro);
                if (parsed.settings?.officeIntro) setOfficeIntro(parsed.settings.officeIntro); // New Office
                if (parsed.settings?.sunoBgmUrl) setSunoBgmUrl(parsed.settings.sunoBgmUrl);


                // Migration: Ensure 'note' tab exists if not present
                if (parsed.tabs && !parsed.tabs.find((t: any) => t.id === 'note')) {
                    parsed.tabs.push({ id: 'note', label: 'note' });
                } else if (parsed.tabs) {
                    // Force update label if it exists (for migration from 'Note記事リスト')
                    const noteTab = parsed.tabs.find((t: any) => t.id === 'note');
                    if (noteTab) noteTab.label = 'note';
                }
                // Migration: Ensure 'sketchMark' tab exists if not present
                if (parsed.tabs && !parsed.tabs.find((t: any) => t.id === 'sketchMark')) {
                    parsed.tabs.push({ id: 'sketchMark', label: 'Sketch Mark' });
                }
                // Migration: Ensure 'office' tab exists if not present
                if (parsed.tabs && !parsed.tabs.find((t: any) => t.id === 'office')) {
                    parsed.tabs.push({ id: 'office', label: 'Office' });
                }
                // Migration: Ensure 'tiktok' tab exists and has correct label
                const tiktokTab = parsed.tabs?.find((t: any) => t.id === 'tiktok');
                if (tiktokTab) {
                    // Force update label to '毎日投稿チャレンジ'
                    tiktokTab.label = '毎日投稿チャレンジ';
                } else if (parsed.tabs) {
                    // Insert after 'office' tab if it exists, otherwise push at the end
                    const officeIndex = parsed.tabs.findIndex((t: any) => t.id === 'office');
                    if (officeIndex !== -1) {
                        parsed.tabs.splice(officeIndex + 1, 0, { id: 'tiktok', label: '毎日投稿チャレンジ' });
                    } else {
                        parsed.tabs.push({ id: 'tiktok', label: '毎日投稿チャレンジ' });
                    }
                }
                // Migration: Ensure 'tiktokItems' array exists
                if (!parsed.tiktokItems) {
                    parsed.tiktokItems = [];
                }

                setData(parsed);
                return; // Skip server fetch if local data exists
            } catch (e) {
                console.error('Failed to parse local storage data', e);
            }
        }

        // 2. Fallback to server fetch
        fetch('/api/data')
            .then(res => res.json())
            .then(fetchedData => {
                if (!fetchedData.tabs) {
                    fetchedData.tabs = [
                        { id: '3d-printer', label: '3Dプリンタ画像' },
                        { id: 'leather', label: '革製品リスト' },
                        { id: 'ios', label: 'iOSアプリリスト' },
                        { id: 'shopify', label: 'Shopifyアプリリスト' },
                        { id: 'sns', label: 'SNSリスト' },
                        { id: 'furusato', label: 'ふるさと納税リスト' },
                        { id: 'note', label: 'note' },
                        { id: 'sketchMark', label: 'Sketch Mark' },
                        { id: 'office', label: 'Office' },
                    ];
                }
                setData(fetchedData);
                // Also save to local storage to sync
                localStorage.setItem('portfolio_admin_data_v2', JSON.stringify(fetchedData));

                if (fetchedData.settings?.xUsername) {
                    setXUsername(fetchedData.settings.xUsername);
                }
                if (fetchedData.settings?.siteTitle) setSiteTitle(fetchedData.settings.siteTitle);
                if (fetchedData.settings?.profileName) setProfileName(fetchedData.settings.profileName);
                if (fetchedData.settings?.profileTagline) setProfileTagline(fetchedData.settings.profileTagline);
                if (fetchedData.settings?.featuredIntro) setFeaturedIntro(fetchedData.settings.featuredIntro);
                if (fetchedData.settings?.videoProductionIntro) {
                    setVideoProductionIntro(fetchedData.settings.videoProductionIntro);
                }
                if (fetchedData.settings?.audioIntro) {
                    setAudioIntro(fetchedData.settings.audioIntro);
                }
                if (fetchedData.settings?.noteIntro) {
                    setNoteIntro(fetchedData.settings.noteIntro);
                }
                if (fetchedData.settings?.brainIntro) {
                    setBrainIntro(fetchedData.settings.brainIntro);
                }
                if (fetchedData.settings?.officeIntro) {
                    setOfficeIntro(fetchedData.settings.officeIntro);
                }
                if (fetchedData.settings?.sunoBgmUrl) {
                    setSunoBgmUrl(fetchedData.settings.sunoBgmUrl);
                }

                // Cleanup old data to free up space
                localStorage.removeItem('portfolio_admin_data');
            });
    }, []);

    // --- Brain Item Management ---
    const fetchBrainMeta = async () => {
        if (!newBrainUrl) return;
        setIsFetchingMeta(true);
        setStatus('情報を取得中...');
        try {
            // Noteと同じAPIを使用（OGP取得ロジックが共通であれば）
            // もしBrain専用の処理が必要なら別途APIを用意するが、
            // 現状の /api/ogp が汎用的であればそのまま使える。
            // ここでは簡易的に /api/ogp を使用すると仮定。
            // なければ note と同様の手法、あるいは手動入力を促す。

            // Noteの実装に合わせて手動入力を基本としつつ、OGP取得があればそれを使う。
            // ここではNoteの実装を真似る。
            // Note実装を確認すると fetchNoteMeta 関数があるはず。
            // 後ほど fetchNoteMeta を確認して共通化するか複製する。

            // 既存の fetchNoteMeta が単純なOGP取得なら共有できる。
            // 一旦プレースホルダー。実際のロジックはNoteの実装を見て合わせる。
            const res = await fetch(`/api/metadata?url=${encodeURIComponent(newBrainUrl)}`);
            if (res.ok) {
                const meta = await res.json();
                if (meta.error) {
                    setStatus('情報の取得に失敗しました。手動で入力してください。');
                } else {
                    if (meta.title) setNewBrainTitle(meta.title);
                    if (meta.image) setNewBrainImage(meta.image);
                    if (meta.site_name) setNewBrainSite(meta.site_name);
                    setStatus('情報を取得しました');
                }
            } else {
                setStatus('情報の取得に失敗しました。詳細を入力してください。');
            }
        } catch (e) {
            console.error(e);
            setStatus('情報の取得中にエラーが発生しました。');
        } finally {
            setIsFetchingMeta(false);
        }
    };

    const addBrainItem = () => {
        if (!data) return;
        if (!newBrainTitle || !newBrainUrl) {
            alert('タイトルとURLは必須です。情報を取得するか、手動で入力してください。');
            return;
        }

        const newItem = {
            title: newBrainTitle,
            url: newBrainUrl,
            imageUrl: newBrainImage,
            siteName: newBrainSite
        };

        const newItems = [...(data.brainItems || []), newItem];
        setData({ ...data, brainItems: newItems });

        // Reset inputs
        setNewBrainUrl('');
        setNewBrainTitle('');
        setNewBrainImage('');
        setNewBrainSite('');
    };

    const updateBrainItem = (index: number, field: string, value: string) => {
        if (!data || !data.brainItems) return;
        const newItems = [...data.brainItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setData({ ...data, brainItems: newItems });
    };

    const removeBrainItem = (index: number) => {
        if (!data || !data.brainItems) return;
        if (!confirm('削除しますか？')) return;
        const newItems = [...data.brainItems];
        newItems.splice(index, 1);
        setData({ ...data, brainItems: newItems });
    };

    // TikTok Item Management
    const addTikTokItem = () => {
        if (!data || !newTikTokUrl.trim()) return;
        const newItem = {
            id: `${newTikTokPlatform}_${Date.now()}`,
            title: newTikTokTitle || (newTikTokPlatform === 'instagram' ? 'Instagram Post' : '毎日投稿チャレンジ'),
            url: newTikTokUrl,
            platform: newTikTokPlatform
        };
        const newItems = [...(data.tiktokItems || []), newItem];
        setData({ ...data, tiktokItems: newItems });
        setNewTikTokUrl('');
        setNewTikTokTitle('');
        setNewTikTokPlatform('tiktok');
    };

    const updateTikTokItem = (index: number, field: string, value: string) => {
        if (!data || !data.tiktokItems) return;
        const newItems = [...data.tiktokItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setData({ ...data, tiktokItems: newItems });
    };

    const removeTikTokItem = (index: number) => {
        if (!data || !data.tiktokItems) return;
        if (!confirm('削除しますか？')) return;
        const newItems = [...data.tiktokItems];
        newItems.splice(index, 1);
        setData({ ...data, tiktokItems: newItems });
    };

    // Image Compression Helper
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (e) => reject(e);
            };
            reader.onerror = (e) => reject(e);
        });
    };

    // Handle Brain Image Selection (Base64 with compression)
    const handleBrainImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus('画像を圧縮・処理中...');
        try {
            const compressedBase64 = await compressImage(file);
            setNewBrainImage(compressedBase64);
            setStatus('画像を設定しました (自動圧縮済み)');
        } catch (error) {
            console.error('Image compression failed', error);
            setStatus('画像の処理に失敗しました');
        }

    };


    const [logs, setLogs] = useState<string[]>([]);

    const addLogEntry = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString('ja-JP');
        setLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
    };

    const handleSave = async () => {
        if (!data) return;

        setStatus('保存中...');
        const startTime = new Date().toISOString();

        try {
            // LocalStorageに保存
            localStorage.setItem('portfolio_admin_data_v2', JSON.stringify(data));

            setStatus('ブラウザに保存しました');
            addLogEntry(`[${startTime}] ブラウザへの一時保存に成功しました`);

        } catch (e: unknown) {
            console.error('[保存エラー]', e);
            let msg = e instanceof Error ? e.message : String(e);

            // Handle QuotaExceededError (Storage Warning)
            if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                msg = 'ブラウザの保存容量を超えました。画像などを減らしてください。';
            }

            setStatus(`エラー: ${msg}`);
            addLogEntry(`保存エラー: ${msg}`);
        }

        setTimeout(() => setStatus(''), 3000);
    };

    const handleDeploy = async () => {
        if (!confirm('本当に公開しますか？\n（GitHubへコミットし、Vercelへのデプロイをトリガーします）')) return;

        setIsDeploying(true);
        setStatus('公開処理中... ログを確認してください');
        addLogEntry(`[${new Date().toISOString()}] 公開リクエストを開始...`);

        // Step 1: ブラウザ保存
        addLogEntry('公開前のブラウザ保存を実行中...');
        try {
            if (data) {
                try {
                    localStorage.setItem('portfolio_admin_data_v2', JSON.stringify(data));
                    addLogEntry('ブラウザへの自動保存完了。');
                } catch (e: any) {
                    // Quota exceeded? Try saving without Base64 images
                    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || (e.message && e.message.includes('quota'))) {
                        console.warn('LocalStorage quota exceeded. Trying textual backup...');

                        const liteData = JSON.parse(JSON.stringify(data)); // Deep clone

                        // Strip Base64 images from common fields
                        const stripImage = (item: any) => {
                            if (item.imageUrl && item.imageUrl.startsWith('data:')) {
                                item.imageUrl = ''; // Clear heavy image for local backup
                            }
                            return item;
                        };

                        if (liteData.noteItems) liteData.noteItems = liteData.noteItems.map(stripImage);
                        if (liteData.brainItems) liteData.brainItems = liteData.brainItems.map(stripImage);
                        if (liteData.sketchMarkItems) liteData.sketchMarkItems = liteData.sketchMarkItems.map(stripImage);
                        if (liteData.furusatoItems) liteData.furusatoItems = liteData.furusatoItems.map(stripImage);

                        // Try saving lite version
                        localStorage.setItem('portfolio_admin_data_v2', JSON.stringify(liteData));
                        addLogEntry('※容量制限のため、テキスト情報のみブラウザにバックアップしました（画像はGitHubへ直接保存されます）。');
                    } else {
                        throw e;
                    }
                }
            }
        } catch (e) {
            console.error('Auto-save failed', e);
            // User requested to suppress this warning if it persists. 
            // We just log to console and proceed silently as the main saving method is GitHub.
        }

        // Step 2: GitHub API経由で直接更新 (/api/publish)
        try {
            const res = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: data,
                    message: 'update: content.json via admin tool'
                })
            });

            if (!res.ok) {
                const errorBody = await res.text();
                const statusCode = res.status;
                const statusText = res.statusText;

                console.error('[公開APIエラー詳細]', {
                    statusCode,
                    statusText,
                    body: errorBody,
                    timestamp: new Date().toISOString()
                });

                // エラーレスポンスがJSONの場合パースを試みる
                let errorMsg = `公開失敗 (${statusCode} ${statusText})`;
                try {
                    const parsedError = JSON.parse(errorBody);
                    if (parsedError.error) errorMsg += `: ${parsedError.error}`;
                } catch (e) {
                    // JSONパース失敗時は無視
                }

                throw new Error(errorMsg);
            }

            const result = await res.json();

            setStatus('公開リクエスト完了！');
            addLogEntry(`[${new Date().toISOString()}] GitHubへの更新が完了しました。数分後に本番サイトに反映されます。`);

        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setStatus(`公開エラー: ${msg}`);
            addLogEntry(`通信エラー: ${msg}`);
            console.error('[公開例外]', e);
        } finally {
            setIsDeploying(false);
            setTimeout(() => setStatus(''), 5000);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !data) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setStatus('アップロード中...');
        addLogEntry(`画像アップロード開始: ${file.name}`);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const result = await res.json();

            if (result.success) {
                const newData = {
                    ...data,
                    printImages: [...data.printImages, result.path]
                };
                setData(newData);
                setStatus('画像をアップロードしました（保存ボタンを押してください）');
                addLogEntry(`画像アップロード成功: ${result.path}`);

                // 自動保存もしてしまう (LocalStorage)
                localStorage.setItem('portfolio_admin_data_v2', JSON.stringify(newData));
                addLogEntry('アップロード後のデータをブラウザに自動保存しました');

            } else {
                addLogEntry('画像アップロードに失敗しました');
            }
        } catch (e: unknown) {
            setStatus('アップロード失敗');
            const msg = e instanceof Error ? e.message : String(e);
            addLogEntry(`エラー: ${msg}`);
        }
    };

    if (!data) return <div className="p-8">読み込み中...</div>;

    const updateGeneralProduct = (listName: 'shopifyApps' | 'snsAccounts', index: number, field: string, value: string) => {
        const newList = [...data[listName]] as Product[];
        newList[index] = { ...newList[index], [field]: value };
        setData({ ...data, [listName]: newList });
    };

    const updateLeatherProduct = (index: number, field: 'handle' | 'category', value: string) => {
        if (!data) return;
        const newList = [...data.leatherProducts];
        newList[index] = { ...newList[index], [field]: value };
        setData({ ...data, leatherProducts: newList });
    };

    const addProduct = (listName: 'shopifyApps' | 'snsAccounts') => {
        const newProduct: Product = { title: 'New Item', description: '', url: '', category: 'New' };
        setData({ ...data, [listName]: [...data[listName], newProduct] as Product[] });
    };

    const addLeatherProduct = () => {
        if (!data) return;
        const newProduct = { handle: 'handle-id', category: 'Leather' };
        setData({ ...data, leatherProducts: [...data.leatherProducts, newProduct] });
    };

    const addGeneralProduct = (listName: 'shopifyApps' | 'snsAccounts') => {
        if (!data) return;
        const newProduct: Product = { title: 'New Item', description: '', url: '', category: 'New' };
        setData({ ...data, [listName]: [...data[listName], newProduct] as Product[] });
    };

    const removeLeatherProduct = (index: number) => {
        if (!data) return;
        const newList = [...data.leatherProducts];
        newList.splice(index, 1);
        setData({ ...data, leatherProducts: newList });
    };

    const addOfficeItem = () => {
        if (!data) return;
        const newItem: OfficeItem = {
            id: Date.now().toString(),
            title: '',
            consultationUrl: '',
            buyButtonId: '',
            publishableKey: '',
            imageUrl: '',
            isFeatured: false
        };
        setData({ ...data, officeItems: [...(data.officeItems || []), newItem] });
    };

    const updateOfficeItem = (index: number, field: keyof OfficeItem, value: any) => {
        if (!data) return;
        const newItems = [...(data.officeItems || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        setData({ ...data, officeItems: newItems });
    };

    const removeOfficeItem = (index: number) => {
        if (!data) return;
        const newItems = [...(data.officeItems || [])];
        newItems.splice(index, 1);
        setData({ ...data, officeItems: newItems });
    };

    const removeGeneralProduct = (listName: 'shopifyApps' | 'snsAccounts', index: number) => {
        if (!data) return;
        const newList = [...data[listName]];
        newList.splice(index, 1);
        setData({ ...data, [listName]: newList });
    };

    const removeProduct = (listName: 'leatherProducts' | 'shopifyApps' | 'snsAccounts', index: number) => {
        const newList = [...data[listName]];
        newList.splice(index, 1);
        setData({ ...data, [listName]: newList });
    };

    // iOS App Logic
    const addAppId = async () => {
        if (!data || !newAppId) return;

        setStatus('アプリ情報を取得中...');
        try {
            const res = await fetch(`/api/apps?id=${newAppId}`);
            const json = await res.json();
            const appName = (json.results && json.results.length > 0) ? json.results[0].trackName : `Unknown (${newAppId})`;

            setData({ ...data, iosApps: [...data.iosApps, { id: newAppId, name: appName }] });
            setNewAppId('');
            setStatus(`アプリを追加しました: ${appName}`);
        } catch (e) {
            console.error(e);
            setStatus('アプリ情報の取得に失敗しましたが、IDは追加します');
            setData({ ...data, iosApps: [...data.iosApps, { id: newAppId, name: `Error (${newAppId})` }] });
        }
    };

    const removeAppId = (index: number) => {
        if (!data) return;
        const newList = [...data.iosApps];
        newList.splice(index, 1);
        setData({ ...data, iosApps: newList });
    };

    const moveAppId = (index: number, direction: 'up' | 'down') => {
        if (!data) return;
        const newList = [...data.iosApps];
        if (direction === 'up' && index > 0) {
            [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
        } else if (direction === 'down' && index < newList.length - 1) {
            [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
        }
        setData({ ...data, iosApps: newList });
    };

    // Furusato Logic
    const fetchMetadata = async () => {
        if (!newFurusatoUrl) return;
        setIsFetchingMeta(true);
        setStatus('メタデータ取得中...');
        try {
            const res = await fetch(`/api/metadata?url=${encodeURIComponent(newFurusatoUrl)}`);
            const meta = await res.json();
            if (meta.error) {
                setStatus('メタデータ取得失敗');
                addLogEntry(`メタデータ取得エラー: ${meta.error}`);
            } else {
                setNewFurusatoTitle(meta.title);
                setNewFurusatoImage(meta.imageUrl);
                setNewFurusatoSite(meta.siteName);
                setStatus('メタデータ取得成功');
            }
        } catch (e: unknown) {
            setStatus('メタデータ取得エラー');
            console.error(e);
        }
        setIsFetchingMeta(false);
    };

    const addFurusatoItem = () => {
        if (!data) return;
        const newItem = {
            title: newFurusatoTitle,
            url: newFurusatoUrl,
            imageUrl: newFurusatoImage,
            siteName: newFurusatoSite
        };
        const currentItems = data.furusatoItems || [];
        setData({ ...data, furusatoItems: [...currentItems, newItem] });

        // Reset inputs
        setNewFurusatoUrl('');
        setNewFurusatoTitle('');
        setNewFurusatoImage('');
        setNewFurusatoSite('');
        setStatus('アイテムを追加しました（保存ボタンを押してください）');
    };

    const removeFurusatoItem = (index: number) => {
        if (!data || !data.furusatoItems) return;
        const newList = [...data.furusatoItems];
        newList.splice(index, 1);
        setData({ ...data, furusatoItems: newList });
    };

    const updateFurusatoItem = (index: number, field: string, value: string) => {
        if (!data || !data.furusatoItems) return;
        const newList = [...data.furusatoItems];
        newList[index] = { ...newList[index], [field]: value };
        setData({ ...data, furusatoItems: newList });
    };

    // Note Logic
    const fetchNoteMeta = async () => {
        if (!newNoteUrl) return;
        setIsFetchingMeta(true);
        setStatus('Note記事データ取得中...');
        try {
            const res = await fetch(`/api/metadata?url=${encodeURIComponent(newNoteUrl)}`);
            const meta = await res.json();
            if (meta.error) {
                setStatus('データ取得失敗');
                addLogEntry(`データ取得エラー: ${meta.error}`);
            } else {
                setNewNoteTitle(meta.title);
                setNewNoteImage(meta.imageUrl);
                setNewNoteSite(meta.siteName || 'note');
                setStatus('データ取得成功');
            }
        } catch (e: unknown) {
            setStatus('データ取得エラー');
            console.error(e);
        }
        setIsFetchingMeta(false);
    };

    const handleNoteImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setStatus('画像を圧縮・処理中...');
            try {
                const compressedBase64 = await compressImage(file);
                setNewNoteImage(compressedBase64);
                setStatus('画像を設定しました (自動圧縮済み)');
            } catch (error) {
                console.error('Image compression failed', error);
                setStatus('画像の処理に失敗しました');
            }

        }
    };
    const addNoteItem = () => {
        if (!data) return;
        const newItem = {
            title: newNoteTitle,
            url: newNoteUrl,
            imageUrl: newNoteImage,
            siteName: newNoteSite
        };
        const currentItems = data.noteItems || [];
        setData({ ...data, noteItems: [...currentItems, newItem] });

        // Reset inputs
        setNewNoteUrl('');
        setNewNoteTitle('');
        setNewNoteImage('');
        setNewNoteSite('');
        setStatus('Note記事を追加しました（保存ボタンを押してください）');
    };

    const removeNoteItem = (index: number) => {
        if (!data || !data.noteItems) return;
        const newList = [...data.noteItems];
        newList.splice(index, 1);
        setData({ ...data, noteItems: newList });
    };

    const updateNoteItem = (index: number, field: string, value: string) => {
        if (!data || !data.noteItems) return;
        const newList = [...data.noteItems];
        newList[index] = { ...newList[index], [field]: value };
        setData({ ...data, noteItems: newList });
    };

    // YouTube Logic
    const fetchYouTubeMeta = async () => {
        if (!newYouTubeUrl) return;
        setIsFetchingMeta(true);
        setStatus('メタデータ取得中...');
        try {
            const res = await fetch(`/api/metadata?url=${encodeURIComponent(newYouTubeUrl)}`);
            const meta = await res.json();
            if (meta.error) {
                setStatus('メタデータ取得失敗');
                addLogEntry(`メタデータ取得エラー: ${meta.error}`);
            } else {
                setNewYouTubeTitle(meta.title);
                setStatus('メタデータ取得成功');
            }
        } catch (e: unknown) {
            setStatus('メタデータ取得エラー');
            console.error(e);
        }
        setIsFetchingMeta(false);
    };

    const addYouTubeVideo = () => {
        if (!data || !newYouTubeTitle) return;
        const newVideo = {
            id: Date.now().toString(),
            url: newYouTubeUrl,
            title: newYouTubeTitle
        };
        const currentVideos = data.youtubeVideos || [];
        setData({ ...data, youtubeVideos: [...currentVideos, newVideo] });

        // Reset inputs
        setNewYouTubeUrl('');
        setNewYouTubeTitle('');
        setStatus('動画を追加しました（保存ボタンを押してください）');
    };

    const removeYouTubeVideo = (id: string) => {
        if (!data || !data.youtubeVideos) return;
        const newList = data.youtubeVideos.filter(v => v.id !== id);
        setData({ ...data, youtubeVideos: newList });
    };

    // Audio (BGM) Logic
    const handleAudioUpload = async () => {
        if (!newAudioFile || !newAudioTitle) {
            setStatus('ファイルとタイトルを入力してください');
            return;
        }

        setIsUploadingAudio(true);
        setStatus('音声ファイルをアップロード中...');

        try {
            const formData = new FormData();
            formData.append('file', newAudioFile);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (uploadData.success) {
                const newTrack = {
                    id: Date.now().toString(),
                    title: newAudioTitle,
                    description: newAudioDescription,
                    url: uploadData.path,
                };

                const currentTracks = data?.audioTracks || [];
                setData({ ...data!, audioTracks: [...currentTracks, newTrack] });

                // Reset inputs
                setNewAudioTitle('');
                setNewAudioDescription('');
                setNewAudioFile(null);
                setStatus('BGMを追加しました（保存ボタンを押してください）');
            } else {
                setStatus('アップロードに失敗しました');
            }
        } catch (error) {
            console.error('Audio upload error:', error);
            setStatus('アップロードエラー');
        }

        setIsUploadingAudio(false);
    };

    const removeAudioTrack = (id: string) => {
        if (!data || !data.audioTracks) return;
        const newList = data.audioTracks.filter(t => t.id !== id);
        setData({ ...data, audioTracks: newList });
    };

    // Featured Toggle Logic
    const toggleFeatured = (listName: 'iosApps' | 'leatherProducts' | 'shopifyApps' | 'snsAccounts' | 'youtubeVideos' | 'furusatoItems' | 'noteItems' | 'audioTracks' | 'brainItems' | 'tiktokItems', index: number) => {
        if (!data) return;
        const newList = [...data[listName]] as any[];
        newList[index] = { ...newList[index], isFeatured: !newList[index].isFeatured };
        setData({ ...data, [listName]: newList } as any);
    };

    const updateLegal = (field: string, val: string) => {
        if (!data) return;
        setData({
            ...data,
            legalInfo: {
                ...(data.legalInfo || { businessName: '', contactEmail: '', addressInfo: '', shippingInfo: '', returnPolicy: '' }),
                [field]: val
            }
        });
    };


    const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'profile'); // Explicit type for route.ts

        setStatus('プロフィール写真アップロード中...');
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                setStatus('プロフィール写真を更新しました！(キャッシュクリアが必要な場合があります)');
                addLogEntry(`プロフィール写真更新: ${result.path}`);
                // Force a reload of the image by updating a timestamp state if we had one, 
                // but effectively the user might need to reload. 
                // We can try to append a timestamp to the image src in the preview but 
                // for admin simple reload is okay.
            } else {
                setStatus('アップロード失敗');
            }
        } catch (e) {
            console.error(e);
            setStatus('エラーが発生しました');
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 p-8 pb-32">
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-stone-200 z-50 shadow-sm">
                {/* Title Row */}
                <div className="px-4 md:px-8 py-2 md:py-4 flex md:flex-row md:justify-between md:items-center">
                    <h1 className="text-sm md:text-xl font-bold text-stone-900">ポートフォリオ管理画面</h1>
                    <div className="hidden md:flex flex-col sm:flex-row gap-2 md:gap-4 items-stretch sm:items-center">
                        {/* Preview Button */}
                        <a
                            href="https://profile-portfolio-one-tau.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            サイトを確認する
                        </a>

                        <button
                            onClick={handleSave}
                            className="bg-primary text-white px-4 md:px-6 py-2 rounded-full hover:bg-primary/90 transition-colors text-sm md:text-base font-medium"
                        >
                            保存する
                        </button>
                        <button
                            onClick={handleDeploy}
                            disabled={isDeploying}
                            className="bg-red-500 text-white px-4 md:px-6 py-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 text-sm md:text-base font-medium"
                        >
                            {isDeploying ? '公開中...' : '公開する'}
                        </button>
                    </div>
                </div>

                {/* Mobile Tab Navigation - Inside Header */}
                <div className="md:hidden px-4 overflow-x-auto no-scrollbar border-t border-stone-100">
                    <div className="flex gap-2 py-2 min-w-max">
                        {[
                            { id: 'home', label: 'HOME' },
                            ...(data.tabs || []),
                            { id: 'settings', label: '設定' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveAdminTab(item.id)}
                                className={`px-3 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${activeAdminTab === item.id
                                    ? 'bg-stone-800 text-white'
                                    : 'bg-stone-100 text-stone-900'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>


            <div className="flex pt-20 md:pt-20 h-screen">
                {/* Sidebar Navigation - Hidden on mobile */}
                <aside className="hidden md:block w-64 bg-white border-r border-stone-200 fixed left-0 top-16 md:top-20 bottom-0 overflow-y-auto p-4 z-40">
                    <nav className="space-y-1">
                        {[
                            { id: 'home', label: 'HOME' },
                            ...(data.tabs || []),
                            { id: 'settings', label: '設定' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveAdminTab(item.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-colors ${activeAdminTab === item.id
                                    ? 'bg-stone-800 text-white'
                                    : 'text-stone-600 hover:bg-stone-100'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>


                <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto bg-stone-50 pb-20 md:pb-32">
                    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
                        {/* Status Alert Area */}
                        {status && (
                            <div className={`p-3 md:p-4 rounded-lg shadow-md border flex items-start gap-3 md:gap-4 mb-4 ${status.includes('エラー') || status.includes('失敗')
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : 'bg-green-50 border-green-200 text-green-800'
                                }`}>
                                <div className="text-xl md:text-2xl">
                                    {status.includes('エラー') || status.includes('失敗') ? '⚠️' : '✅'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold mb-1 text-sm md:text-base">
                                        {status.includes('エラー') || status.includes('失敗') ? 'システムメッセージ' : '完了'}
                                    </h3>
                                    <p className="whitespace-pre-wrap font-mono text-xs md:text-sm">{status}</p>
                                </div>
                                <button
                                    onClick={() => setStatus('')}
                                    className="text-stone-600 hover:text-stone-600"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        {/* HOME Tab */}
                        {activeAdminTab === 'home' && (
                            <section className="space-y-8">
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">HOMEページ設定</h2>

                                {/* Tab Display Order with DND */}
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">タブの表示順</h3>
                                    <p className="text-xs text-stone-700 mb-4">ドラッグ&ドロップで並び替えられます</p>
                                    <DraggableList
                                        items={data.tabs || []}
                                        onReorder={(newTabs) => setData({ ...data, tabs: newTabs })}
                                        renderItem={(tab) => (
                                            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                                                <span className="font-bold text-stone-700">{tab.label}</span>
                                            </div>
                                        )}
                                        itemKey={(tab) => tab.id}
                                    />
                                </div>

                                {/* Featured Works Order with DND */}
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">Featured (TopPage) 並び順</h3>
                                    <p className="text-xs text-stone-700 mb-4">
                                        トップページに表示される "Featured Works" の並び順をドラッグ&ドロップで変更できます。<br />
                                        ※ リストにない新規Featuredアイテムは自動的に末尾に追加されます。
                                    </p>
                                    {(() => {
                                        if (!data) return null;

                                        // Aggregate all featured items
                                        const items: Array<{ id: string; title: string; type: string }> = [];

                                        data.iosApps?.filter((x: any) => x.isFeatured).forEach((x: any) => items.push({ id: x.id, title: `[iOS] ${x.name}`, type: 'ios' }));
                                        data.leatherProducts?.filter((x: any) => x.isFeatured && x.handle).forEach((x: any) => items.push({ id: x.handle, title: `[Leather] ${x.handle}`, type: 'leather' }));
                                        data.shopifyApps?.filter((x: any) => x.isFeatured).forEach((x: any) => items.push({ id: x.url, title: `[ShopifyApp] ${x.title}`, type: 'shopify' }));
                                        data.snsAccounts?.filter((x: any) => x.isFeatured).forEach((x: any) => items.push({ id: x.url, title: `[SNS] ${x.title}`, type: 'sns' }));
                                        data.youtubeVideos?.filter((x: any) => x.isFeatured).forEach((x: any) => items.push({ id: x.id, title: `[YouTube] ${x.title}`, type: 'youtube' }));
                                        data.furusatoItems?.filter((x: any) => x.isFeatured).forEach((x: any) => items.push({ id: x.url, title: `[Furusato] ${x.title}`, type: 'furusato' }));
                                        data.noteItems?.filter((x: any) => x.isFeatured).forEach((x: any) => items.push({ id: x.url, title: `[Note] ${x.title}`, type: 'note' }));
                                        data.videoProductionVideos?.filter((x: any) => x.isFeatured).forEach((x: any) => items.push({ id: x.id, title: `[VideoProd] ${x.title}`, type: 'videoProduction' }));

                                        // Current Order
                                        const currentOrder = data.settings?.featuredOrder || [];

                                        // Sort items according to current order
                                        items.sort((a, b) => {
                                            const indexA = currentOrder.indexOf(a.id);
                                            const indexB = currentOrder.indexOf(b.id);
                                            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                            if (indexA !== -1) return -1;
                                            if (indexB !== -1) return 1;
                                            return 0;
                                        });

                                        return (
                                            <DraggableList
                                                items={items}
                                                onReorder={(newItems) => {
                                                    const newOrderIDs = newItems.map(item => item.id);
                                                    setData({ ...data, settings: { ...data.settings, featuredOrder: newOrderIDs } });
                                                }}
                                                renderItem={(item) => (
                                                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                                                        <span className="font-medium text-stone-700">{item.title}</span>
                                                    </div>
                                                )}
                                                itemKey={(item) => item.id}
                                            />
                                        );
                                    })()}
                                </div>
                            </section>
                        )}

                        {/* 3D Printer Gallery Section */}
                        {activeAdminTab === '3d-printer' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">3Dプリンタ画像</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文（スキル紹介）</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.printer3dIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, printer3dIntro: e.target.value } })}
                                        placeholder="3Dプリンタに関する紹介文を入力してください"
                                    />
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">画像ギャラリー</h3>
                                    <p className="text-xs text-stone-700 mb-4">ドラッグ&ドロップで並び替えられます</p>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <DraggableList
                                            items={data.printImages || []}
                                            onReorder={(newImages) => setData({ ...data, printImages: newImages })}
                                            renderItem={(src, index) => (
                                                <div className="relative group aspect-square rounded-lg overflow-hidden bg-stone-100">
                                                    <Image src={src} alt={`gallery-${index}`} fill className="object-cover" />
                                                    <button
                                                        onClick={() => {
                                                            const newImages = [...data.printImages];
                                                            newImages.splice(index, 1);
                                                            setData({ ...data, printImages: newImages });
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                            itemKey={(src, idx) => `print-${idx}-${src.slice(-20)}`}
                                        />
                                    </div>

                                    <label className="cursor-pointer bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-lg inline-block transition-colors">
                                        <span>+ 画像を追加する</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </section>
                        )}

                        {/* Note Section */}
                        {activeAdminTab === 'note' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">Note記事リスト</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文（スキル紹介）</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.noteIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, noteIntro: e.target.value } })}
                                        placeholder="Noteに関する紹介文を入力してください"
                                    />
                                </div>

                                {/* Add New Note Item */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">新しい記事を追加</h3>
                                    <div className="grid gap-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Note記事のURL (例: https://note.com/...)"
                                                className="flex-1 p-3 border rounded-lg"
                                                value={newNoteUrl}
                                                onChange={(e) => setNewNoteUrl(e.target.value)}
                                            />
                                            <button
                                                onClick={fetchNoteMeta}
                                                disabled={!newNoteUrl || isFetchingMeta}
                                                className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50 whitespace-nowrap"
                                            >
                                                {isFetchingMeta ? '取得中...' : '情報取得'}
                                            </button>
                                        </div>

                                        {newNoteTitle && (
                                            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                                                <div className="mb-2">
                                                    <label className="text-xs font-bold text-stone-500">タイトル</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border rounded mt-1"
                                                        value={newNoteTitle}
                                                        onChange={(e) => setNewNoteTitle(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex gap-4 items-start">
                                                        <div className="relative w-32 h-32 flex-shrink-0 group cursor-pointer bg-white border-2 border-dashed border-stone-300 rounded-lg hover:bg-stone-50 transition-colors flex items-center justify-center overflow-hidden">
                                                            {newNoteImage ? (
                                                                <>
                                                                    <Image src={newNoteImage} alt="Preview" fill className="object-cover" />
                                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                                                                        変更する
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-center p-2 text-stone-400">
                                                                    <span className="text-2xl block mb-1">📷</span>
                                                                    <span className="text-[10px] font-bold">画像を選択</span>
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                onChange={handleNoteImageSelect}
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <div>
                                                                <label className="text-xs font-bold text-stone-500">画像URL (Base64/URL)</label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full p-2 border rounded mt-1 text-sm bg-stone-100 text-stone-500"
                                                                    value={newNoteImage ? (newNoteImage.length > 50 ? newNoteImage.substring(0, 50) + '...' : newNoteImage) : ''}
                                                                    onChange={(e) => setNewNoteImage(e.target.value)}
                                                                    placeholder="（ファイルを選択すると自動入力されます）"
                                                                    readOnly={newNoteImage.startsWith('data:')}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-stone-400">
                                                                ※ DNDまたはクリックで画像を選択できます。<br />
                                                                ※ 自動取得やURL入力も可能です。
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={addNoteItem}
                                                        className="w-full mt-4 bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600"
                                                    >
                                                        リストに追加
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Note List with DND */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">記事リスト</h3>
                                    <p className="text-xs text-stone-700 mb-4">ドラッグ&ドロップで並び替えられます</p>

                                    <DraggableList
                                        items={data.noteItems || []}
                                        onReorder={(newList) => setData({ ...data, noteItems: newList })}
                                        renderItem={(item, index) => (
                                            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                                                <div className="grid gap-3">
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border rounded font-bold"
                                                        value={item.title}
                                                        onChange={(e) => updateNoteItem(index, 'title', e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border rounded text-sm text-stone-600"
                                                        value={item.url}
                                                        onChange={(e) => updateNoteItem(index, 'url', e.target.value)}
                                                    />

                                                    <div>
                                                        <label className="block text-xs font-bold text-stone-700 mb-1">画像 (任意)</label>
                                                        <ImageInput
                                                            currentImage={item.imageUrl}
                                                            onImageChange={(base64) => updateNoteItem(index, 'imageUrl', base64)}
                                                            label="画像をアップロード"
                                                        />
                                                    </div>

                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => toggleFeatured('noteItems', index)}
                                                            className={`px-3 py-1 rounded text-xs font-bold border ${item.isFeatured
                                                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                                : 'bg-white text-stone-400 border-stone-200'
                                                                }`}
                                                        >
                                                            ★ Featured
                                                        </button>
                                                        <button
                                                            onClick={() => removeNoteItem(index)}
                                                            className="px-3 py-1 bg-red-50 text-red-500 rounded text-xs font-bold hover:bg-red-100"
                                                        >
                                                            削除
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        itemKey={(item) => item.url}
                                    />
                                </div>

                                {/* Brain Section Divider */}
                                <div className="my-12 border-t-4 border-stone-200 border-dashed" />

                                {/* Brain Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <h2 className="text-xl font-bold mb-4 text-stone-900">Brain導入文</h2>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.brainIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, brainIntro: e.target.value } })}
                                        placeholder="Brainに関する紹介文を入力してください"
                                    />
                                </div>

                                {/* Add New Brain Item */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">新しいBrain記事を追加</h3>
                                    <div className="grid gap-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Brain記事のURL (例: https://brain-market.com/...)"
                                                className="flex-1 p-3 border rounded-lg"
                                                value={newBrainUrl}
                                                onChange={(e) => setNewBrainUrl(e.target.value)}
                                            />
                                            <button
                                                onClick={fetchBrainMeta}
                                                disabled={!newBrainUrl || isFetchingMeta}
                                                className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50 whitespace-nowrap"
                                            >
                                                {isFetchingMeta ? '取得中...' : '情報取得'}
                                            </button>
                                        </div>

                                        {newBrainUrl && (
                                            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                                                <div className="mb-2">
                                                    <label className="text-xs font-bold text-stone-500">タイトル</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border rounded mt-1"
                                                        value={newBrainTitle}
                                                        onChange={(e) => setNewBrainTitle(e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    onClick={addBrainItem}
                                                    className="w-full mt-4 bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600"
                                                >
                                                    リストに追加
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Brain List with DND */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">Brain記事リスト</h3>
                                    <p className="text-xs text-stone-700 mb-4">ドラッグ&ドロップで並び替えられます</p>

                                    <DraggableList
                                        items={data.brainItems || []}
                                        onReorder={(newList) => setData({ ...data, brainItems: newList })}
                                        renderItem={(item, index) => (
                                            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                                                <div className="flex gap-4">
                                                    <div className="flex-1 space-y-2">
                                                        <input
                                                            type="text"
                                                            className="w-full p-2 border rounded font-bold"
                                                            value={item.title}
                                                            onChange={(e) => updateBrainItem(index, 'title', e.target.value)}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="w-full p-2 border rounded text-sm text-stone-600"
                                                            value={item.url}
                                                            onChange={(e) => updateBrainItem(index, 'url', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {/* Featured Toggle for Brain Items if needed (Optional) */}
                                                        {/* 
                                                        <button
                                                            onClick={() => toggleFeatured('brainItems', index)}
                                                            className={`p-2 rounded text-xs font-bold border ${item.isFeatured
                                                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                                : 'bg-white text-stone-400 border-stone-200'
                                                                }`}
                                                        >
                                                            ★ Featured
                                                        </button>
                                                        */}
                                                        <button
                                                            onClick={() => removeBrainItem(index)}
                                                            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs font-bold"
                                                        >
                                                            削除
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        itemKey={(item) => item.url}
                                    />
                                </div>
                            </section>
                        )}

                        {/* Sketch Mark Section */}
                        {activeAdminTab === 'sketchMark' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">Sketch Mark</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.sketchMarkIntro || 'いつか意味を持つ'}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, sketchMarkIntro: e.target.value } })}
                                        placeholder="Sketch Markに関する紹介文を入力してください"
                                    />
                                </div>

                                {/* Fetch Latest Data */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-stone-900">最新データを取得・Featured設定</h3>
                                        <button
                                            onClick={async () => {
                                                setIsFetchingSketchMark(true);
                                                try {
                                                    const res = await fetch('/api/sketch-mark');
                                                    const resData = await res.json();
                                                    if (resData.items) {
                                                        setFetchedSketchMarkItems(resData.items);
                                                    }
                                                } catch (e) {
                                                    console.error(e);
                                                    alert('データの取得に失敗しました');
                                                } finally {
                                                    setIsFetchingSketchMark(false);
                                                }
                                            }}
                                            disabled={isFetchingSketchMark}
                                            className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-50 text-sm font-bold"
                                        >
                                            {isFetchingSketchMark ? '取得中...' : '最新データを読み込む'}
                                        </button>
                                    </div>

                                    {fetchedSketchMarkItems.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-2">
                                            {fetchedSketchMarkItems.map((item) => {
                                                // Check if already in featured list
                                                const isFeatured = data.sketchMarkItems?.some(existing => existing.id === item.id);

                                                return (
                                                    <div key={item.id} className={`p-3 rounded-lg border-2 ${isFeatured ? 'border-yellow-400 bg-yellow-50' : 'border-stone-200 bg-white'}`}>
                                                        <div className="relative aspect-square mb-2 bg-stone-100 rounded overflow-hidden">
                                                            {item.imageUrl ? (
                                                                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full text-xs text-stone-400">No Image</div>
                                                            )}
                                                            <span className="absolute top-1 right-1 text-[10px] font-bold px-2 py-0.5 rounded bg-black/50 text-white block">
                                                                {item.type === 'base' ? 'BASE' : 'Instagram'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs font-bold text-stone-800 line-clamp-2 mb-2 h-8">{item.title}</p>
                                                        <button
                                                            onClick={() => {
                                                                const currentFeatured = data.sketchMarkItems || [];
                                                                let newFeatured;
                                                                if (isFeatured) {
                                                                    // Remove
                                                                    newFeatured = currentFeatured.filter(f => f.id !== item.id);
                                                                } else {
                                                                    // Add
                                                                    newFeatured = [...currentFeatured, item];
                                                                }
                                                                setData({ ...data, sketchMarkItems: newFeatured });
                                                            }}
                                                            className={`w-full py-2 rounded text-xs font-bold transition-colors ${isFeatured
                                                                ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
                                                                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                                                                }`}
                                                        >
                                                            {isFeatured ? '★ Featured (TOP表示中)' : '☆ TOPに表示する'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* BASE Sync Status */}
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-bold text-stone-900">BASEと連携中</span>
                                    </div>
                                    <p className="text-stone-600 text-sm mb-4">
                                        商品データはBASE APIから自動取得されます。手動登録は不要です。
                                    </p>
                                    <a
                                        href="https://sketchmark.thebase.in/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
                                    >
                                        BASEショップを開く →
                                    </a>
                                </div>
                            </section>
                        )}

                        {/* TikTok Section */}
                        {activeAdminTab === 'tiktok' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">毎日投稿チャレンジ</h2>

                                {/* TikTok Intro */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[80px]"
                                        value={data.settings?.tiktokIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, tiktokIntro: e.target.value } })}
                                        placeholder="毎日投稿チャレンジの紹介文を入力..."
                                    />
                                </div>

                                {/* Add Post */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">投稿を追加</h3>
                                    <div className="grid gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">プラットフォーム *</label>
                                            <select
                                                className="w-full p-3 border rounded-lg"
                                                value={newTikTokPlatform || 'tiktok'}
                                                onChange={(e) => setNewTikTokPlatform(e.target.value as 'tiktok' | 'instagram')}
                                            >
                                                <option value="tiktok">TikTok</option>
                                                <option value="instagram">Instagram</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">投稿URL *</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 border rounded-lg"
                                                value={newTikTokUrl}
                                                onChange={(e) => setNewTikTokUrl(e.target.value)}
                                                placeholder={newTikTokPlatform === 'instagram' ? "https://www.instagram.com/p/ABC123..." : "https://www.tiktok.com/@user/video/1234567890..."}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">タイトル（任意）</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 border rounded-lg"
                                                value={newTikTokTitle}
                                                onChange={(e) => setNewTikTokTitle(e.target.value)}
                                                placeholder="投稿のタイトル"
                                            />
                                        </div>
                                        <button
                                            onClick={addTikTokItem}
                                            className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600"
                                        >
                                            リストに追加
                                        </button>
                                    </div>
                                </div>

                                {/* Post List */}
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">投稿リスト</h3>
                                    <DraggableList
                                        items={data.tiktokItems || []}
                                        onReorder={(newList) => setData({ ...data, tiktokItems: newList })}
                                        renderItem={(item, index) => (
                                            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                                                <div className="grid gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${item.platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-black'}`}>
                                                            {item.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="flex-1 p-2 border rounded font-bold"
                                                            value={item.title}
                                                            onChange={(e) => updateTikTokItem(index, 'title', e.target.value)}
                                                            placeholder="タイトル"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border rounded text-sm text-stone-600"
                                                        value={item.url}
                                                        onChange={(e) => updateTikTokItem(index, 'url', e.target.value)}
                                                        placeholder="TikTok URL"
                                                    />
                                                    <div>
                                                        <label className="block text-xs font-bold text-stone-700 mb-1">サムネイル画像 (TOP表示用)</label>
                                                        <ImageInput
                                                            currentImage={item.thumbnailUrl}
                                                            onImageChange={(base64) => updateTikTokItem(index, 'thumbnailUrl', base64)}
                                                            label="画像をアップロード"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => toggleFeatured('tiktokItems', index)}
                                                            className={`px-3 py-1 rounded text-xs font-bold border ${item.isFeatured
                                                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                                : 'bg-white text-stone-400 border-stone-200'
                                                                }`}
                                                        >
                                                            ★ Featured
                                                        </button>
                                                        <button
                                                            onClick={() => removeTikTokItem(index)}
                                                            className="px-3 py-1 bg-red-50 text-red-500 rounded text-xs font-bold hover:bg-red-100"
                                                        >
                                                            削除
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        itemKey={(item) => item.id}
                                    />
                                    {(!data.tiktokItems || data.tiktokItems.length === 0) && (
                                        <p className="text-center text-stone-400 py-8">まだ動画が登録されていません。</p>
                                    )}
                                </div>
                            </section>
                        )}

                        {activeAdminTab === 'leather' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">革製品リスト</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文（スキル紹介）</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.leatherIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, leatherIntro: e.target.value } })}
                                        placeholder="革製品に関する紹介文を入力してください"
                                    />
                                </div>

                                {/* Leather Products List with DND */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">商品リスト</h3>
                                    <p className="text-xs text-stone-700 mb-4">ドラッグ&ドロップで並び替えられます</p>

                                    <DraggableList
                                        items={data.leatherProducts || []}
                                        onReorder={(newList) => setData({ ...data, leatherProducts: newList })}
                                        renderItem={(item, index) => (
                                            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                                                <div className="grid gap-3">
                                                    <div>
                                                        <label className="block text-xs font-bold text-stone-700 mb-1">Shopify Handle ID</label>
                                                        <input
                                                            className="border p-2 rounded w-full"
                                                            value={item.handle}
                                                            onChange={(e) => {
                                                                const newList = [...data.leatherProducts];
                                                                const urlMatch = e.target.value.match(/\/products\/([^/?]+)/);
                                                                newList[index] = { ...newList[index], handle: urlMatch ? urlMatch[1] : e.target.value };
                                                                setData({ ...data, leatherProducts: newList });
                                                            }}
                                                            placeholder="handle-id または https://... の商品URL"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-stone-700 mb-1">カテゴリ</label>
                                                        <input
                                                            className="border p-2 rounded w-full"
                                                            value={item.category}
                                                            onChange={(e) => updateLeatherProduct(index, 'category', e.target.value)}
                                                            placeholder="カテゴリ (例: Leather Craft)"
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <button
                                                            onClick={() => {
                                                                const newList = [...data.leatherProducts];
                                                                newList[index] = { ...newList[index], isFeatured: !item.isFeatured };
                                                                setData({ ...data, leatherProducts: newList });
                                                            }}
                                                            className={`px-3 py-1 rounded text-sm font-bold ${item.isFeatured ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                                        >
                                                            {item.isFeatured ? '★ Featured' : '☆ Featured'}
                                                        </button>
                                                        <button
                                                            onClick={() => removeLeatherProduct(index)}
                                                            className="text-red-500 hover:text-red-700 font-bold"
                                                        >
                                                            削除
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        itemKey={(item, idx) => item.handle || `leather-${idx}`}
                                    />

                                    <button
                                        onClick={addLeatherProduct}
                                        className="mt-4 w-full bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-lg font-bold transition-colors"
                                    >
                                        + 革製品を追加
                                    </button>
                                </div>
                            </section>
                        )}

                        {/* SNS Section */}
                        {activeAdminTab === 'sns' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">SNSリスト</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文（スキル紹介）</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.snsIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, snsIntro: e.target.value } })}
                                        placeholder="SNSに関する紹介文を入力してください"
                                    />
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">SNSアカウント一覧</h3>
                                    <p className="text-xs text-stone-700 mb-4">ドラッグ&ドロップで並び替えられます</p>

                                    <DraggableList
                                        items={data.snsAccounts || []}
                                        onReorder={(newList) => setData({ ...data, snsAccounts: newList })}
                                        renderItem={(item, index) => (
                                            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                                                <div className="grid gap-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input className="border p-2 rounded text-stone-900" value={item.title} onChange={(e) => updateGeneralProduct('snsAccounts', index, 'title', e.target.value)} placeholder="タイトル" />
                                                        <select
                                                            className="border p-2 rounded text-stone-900"
                                                            value={item.platformType || 'other'}
                                                            onChange={(e) => updateGeneralProduct('snsAccounts', index, 'platformType', e.target.value)}
                                                        >
                                                            <option value="instagram">Instagram</option>
                                                            <option value="x">X (Twitter)</option>
                                                            <option value="youtube">YouTube</option>
                                                            <option value="tiktok">TikTok</option>
                                                            <option value="facebook">Facebook</option>
                                                            <option value="linkedin">LinkedIn</option>
                                                            <option value="sora">Sora</option>
                                                            <option value="other">その他</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input className="border p-2 rounded text-stone-900" value={item.category} onChange={(e) => updateGeneralProduct('snsAccounts', index, 'category', e.target.value)} placeholder="カテゴリ (例: SNS)" />
                                                        <input
                                                            className="border p-2 rounded text-stone-900"
                                                            value={item.tagline || ''}
                                                            onChange={(e) => updateGeneralProduct('snsAccounts', index, 'tagline', e.target.value)}
                                                            placeholder="キャッチコピー (例: 日々のつぶやき)"
                                                        />
                                                    </div>
                                                    <input className="border p-2 rounded text-stone-900" value={item.url} onChange={(e) => updateGeneralProduct('snsAccounts', index, 'url', e.target.value)} placeholder="URL" />
                                                    <div>
                                                        <label className="block text-xs font-bold text-stone-700 mb-1">サムネイル画像 (任意)</label>
                                                        <ImageInput
                                                            currentImage={item.thumbnailUrl}
                                                            onImageChange={(base64) => updateGeneralProduct('snsAccounts', index, 'thumbnailUrl', base64)}
                                                            label="画像をアップロード"
                                                        />
                                                    </div>
                                                    <textarea className="border p-2 rounded text-stone-900 h-24" value={item.description} onChange={(e) => updateGeneralProduct('snsAccounts', index, 'description', e.target.value)} placeholder="説明" />
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => toggleFeatured('snsAccounts', index)}
                                                            className={`px-3 py-1 rounded text-sm font-bold ${item.isFeatured ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                                        >
                                                            {item.isFeatured ? '★ Featured' : '☆ Pick Up'}
                                                        </button>
                                                        <button onClick={() => removeGeneralProduct('snsAccounts', index)} className="text-red-500 text-sm">削除</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        itemKey={(item, idx) => `sns-${idx}-${item.url}`}
                                    />

                                    <button onClick={() => addGeneralProduct('snsAccounts')} className="mt-4 w-full py-3 border-2 border-dashed border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors">
                                        + アイテムを追加
                                    </button>
                                </div>
                            </section>
                        )}

                        {/* Shopify Section */}
                        {/* Shopify Section */}
                        {activeAdminTab === 'shopify' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">Shopifyアプリリスト</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文（スキル紹介）</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.shopifyIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, shopifyIntro: e.target.value } })}
                                        placeholder="Shopifyアプリに関する紹介文を入力してください"
                                    />
                                </div>

                                {data.shopifyApps.map((item, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm mb-4">
                                        <div className="grid gap-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input className="border p-2 rounded text-stone-900" value={item.title} onChange={(e) => updateGeneralProduct('shopifyApps', index, 'title', e.target.value)} placeholder="タイトル" />
                                                <input className="border p-2 rounded text-stone-900" value={item.category} onChange={(e) => updateGeneralProduct('shopifyApps', index, 'category', e.target.value)} placeholder="カテゴリ (例: Shopify App)" />
                                            </div>
                                            <input className="border p-2 rounded text-stone-900" value={item.url} onChange={(e) => updateGeneralProduct('shopifyApps', index, 'url', e.target.value)} placeholder="URL" />
                                            <textarea className="border p-2 rounded text-stone-900 h-24" value={item.description} onChange={(e) => updateGeneralProduct('shopifyApps', index, 'description', e.target.value)} placeholder="説明" />
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => toggleFeatured('shopifyApps', index)}
                                                    className={`px-3 py-1 rounded text-sm font-bold ${item.isFeatured ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                                >
                                                    ★ {item.isFeatured ? 'Featured' : 'Pick Up'}
                                                </button>
                                                <button onClick={() => removeGeneralProduct('shopifyApps', index)} className="text-red-500 text-sm">削除</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => addGeneralProduct('shopifyApps')} className="w-full py-3 border-2 border-dashed border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors">
                                    + アイテムを追加
                                </button>
                            </section>
                        )}

                        {/* Furusato Nozei Section */}
                        {activeAdminTab === 'furusato' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">ふるさと納税リスト</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文（スキル紹介）</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.furusatoIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, furusatoIntro: e.target.value } })}
                                        placeholder="ふるさと納税に関する紹介文を入力してください"
                                    />
                                </div>

                                {/* Add New Item Form */}
                                <div className="bg-stone-100 p-6 rounded-xl mb-8 border border-stone-200">
                                    <h3 className="font-bold mb-4 text-stone-700">新規追加</h3>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            className="flex-grow border p-2 rounded text-stone-900"
                                            value={newFurusatoUrl}
                                            onChange={(e) => setNewFurusatoUrl(e.target.value)}
                                            placeholder="URLを入力して自動取得"
                                        />
                                        <button
                                            onClick={fetchMetadata}
                                            disabled={isFetchingMeta || !newFurusatoUrl}
                                            className="bg-stone-600 text-white px-4 py-2 rounded hover:bg-stone-700 disabled:opacity-50"
                                        >
                                            {isFetchingMeta ? '...' : '情報取得'}
                                        </button>
                                    </div>

                                    {/* Always show manual inputs or when URL is entered */}
                                    <div className="bg-white p-4 rounded border border-stone-200 mb-4 flex gap-4 items-start">
                                        <div className="flex-shrink-0 space-y-2">
                                            {newFurusatoImage ? (
                                                <div className="relative w-24 h-24 bg-stone-100 rounded overflow-hidden">
                                                    <Image src={newFurusatoImage} alt="preview" fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-24 h-24 bg-stone-100 rounded flex items-center justify-center text-xs text-stone-600">
                                                    No Image
                                                </div>
                                            )}
                                            <input
                                                className="w-24 text-xs border p-1 rounded"
                                                value={newFurusatoImage}
                                                onChange={(e) => setNewFurusatoImage(e.target.value)}
                                                placeholder="画像URL"
                                            />
                                        </div>
                                        <div className="flex-grow space-y-2">
                                            <input
                                                className="w-full border p-2 rounded text-sm"
                                                value={newFurusatoTitle}
                                                onChange={(e) => setNewFurusatoTitle(e.target.value)}
                                                placeholder="タイトル (必須)"
                                            />
                                            <input
                                                className="w-full border p-2 rounded text-sm"
                                                value={newFurusatoSite}
                                                onChange={(e) => setNewFurusatoSite(e.target.value)}
                                                placeholder="サイト名"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={addFurusatoItem}
                                        disabled={!newFurusatoTitle}
                                        className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 font-bold"
                                    >
                                        リストに追加
                                    </button>
                                </div>

                                {/* Furusato Items List */}
                                <div className="grid grid-cols-1 gap-4">
                                    {data.furusatoItems && data.furusatoItems.map((item, index) => (
                                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 border border-stone-100">
                                            <div className="relative w-32 aspect-video bg-stone-100 rounded overflow-hidden flex-shrink-0">
                                                {item.imageUrl ? (
                                                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xs text-stone-600">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-grow grid gap-2">
                                                <input
                                                    className="border p-2 rounded text-sm font-bold"
                                                    value={item.title}
                                                    onChange={(e) => updateFurusatoItem(index, 'title', e.target.value)}
                                                />
                                                <input
                                                    className="border p-2 rounded text-xs text-stone-700"
                                                    value={item.url}
                                                    onChange={(e) => updateFurusatoItem(index, 'url', e.target.value)}
                                                />
                                            </div>
                                            <button
                                                onClick={() => toggleFeatured('furusatoItems', index)}
                                                className={`px-3 py-1 rounded text-sm font-bold ${item.isFeatured ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                            >
                                                ★
                                            </button>
                                            <button
                                                onClick={() => removeFurusatoItem(index)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded self-start"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* iOS Apps Section */}
                        {activeAdminTab === 'ios' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">iOSアプリリスト</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文（スキル紹介）</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.iosIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, iosIntro: e.target.value } })}
                                        placeholder="iOSアプリに関する紹介文を入力してください"
                                    />
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">アプリリスト</h3>
                                    <p className="text-xs text-stone-700 mb-4">ドラッグ&ドロップで並び替えられます</p>

                                    <DraggableList
                                        items={data.iosApps || []}
                                        onReorder={(newList) => setData({ ...data, iosApps: newList })}
                                        renderItem={(app, index) => (
                                            <div className="flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-200">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-stone-800">{app.name}</span>
                                                    <span className="font-mono text-xs text-stone-700">ID: {app.id}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleFeatured('iosApps', index)}
                                                        className={`px-3 py-1 rounded text-sm font-bold ${app.isFeatured ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                                    >
                                                        {app.isFeatured ? '★ Featured' : '☆ Pick Up'}
                                                    </button>
                                                    <button
                                                        onClick={() => removeAppId(index)}
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        itemKey={(app, idx) => `${app.id}-${idx}`}
                                    />
                                </div>

                                <div className="flex gap-2 bg-stone-100 p-4 rounded-xl border border-stone-200">
                                    <input
                                        className="flex-grow border p-2 rounded text-stone-900"
                                        value={newAppId}
                                        onChange={(e) => setNewAppId(e.target.value)}
                                        placeholder="App Store IDを入力 (例: 1234567890)"
                                    />
                                    <button
                                        onClick={addAppId}
                                        disabled={!newAppId}
                                        className="bg-stone-600 text-white px-6 py-2 rounded hover:bg-stone-700 disabled:opacity-50 font-bold"
                                    >
                                        追加
                                    </button>
                                </div>
                            </section>
                        )}

                        {/* YouTube Section */}
                        {activeAdminTab === 'youtube' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">YouTube動画リスト</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文（スキル紹介）</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.youtubeIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, youtubeIntro: e.target.value } })}
                                        placeholder="YouTube動画に関する紹介文を入力してください"
                                    />
                                </div>

                                {/* Add New Video Form */}
                                <div className="bg-stone-100 p-6 rounded-xl mb-8 border border-stone-200">
                                    <h3 className="font-bold mb-4 text-stone-700">新規追加</h3>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            className="flex-grow border p-2 rounded text-stone-900"
                                            value={newYouTubeUrl}
                                            onChange={(e) => setNewYouTubeUrl(e.target.value)}
                                            placeholder="YouTube URLを入力"
                                        />
                                        <button
                                            onClick={fetchYouTubeMeta}
                                            disabled={isFetchingMeta || !newYouTubeUrl}
                                            className="bg-stone-600 text-white px-4 py-2 rounded hover:bg-stone-700 disabled:opacity-50"
                                        >
                                            {isFetchingMeta ? '...' : '情報取得'}
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            className="w-full border p-2 rounded"
                                            value={newYouTubeTitle}
                                            onChange={(e) => setNewYouTubeTitle(e.target.value)}
                                            placeholder="動画タイトル"
                                        />
                                    </div>

                                    <button
                                        onClick={addYouTubeVideo}
                                        disabled={!newYouTubeTitle}
                                        className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 font-bold"
                                    >
                                        リストに追加
                                    </button>
                                </div>

                                {/* Video List */}
                                <div className="grid grid-cols-1 gap-4">
                                    {data.youtubeVideos && data.youtubeVideos.map((video) => (
                                        <div key={video.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 border border-stone-100 items-center">
                                            <div className="flex-grow">
                                                <p className="font-bold text-sm mb-1">{video.title}</p>
                                                <p className="text-xs text-stone-700 break-all">{video.url}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const index = data.youtubeVideos?.findIndex(v => v.id === video.id) ?? -1;
                                                    if (index >= 0) toggleFeatured('youtubeVideos', index);
                                                }}
                                                className={`px-3 py-1 rounded text-sm font-bold ${video.isFeatured ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                            >
                                                ★
                                            </button>
                                            <button
                                                onClick={() => removeYouTubeVideo(video.id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    {(!data.youtubeVideos || data.youtubeVideos.length === 0) && (
                                        <p className="text-center text-stone-700 py-8">まだ動画が登録されていません。</p>
                                    )}
                                </div>
                            </section>
                        )}



                        {/* Settings Section */}
                        {activeAdminTab === 'settings' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">サイト設定</h2>
                                <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">

                                    {/* Profile Image Upload */}
                                    <div className="p-4 border border-stone-200 rounded-lg bg-stone-50">
                                        <h3 className="font-bold mb-4">プロフィール写真 (Hero Section)</h3>
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-stone-200 shadow-sm">
                                                <Image
                                                    src="/profile/profile.jpg"
                                                    alt="Current Profile"
                                                    width={96}
                                                    height={96}
                                                    className="object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = '/profile-icon.png' }}
                                                    key={Date.now()}
                                                />
                                            </div>
                                            <div>
                                                <label className="cursor-pointer bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 px-4 py-2 rounded-lg inline-block transition-colors">
                                                    <span>写真を変更する</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleProfileUpload}
                                                    />
                                                </label>
                                                <p className="text-xs text-stone-700 mt-2">
                                                    推奨: 正方形 (jpg/png)<br />
                                                    反映されない場合はページをリロードしてください。
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-2">
                                            サイトタイトル (Site Title)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded"
                                            value={siteTitle}
                                            onChange={(e) => {
                                                setSiteTitle(e.target.value);
                                                setData({ ...data!, settings: { ...data!.settings, siteTitle: e.target.value } });
                                            }}
                                            placeholder="Dev cat's ポートフォリオ"
                                        />
                                        <p className="mt-1 text-xs text-stone-700">
                                            ブラウザタブに表示されるタイトルです。
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-2">
                                            ヘッダー名前 (Profile Name)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded"
                                            value={profileName}
                                            onChange={(e) => {
                                                setProfileName(e.target.value);
                                                setData({ ...data!, settings: { ...data!.settings, profileName: e.target.value } });
                                            }}
                                            placeholder="Dev cat's Archive"
                                        />
                                        <p className="mt-1 text-xs text-stone-700">
                                            ヘッダーに表示される名前です。
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-2">
                                            ヘッダー一言 (Tagline)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded"
                                            value={profileTagline}
                                            onChange={(e) => {
                                                setProfileTagline(e.target.value);
                                                setData({ ...data!, settings: { ...data!.settings, profileTagline: e.target.value } });
                                            }}
                                            placeholder="ロジックと情熱の、結び目を管理する。"
                                        />
                                        <p className="mt-1 text-xs text-stone-700">
                                            ヘッダー右側に表示される一言です。
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-2">
                                            Featured導入文 (Featured Intro)
                                        </label>
                                        <textarea
                                            className="w-full border p-3 rounded text-stone-900 h-48 font-sans"
                                            value={featuredIntro}
                                            onChange={(e) => {
                                                setFeaturedIntro(e.target.value);
                                                setData({ ...data!, settings: { ...data!.settings, featuredIntro: e.target.value } });
                                            }}
                                            placeholder="ようこそ。私は Dev cat と申します..."
                                        />
                                        <p className="mt-1 text-xs text-stone-700">
                                            Featured Worksセクションの上部に表示される導入文です。改行が反映されます。
                                        </p>
                                        <p className="mt-1 text-xs text-stone-700">
                                            Featured Worksセクションの上部に表示される導入文です。改行が反映されます。
                                        </p>
                                    </div>

                                    {/* Legal Information Section */}
                                    <div className="border-t border-stone-200 mt-8 pt-6">
                                        <h3 className="font-bold text-xl mb-4 text-stone-800">特定商取引法に基づく表記</h3>
                                        <div className="grid gap-6">
                                            {/* 1. 販売業者 / 事業者名 */}
                                            <div>
                                                <label className="text-xs font-bold text-stone-500">販売業者 / 事業者名</label>
                                                <input
                                                    className="w-full border p-2 rounded"
                                                    value={data.legalInfo?.businessName || ''}
                                                    onChange={e => updateLegal('businessName', e.target.value)}
                                                    placeholder="例: 長嶺一平 (Dev cat's Studio & Office)"
                                                />
                                            </div>

                                            {/* 2. 代表者名 */}
                                            <div>
                                                <label className="text-xs font-bold text-stone-500">代表者名</label>
                                                <input
                                                    className="w-full border p-2 rounded"
                                                    value={data.legalInfo?.representativeName || ''}
                                                    onChange={e => updateLegal('representativeName', e.target.value)}
                                                    placeholder="例: 長嶺一平"
                                                />
                                            </div>

                                            {/* 3. 所在地・連絡先 */}
                                            <div>
                                                <label className="text-xs font-bold text-stone-500">所在地・連絡先</label>
                                                <textarea
                                                    className="w-full border p-2 rounded h-32"
                                                    value={data.legalInfo?.addressInfo || ''}
                                                    onChange={e => updateLegal('addressInfo', e.target.value)}
                                                    placeholder="例: 所在地および電話番号については、特定商取引法に基づき..."
                                                />
                                            </div>

                                            {/* 4. お問い合わせ先 */}
                                            <div>
                                                <label className="text-xs font-bold text-stone-500">お問い合わせ先</label>
                                                <input
                                                    className="w-full border p-2 rounded"
                                                    value={data.legalInfo?.contactEmail || ''}
                                                    onChange={e => updateLegal('contactEmail', e.target.value)}
                                                    placeholder="例: info@example.com"
                                                />
                                            </div>

                                            {/* 5. 販売価格 */}
                                            <div>
                                                <label className="text-xs font-bold text-stone-500">販売価格</label>
                                                <textarea
                                                    className="w-full border p-2 rounded h-20"
                                                    value={data.legalInfo?.sellingPrice || ''}
                                                    onChange={e => updateLegal('sellingPrice', e.target.value)}
                                                    placeholder="例: 各サービス・商品ページに記載の金額（消費税込み）"
                                                />
                                            </div>

                                            {/* 6. 商品代金以外に必要な料金 */}
                                            <div>
                                                <label className="text-xs font-bold text-stone-500">商品代金以外に必要な料金</label>
                                                <textarea
                                                    className="w-full border p-2 rounded h-32"
                                                    value={data.legalInfo?.additionalCharges || ''}
                                                    onChange={e => updateLegal('additionalCharges', e.target.value)}
                                                    placeholder="例: &#13;&#10;物販： 配送料...&#13;&#10;サービス： 対面時の各自の飲食代..."
                                                />
                                            </div>

                                            {/* 7 & 8. 代金の支払時期および支払方法 */}
                                            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                                                <label className="text-sm font-bold text-stone-700 block mb-3">代金の支払時期および支払方法</label>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-stone-500">支払方法</label>
                                                        <textarea
                                                            className="w-full border p-2 rounded h-20"
                                                            value={data.legalInfo?.paymentMethod || ''}
                                                            onChange={e => updateLegal('paymentMethod', e.target.value)}
                                                            placeholder="例: クレジットカード決済（Stripe）"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-stone-500">支払時期</label>
                                                        <textarea
                                                            className="w-full border p-2 rounded h-20"
                                                            value={data.legalInfo?.paymentTiming || ''}
                                                            onChange={e => updateLegal('paymentTiming', e.target.value)}
                                                            placeholder="例: 商品注文時、または予約確定時の事前決済"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 9. 商品の引き渡し・サービス提供時期 */}
                                            <div>
                                                <label className="text-xs font-bold text-stone-500">商品の引き渡し・サービス提供時期</label>
                                                <textarea
                                                    className="w-full border p-2 rounded h-32"
                                                    value={data.legalInfo?.shippingInfo || ''}
                                                    onChange={e => updateLegal('shippingInfo', e.target.value)}
                                                    placeholder="例: &#13;&#10;物販： 順次発送...&#13;&#10;サービス： 予約確定時に合意した日時"
                                                />
                                            </div>

                                            {/* 10. 返品・交換・キャンセルについて */}
                                            <div>
                                                <label className="text-xs font-bold text-stone-500">返品・交換・キャンセルについて</label>
                                                <textarea
                                                    className="w-full border p-2 rounded h-40"
                                                    value={data.legalInfo?.returnPolicy || ''}
                                                    onChange={e => updateLegal('returnPolicy', e.target.value)}
                                                    placeholder="例: &#13;&#10;物販： 商品に欠陥がある場合を除き...&#13;&#10;サービス： サービス提供後の返金には応じられません..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Video Production Section */}
                        {activeAdminTab === 'videoProduction' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">動画編集リスト</h2>

                                {/* Intro Text Section */}
                                <div className="bg-stone-50 p-6 rounded-xl mb-8 border border-stone-200">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">
                                        動画制作のスキル・想い（導入文）
                                    </label>
                                    <textarea
                                        className="w-full border p-3 rounded text-stone-900 h-32 font-sans"
                                        value={videoProductionIntro}
                                        onChange={(e) => {
                                            setVideoProductionIntro(e.target.value);
                                            setData({ ...data!, settings: { ...data!.settings, videoProductionIntro: e.target.value } });
                                        }}
                                        placeholder="動画制作に対する想いやスキルを記述してください..."
                                    />
                                    <p className="mt-1 text-xs text-stone-700">
                                        動画制作タブの上部に表示される導入文です。改行が反映されます。
                                    </p>
                                </div>

                                {/* Add New Video Form */}
                                <div className="bg-stone-100 p-6 rounded-xl mb-8 border border-stone-200">
                                    <h3 className="font-bold mb-4 text-stone-700">新規追加</h3>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            className="flex-grow border p-2 rounded text-stone-900"
                                            value={newVideoProductionUrl}
                                            onChange={(e) => setNewVideoProductionUrl(e.target.value)}
                                            placeholder="YouTube URLを入力"
                                        />
                                        <button
                                            onClick={async () => {
                                                if (!newVideoProductionUrl) return;
                                                setIsFetchingMeta(true);
                                                setStatus('メタデータ取得中...');
                                                try {
                                                    const res = await fetch(`/api/metadata?url=${encodeURIComponent(newVideoProductionUrl)}`);
                                                    const meta = await res.json();
                                                    if (meta.error) {
                                                        setStatus('メタデータ取得失敗');
                                                    } else {
                                                        setNewVideoProductionTitle(meta.title);
                                                        setStatus('メタデータ取得成功');
                                                    }
                                                } catch (e: unknown) {
                                                    setStatus('メタデータ取得エラー');
                                                }
                                                setIsFetchingMeta(false);
                                            }}
                                            disabled={isFetchingMeta || !newVideoProductionUrl}
                                            className="bg-stone-600 text-white px-4 py-2 rounded hover:bg-stone-700 disabled:opacity-50"
                                        >
                                            {isFetchingMeta ? '...' : '情報取得'}
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            className="w-full border p-2 rounded"
                                            value={newVideoProductionTitle}
                                            onChange={(e) => setNewVideoProductionTitle(e.target.value)}
                                            placeholder="動画タイトル"
                                        />
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (!data || !newVideoProductionTitle) return;
                                            const newVideo = {
                                                id: Date.now().toString(),
                                                url: newVideoProductionUrl,
                                                title: newVideoProductionTitle
                                            };
                                            const currentVideos = data.videoProductionVideos || [];
                                            setData({ ...data, videoProductionVideos: [...currentVideos, newVideo] });
                                            setNewVideoProductionUrl('');
                                            setNewVideoProductionTitle('');
                                            setStatus('動画を追加しました（保存ボタンを押してください）');
                                        }}
                                        disabled={!newVideoProductionTitle}
                                        className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 font-bold"
                                    >
                                        リストに追加
                                    </button>
                                </div>

                                {/* Video List */}
                                <div className="grid grid-cols-1 gap-4">
                                    {data.videoProductionVideos && data.videoProductionVideos.map((video) => (
                                        <div key={video.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 border border-stone-100 items-center">
                                            <div className="flex-grow">
                                                <p className="font-bold text-sm mb-1">{video.title}</p>
                                                <p className="text-xs text-stone-700 break-all">{video.url}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const index = data.videoProductionVideos?.findIndex(v => v.id === video.id) ?? -1;
                                                    if (index >= 0) {
                                                        const newList = [...data.videoProductionVideos!] as any[];
                                                        newList[index] = { ...newList[index], isFeatured: !newList[index].isFeatured };
                                                        setData({ ...data!, videoProductionVideos: newList } as any);
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded text-sm font-bold ${video.isFeatured ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                            >
                                                ★
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!data || !data.videoProductionVideos) return;
                                                    const newList = data.videoProductionVideos.filter(v => v.id !== video.id);
                                                    setData({ ...data, videoProductionVideos: newList });
                                                }}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    {(!data.videoProductionVideos || data.videoProductionVideos.length === 0) && (
                                        <p className="text-center text-stone-700 py-8">まだ動画が登録されていません。</p>
                                    )}
                                </div>
                            </section>
                        )}


                        {/* Office Section */}
                        {activeAdminTab === 'office' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">Office (Consultation & Checkout)</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文（スキル紹介）</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.officeIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, officeIntro: e.target.value } })}
                                        placeholder="Officeタブに関する紹介文を入力してください"
                                    />
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
                                    <h3 className="text-lg font-bold mb-4 text-stone-900">相談メニュー管理</h3>
                                    <p className="text-xs text-stone-700 mb-4">ドラッグ&ドロップで並び替えられます</p>
                                    <div className="mb-4 bg-stone-100 p-4 rounded text-xs">
                                        <p className="font-bold mb-1">Stripe Buy Button設定方法:</p>
                                        <ol className="list-decimal list-inside space-y-1">
                                            <li>Stripeダッシュボードで商品を作成し、「購入ボタン」を作成します。</li>
                                            <li>生成されたコードから <code>buy-button-id</code> と <code>publishable-key</code> をコピーして入力してください。</li>
                                            <li>※ 公開サイトでは「相談ボタン」が表示され、決済ボタンはこの項目のIDに基づく専用ページ（/checkout/[ID]）でのみ表示されます。</li>
                                        </ol>
                                    </div>

                                    <DraggableList
                                        items={data.officeItems || []}
                                        onReorder={(newList) => setData({ ...data, officeItems: newList })}
                                        renderItem={(item, index) => (
                                            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                                                <div className="grid gap-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-stone-700 mb-1">メニュー名 (必須)</label>
                                                            <input
                                                                className="border p-2 rounded w-full text-sm font-bold"
                                                                value={item.title || ''}
                                                                onChange={(e) => updateOfficeItem(index, 'title', e.target.value)}
                                                                placeholder="例: Webサイト制作相談"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-stone-700 mb-1">相談用URL (Googleフォーム等)</label>
                                                            <input
                                                                className="border p-2 rounded w-full text-sm"
                                                                value={item.consultationUrl || ''}
                                                                onChange={(e) => updateOfficeItem(index, 'consultationUrl', e.target.value)}
                                                                placeholder="https://forms.google.com/..."
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Image Input */}
                                                    <div className="mb-4">
                                                        <label className="block text-xs font-bold text-stone-700 mb-1">画像 (任意)</label>
                                                        <ImageInput
                                                            currentImage={item.imageUrl}
                                                            onImageChange={(base64) => updateOfficeItem(index, 'imageUrl', base64)}
                                                            label="画像をアップロード"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-stone-700 mb-1">説明 (任意)</label>
                                                        <textarea
                                                            className="border p-2 rounded w-full text-sm h-16"
                                                            value={item.description || ''}
                                                            onChange={(e) => updateOfficeItem(index, 'description', e.target.value)}
                                                            placeholder="メニューの簡単な説明"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 rounded border border-stone-200">
                                                        <div>
                                                            <label className="block text-xs font-bold text-stone-500 mb-1">Stripe Buy Button ID</label>
                                                            <input
                                                                className="border p-2 rounded w-full font-mono text-xs bg-stone-50"
                                                                value={item.buyButtonId}
                                                                onChange={(e) => updateOfficeItem(index, 'buyButtonId', e.target.value)}
                                                                placeholder="buy_btn_..."
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-stone-500 mb-1">Stripe Publishable Key</label>
                                                            <input
                                                                className="border p-2 rounded w-full font-mono text-xs bg-stone-50"
                                                                value={item.publishableKey}
                                                                onChange={(e) => updateOfficeItem(index, 'publishableKey', e.target.value)}
                                                                placeholder="pk_live_..."
                                                            />
                                                        </div>
                                                        <div className="col-span-1 md:col-span-2 text-[10px] text-stone-400 text-right">
                                                            ID: {item.id} (Checkout URL: .../checkout/{item.id})
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-2">
                                                        <button
                                                            onClick={() => updateOfficeItem(index, 'isFeatured', !item.isFeatured)}
                                                            className={`px-3 py-1 rounded text-sm font-bold ${item.isFeatured ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                                        >
                                                            {item.isFeatured ? '★ Featured' : '☆ Featured'}
                                                        </button>
                                                        <button
                                                            onClick={() => removeOfficeItem(index)}
                                                            className="text-red-500 hover:text-red-700 font-bold"
                                                        >
                                                            削除
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        itemKey={(item, idx) => item.id || `office-${idx}`}
                                    />

                                    <button
                                        onClick={addOfficeItem}
                                        className="mt-4 w-full bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-lg font-bold transition-colors"
                                    >
                                        + メニューを追加
                                    </button>
                                </div>
                            </section>
                        )}



                        {/* Audio (BGM) Section */}
                        {activeAdminTab === 'audio' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">BGM管理</h2>

                                {/* Intro Text Input */}
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <label className="block text-sm font-bold text-stone-700 mb-2">このタブの導入文（スキル紹介）</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg min-h-[120px]"
                                        value={data.settings?.audioIntro || ''}
                                        onChange={(e) => setData({ ...data, settings: { ...data.settings, audioIntro: e.target.value } })}
                                        placeholder="BGMに関する紹介文を入力してください"
                                    />
                                </div>

                                {/* Add New Audio Form */}
                                <div className="bg-stone-50 p-6 rounded-xl mb-6 border border-stone-200">
                                    <h3 className="font-bold mb-4 text-stone-700">🤖 Suno 作業用BGM設定</h3>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-stone-700 mb-2">YouTube URL</label>
                                        <input
                                            className="w-full border p-2 rounded"
                                            value={sunoBgmUrl}
                                            onChange={(e) => {
                                                setSunoBgmUrl(e.target.value);
                                                setData({ ...data!, settings: { ...data!.settings, sunoBgmUrl: e.target.value } });
                                            }}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                        <p className="mt-1 text-xs text-stone-600">
                                            ここにURLを入力すると、BGMタブの下部に「Suno 作業用BGM」セクションが表示されます。
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-stone-100 p-6 rounded-xl mb-8 border border-stone-200">
                                    <h3 className="font-bold mb-4 text-stone-700">新規BGM追加</h3>

                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded"
                                            value={newAudioTitle}
                                            onChange={(e) => setNewAudioTitle(e.target.value)}
                                            placeholder="タイトル (必須)"
                                        />

                                        <textarea
                                            className="w-full border p-2 rounded h-20"
                                            value={newAudioDescription}
                                            onChange={(e) => setNewAudioDescription(e.target.value)}
                                            placeholder="説明 (任意)"
                                        />

                                        <div className="border p-4 rounded bg-white">
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setNewAudioFile(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                            <p className="text-xs text-stone-700 mt-2">※ MP3ファイルのみ対応しています。</p>
                                        </div>

                                        <button
                                            onClick={handleAudioUpload}
                                            disabled={isUploadingAudio || !newAudioTitle || !newAudioFile}
                                            className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 font-bold"
                                        >
                                            {isUploadingAudio ? 'アップロード中...' : 'アップロードしてリストに追加'}
                                        </button>
                                    </div>
                                </div>

                                {/* Audio List */}
                                <div className="grid grid-cols-1 gap-4">
                                    {data.audioTracks && data.audioTracks.map((track) => (
                                        <div key={track.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-lg">{track.title}</p>
                                                    <p className="text-stone-700 text-sm">{track.description}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const index = data.audioTracks?.findIndex(t => t.id === track.id) ?? -1;
                                                            if (index >= 0) toggleFeatured('audioTracks', index);
                                                        }}
                                                        className={`px-3 py-1 rounded text-sm font-bold ${track.isFeatured ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                                    >
                                                        ★
                                                    </button>
                                                    <button
                                                        onClick={() => removeAudioTrack(track.id)}
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                            <audio controls src={track.url} className="w-full mt-2" />
                                            <p className="text-xs text-stone-600 mt-2 break-all">{track.url}</p>
                                        </div>
                                    ))}
                                    {(!data.audioTracks || data.audioTracks.length === 0) && (
                                        <p className="text-center text-stone-700 py-8">まだBGMが登録されていません。</p>
                                    )}
                                </div>
                            </section>
                        )}

                        <section className="mt-8 border-t pt-8">
                            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200 text-stone-900">処理ログ</h2>
                            <div className="bg-black/90 p-4 rounded-xl shadow-inner h-64 overflow-y-auto font-mono text-sm">
                                {logs.length === 0 ? (
                                    <div className="text-gray-500">まだログはありません...</div>
                                ) : (
                                    logs.map((log, i) => (
                                        <div key={i} className="text-green-400 border-b border-gray-800 pb-1 mb-1 last:border-0">
                                            {log}
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <div className="h-20"></div>
                    </div>
                </main>
            </div >

            {/* Mobile Fixed Save Button */}
            < div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 p-2 z-50 shadow-lg" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }
            }>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors font-medium text-xs"
                    >
                        保存
                    </button>
                    <button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 font-medium text-xs"
                    >
                        {isDeploying ? '公開中' : '公開'}
                    </button>
                </div>
            </div >
        </div >


    );
}
