import { insertToYoutubeResult } from './../database/youtube/index';
import Database from '../database/Database'
import { escape } from 'mysql'
import moment from 'moment'

const db = new Database()

export const getNewApiKey = (current_api_key?: string) => {
    // If a key is exhausted, then remove it
    if (current_api_key) {
        const index = global.api_keys.indexOf(current_api_key);
        if (index > -1) {
            global.api_keys.splice(index, 1);
        }
    }
    // We fetch a new key now which is not exhausted
    return areKeysAvailable()
}

export const areKeysAvailable = () => {
    return global.api_keys.length ? global.api_keys[0] : false
}

export const initializeApiKey = () => {
    const keys = process.env.YOUTUBE_API_KEYS?.split(',')
    return keys
}

export const storeMultipleRowsToDB = async (items: any) => {
    let values: any = []
    // Columns to store data - etag, id.videoId, snippet.publishedAt, snippet.title
    items.forEach((item: any) => {
        // We need to encode title as it contains emoji's. Mysql support :)
        values.push(`(${escape(item.etag)}, ${escape(item.id.videoId)}, ${escape(moment(item.snippet.publishedAt).format('YYYY-MM-DD HH:mm:ss'))}, ${escape(encodeURI(item.snippet.title))}, ${escape(encodeURI(item.snippet.description))}, ${escape(item.snippet.thumbnails.medium.url)})`)
    })

    // Add to db
    try {
        const res = await db.execute(insertToYoutubeResult(values.join(',')))
        return res
    } catch (error) {
        console.log("database error", error)
        return false
    }
    
}