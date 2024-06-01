exports.getYoutubeApiKey = async (req, res) => {
    const apiKey = "AIzaSyDCkTEA_JGJd_PQENVB-6FZ6XVpbhTj4hY";
    return res.status(200).json({
        "apiKey":apiKey
    })

};
