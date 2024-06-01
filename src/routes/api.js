const ConvertMp3Controller = require("../app/controllers/covert.mp3.controller")
const YoutubeApiKeyController = require("../app/controllers/youtube.api.key.controller")
function route(app){
    app.get('/api/convert/:videoId',ConvertMp3Controller.convertMp3)
    app.get('/api/get-api-key',YoutubeApiKeyController.getYoutubeApiKey)
    
}
module.exports = route