import { useState, useEffect } from 'react';

let _push = null;
export const toast = {
  success: (msg) => _push?.('success', msg),
  error: (msg) => _push?.('error', msg),
};

export const ToastContainer = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    _push = (type, msg) => {
      const id = Date.now();
      setList(p => [...p, { id, type, msg }]);
      setTimeout(() => setList(p => p.filter(t => t.id !== id)), 3000);
    };
    return () => { _push = null; };
  }, []);
  if (!list.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
      {list.map(t => (
        <div key={t.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 min-w-[260px]">
          {t.type === 'success'
            ? <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            : <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          }
          <span className="text-sm text-gray-800 font-medium">{t.msg}</span>
        </div>
      ))}
    </div>
  );
};
