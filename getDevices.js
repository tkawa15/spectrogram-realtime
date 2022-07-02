let micSelector = document.getElementById('mic-selector')

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
        console.log(stream)
    })
    .then(() => {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device => {
                    if (device.kind === "audioinput") {
                        // console.log(device)
                        const option = document.createElement('option')
                        option.text = device.label
                        option.value = device.deviceId
                        micSelector.appendChild(option)
                    }
                    const options = micSelector.options
                    options[0].text = 'Select a microphone.'
                })
            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            })
    })
