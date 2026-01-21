import React, { useState, useEffect } from 'react';
import { getPresets } from '../services/graphqlService';
import { Preset } from '../types';
import SamplePackCard from '../components/SamplePackCard'; 
import ContentModal from '../components/ContentModal';

const PresetsPage: React.FC = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Preset | null>(null);

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await getPresets();
      setPresets(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2">Synth Presets</h1>
        <p className="text-brand-muted">Pro patches for your favorite software synthesizers.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-72 bg-white/5 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {presets.map(item => (
            <SamplePackCard 
              key={item.id} 
              pack={item as any} 
              onViewDetails={() => setSelectedItem(item)} 
            />
          ))}
        </div>
      )}

      {selectedItem && (
        <ContentModal 
          item={selectedItem as any} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};

export default PresetsPage;