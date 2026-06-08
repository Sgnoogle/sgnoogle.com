const DEFAULT_CHANNEL_ID = 'UCO_SA_eFRJbVyfqWV8BKzCQ';
const DEFAULT_HANDLE = '@sgnoogle';
const DEFAULT_UPLOADS_PID = 'UUO_SA_eFRJbVyfqWV8BKzCQ';
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


const decodeXml = (value = '') => String(value)
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

const pickXml = (xml, tag) => {
  const m = String(xml).match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`));
  return decodeXml(m?.[1] || '');
};

const pickAttr = (xml, tag, attr) => {
  const m = String(xml).match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'));
  return decodeXml(m?.[1] || '');
};

const fetchRssUploads = async (channelId = DEFAULT_CHANNEL_ID) => {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  const res = await fetch(url, { cf: { cacheTtl: 900, cacheEverything: true } });
  if (!res.ok) {
    const err = new Error(`YOUTUBE_RSS_${res.status}`);
    err.status = res.status;
    throw err;
  }
  const xml = await res.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  return entries.map((entry) => {
    const id = pickXml(entry, 'yt:videoId');
    const title = pickXml(entry, 'title');
    return {
      id,
      youtubeId: id,
      title,
      publishedAt: pickXml(entry, 'published'),
      thumbnail: pickAttr(entry, 'media:thumbnail', 'url') || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''),
      cat: 'YOUTUBE',
      url: id ? `https://www.youtube.com/watch?v=${id}` : '',
      views: toInt(pickAttr(entry, 'media:statistics', 'views')),
      likes: 0,
      duration: '',
      durationSeconds: 0,
      description: pickXml(entry, 'media:description'),
    };
  }).filter((video) => video.youtubeId && video.title);
};

const rssResponse = async ({ channelId, handle, warning } = {}) => {
  const fallbackId = channelId || DEFAULT_CHANNEL_ID;
  const uploads = await fetchRssUploads(fallbackId);
  const latest = uploads[0] || null;
  return json({
    ok: true,
    source: 'youtube-rss',
    apiKeyConfigured: false,
    warning,
    channelId: fallbackId,
    channelHandle: handle || DEFAULT_HANDLE,
    uploadsPlaylistId: fallbackId.replace(/^UC/, 'UU'),
    fetchedAt: new Date().toISOString(),
    featured: latest ? {
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
    } : null,
    uploads: uploads.slice(1, Number(MAX_RESULTS)),
  });
};

const apiUrl = (path, params, key) => {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  url.search = new URLSearchParams({ ...params, key }).toString();
  return url.toString();
};

const fetchJson = async (url) => {
  const res = await fetch(url, { cf: { cacheTtl: 900, cacheEverything: true } });
  if (!res.ok) {
    const err = new Error(`YOUTUBE_${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
};

const resolveChannel = async (key, handle = DEFAULT_HANDLE, fallbackId = DEFAULT_CHANNEL_ID) => {
  const normalizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
  const byHandle = await fetchJson(apiUrl('channels', {
    part: 'id,snippet,contentDetails,statistics',
    forHandle: normalizedHandle,
  }, key)).catch(() => null);
  const channel = Array.isArray(byHandle?.items) && byHandle.items[0]
    ? byHandle.items[0]
    : null;

  if (channel) return channel;

  const byId = await fetchJson(apiUrl('channels', {
    part: 'id,snippet,contentDetails,statistics',
    id: fallbackId,
  }, key));
  return Array.isArray(byId.items) ? byId.items[0] : null;
};

const mapVideo = (video, playlistItem = {}) => {
  const snippet = video.snippet || playlistItem.snippet || {};
  const stats = video.statistics || {};
  const content = video.contentDetails || {};
  const id = video.id || playlistItem.snippet?.resourceId?.videoId || '';
  return {
    id,
    youtubeId: id,
    title: snippet.title || '',
    publishedAt: snippet.publishedAt || playlistItem.snippet?.publishedAt || '',
    thumbnail: bestThumb(snippet.thumbnails || playlistItem.snippet?.thumbnails),
    cat: 'YOUTUBE',
    url: `https://www.youtube.com/watch?v=${id}`,
    views: toInt(stats.viewCount),
    likes: toInt(stats.likeCount),
    duration: content.duration || '',
    durationSeconds: isoDurationToSeconds(content.duration),
    description: snippet.description || '',
  };
};

export async function onRequestGet({ env }) {
  const key = env.YOUTUBE_API_KEY || env.YT_API_KEY;
  const handle = env.YOUTUBE_CHANNEL_HANDLE || DEFAULT_HANDLE;
  const fallbackId = env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID;
  if (!key) {
    try {
      return await rssResponse({ channelId: fallbackId, handle, warning: 'YOUTUBE_API_KEY_NOT_CONFIGURED' });
    } catch (err) {
      return json({
        ok: false,
        reason: 'YOUTUBE_API_KEY_NOT_CONFIGURED_AND_RSS_FAILED',
        detail: err?.message || String(err),
        acceptedEnv: ['YOUTUBE_API_KEY', 'YT_API_KEY'],
        channelHandle: handle,
        channelId: fallbackId,
      }, 503);
    }
  }

  try {
    const channel = await resolveChannel(key, handle, fallbackId);
    const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads || DEFAULT_UPLOADS_PID;
    if (!uploadsPlaylistId) {
      return json({ ok: false, reason: 'UPLOADS_PLAYLIST_NOT_FOUND', channelHandle: handle, channelId: channel?.id || fallbackId }, 502);
    }

    const playlist = await fetchJson(apiUrl('playlistItems', {
      part: 'snippet,contentDetails',
      maxResults: MAX_RESULTS,
      playlistId: uploadsPlaylistId,
    }, key));

    const playlistItems = Array.isArray(playlist.items) ? playlist.items : [];
    const ids = playlistItems
      .map((item) => item.contentDetails?.videoId || item.snippet?.resourceId?.videoId)
      .filter(Boolean);

    if (!ids.length) {
      return json({ ok: true, channelId: channel?.id || fallbackId, channelHandle: handle, uploadsPlaylistId, featured: null, uploads: [] });
    }

    const videosData = await fetchJson(apiUrl('videos', {
      part: 'snippet,statistics,contentDetails',
      id: ids.join(','),
      maxResults: MAX_RESULTS,
    }, key));

    const playlistById = new Map(playlistItems.map((item) => [
      item.contentDetails?.videoId || item.snippet?.resourceId?.videoId,
      item,
    ]));
    const videosById = new Map((Array.isArray(videosData.items) ? videosData.items : []).map((item) => [item.id, item]));
    const uploads = ids
      .map((id) => videosById.has(id) ? mapVideo(videosById.get(id), playlistById.get(id)) : null)
      .filter((video) => video && video.youtubeId && video.title && video.title !== 'Private video' && video.title !== 'Deleted video');

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
    } : null;

    return json({
      ok: true,
      source: 'youtube-data-api-v3',
      channelId: channel?.id || fallbackId,
      channelHandle: handle,
      uploadsPlaylistId,
      fetchedAt: new Date().toISOString(),
      featured,
      uploads: uploads.slice(1),
    });
  } catch (err) {
    try {
      return await rssResponse({ channelId: fallbackId, handle, warning: err?.message || 'YOUTUBE_DATA_API_FAILED' });
    } catch (rssErr) {
      return json({
        ok: false,
        reason: 'YOUTUBE_SYNC_FAILED',
        detail: err?.message || String(err),
        rssDetail: rssErr?.message || String(rssErr),
        channelHandle: handle,
        channelId: fallbackId,
      }, 502);
    }
  }
}
