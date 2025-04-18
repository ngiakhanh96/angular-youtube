export const ExternalRoutesByOpeningNewWindow: Map<string | null, string> =
  new Map([
    ['youtube-music', 'https://music.youtube.com/'],
    ['youtube-kids', 'https://www.youtubekids.com/'],
    ['youtube-studio', 'https://studio.youtube.com/'],
  ]);
export const ExternalRoutesByCurrentWindowWithoutLocationChange: Map<
  string | null,
  string
> = new Map([['youtube-music-light', 'https://music.youtube.com/']]);

export const InternalRoutesByCurrentWindow: Map<string | null, string> =
  new Map([['home', '/']]);
