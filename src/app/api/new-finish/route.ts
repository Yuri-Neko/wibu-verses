import { useFetch } from '@/fetcher/useFetch';
import { NextRequest, NextResponse } from 'next/server';
import cheerio from 'cheerio';

export const GET = async (req: NextRequest) => {
  const timestamps = [1, 2, 3, 4];

  try {
    const fetchPromises = timestamps.map(async (timestamp) => {
      const { data, status } = await useFetch(`https://otakudesu.media/complete-anime/page/${timestamp}/`);
      if (status !== 200) throw new Error(`Error ${status}`);
      return data;
    });

    const responses = await Promise.all(fetchPromises);

    const combinedList = responses.flatMap((data, index) => {
      const $ = cheerio.load(data);
      const $parentElement = $('#venkonten > div > div.venser > div.venutama > div.rseries > div > div.venz > ul > li');

      return $parentElement.map((i, el) => {
        const title = $(el).find('div > div.thumb > a > div > h2').text();
        const thumbnail = $(el).find('div > div.thumb > a > div > img').attr('src');
        const episode = $(el).find('div > div.epz').text();
        const temp = $(el).find('div > div.thumb > a').attr('href')?.split('/');

        return {
          id: temp?.[temp.length - 2],
          title,
          thumbnail,
          episode,
        };
      }).get();
    });

    return NextResponse.json({ status: 200, success: true, data: combinedList }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ msg: error }, { status: 500 });
  }
};
