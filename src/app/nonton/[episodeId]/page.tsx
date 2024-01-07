'use client';
import Frame from '@/components/Frame';
import Frame2 from '@/components/Frame2';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ListEpisodeContext } from '@/context/ListEpisodeCtx';
import Image from 'next/image';
import loadingGif from '@/assets/loading.gif';

interface Episode {
  title: string;
  link: string;
}

const Page = ({ params }: { params: { episodeId: string } }) => {
  const [episode, setEpisode] = useState<Episode | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedQuality, setSelectedQuality] = useState<string>('480p');
  const [showMessage, setShowMessage] = useState<boolean>(true); // State untuk menunjukkan atau menyembunyikan pesan
  const { setLists } = useContext(ListEpisodeContext);

  const getEpisode = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/episode/${params.episodeId}`);
      setEpisode(data.data);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEpisode();
    const lists = localStorage.getItem('lists');
    if (lists) setLists(JSON.parse(lists));
  }, []);

  const handlePrevEpisode = () => {
    const currentUrl = window.location.href;

    // Mengekstrak nomor episode dari URL
    const episodeNumberMatch = currentUrl.match(/episode-(\d+)/);
    if (episodeNumberMatch) {
      // Mendapatkan nomor episode saat ini
      const currentEpisodeNumber = parseInt(episodeNumberMatch[1]);

      // Menghitung nomor episode sebelumnya
      const prevEpisodeNumber = currentEpisodeNumber - 1;

      // Membuat URL baru dengan nomor episode sebelumnya
      const newUrl = currentUrl.replace(
        episodeNumberMatch[0],
        `episode-${prevEpisodeNumber}`
      );

      // Navigasi ke URL baru
      window.location.href = newUrl;
    } else {
      // Handle jika format episode tidak ditemukan pada URL
      console.error("Format episode tidak ditemukan pada URL");
    }
  };


  const handleNextEpisode = () => {
    const currentUrl = window.location.href;

    // Mengekstrak nomor episode dari URL
    const episodeNumberMatch = currentUrl.match(/episode-(\d+)/);
    if (episodeNumberMatch) {
      // Mendapatkan nomor episode saat ini
      const currentEpisodeNumber = parseInt(episodeNumberMatch[1]);

      // Menghitung nomor episode sebelumnya
      const nextEpisodeNumber = currentEpisodeNumber + 1;

      // Membuat URL baru dengan nomor episode sebelumnya
      const newUrl = currentUrl.replace(
        episodeNumberMatch[0],
        `episode-${nextEpisodeNumber}`
      );

      // Navigasi ke URL baru
      window.location.href = newUrl;
    } else {
      // Handle jika format episode tidak ditemukan pada URL
      console.error("Format episode tidak ditemukan pada URL");
    }
  };

  return (
    <div className="py-10">
      {loading ? (
        <div className="flex justify-center">
          <div className="rounded-full h-32 w-32">
            <Image src={loadingGif} alt="loading" width={150} height={150} className="h-full w-full rounded-full" />
          </div>
        </div>
      ) : null}

      {episode && (
        <>
          <h1>{episode.title}</h1>
          <br />
          {showMessage && (
            <div className="alert alert-danger bg-green-500 text-black mx-auto max-w-md" role="alert">
              <span className="mx-auto">720p tidak selalu ada karena limitasi akses ke server sumber</span>
              <button onClick={() => setShowMessage(false)} className="float-right text-white">×</button>
            </div>
          )}
          <br />
          <div className="flex justify-center">
            {selectedQuality === '480p' ? (
              <Frame url={episode.link} />
            ) : (
              <Frame2 url={episode.link} />
            )}
          </div>
          <div className="flex justify-center mt-3">
            <button onClick={handlePrevEpisode} className="bg-gray-300 text-black py-2 px-4 rounded mr-3">
              Prev Episode
            </button>
            <button onClick={handleNextEpisode} className="bg-gray-300 text-black py-2 px-4 rounded">
              Next Episode
            </button>
            <br />
          </div>
          <span className='flex justify-center'>Kualitas saat ini: {selectedQuality}</span>
          <br />
          {/* Add buttons for quality selection */}
          <div className="flex justify-center mt-3 rounded">
            <div className="border border-black p-2">
              <button
                onClick={() => setSelectedQuality('480p')}
                className={`mr-3 ${selectedQuality === '480p' ? 'bg-green-500 text-white' : 'bg-blue-500 text-black'} py-2 px-4 rounded`}
              >
                SD 480p
              </button>
              <button
                onClick={() => setSelectedQuality('720p')}
                className={`${selectedQuality === '720p' ? 'bg-green-500 text-white' : 'bg-blue-500 text-black'} py-2 px-4 rounded`}
              >
                HD 720p
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
