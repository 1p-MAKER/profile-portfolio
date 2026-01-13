'use client';

import { useState, useEffect } from 'react';
import { ContentData, Product } from '@/types/content';
import Image from 'next/image';

export default function AdminPage() {
    const [data, setData] = useState<ContentData | null>(null);
    const [status, setStatus] = useState<string>('');
    const [isDeploying, setIsDeploying] = useState(false);

    useEffect(() => {
        fetch('/api/data')
            .then(res => res.json())
            .then(fetchedData => {
                if (!fetchedData.tabs) {
                    fetchedData.tabs = [
                        { id: 'leather', label: '革製品' },
                        { id: 'ios', label: 'iOSアプリ' },
                        { id: 'shopify', label: 'Shopifyアプリ' },
                        { id: '3d-printer', label: '3Dプリンタ' },
                        { id: 'sns', label: 'SNS' },
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
        } catch (e) {
            setStatus('エラーが発生しました');
            addLogEntry(`エラー: ${e}`);
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
        } catch (e: any) {
            setStatus('保存エラー');
            addLogEntry(`エラー: ${e.message}`);
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
        } catch (e) {
            setStatus('エラーが発生しました');
            addLogEntry(`通信エラー: ${e}`);
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
        } catch (e) {
            setStatus('アップロード失敗');
            addLogEntry(`エラー: ${e}`);
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

            <div className="max-w-4xl mx-auto mt-20 space-y-12">

                {/* 3D Printer Gallery Section */}
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

                {/* Leather Products Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">革製品リスト</h2>
                    {data.leatherProducts.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm mb-4">
                            <div className="grid gap-3">
                                <input className="border p-2 rounded" value={item.title} onChange={(e) => updateProduct('leatherProducts', index, 'title', e.target.value)} placeholder="タイトル" />
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

                {/* SNS Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">SNSリスト</h2>
                    {data.snsAccounts.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm mb-4">
                            <div className="grid gap-3">
                                <input className="border p-2 rounded" value={item.title} onChange={(e) => updateProduct('snsAccounts', index, 'title', e.target.value)} placeholder="タイトル" />
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

                {/* Shopify Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">Shopifyアプリリスト</h2>
                    {data.shopifyApps.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm mb-4">
                            <div className="grid gap-3">
                                <input className="border p-2 rounded" value={item.title} onChange={(e) => updateProduct('shopifyApps', index, 'title', e.target.value)} placeholder="タイトル" />
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

                <section>
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-stone-200">タブの表示順設定</h2>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="space-y-2">
                            {/* @ts-ignore: Temporary ignore for rapid prototyping if types aren't perfectly synced yet */}
                            {data.tabs?.map((tab: any, index: number) => (
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

                <section>
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
        </div>
    );
}
