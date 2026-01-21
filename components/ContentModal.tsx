import React, { useState, useEffect } from 'react';
import { SamplePack, Comment } from '../types';
import { getComments, addComment } from '../services/graphqlService';
import Button from './Button';
import { CloseIcon } from '../constants';

interface ContentModalProps {
  item: SamplePack;
  onClose: () => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ item, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getComments(item.slug).then(setComments).finally(() => setLoading(false));
    
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [item.slug, onClose]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.text.trim()) return;
    setSubmitting(true);
    try {
      const name = newComment.name.trim() || 'Anonymous';
      const res = await addComment(item.slug, name, newComment.text);
      setComments([res, ...comments]);
      setNewComment({ name: '', text: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const coverUrl = item.coverArt?.[0]?.url || 'https://via.placeholder.com/600';

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-brand-dark/95 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative bg-brand-panel-light border border-white/10 w-full max-w-5xl max-h-[92vh] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button - Always visible */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-brand-dark/60 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-all z-50 border border-white/10 shadow-lg"
        >
          <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Image Section - Strict containment logic */}
        <div className="w-full md:w-5/12 lg:w-4/12 flex items-center justify-center bg-black/40 relative overflow-hidden shrink-0 h-[35vh] md:h-auto">
          {/* Ambient Glow Backdrop (derived from image) */}
          <div 
            className="absolute inset-0 opacity-20 blur-3xl scale-150 pointer-events-none"
            style={{ backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          
          <div className="relative z-10 w-full h-full p-4 sm:p-8 flex items-center justify-center">
            <img 
              src={coverUrl} 
              alt={item.name} 
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl transition-all duration-700" 
            />
          </div>
        </div>

        {/* Content Section - Priority Layout */}
        <div className="flex-1 min-w-0 p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar flex flex-col bg-brand-panel-light/40">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {(item.genre as string[] || []).map(g => (
                <span key={g} className="px-2.5 py-0.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-[9px] sm:text-[10px] font-black text-brand-cyan uppercase tracking-widest">{g}</span>
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-1 text-white leading-tight break-words tracking-tighter">{item.name}</h2>
            
            <div className="mt-5 bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/5 shadow-inner">
               <p className="text-brand-muted leading-relaxed text-sm sm:text-base">{item.description}</p>
            </div>
          </div>

          <div className="mb-8">
            <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button size="lg" className="w-full py-5 text-lg font-black rounded-xl sm:rounded-2xl shadow-xl shadow-brand-cyan/10 active:scale-[0.98]">
                Download Free Pack
              </Button>
            </a>
          </div>

          <div className="pt-6 border-t border-white/5 mt-auto">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
              Discussion 
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-brand-muted font-black">{comments.length}</span>
            </h3>
            
            <form onSubmit={handleCommentSubmit} className="space-y-3 mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text"
                  placeholder="Your Name" 
                  className="w-full sm:w-1/3 px-4 py-2 bg-brand-dark/60 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-brand-cyan transition text-sm"
                  value={newComment.name} 
                  onChange={e => setNewComment({...newComment, name: e.target.value})}
                />
                <div className="flex flex-1 gap-2">
                  <input 
                    type="text"
                    placeholder="Join the conversation..." 
                    className="flex-1 px-4 py-2 bg-brand-dark/60 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-brand-cyan transition text-sm"
                    value={newComment.text} 
                    onChange={e => setNewComment({...newComment, text: e.target.value})}
                    required
                  />
                  <Button type="submit" isLoading={submitting} className="rounded-xl px-5 py-2 shrink-0">Post</Button>
                </div>
              </div>
            </form>

            <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="space-y-2">
                  {[1,2].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl"></div>)}
                </div>
              ) : comments.length > 0 ? (
                comments.map(c => (
                  <div key={c.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/[0.07] transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-brand-cyan text-[10px] uppercase tracking-wider">{c.name}</span>
                      <span className="text-[9px] text-brand-muted font-medium">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-brand-text leading-relaxed">{c.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
                  <p className="text-brand-muted italic text-[11px] font-bold opacity-50 uppercase tracking-widest">No comments yet. Start the buzz!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;