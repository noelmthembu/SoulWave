
import React, { useState, useMemo, useEffect } from 'react';
import { getSamplePacks, getCommentsForPack, addComment } from '../services/graphqlService';
import { getUserCredits, useCredit } from '../services/supabaseService';
import { generateCommentWithGemini } from '../services/geminiService';
import SamplePackCard from '../components/SamplePackCard';
import Input from '../components/Input';
import { SamplePack, Comment } from '../types';
import Button from '../components/Button';
import { CloseIcon } from '../constants';

const Hero: React.FC = () => {
    const scrollToPacks = () => {
        const packsSection = document.getElementById('packs-section');
        packsSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="text-center py-16 md:py-24 rounded-lg bg-gradient-to-br from-brand-light-dark to-brand-dark mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Craft Your <span className="text-brand-cyan">Signature Sound</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Discover thousands of royalty-free sample packs, loops, and presets to elevate your music production. All completely free.
            </p>
            <button
                onClick={scrollToPacks}
                className="mt-8 inline-block bg-brand-cyan text-brand-dark font-bold py-3 px-8 rounded-md hover:bg-cyan-300 transition-colors text-lg"
            >
                Explore Packs
            </button>
        </div>
    );
};

const HomePage: React.FC = () => {
    const [packs, setPacks] = useState<SamplePack[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedPack, setSelectedPack] = useState<SamplePack | null>(null);
    
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [creditsRemaining, setCreditsRemaining] = useState(10);
    const [userIdentifier, setUserIdentifier] = useState('');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    useEffect(() => {
        const fetchPacks = async () => {
            try {
                setError(null);
                setLoading(true);
                const data = await getSamplePacks();
                setPacks(data);
            } catch (err: any) {
                console.error("Error fetching sample packs:", err);
                setError(err.message || 'Failed to load sample packs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPacks();
    }, []);

    useEffect(() => {
      let identifier = localStorage.getItem('userIdentifier');
      if (!identifier) {
        identifier = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('userIdentifier', identifier);
      }
      setUserIdentifier(identifier);

      getUserCredits(identifier).then(credits => {
        setCreditsRemaining(credits);
      });
    }, []);

    useEffect(() => {
      const fetchComments = async () => {
        if (!selectedPack) return;
        setCommentsLoading(true);
        try {
          const packComments = await getCommentsForPack(selectedPack.id);
          setComments(packComments);
        } catch (error) {
          console.error('Failed to fetch comments');
        } finally {
          setCommentsLoading(false);
        }
      };
      fetchComments();
    }, [selectedPack]);
    
    const allGenres = useMemo(() => ['All', ...new Set(packs.flatMap(p => p.genre))], [packs]);

    const filteredPacks = useMemo(() => {
        return packs.filter(pack => {
            const matchesGenre = selectedGenre === 'All' || pack.genre.includes(selectedGenre);
            const matchesSearch = searchTerm === '' ||
                pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pack.creator.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesGenre && matchesSearch;
        });
    }, [searchTerm, selectedGenre, packs]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim() || !selectedPack) return;

      setIsSubmittingComment(true);
      try {
        const addedComment = await addComment({ packId: selectedPack.id, text: newComment, author: 'GuestUser' });
        setComments(prev => [addedComment, ...prev]);
        setNewComment('');
      } catch (error) {
        console.error("Failed to submit comment");
      } finally {
        setIsSubmittingComment(false);
      }
    };

    const handleGenerateAIComment = async () => {
      if (!selectedPack) return;

      if (creditsRemaining <= 0) {
        alert('No credits remaining! You cannot generate more AI comments.');
        return;
      }

      setIsGeneratingAI(true);
      try {
        const success = await useCredit(userIdentifier);
        if (!success) {
          alert('Failed to use credit. Please try again.');
          return;
        }

        const aiText = await generateCommentWithGemini(selectedPack);
        const addedComment = await addComment({ packId: selectedPack.id, text: aiText, author: 'AI Assistant' });

        setComments(prev => [addedComment, ...prev]);
        const newCredits = await getUserCredits(userIdentifier);
        setCreditsRemaining(newCredits);
      } catch (error) {
        console.error("Failed to generate AI comment");
        alert('Failed to generate AI comment. Please try again.');
      } finally {
        setIsGeneratingAI(false);
      }
    }

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
            setSelectedPack(null);
           }
        };
        window.addEventListener('keydown', handleEsc);
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
      }, []);

    return (
        <div className="space-y-8">
            <Hero />

            <div id="packs-section" className="space-y-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {allGenres.map(genre => (
                            <button
                                key={genre}
                                onClick={() => setSelectedGenre(genre)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                                    selectedGenre === genre
                                        ? 'bg-brand-cyan text-brand-dark'
                                        : 'bg-brand-light-dark hover:bg-gray-700'
                                }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>

                    <div className="w-full md:w-1/3">
                        <Input 
                            type="search"
                            id="search"
                            label=""
                            placeholder="Search packs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-cyan mx-auto"></div>
                        <p className="mt-4 text-gray-400">Loading sample packs...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12 bg-red-900/20 text-red-400 p-4 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {filteredPacks.map(pack => (
                                <SamplePackCard 
                                    key={pack.id} 
                                    pack={pack} 
                                    onViewDetails={() => setSelectedPack(pack)}
                                />
                            ))}
                        </div>
                        {filteredPacks.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-400">No sample packs found. Try a different search or category!</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedPack && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" 
                    onClick={() => setSelectedPack(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="pack-title"
                >
                    <div className="max-w-4xl max-h-[90vh] w-full bg-brand-light-dark rounded-lg shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-8 grid md:grid-cols-2 gap-8 md:gap-12 relative overflow-y-auto">
                            <button onClick={() => setSelectedPack(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10" aria-label="Close dialog">
                               <CloseIcon className="w-6 h-6"/>
                            </button>
                             <div>
                                {selectedPack.coverArt ? (
                                    <img src={selectedPack.coverArt} alt={selectedPack.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                                ) : (
                                    <div className="w-full aspect-square bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center rounded-lg shadow-lg">
                                        <span className="text-gray-500 text-6xl">♪</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <div>
                                    <h1 id="pack-title" className="text-4xl font-bold text-white">{selectedPack.name}</h1>
                                    <p className="text-lg text-gray-400 mt-1">by {selectedPack.creator}</p>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    {selectedPack.genre.map((g) => (
                                        <span key={g} className="px-3 py-1 bg-gray-700 text-sm text-gray-300 rounded-full">{g}</span>
                                    ))}
                                </div>
                                <p className="mt-6 text-gray-300 ">{selectedPack.longDescription}</p>
                                <div className="mt-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold text-white">Comments</h2>
                                        <div className="text-sm">
                                            <span className="text-gray-400">AI Credits: </span>
                                            <span className="text-brand-cyan font-bold">{creditsRemaining}</span>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <Button
                                            onClick={handleGenerateAIComment}
                                            isLoading={isGeneratingAI}
                                            disabled={creditsRemaining <= 0}
                                            className="w-full mb-3"
                                        >
                                            {creditsRemaining > 0 ? '✨ Generate AI Comment' : '🚫 No Credits Left'}
                                        </Button>
                                    </div>
                                    <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
                                        <Input
                                          id="newComment"
                                          label=""
                                          type="text"
                                          placeholder="Add a comment..."
                                          value={newComment}
                                          onChange={e => setNewComment(e.target.value)}
                                          className="flex-grow"
                                          required
                                        />
                                        <Button type="submit" isLoading={isSubmittingComment}>Post</Button>
                                    </form>
                                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                        {commentsLoading ? (
                                          <p className="text-gray-400">Loading comments...</p>
                                        ) : comments.length > 0 ? (
                                            comments.map(comment => (
                                                <div key={comment.id} className={`p-3 rounded-lg ${comment.author === 'AI Assistant' ? 'bg-gradient-to-r from-cyan-900/30 to-brand-dark border border-brand-cyan/30' : 'bg-brand-dark'}`}>
                                                    <div className="flex items-start gap-2">
                                                        {comment.author === 'AI Assistant' && <span className="text-brand-cyan text-sm">✨</span>}
                                                        <div className="flex-1">
                                                            <p className="text-gray-300">{comment.text}</p>
                                                            <p className="text-xs text-gray-500 mt-1 text-right">
                                                                by {comment.author} on {new Date(comment.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No comments yet. Be the first!</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 pt-0 mt-auto">
                            <a href={selectedPack.downloadUrl} download className="block">
                                <Button size="lg" className="w-full">
                                    Download Now
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
