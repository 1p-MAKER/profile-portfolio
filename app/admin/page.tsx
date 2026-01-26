"use client";
import { useState, useEffect } from 'react';
import DraggableList from '@/components/DraggableList';

export default function Admin() {
    const [activeAdminTab, setActiveAdminTab] = useState('home');
    const [status, setStatus] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    const [data, setData] = useState<any>(null);
    const [sketchItems, setSketchItems] = useState<any[]>([]);

    const [newNoteUrl, setNewNoteUrl] = useState('');
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteImage, setNewNoteImage] = useState('');
    const [isFetchingMeta, setIsFetchingMeta] = useState(false);

    useEffect(() => {
        fetch('/api/data').then(res => res.json()).then(setData).catch(e => setStatus('読込エラー: ' + e.message));
        fetch('/api/sketch-mark').then(res => res.json()).then(json => { if (json.items) setSketchItems(json.items); }).catch(console.error);
    }, []);

    const addGeneral = (key: string) => {
        const newItem = { id: Date.now().toString(), title: '', url: '', imageUrl: '', description: '', isFeatured: false, price: '' };
        setData({ ...data, [key]: [newItem, ...(data[key] || [])] });
    };

    const removeGeneral = (key: string, idx: number) => {
        const list = [...(data[key] || [])];
        list.splice(idx, 1);
        setData({ ...data, [key]: list });
    };

    const updateGeneral = (key: string, idx: number, field: string, val: any) => {
        const list = [...(data[key] || [])];
        list[idx] = { ...list[idx], [field]: val };
        setData({ ...data, [key]: list });
    };

    const toggleFeatured = (key: string, idx: number) => {
        const list = [...(data[key] || [])];
        list[idx] = { ...list[idx], isFeatured: !list[idx].isFeatured };
        setData({ ...data, [key]: list });
    };

    const updateLegal = (field: string, val: string) => {
        setData({ ...data, legalInfo: { ...data.legalInfo, [field]: val } });
    };

    const handleSave = async () => {
        if (!confirm('公開しますか？')) return;
        setIsDeploying(true); setStatus('保存中... ⏳');
        try {
            const res = await fetch('/api/data', { method: 'POST', body: JSON.stringify(data) });
            if (!res.ok) throw new Error('保存失敗');
            setStatus('✅ 公開完了！');
        } catch (e: any) { setStatus('❌ ' + e.message); } finally { setIsDeploying(false); }
    };

    if (!data) return <div className="p-10 text-center animate-pulse">読み込み中...</div>;

    const TABS = [
        { id: 'home', label: 'HOME' },
        { id: 'office', label: 'Office', k: 'officeServices' },
        { id: 'ios', label: 'iOS', k: 'iosApps' },
        { id: 'leather', label: 'Leather', k: 'leatherProducts' },
        { id: 'note', label: 'Note', k: 'noteItems' },
        { id: 'video', label: 'Video', k: 'videoProductionVideos' },
        { id: 'youtube', label: 'YouTube', k: 'youtubeVideos' },
        { id: 'bgm', label: 'BGM', k: 'bgmAudio' },
        { id: 'sketchMark', label: 'Sketch' },
        { id: '3d', label: '3D', k: 'printImages' },
        { id: 'sns', label: 'SNS', k: 'snsAccounts' },
        { id: 'legal', label: '特商法' }
    ];
    const cur = TABS.find(t => t.id === activeAdminTab);

    return (
        <div className="min-h-screen bg-stone-50 p-4 pb-32 font-sans">
            <header className="fixed top-0 left-0 right-0 bg-white border-b p-3 flex justify-between items-center z-50 shadow-sm">
                <h1 className="font-bold text-stone-900">Dev cat&apos;s Admin</h1>
                <button onClick={handleSave} disabled={isDeploying} className="bg-stone-900 text-white px-6 py-2 rounded-full font-bold text-sm">
                    {isDeploying ? '処理中...' : '公開する'}
                </button>
            </header>

            <div className="mt-16 max-w-4xl mx-auto">
                {status && <div className="p-4 mb-4 bg-white border rounded-lg shadow-sm text-sm border-stone-200">{status}</div>}

                <div className="flex gap-2 overflow-x-auto mb-6 pb-2 sticky top-16 bg-stone-50 z-40 py-2">
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setActiveAdminTab(t.id)} className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${activeAdminTab === t.id ? 'bg-stone-900 text-white' : 'bg-white text-stone-600'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Home / Profile */}
                {activeAdminTab === 'home' && (
                    <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
                        <div><label className="text-xs font-bold text-stone-400">Main Title</label><input className="w-full border p-2 rounded" value={data.hero?.title} onChange={e => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} /></div>
                        <div><label className="text-xs font-bold text-stone-400">Description</label><textarea className="w-full border p-2 rounded h-32" value={data.hero?.description} onChange={e => setData({ ...data, hero: { ...data.hero, description: e.target.value } })} /></div>
                    </div>
                )}

                {/* Legal (特商法) */}
                {activeAdminTab === 'legal' && (
                    <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
                        <h2 className="font-bold border-b pb-2">特定商取引法に基づく表記の編集</h2>
                        <div><label className="text-xs font-bold text-stone-400">販売業者名</label><input className="w-full border p-2 rounded" value={data.legalInfo?.businessName} onChange={e => updateLegal('businessName', e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-stone-400">連絡先メール</label><input className="w-full border p-2 rounded" value={data.legalInfo?.contactEmail} onChange={e => updateLegal('contactEmail', e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-stone-400">所在地・連絡先開示文言</label><textarea className="w-full border p-2 rounded h-20" value={data.legalInfo?.addressInfo} onChange={e => updateLegal('addressInfo', e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-stone-400">発送・提供時期の説明</label><textarea className="w-full border p-2 rounded h-20" value={data.legalInfo?.shippingInfo} onChange={e => updateLegal('shippingInfo', e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-stone-400">返品・キャンセル説明</label><textarea className="w-full border p-2 rounded h-20" value={data.legalInfo?.returnPolicy} onChange={e => updateLegal('returnPolicy', e.target.value)} /></div>
                    </div>
                )}

                {/* Sketch Mark */}
                {activeAdminTab === 'sketchMark' && (
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-96 overflow-y-auto">
                            {sketchItems.map(item => {
                                const sel = (data.featuredSketchMarkIds || []).includes(item.id);
                                return (
                                    <div key={item.id} onClick={() => {
                                        const ids = data.featuredSketchMarkIds || [];
                                        setData({ ...data, featuredSketchMarkIds: sel ? ids.filter((i: any) => i !== item.id) : [...ids, item.id] });
                                    }} className={`relative aspect-square border-2 rounded-lg overflow-hidden cursor-pointer ${sel ? 'border-blue-500 ring-2' : 'border-transparent'}`}>
                                        <img src={item.imageUrl} className="object-cover w-full h-full" alt="" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* 汎用リストタブ (Office, iOS, Leather, Note, Video, etc) */}
                {cur && cur.k && activeAdminTab !== 'sketchMark' && (
                    <div className="space-y-4">
                        <button onClick={() => addGeneral(cur.k!)} className="w-full py-4 border-2 border-dashed border-stone-300 text-stone-400 rounded-xl font-bold hover:bg-stone-50">+ アイテムを追加</button>
                        <DraggableList items={data[cur.k] || []} onReorder={l => setData({ ...data, [cur.k!]: l })} itemKey={(i: any) => i.id} renderItem={(item, idx) => (
                            <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3 relative border-stone-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-stone-300">#{idx + 1}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => toggleFeatured(cur.k!, idx)} className={`text-[10px] px-2 py-1 rounded-full border ${item.isFeatured ? 'bg-yellow-400 text-white border-yellow-500' : 'bg-white text-stone-400'}`}>Featured</button>
                                        <button onClick={() => removeGeneral(cur.k!, idx)} className="text-[10px] text-red-500 border border-red-100 px-2 py-1 rounded-full">削除</button>
                                    </div>
                                </div>
                                <input className="w-full border-b p-1 font-bold outline-none text-stone-800" value={item.title} onChange={e => updateGeneral(cur.k!, idx, 'title', e.target.value)} placeholder="タイトル" />
                                {activeAdminTab === 'office' && <input className="w-full border p-2 rounded text-sm" value={item.price} onChange={e => updateGeneral(cur.k!, idx, 'price', e.target.value)} placeholder="価格 (例: 2,500)" />}
                                <input className="w-full border p-2 rounded text-xs font-mono text-blue-600" value={item.url || item.link} onChange={e => updateGeneral(cur.k!, idx, item.link !== undefined ? 'link' : 'url', e.target.value)} placeholder="URL" />
                                <textarea className="w-full border p-2 rounded text-sm h-20" value={item.description} onChange={e => updateGeneral(cur.k!, idx, 'description', e.target.value)} placeholder="説明文" />
                                {item.imageUrl && <div className="h-16 w-16 relative"><img src={item.imageUrl} className="object-cover w-full h-full rounded shadow-sm" alt="" /></div>}
                            </div>
                        )} />
                    </div>
                )}
            </div>
        </div>
    );
}
