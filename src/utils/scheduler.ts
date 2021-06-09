import { fetchDataFromYoutube } from '../components/youtube';
import schedule from 'node-schedule';

/**
 * Function: youtubeFetchDataScheduler
 * Params: None
 * Description: This function will call youtube data api every 10 seconds and update the database
 *              It uses node-scheduler library to do the same. A cron is passed as an arguement to
 *              it. It is present in env file.
 */
export const youtubeFetchDataScheduler = () => {
    schedule.scheduleJob(`*/${process.env.YOUTUBE_SCHEDULER_TIME} * * * * *`, async () => {
        console.log("Scheduler running.....")
        fetchDataFromYoutube(process.env.BASIC_SEARCH_QUERY!)
    })
}