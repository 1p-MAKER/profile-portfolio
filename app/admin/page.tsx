"use client";
import { useState, useEffect } from 'react';
import DraggableList from '@/components/DraggableList';

export default function Admin() {
    const [activeAdminTab, setActiveAdminTab] = useState('home');
    const [status, setStatus] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/content').then(res => res.json()).then(setData).catch(e => setStatus('読込エラー: ' + e.message));
    }, []);

    const updateLegal = (field: string, val: string) => {
        setData({ ...data, legalInfo: { ...data.legalInfo, [field]: val } });
    };

    const handleSave = async () => {
        if (!confirm('公開しますか？')) return;
        setIsDeploying(true); setStatus('保存中... ⏳');
        try {
            const res = await fetch('/api/update-content', { method: 'POST', body: JSON.stringify(data) });
            if (!res.ok) throw new Error('保存失敗');
            setStatus('✅ 公開完了！');
        } catch (e: any) { setStatus('❌ ' + e.message); } finally { setIsDeploying(false); }
    };

    if (!data) return <div className="p-10 text-center">読み込み中...</div>;

    return (
        <div className="min-h-screen bg-stone-50 p-4 pb-32 font-sans">
            <header className="fixed top-0 left-0 right-0 bg-white border-b p-3 flex justify-between items-center z-50 shadow-sm">
                <h1 className="font-bold text-stone-900">Portfolio Admin</h1>
                <button onClick={handleSave} disabled={isDeploying} className="bg-stone-900 text-white px-6 py-2 rounded-full font-bold text-sm">
                    {isDeploying ? '処理中...' : '公開する'}
                </button>
            </header>

            <div className="mt-16 max-w-2xl mx-auto">
                {status && <div className="p-4 mb-4 bg-white border rounded-lg shadow-sm text-sm">{status}</div>}

                <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
                    {['home', 'office', 'legal'].map(t => (
                        <button key={t} onClick={() => setActiveAdminTab(t)} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${activeAdminTab === t ? 'bg-stone-900 text-white' : 'bg-white'}`}>
                            {t === 'home' ? 'HOME' : t === 'office' ? 'Office' : '特商法表記'}
                        </button>
                    ))}
                </div>

                {activeAdminTab === 'home' && (
                    <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
                        <div><label className="text-xs font-bold text-stone-400">Site Title</label><input className="w-full border p-2 rounded" value={data.hero?.title} onChange={e => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} /></div>
                        <div><label className="text-xs font-bold text-stone-400">Description</label><textarea className="w-full border p-2 rounded h-32" value={data.hero?.description} onChange={e => setData({ ...data, hero: { ...data.hero, description: e.target.value } })} /></div>
                    </div>
                )}

                {activeAdminTab === 'legal' && (
                    <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
                        <h2 className="font-bold text-stone-900 mb-4">特定商取引法に基づく表記の編集</h2>
                        <div><label className="text-xs font-bold text-stone-400">販売業者名</label><input className="w-full border p-2 rounded" value={data.legalInfo?.businessName} onChange={e => updateLegal('businessName', e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-stone-400">お問い合わせメール</label><input className="w-full border p-2 rounded" value={data.legalInfo?.contactEmail} onChange={e => updateLegal('contactEmail', e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-stone-400">所在地・連絡先に関する文言</label><textarea className="w-full border p-2 rounded h-20" value={data.legalInfo?.addressInfo} onChange={e => updateLegal('addressInfo', e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-stone-400">発送・提供時期の説明</label><textarea className="w-full border p-2 rounded h-20" value={data.legalInfo?.shippingInfo} onChange={e => updateLegal('shippingInfo', e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-stone-400">返品・キャンセルに関する説明</label><textarea className="w-full border p-2 rounded h-24" value={data.legalInfo?.returnPolicy} onChange={e => updateLegal('returnPolicy', e.target.value)} /></div>
                    </div>
                )}
            </div>
        </div>
    );
}
