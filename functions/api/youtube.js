const CHANNEL_ID = 'UCO_SA_eFRJbVyfqWV8BKzCQ';
const UPLOADS_PID = 'UUO_SA_eFRJbVyfqWV8BKzCQ';

const json = (body, status = 200, extraHeaders = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': status === 200
      ? 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600'
      : 'public, max-age=60, s-maxage=60',
    ...extraHeaders,
  },
});

const toInt = (value) => {
  const n = Number.parseInt(value || '0', 10);
  return Number.isFinite(n) ? n : 0;
};

export async function onRequestGet({ env }) {
  const key = env.YOUTUBE_API_KEY;
  if (!key) {
    return json({ ok: false, reason: 'YOUTUBE_API_KEY_NOT_CONFIGURED', channelId: CHANNEL_ID }, 503);
  }

  const playlistUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  playlistUrl.search = new URLSearchParams({
    part: 'snippet',
    maxResults: '13',
    playlistId: UPLOADS_PID,
    key,
  }).toString();

  const playlistRes = await fetch(playlistUrl.toString(), {
    cf: { cacheTtl: 900, cacheEverything: true },
  });
  if (!playlistRes.ok) return json({ ok: false, reason: 'PLAYLIST_FETCH_FAILED' }, 502);

  const playlist = await playlistRes.json();
  const items = Array.isArray(playlist.items) ? playlist.items : [];
  const uploads = items.map((item) => {
    const s = item.snippet || {};
    const videoId = s.resourceId && s.resourceId.videoId;
    if (!videoId) return null;
    return {
      id: videoId,
      youtubeId: videoId,
      title: s.title || '',
      publishedAt: s.publishedAt || '',
      thumbnail: s.thumbnails?.maxres?.url || s.thumbnails?.high?.url || s.thumbnails?.medium?.url || '',
      cat: 'YOUTUBE',
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }).filter(Boolean);

  const latest = uploads[0];
  let featured = latest || null;
  if (latest?.youtubeId) {
    const videoUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videoUrl.search = new URLSearchParams({
      part: 'statistics,contentDetails,snippet',
      id: latest.youtubeId,
      key,
    }).toString();
    const videoRes = await fetch(videoUrl.toString(), {
      cf: { cacheTtl: 900, cacheEverything: true },
    });
    if (videoRes.ok) {
      const videoData = await videoRes.json();
      const video = Array.isArray(videoData.items) ? videoData.items[0] : null;
      if (video) {
        featured = {
          videoId: latest.youtubeId,
          title: latest.title,
          publishedAt: latest.publishedAt,
          views: toInt(video.statistics?.viewCount),
          likes: toInt(video.statistics?.likeCount),
          duration: video.contentDetails?.duration || '',
          description: video.snippet?.description || '',
          thumbnail: latest.thumbnail,
        };
      }
    }
  }

  return json({ ok: true, channelId: CHANNEL_ID, featured, uploads: uploads.slice(1) });
}
