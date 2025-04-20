import axios from 'axios';

const API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const apiService = {
  /**
   * Search for videos based on a search string using YouTube API
   * @param searchString The string to search for
   * @returns Promise with search results
   */
  searchVideos: async (searchString: string)  => {
    try {
      // Use YouTube API to search for videos
      const youtubeResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(searchString) }&type=video&key=${YOUTUBE_API_KEY}`
      );
       // Make sure this is properly structured
      if (!youtubeResponse.data || !youtubeResponse.data.items) {
        return { 
          success: false, 
          error: 'Invalid response from YouTube API',
          videos: [] // Always include an empty array as fallback
        };
      }
      // Transform YouTube API response to our format
      const videos = youtubeResponse.data.items.map((item: { id: { videoId: any; }; snippet: { title: any; thumbnails: { medium: { url: any; }; }; description: any; channelTitle: any; publishedAt: any; }; }) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }));
      
      return {
        success: true,
        videos
      };
    } catch (error) {
      console.error('Error searching videos:', error);
      return { success: false, error: 'Failed to search videos',videos: [] };
    }
  },

  /**
   * Calculate score for a video
   * @param videoUrl The YouTube video URL
   * @param searchString The search string used
   * @returns Promise with calculation result
   */
  calculateVideoScore: async (videoUrl: string, searchString: string) => {
    try {
      const formData = new FormData();
      formData.append("youtube_url", videoUrl);
      formData.append("search_string", searchString);

      const response = await axios.post(`${API_URL}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const resultText = (response.data?.result ?? '').toString().trim();

      console.log("API full response:", response.data);
      console.log("resultText received:", resultText);

      const parsedScore = parseFloat(resultText);
      const isNumeric = !isNaN(parsedScore);

      if (isNumeric) {
        const roundedScore = Math.ceil(parsedScore); // you can use Math.round if needed
        return {
          success: true,
          result: roundedScore,
          fullResponse: resultText,
          error: null
        };
      } else {
        return {
          success: false,
          result: null,
          error: resultText // this is a string error message
        };
      }

    } catch (error: any) {
      console.error('API call failed:', error.message);
      return {
        success: false,
        result: null,
        error: error.message || 'Unknown error'
      };
    }
  }

};

export default apiService;
