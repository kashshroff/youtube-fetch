import { searchYoutubeVideos } from './../database/youtube/index';
import { YOUTUBE_SEARCH_QUERY } from './../constants/youtube';
import { getNewApiKey, storeMultipleRowsToDB, areKeysAvailable, initializeApiKey } from './../utils/index';
import axios from 'axios'
import moment from 'moment'
import responseGenerator from '../libs/responseGenerator';
import sw from 'stopword'
import DataBase from '../database/Database';

const db = new DataBase()

export const fetchDataFromYoutube = async(search_query: string) => {
    /**
     * Youtube data api v3 provides Search.list feature
     * Req: GET https://www.googleapis.com/youtube/v3/search
     * Params: part=snippet, type=video, order=date, publishedAfter=<some_date>, apiKey
     */

    // Step 1: Build GET request
    const api_key = getNewApiKey()
    console.log(global.api_keys, api_key)
    const url = YOUTUBE_SEARCH_QUERY
                +'?part=snippet&type=video&order=date&publishedAfter='
                +moment().subtract(1, 'year').toISOString()
                +'&key='+api_key
                +'&q='+search_query
                +'&maxResults='+process.env.MAX_SEARCH_RESULT
    console.log(url)

    // Step 2: Make a request
    try {
        const res = await axios.get(url)
        if(res.status === 200) {
            const { data } = res
            // Step 3: Store result in database
            if(data.items.length){
                const { items } = data
                // Columns to store data - etag, id.videoId, snippet.publishedAt, snippet.title
                await storeMultipleRowsToDB(items)
                return true

            } else {
                console.log("No result")
                return false
            }
        }
    } catch (error){
        // Youtube will give a 403 error if quota has been exceeded.
        console.log(error.response.data)
        const error_code = error.response.data.error.code
        if(error_code === 403){
            const error_details = error.response.data.error.errors ? error.response.data.error.errors : []
            if(error_details.length) {
                const error_domain = error_details[0].domain
                const error_reason = error_details[0].reason
                if(error_domain === 'youtube.quota' && error_reason === 'quotaExceeded') {
                    // Check & call change API key function as the limit has expired
                    if(areKeysAvailable()){
                        console.log("Generating new key")
                        getNewApiKey(api_key)
                    } else {
                        // There's a possiblility here that the function go in an infinite loop here
                        console.log("Re-initializing all keys")
                        global.api_keys = initializeApiKey()
                    }
                }
            }
        }
        
    }
    
}

export const searchVideoData = async(req: any, res: any) => {
    const search_query = req.query.query
    
    // Validation (basic)
    if(!search_query) responseGenerator(true, "Please provide search query", 404, {}, res)

    /**
     * We need to create a search result
     * For that, let's break the search query
     * First, we remove all punctuations
     * We use npm stopwords library to remove frequenty used words
     * then split it on space and use tokens as search params
     */

    // Step 1: Remove punctuations
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    let search_expression = search_query.replace(regex, '')

    // Step 2: Remove stop words and word tokenize
    const word_tokens = sw.removeStopwords(search_expression.split(" "))

    // Step 3: Create query string
    // Note: Python is better to do this as many ML packages are available out there to do this
    // We could create a serverless Python function for this
    // But let's continue with simple like operation in mysql

    let where_condition = word_tokens.map((word) => {
        return `title LIKE '%${word}%' OR description LIKE '%${word}%'`
    })

    // Step 4: Make db call
    const database_result: any = await db.execute(searchYoutubeVideos(where_condition.join(" OR ")))
    if(database_result.rows.length){
        const result = database_result.rows
        result.forEach((item: any, key: number) => {
            result[key].title = decodeURI(item.title)
            result[key].description = decodeURI(item.description)
        })
        responseGenerator(false, "Data fetched successfully", 200, result, res)
    }else {
        responseGenerator(true, "No data found", 404, {}, res)
    }
}