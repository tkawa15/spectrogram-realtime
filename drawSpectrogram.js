const fps = 30

let timerId
let isRecording = false

const clickRecBtn = () => {
    if (!isRecording) {
        if (!confirm('録画を開始します')) return

        context.fillStyle = '#000000'
        context.fillRect(0, 0, canvasWidth, canvasHeight)

        isRecording = true
        startBtn.textContent = 'stop'
        startRecording()

        let x = 0
        const second = document.getElementById('second').value
        const speed = canvasWidth / (second * fps)

        navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: micSelector.value
            },
            video: false
        }).then(stream => {
            // オーディオ
            const audioContext = new AudioContext()
            const sourceNode = audioContext.createMediaStreamSource(stream)
            const analyserNode = audioContext.createAnalyser()
            sourceNode.connect(analyserNode)
            analyserNode.fftSize = 2048
            const bufferLength = analyserNode.frequencyBinCount
            const array = new Uint8Array(bufferLength)

            const maxHzRange = document.getElementById('max-hz').value
            const maxArrayIndex = parseInt((maxHzRange * analyserNode.fftSize) / 44100)
            const barHeight = canvasHeight / maxArrayIndex
            
            timerId = setInterval(() => {
                analyserNode.getByteFrequencyData(array)
                for (let i = 0; i < maxArrayIndex; i++) {
                    let r = array[i] * 2
                    let g = 0
                    let b = 50
                    if (r > 255) {
                        g = r - 255
                        r = 255
                    }
                    context.fillStyle = `rgb(${r}, ${g}, ${b})`
                    context.fillRect(x, canvasHeight - (i * barHeight), speed, -barHeight)
                }

                x += speed

                if (x >= canvasWidth) {
                    isRecording = false
                    clearInterval(timerId)
                    startBtn.textContent = 'start'
                    stopRecording()
                    
                    // ダウンロード
                    const a_png = document.createElement('a')
                    a_png.href = canvas.toDataURL('image/png')
                    a_png.download = `spectrogram-${getNow()}.png`
                    a_png.click()
                } 
            }, 1000 / fps);
        }).catch(function(e) {
            alert("ERROR: 音声の取得に失敗しました: " + e.message)
        })
    } else {
        isRecording = false
        clearInterval(timerId)
        startBtn.textContent = 'start'
        stopRecording()
                    
        // ダウンロード
        const a_png = document.createElement('a')
        a_png.href = canvas.toDataURL('image/png')
        a_png.download = `spectrogram-${getNow()}.png`
        a_png.click()
    }
}