import React, { useState, useEffect } from 'react';
import { getPlugins } from '../services/graphqlService';
import { Plugin } from '../types';
import SamplePackCard from '../components/SamplePackCard';
import ContentModal from '../components/ContentModal';

const PluginsPage: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Plugin | null>(null);

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await getPlugins();
      setPlugins(data);
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
        <h1 className="text-4xl font-black mb-2">Free Plugins</h1>
        <p className="text-brand-muted">Essential tools for your DAW, handpicked by our team.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-72 bg-white/5 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {plugins.map(item => (
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

export default PluginsPage;