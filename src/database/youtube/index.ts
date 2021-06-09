import { YOUTUBE_RESULT } from './../tables';
export const insertToYoutubeResult = (values: string) => {
    return `INSERT IGNORE INTO ${YOUTUBE_RESULT} (etag, video_id, published_at, title, description, thumbnail_url) VALUES ${values}`
}

export const searchYoutubeVideos = (where_query: string) => {
    return `
        SELECT * FROM ${YOUTUBE_RESULT} WHERE ${where_query} LIMIT 10
    `
}