let mediaRecorder;

const startRecording = () => {
    const videoStream = canvas.captureStream()
    navigator.mediaDevices.getUserMedia({
        video: false,
        audio: { deviceId: micSelector.value }
    }).then(stream => {
        const combinedStream = new MediaStream([videoStream.getTracks()[0], stream.getAudioTracks()[0]])
        mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' })
        if (mediaRecorder.state == "recording") return
        mediaRecorder.start()
    }).catch(function(e) {
        alert("ERROR: 録画に失敗しました: " + e.message)
    })
}

const stopRecording = () => {
    if (mediaRecorder.state == "inactive") return
    mediaRecorder.stop()
    mediaRecorder.addEventListener('dataavailable', (event) => {
        const a_webm = document.createElement('a')
        const videoBlob = new Blob([event.data], { type: event.data.type })
        const blobUrl = window.URL.createObjectURL(videoBlob)
        a_webm.href = blobUrl
        a_webm.download = `spectrogram-${getNow()}.webm`
        a_webm.click()
    })
}

const getNow = () => {
    const now = new Date()
    const y = now.getFullYear()
    const m = ('00' + now.getMonth()).slice(-2)
    const d = ('00' + now.getDate()).slice(-2)
    const h = ('00' + now.getHours()).slice(-2)
    const min = ('00' + now.getMinutes()).slice(-2)
    const s = ('00' + now.getSeconds()).slice(-2)
    return y + m + d + '_' + h + min + s
}