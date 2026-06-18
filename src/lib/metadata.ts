import * as mm from 'music-metadata-browser';

export async function extractLyricsFromAudio(file: File): Promise<string | null> {
  try {
    const metadata = await mm.parseBlob(file);
    // Usually lyrics are in metadata.common.lyrics
    if (metadata.common.lyrics && metadata.common.lyrics.length > 0) {
      return metadata.common.lyrics[0];
    }
  } catch (error) {
    console.warn('Error reading tags with music-metadata-browser:', error);
  }
  return null;
}
