// app/admin/page.tsx
'use client';

import { useState } from 'react';

interface Episode {
  title: string;
  file: File | null;
  publishDate: string;
  description: string;
  uploading: boolean;
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [episodes, setEpisodes] = useState<Episode[]>([{
    title: '',
    file: null,
    publishDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    description: '',
    uploading: false
  }]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
  };

  const addEpisodeSlot = () => {
    const lastDate = episodes[episodes.length - 1]?.publishDate || 
      new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    
    setEpisodes([...episodes, {
      title: '',
      file: null,
      publishDate: lastDate, // Use the same date as the previous episode
      description: '',
      uploading: false
    }]);
  };

  const removeEpisodeSlot = (index: number) => {
    if (episodes.length > 1) {
      setEpisodes(episodes.filter((_, i) => i !== index));
    }
  };

  const updateEpisode = (index: number, field: keyof Episode, value: string | File | null | boolean) => {
    setEpisodes(episodes.map((ep, i) => 
      i === index ? { ...ep, [field]: value } : ep
    ));
  };

  const uploadEpisode = async (index: number) => {
    const episode = episodes[index];
    if (!episode.file || !episode.title) return;

    updateEpisode(index, 'uploading', true);
    
    try {
      // Upload file to Vercel Blob
      const formData = new FormData();
      formData.append('file', episode.file);
      formData.append('password', password);

      const uploadResponse = await fetch('/api/upload-audio', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
      }
      
      const { url } = await uploadResponse.json();

      // Add episode to KV
      const addEpisodeResponse = await fetch('/api/add-episode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: episode.title,
          description: episode.description,
          audioUrl: url,
          pubDate: new Date(episode.publishDate).toISOString(),
          password
        })
      });

      if (!addEpisodeResponse.ok) {
        const errorText = await addEpisodeResponse.text();
        throw new Error(`Failed to add episode: ${addEpisodeResponse.status} ${addEpisodeResponse.statusText} - ${errorText}`);
      }

      // Clear this episode
      updateEpisode(index, 'title', '');
      updateEpisode(index, 'description', '');
      updateEpisode(index, 'file', null);
      
      alert(`Episode "${episode.title}" uploaded successfully!`);
      
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    }
    
    updateEpisode(index, 'uploading', false);
  };

  const uploadAll = async () => {
    for (const [index, episode] of episodes.entries()) {
      if (episode.file && episode.title && !episode.uploading) {
        await uploadEpisode(index);
      }
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Admin Access
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-6">
              Add New Episodes
            </h2>

            <div className="space-y-6">
              {episodes.map((episode, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Episode {index + 1}
                    </h3>
                    {episodes.length > 1 && (
                      <button
                        onClick={() => removeEpisodeSlot(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Episode Title
                      </label>
                      <input
                        type="text"
                        value={episode.title}
                        onChange={(e) => updateEpisode(index, 'title', e.target.value)}
                        className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter episode title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description (optional)
                      </label>
                      <textarea
                        value={episode.description}
                        onChange={(e) => updateEpisode(index, 'description', e.target.value)}
                        rows={2}
                        className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Brief description of this episode"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Publish Date
                      </label>
                      <input
                        type="datetime-local"
                        value={episode.publishDate}
                        onChange={(e) => updateEpisode(index, 'publishDate', e.target.value)}
                        className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Audio File
                    </label>
                    <input
                      type="file"
                      accept="audio/*,.m4a,.mp3,.wav,.aac,.ogg"
                      onChange={(e) => updateEpisode(index, 'file', e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300 dark:hover:file:bg-indigo-800"
                    />
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => uploadEpisode(index)}
                      disabled={episode.uploading || !episode.file || !episode.title}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800 dark:disabled:bg-gray-600"
                    >
                      {episode.uploading ? 'Uploading...' : 'Upload Episode'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={addEpisodeSlot}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                Add Another Episode
              </button>

              <button
                onClick={uploadAll}
                disabled={episodes.some(ep => ep.uploading) || !episodes.some(ep => ep.file && ep.title)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800 dark:disabled:bg-gray-600"
              >
                Upload All Episodes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}