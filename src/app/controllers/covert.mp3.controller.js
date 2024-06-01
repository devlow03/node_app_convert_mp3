const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const { promisify } = require("util");
const dotenv = require('dotenv')
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
dotenv.config()

exports.convertMp3 = async (req, res) => {
    const videoId = req.params.videoId; // Lấy ID từ yêu cầu
    const outputFilename = `src/resources/mp3/${videoId}.mp3`; // Tên tệp đầu ra MP3
    const expirationTime = 24 * 60 * 60 * 1000; // 1 ngày

    try {
        // Kiểm tra xem tệp MP3 đã tồn tại hay không
        if (fs.existsSync(outputFilename)) {
            console.log("MP3 file already exists:", outputFilename);
            return res.status(200).json({
                message: "Convert Successfully",
                mp3Filename: `${process.env.DOMAIN_HOST}mp3/${videoId}.mp3`,
            });
        }

        // Lấy thông tin về video từ YouTube
        const videoInfo = await ytdl.getInfo(videoId);
        const videoTitle = videoInfo.videoDetails.title;
        console.log("Video Title:", videoTitle);

        // Lọc định dạng âm thanh
        const audioFormat = ytdl.filterFormats(videoInfo.formats, "audioonly")[0];

        // Tạo một mảng byte từ dữ liệu audio
        const audioBuffer = [];
        const audioStream = await ytdl.downloadFromInfo(videoInfo, { filter: "audioonly", format: audioFormat });
        audioStream.on('data', chunk => {
            audioBuffer.push(chunk);
        });

        audioStream.on('end', async () => {
            // Ghi dữ liệu vào tệp MP3
            await writeFileAsync(outputFilename, Buffer.concat(audioBuffer));

            // Xóa tệp sau một khoảng thời gian
            setTimeout(async () => {
                await unlinkAsync(outputFilename);
                console.log(`File ${outputFilename} has been deleted.`);
            }, expirationTime);

            // Trả về phản hồi thành công
            res.status(200).json({
                message: "Convert Successfully",
                mp3Filename: `${process.env.DOMAIN_HOST}mp3/${videoId}.mp3`,
            });
        });

        audioStream.on('error', (error) => {
            console.error("Error downloading audio:", error);
            res.status(500).json({ error: "Failed to download audio" });
        });
    } catch (error) {
        console.error("Error converting video:", error);
        res.status(500).json({ error: "Failed to convert video" });
    }
};
