'use client';

import { useState, useEffect } from 'react';
import { ContentData, Product, TabItem } from '@/types/content';
import Image from 'next/image';

export default function AdminPage() {
    const [data, setData] = useState<ContentData | null>(null);
    const [status, setStatus] = useState<string>('');

    const [isDeploying, setIsDeploying] = useState(false);
    const [activeAdminTab, setActiveAdminTab] = useState<string>('3d-printer');

    // Furusato Item Input State


    const [newFurusatoUrl, setNewFurusatoUrl] = useState('');
    const [newFurusatoTitle, setNewFurusatoTitle] = useState('');
    const [newFurusatoImage, setNewFurusatoImage] = useState('');
    const [newFurusatoSite, setNewFurusatoSite] = useState('');
    const [isFetchingMeta, setIsFetchingMeta] = useState(false);

    // iOS App Input State
    const [newAppId, setNewAppId] = useState('');

    useEffect(() => {
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
                    ];

                }
                setData(fetchedData);
            });
    }, []);

    const [logs, setLogs] = useState<string[]>([]);

    const addLogEntry = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString('ja-JP');
        setLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
    };

    const handleSave = async () => {
        setStatus('保存中...');
        addLogEntry('保存処理を開始しました');
        try {
            const res = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setStatus('保存しました！');
                addLogEntry('データの保存に成功しました');
            } else {
                setStatus('保存に失敗しました');
                addLogEntry('エラー: データの保存に失敗しました');
            }
        } catch (e: unknown) {
            setStatus('エラーが発生しました');
            const msg = e instanceof Error ? e.message : String(e);
            addLogEntry(`エラー: ${msg}`);
        }
        setTimeout(() => setStatus(''), 3000);
    };

    const handleDeploy = async () => {
        if (!confirm('本当に公開しますか？\n（編集内容は自動で保存され、Gitへのコミットとプッシュが行われます）')) return;

        setIsDeploying(true);
        setStatus('公開処理中... ログを確認してください');
        addLogEntry('公開（デプロイ）処理を開始...');

        // Step 1: 自動保存
        addLogEntry('デプロイ前の自動保存を実行中...');
        try {
            const saveRes = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!saveRes.ok) {
                throw new Error('データの自動保存に失敗しました');
            }
            addLogEntry('データの自動保存完了。');
        } catch (e: unknown) {
            setStatus('保存エラー');
            const msg = e instanceof Error ? e.message : String(e);
            addLogEntry(`エラー: ${msg}`);
            setIsDeploying(false);
            return;
        }

        // Step 2: デプロイ実行
        try {
            const res = await fetch('/api/deploy', { method: 'POST' });
            const result = await res.json();

            // サーバーからのログを表示
            if (result.logs && Array.isArray(result.logs)) {
                result.logs.forEach((log: string) => addLogEntry(`SERVER: ${log}`));
            }

            if (res.ok) {
                setStatus('公開リクエスト完了！');
                addLogEntry('公開リクエストが正常に完了しました。Vercelでの反映を待ってください。');
            } else {
                setStatus('公開に失敗しました');
                addLogEntry('エラー: 公開処理に失敗しました。詳細は上記サーバログを確認してください。');
            }
        } catch (e: unknown) {
            setStatus('エラーが発生しました');
            const msg = e instanceof Error ? e.message : String(e);
            addLogEntry(`通信エラー: ${msg}`);
        }
        setIsDeploying(false);
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

                // 自動保存もしてしまう
                await fetch('/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newData)
                });
                addLogEntry('アップロード後のデータを自動保存しました');

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

    const updateProduct = (listName: 'leatherProducts' | 'shopifyApps' | 'snsAccounts', index: number, field: string, value: string) => {
        const newList = [...data[listName]];
        newList[index] = { ...newList[index], [field]: value };
        setData({ ...data, [listName]: newList });
    };

    const addProduct = (listName: 'leatherProducts' | 'shopifyApps' | 'snsAccounts') => {
        const newProduct: Product = { title: 'New Item', description: '', url: '', category: 'New' };
        setData({ ...data, [listName]: [...data[listName], newProduct] });
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

    return (
        <div className="min-h-screen bg-stone-50 p-8 pb-32">
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-primary">ポートフォリオ管理画面</h1>
                <div className="flex gap-4 items-center">
                    <span className="text-sm font-bold text-accent">{status}</span>
                    <button
                        onClick={handleSave}
                        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
                    >
                        保存する
                    </button>
                    <button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {isDeploying ? '公開中...' : '公開する'}
                    </button>
                </div>
            </header>

            <div className="flex pt-20 h-screen">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-white border-r border-stone-200 fixed left-0 top-20 bottom-0 overflow-y-auto p-4 z-40">
                    <nav className="space-y-1">
                        {(data.tabs ? [...data.tabs, { id: 'tab-order', label: 'タブ表示順設定' }] : []).map((item) => (
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

                <main className="flex-1 ml-64 p-8 overflow-y-auto bg-stone-50 pb-32">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* 3D Printer Gallery Section */}
                        {activeAdminTab === '3d-printer' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">3Dプリンタ画像</h2>
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        {data.printImages.map((src, index) => (
                                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-stone-100">
                                                <Image src={src} alt="gallery" fill className="object-cover" />
                                                <button
                                                    onClick={() => {
                                                        const newImages = [...data.printImages];
                                                        newImages.splice(index, 1);
                                                        setData({ ...data, printImages: newImages });
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <label className="cursor-pointer bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-lg inline-block transition-colors">
                                        <span>+ 画像を追加する</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </section>
                        )}

                        {/* Leather Products Section */}
                        {activeAdminTab === 'leather' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">革製品リスト</h2>
                                {data.leatherProducts.map((item, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm mb-4">
                                        <div className="grid gap-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input className="border p-2 rounded" value={item.title} onChange={(e) => updateProduct('leatherProducts', index, 'title', e.target.value)} placeholder="タイトル" />
                                                <input className="border p-2 rounded" value={item.category} onChange={(e) => updateProduct('leatherProducts', index, 'category', e.target.value)} placeholder="カテゴリ (例: Leather Craft)" />
                                            </div>
                                            <input className="border p-2 rounded" value={item.url} onChange={(e) => updateProduct('leatherProducts', index, 'url', e.target.value)} placeholder="URL" />
                                            <textarea className="border p-2 rounded h-24" value={item.description} onChange={(e) => updateProduct('leatherProducts', index, 'description', e.target.value)} placeholder="説明" />
                                            <div className="flex justify-end">
                                                <button onClick={() => removeProduct('leatherProducts', index)} className="text-red-500 text-sm">削除</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => addProduct('leatherProducts')} className="w-full py-3 border-2 border-dashed border-stone-300 text-stone-500 rounded-xl hover:bg-stone-50 transition-colors">
                                    + アイテムを追加
                                </button>
                            </section>
                        )}

                        {/* SNS Section */}
                        {activeAdminTab === 'sns' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">SNSリスト</h2>
                                {data.snsAccounts.map((item, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm mb-4">
                                        <div className="grid gap-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input className="border p-2 rounded" value={item.title} onChange={(e) => updateProduct('snsAccounts', index, 'title', e.target.value)} placeholder="タイトル" />
                                                <input className="border p-2 rounded" value={item.category} onChange={(e) => updateProduct('snsAccounts', index, 'category', e.target.value)} placeholder="カテゴリ (例: SNS)" />
                                            </div>
                                            <input className="border p-2 rounded" value={item.url} onChange={(e) => updateProduct('snsAccounts', index, 'url', e.target.value)} placeholder="URL" />
                                            <textarea className="border p-2 rounded h-24" value={item.description} onChange={(e) => updateProduct('snsAccounts', index, 'description', e.target.value)} placeholder="説明" />
                                            <div className="flex justify-end">
                                                <button onClick={() => removeProduct('snsAccounts', index)} className="text-red-500 text-sm">削除</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => addProduct('snsAccounts')} className="w-full py-3 border-2 border-dashed border-stone-300 text-stone-500 rounded-xl hover:bg-stone-50 transition-colors">
                                    + アイテムを追加
                                </button>
                            </section>
                        )}

                        {/* Shopify Section */}
                        {activeAdminTab === 'shopify' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">Shopifyアプリリスト</h2>
                                {data.shopifyApps.map((item, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm mb-4">
                                        <div className="grid gap-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input className="border p-2 rounded" value={item.title} onChange={(e) => updateProduct('shopifyApps', index, 'title', e.target.value)} placeholder="タイトル" />
                                                <input className="border p-2 rounded" value={item.category} onChange={(e) => updateProduct('shopifyApps', index, 'category', e.target.value)} placeholder="カテゴリ (例: Shopify App)" />
                                            </div>
                                            <input className="border p-2 rounded" value={item.url} onChange={(e) => updateProduct('shopifyApps', index, 'url', e.target.value)} placeholder="URL" />
                                            <textarea className="border p-2 rounded h-24" value={item.description} onChange={(e) => updateProduct('shopifyApps', index, 'description', e.target.value)} placeholder="説明" />
                                            <div className="flex justify-end">
                                                <button onClick={() => removeProduct('shopifyApps', index)} className="text-red-500 text-sm">削除</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => addProduct('shopifyApps')} className="w-full py-3 border-2 border-dashed border-stone-300 text-stone-500 rounded-xl hover:bg-stone-50 transition-colors">
                                    + アイテムを追加
                                </button>
                            </section>
                        )}

                        {/* Furusato Nozei Section */}
                        {activeAdminTab === 'furusato' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">ふるさと納税リスト</h2>

                                {/* Add New Item Form */}
                                <div className="bg-stone-100 p-6 rounded-xl mb-8 border border-stone-200">
                                    <h3 className="font-bold mb-4 text-stone-700">新規追加</h3>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            className="flex-grow border p-2 rounded"
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
                                                <div className="w-24 h-24 bg-stone-100 rounded flex items-center justify-center text-xs text-stone-400">
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
                                                    <div className="flex items-center justify-center h-full text-xs text-stone-400">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-grow grid gap-2">
                                                <input
                                                    className="border p-2 rounded text-sm font-bold"
                                                    value={item.title}
                                                    onChange={(e) => updateFurusatoItem(index, 'title', e.target.value)}
                                                />
                                                <input
                                                    className="border p-2 rounded text-xs text-stone-500"
                                                    value={item.url}
                                                    onChange={(e) => updateFurusatoItem(index, 'url', e.target.value)}
                                                />
                                            </div>
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
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">iOSアプリリスト</h2>
                                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                                    <div className="space-y-3">

                                        {data.iosApps.map((app, index) => (
                                            <div key={`${app.id}-${index}`} className="flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-200">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-stone-800">{app.name}</span>
                                                    <span className="font-mono text-xs text-stone-500">ID: {app.id}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => moveAppId(index, 'up')}
                                                        disabled={index === 0}
                                                        className="p-2 text-sm bg-white border rounded hover:bg-stone-100 disabled:opacity-30"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        onClick={() => moveAppId(index, 'down')}
                                                        disabled={index === data.iosApps.length - 1}
                                                        className="p-2 text-sm bg-white border rounded hover:bg-stone-100 disabled:opacity-30"
                                                    >
                                                        ↓
                                                    </button>
                                                    <button
                                                        onClick={() => removeAppId(index)}
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded ml-2"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>

                                <div className="flex gap-2 bg-stone-100 p-4 rounded-xl border border-stone-200">
                                    <input
                                        className="flex-grow border p-2 rounded"
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

                        {/* Tab Order Settings */}
                        {activeAdminTab === 'tab-order' && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">タブの表示順設定</h2>
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <div className="space-y-2">
                                        {data.tabs?.map((tab: TabItem, index: number) => (
                                            <div key={tab.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200">
                                                <span className="font-bold text-stone-700">{tab.label}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            if (index === 0) return;
                                                            const newTabs = [...data.tabs];
                                                            [newTabs[index - 1], newTabs[index]] = [newTabs[index], newTabs[index - 1]];
                                                            setData({ ...data, tabs: newTabs });
                                                        }}
                                                        disabled={index === 0}
                                                        className="p-2 text-sm bg-white border rounded hover:bg-stone-100 disabled:opacity-30"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (index === data.tabs.length - 1) return;
                                                            const newTabs = [...data.tabs];
                                                            [newTabs[index + 1], newTabs[index]] = [newTabs[index], newTabs[index + 1]];
                                                            setData({ ...data, tabs: newTabs });
                                                        }}
                                                        disabled={index === data.tabs.length - 1}
                                                        className="p-2 text-sm bg-white border rounded hover:bg-stone-100 disabled:opacity-30"
                                                    >
                                                        ↓
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-xs text-stone-500">※矢印ボタンで表示順を入れ替えられます。</p>
                                </div>
                            </section>
                        )}

                        <section className="mt-8 border-t pt-8">
                            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">処理ログ</h2>
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
        </div >

    );
}
