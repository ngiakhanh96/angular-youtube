import type { MediaPlayerErrors, TrackSelectionFunction } from 'dashjs';

export function createTerminalDashErrorCodes(errors: MediaPlayerErrors) {
  return new Set<number>([
    // Native media errors reach ERROR only after dash.js exhausts decode recovery.
    1,
    2,
    3,
    4,
    5,
    errors.MANIFEST_LOADER_PARSING_FAILURE_ERROR_CODE,
    errors.MANIFEST_LOADER_LOADING_FAILURE_ERROR_CODE,
    errors.MANIFEST_ERROR_ID_PARSE_CODE,
    errors.MANIFEST_ERROR_ID_NOSTREAMS_CODE,
    errors.MANIFEST_ERROR_ID_MULTIPLEXED_CODE,
    errors.CAPABILITY_MEDIASOURCE_ERROR_CODE,
    errors.CAPABILITY_MEDIAKEYS_ERROR_CODE,
    errors.MEDIASOURCE_TYPE_UNSUPPORTED_CODE,
    errors.FRAGMENT_LOADER_LOADING_FAILURE_ERROR_CODE,
    errors.SEGMENT_BASE_LOADER_ERROR_CODE,
    errors.DOWNLOAD_ERROR_ID_MANIFEST_CODE,
    errors.DOWNLOAD_ERROR_ID_CONTENT_CODE,
    errors.DOWNLOAD_ERROR_ID_INITIALIZATION_CODE,
    errors.DOWNLOAD_ERROR_ID_SIDX_CODE,
    errors.URL_RESOLUTION_FAILED_GENERIC_ERROR_CODE,
    errors.APPEND_ERROR_CODE,
  ]);
}

export function createInitialDashTrackSelector(
  preferredAudioLanguage: () => string | undefined,
): TrackSelectionFunction {
  return (tracks) => {
    if (!tracks.some((track) => track.type === 'audio')) {
      return tracks;
    }
    for (const preferred of [preferredAudioLanguage(), 'en']) {
      if (!preferred) {
        continue;
      }
      const matches = tracks.filter(
        (track) =>
          track.lang?.toLowerCase().split('-')[0] ===
          preferred.toLowerCase().split('-')[0],
      );
      if (matches.length) {
        return matches;
      }
    }
    return tracks;
  };
}
