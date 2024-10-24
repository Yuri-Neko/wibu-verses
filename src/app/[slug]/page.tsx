'use client';
import Image from 'next/image';
import Loading from '@/components/Loading';
import Link from 'next/link';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { ListEpisodeContext } from '@/context/ListEpisodeCtx';

const BookmarkButton = ({ slug }: { slug: string }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server side
  }

  const isBookmarked = () => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      return bookmarks.includes(slug);
    }
    return false;
  };

  const toggleBookmark = () => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const updatedBookmarks = isBookmarked()
        ? bookmarks.filter((bookmark: string) => bookmark !== slug)
        : [...bookmarks, slug];

      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      window.location.reload();
    }
  };

  return (
    <div className="text-center mb-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-gray-400 transition clickAnimation"
        onClick={toggleBookmark}
      >
        {isBookmarked() ? 'Remove Bookmark' : 'Bookmark'}
      </button>
    </div>
  );  
};

const Page = ({ params }: { params: { slug: string } }) => {
  const [detailAnime, setDetailAnime] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const { setLists } = useContext(ListEpisodeContext);

  const getDetailAnime = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://backend.ryzendesu.vip/anime/${params.slug}`);
      setDetailAnime(data.data);
      setLists(data.data.episodes); // Assign episodes to the context
      localStorage.setItem('lists', JSON.stringify(data.data.episodes)); // Save episodes to localStorage
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailAnime();
  }, [params.slug]);

  return (
    <div className="container py-10">
      {loading ? <Loading /> : null}
      <div className="flex justify-center">
        {detailAnime ? (
          <Image
            className="rounded-md"
            src={detailAnime?.gambar}
            width={200}
            height={250}
            alt={detailAnime?.judul}
          />
        ) : null}
      </div>
      <h1 className="text-center my-2 text-lg">{detailAnime?.judul}</h1>
      {/* Bookmark button */}
      <BookmarkButton slug={params.slug} />
      
      {/* Display anime info */}
      <ul className="my-4">
        <li>{detailAnime?.nama}</li>
        <li>{detailAnime?.namaJapan}</li>
        <li>{detailAnime?.skor}</li>
        <li>{detailAnime?.produser}</li>
        <li>{detailAnime?.tipe}</li>
        <li>{detailAnime?.status}</li>
        <li>{detailAnime?.totalEpisode}</li>
        <li>{detailAnime?.durasi}</li>
        <li>{detailAnime?.rilis}</li>
        <li>{detailAnime?.studio}</li>
        <li>{detailAnime?.genre}</li>
      </ul>

      {/* Display episodes */}
      {detailAnime ? <h3 className=" text-base mt-4">List Episode: </h3> : null}
      <ul className="flex flex-col gap-2">
        {detailAnime?.episodes.map((episode: any, index: number) => (
          <li className="clickAnimation-list" key={index}>
            <Link href={`/nonton/${episode.slug}`}>
              <div className="bg-zinc-800 text-white text-sm p-2 overflow-hidden rounded-md">
                <p className="truncate hover:whitespace-nowrap">{episode.judul}</p>
                <p className="text-end text-xs mt-2">{episode.tanggal}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
