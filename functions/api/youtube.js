const CHANNEL_ID = 'UCO_SA_eFRJbVyfqWV8BKzCQ';
const UPLOADS_PID = 'UUO_SA_eFRJbVyfqWV8BKzCQ';
const CHANNEL_TITLE = 'Francesco Sgnaolin';
const MAX_RESULTS = '13';

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

const isoDurationToSeconds = (value = '') => {
  const m = String(value).match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  return (toInt(m[1]) * 86400) + (toInt(m[2]) * 3600) + (toInt(m[3]) * 60) + toInt(m[4]);
};

const bestThumb = (thumbs = {}) => (
  thumbs.maxres?.url || thumbs.standard?.url || thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url || ''
);

const apiUrl = (path, params, key) => {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  url.search = new URLSearchParams({ ...params, key }).toString();
  return url.toString();
};

const fetchJson = async (url, reason) => {
  const res = await fetch(url, { cf: { cacheTtl: 900, cacheEverything: true } });
  if (!res.ok) {
    const err = new Error(`${reason}_${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
};

const mapVideo = (video, playlistItem = {}) => {
  const snippet = video.snippet || playlistItem.snippet || {};
  const stats = video.statistics || {};
  const content = video.contentDetails || {};
  const id = video.id || playlistItem.contentDetails?.videoId || playlistItem.snippet?.resourceId?.videoId || '';
  return {
    id,
    youtubeId: id,
    title: snippet.title || playlistItem.snippet?.title || '',
    publishedAt: snippet.publishedAt || playlistItem.contentDetails?.videoPublishedAt || playlistItem.snippet?.publishedAt || '',
    thumbnail: bestThumb(snippet.thumbnails || playlistItem.snippet?.thumbnails),
    cat: 'YOUTUBE',
    url: `https://www.youtube.com/watch?v=${id}`,
    views: toInt(stats.viewCount),
    likes: toInt(stats.likeCount),
    duration: content.duration || '',
    durationSeconds: isoDurationToSeconds(content.duration),
    description: snippet.description || '',
    channelId: snippet.channelId || CHANNEL_ID,
    channelTitle: snippet.channelTitle || playlistItem.snippet?.channelTitle || CHANNEL_TITLE,
  };
};

export async function onRequestGet({ env }) {
  const key = env.YOUTUBE_API_KEY || env.YT_API_KEY;
  if (!key) {
    return json({
      ok: false,
      reason: 'YOUTUBE_API_KEY_NOT_CONFIGURED',
      acceptedEnv: ['YOUTUBE_API_KEY', 'YT_API_KEY'],
      channelId: CHANNEL_ID,
      channelTitle: CHANNEL_TITLE,
      uploadsPlaylistId: UPLOADS_PID,
    }, 503);
  }

  try {
    const channelData = await fetchJson(apiUrl('channels', {
      part: 'snippet,contentDetails,statistics',
      id: CHANNEL_ID,
    }, key), 'CHANNEL_FETCH_FAILED');
    const channel = Array.isArray(channelData.items) ? channelData.items[0] : null;
    const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads || UPLOADS_PID;

    if (uploadsPlaylistId !== UPLOADS_PID) {
      return json({
        ok: false,
        reason: 'UPLOADS_PLAYLIST_MISMATCH',
        channelId: CHANNEL_ID,
        channelTitle: channel?.snippet?.title || CHANNEL_TITLE,
        expectedUploadsPlaylistId: UPLOADS_PID,
        receivedUploadsPlaylistId: uploadsPlaylistId,
      }, 502);
    }

    const playlistData = await fetchJson(apiUrl('playlistItems', {
      part: 'snippet,contentDetails',
      maxResults: MAX_RESULTS,
      playlistId: UPLOADS_PID,
    }, key), 'PLAYLIST_FETCH_FAILED');

    const playlistItems = Array.isArray(playlistData.items) ? playlistData.items : [];
    const ids = playlistItems
      .map((item) => item.contentDetails?.videoId || item.snippet?.resourceId?.videoId)
      .filter(Boolean);

    if (!ids.length) {
      return json({
        ok: true,
        source: 'youtube-data-api-v3',
        channelId: CHANNEL_ID,
        channelTitle: channel?.snippet?.title || CHANNEL_TITLE,
        uploadsPlaylistId: UPLOADS_PID,
        fetchedAt: new Date().toISOString(),
        featured: null,
        uploads: [],
      });
    }

    const videosData = await fetchJson(apiUrl('videos', {
      part: 'snippet,statistics,contentDetails',
      id: ids.join(','),
      maxResults: MAX_RESULTS,
    }, key), 'VIDEOS_FETCH_FAILED');

    const playlistById = new Map(playlistItems.map((item) => [
      item.contentDetails?.videoId || item.snippet?.resourceId?.videoId,
      item,
    ]));
    const videosById = new Map((Array.isArray(videosData.items) ? videosData.items : []).map((item) => [item.id, item]));
    const uploads = ids
      .map((id) => videosById.has(id) ? mapVideo(videosById.get(id), playlistById.get(id)) : null)
      .filter((video) => (
        video &&
        video.youtubeId &&
        video.channelId === CHANNEL_ID &&
        video.title &&
        video.title !== 'Private video' &&
        video.title !== 'Deleted video'
      ));

    const latest = uploads[0] || null;
    const featured = latest ? {
      videoId: latest.youtubeId,
      youtubeId: latest.youtubeId,
      title: latest.title,
      publishedAt: latest.publishedAt,
      views: latest.views,
      likes: latest.likes,
      duration: latest.duration,
      durationSeconds: latest.durationSeconds,
      description: latest.description,
      thumbnail: latest.thumbnail,
      url: latest.url,
      channelId: latest.channelId,
      channelTitle: latest.channelTitle,
    } : null;

    return json({
      ok: true,
      source: 'youtube-data-api-v3',
      channelId: CHANNEL_ID,
      channelTitle: channel?.snippet?.title || CHANNEL_TITLE,
      uploadsPlaylistId: UPLOADS_PID,
      fetchedAt: new Date().toISOString(),
      featured,
      uploads: uploads.slice(1),
    });
  } catch (err) {
    return json({
      ok: false,
      reason: 'YOUTUBE_SYNC_FAILED',
      detail: err?.message || String(err),
      channelId: CHANNEL_ID,
      channelTitle: CHANNEL_TITLE,
      uploadsPlaylistId: UPLOADS_PID,
    }, 502);
  }
}
