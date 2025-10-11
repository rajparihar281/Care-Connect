'use strict';

function openURL(url, blank = false) {
    blank ? window.open(url, '_blank') : (window.location.href = url);
}

function checkWebRTCSupported() {
    let isWebRTCSupported = false;
    ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection', 'RTCIceGatherer'].forEach(function (item) {
        if (isWebRTCSupported) return;
        if (item in window) {
            isWebRTCSupported = true;
        }
    });
    return isWebRTCSupported;
}

function isMobile(userAgent) {
    return !!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(userAgent || '');
}

function isTablet(userAgent) {
    return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
        userAgent
    );
}

function isIpad(userAgent) {
    return /macintosh/.test(userAgent) && 'ontouchend' in document;
}

function isDesktop() {
    return !isMobileDevice && !isTabletDevice && !isIPadDevice;
}

function handleMediaError(mediaType, err) {
    playSound('error');

    let errMessage = err;

    switch (err.name) {
        case 'NotFoundError':
        case 'DevicesNotFoundError':
            errMessage = 'Required track is missing';
            break;
        case 'NotReadableError':
        case 'TrackStartError':
            errMessage = 'Already in use';
            break;
        case 'OverconstrainedError':
        case 'ConstraintNotSatisfiedError':
            errMessage = 'Constraints cannot be satisfied by available devices';
            break;
        case 'NotAllowedError':
        case 'PermissionDeniedError':
            errMessage = 'Permission denied in browser';
            break;
        case 'TypeError':
            errMessage = 'Empty constraints object';
            break;
        default:
            break;
    }

    const $html = `
        <ul style="text-align: left">
            <li>Media type: ${mediaType}</li>
            <li>Error name: ${err.name}</li>
            <li>Error message: <p style="color: red">${errMessage}<p></li>
            <li>Common: <a href="https://blog.addpipe.com/common-getusermedia-errors" target="_blank">getUserMedia errors</a></li>
        </ul>
    `;

    popupHtmlMessage(null, image.forbidden, 'Access denied', $html, 'center', '/');

    throw new Error(
        `Access denied for ${mediaType} device [${err.name}]: ${errMessage} check the common getUserMedia errors: https://blog.addpipe.com/common-getusermedia-errors/`
    );
}

function logStreamSettingsInfo(name, stream) {
    if (hasVideoTrack(stream)) {
        console.log(name, {
            video: {
                label: stream.getVideoTracks()[0].label,
                settings: stream.getVideoTracks()[0].getSettings(),
            },
        });
    }
    if (hasAudioTrack(stream)) {
        console.log(name, {
            audio: {
                label: stream.getAudioTracks()[0].label,
                settings: stream.getAudioTracks()[0].getSettings(),
            },
        });
    }
}

function detectCameraFacingMode(stream) {
    if (!stream || !stream.getVideoTracks().length) {
        console.warn("No video track found in the stream. Defaulting to 'user'.");
        return 'user';
    }
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    const capabilities = videoTrack.getCapabilities?.() || {};
    const facingMode = settings.facingMode || capabilities.facingMode?.[0] || 'user';
    return facingMode === 'environment' ? 'environment' : 'user';
}

function handleCameraMirror(video, camera) {
    if (!video) return;
    camera === 'environment' ? video.classList.remove('mirror') : video.classList.add('mirror');
}

function hasAudioTrack(mediaStream) {
    return mediaStream && mediaStream.getAudioTracks().length > 0;
}

function hasVideoTrack(mediaStream) {
    return mediaStream && mediaStream.getVideoTracks().length > 0;
}

function getEnabledTrack(stream, trackType) {
    if (trackType === 'video' && hasVideoTrack(stream)) {
        return stream.getVideoTracks()[0];
    }
    if (trackType === 'audio' && hasAudioTrack(stream)) {
        return stream.getAudioTracks()[0];
    }
    return null;
}

function enableAllAudioTracks(stream) {
    stream && stream.getAudioTracks().forEach((track) => (track.enabled = true));
}

function refreshTrackState(track) {
    if (track) track.enabled = true;
}

function safeXSS(input) {
    return typeof filterXSS === 'function' ? filterXSS(input) : input;
}

function removeAllChildren(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
}

function removeElement(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

function stopMediaStream(stream) {
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
    }
}

function isDisplayStream(stream) {
    return (
        stream &&
        stream.getVideoTracks().some((track) => {
            const label = track.label.toLowerCase();
            return (
                label.includes('screen') ||
                label.includes('display') ||
                (track.kind === 'video' && track.getSettings && track.getSettings().displaySurface)
            );
        })
    );
}

function cleanupPeerMediaElements() {
    Object.values(peerMediaElements).forEach((el) => removeElement(el.parentNode));
    peerMediaElements = {};
}

function cleanupPeerConnections() {
    Object.values(peerConnections).forEach((pc) => pc.close());
    peerConnections = {};
    dataChannels = {};
}

function buildUniqueMediaStream(stream) {
    const tracks = [];
    const seenIds = new Set();
    stream.getTracks().forEach((track) => {
        if (!seenIds.has(track.id)) {
            tracks.push(track);
            seenIds.add(track.id);
        }
    });
    return new MediaStream(tracks);
}

async function getBestUserMedia(constraints) {
    try {
        return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err1) {
        console.warn('[Warning] audio+video denied or not present', err1);
        try {
            return await navigator.mediaDevices.getUserMedia({ audio: constraints.audio, video: false });
        } catch (err2) {
            console.warn('[Warning] audio only denied or not present', err2);
            try {
                return await navigator.mediaDevices.getUserMedia({ audio: false, video: constraints.video });
            } catch (err3) {
                console.warn('[Warning] video only denied or not present', err3);
                return new MediaStream();
            }
        }
    }
}

async function getScreenWithMic(constraints) {
    const screenStream = await navigator.mediaDevices.getDisplayMedia(constraints);
    let micStream = null;
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
        console.warn('[Warning] Could not get mic for screen sharing', err);
    }

    const hasSystemAudio = screenStream.getAudioTracks().length > 0;
    const hasMicAudio = micStream && micStream.getAudioTracks().length > 0;

    if (hasSystemAudio) {
        // If system audio is present, use only system audio (browser will not allow mixing in most cases)
        // Optionally, you could warn the user that mic audio will not be sent
        return screenStream;
    } else if (hasMicAudio) {
        // Only mic audio, add to screen stream
        micStream.getAudioTracks().forEach((track) => screenStream.addTrack(track));
    }

    // else: only video, nothing to do
    return screenStream;
}

function setTippy(element, content, placement) {
    if (isMobileDevice) return;
    if (element) {
        if (element._tippy) {
            element._tippy.destroy();
        }
        try {
            tippy(element, {
                content: content,
                placement: placement,
            });
        } catch (err) {
            console.error('setTippy error', err.message);
        }
    } else {
        console.warn('setTippy element not found with content', content);
    }
}

function changeAspectRatio(aspectRatio) {
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach((video) => {
        video.style.objectFit = aspectRatio ? 'contain' : 'cover';
    });
}

function isFullScreen() {
    const elementFullScreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement ||
        null;
    if (elementFullScreen === null) return false;
    return true;
}

function isFullScreenSupported() {
    return (
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled
    );
}

function goInFullscreen(element) {
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
    else popupMessage('warning', 'Full screen', 'Full screen mode not supported by this browser on this device.');
}

function goOutFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
}

function copyRoom() {
    const tmpInput = document.createElement('input');
    document.body.appendChild(tmpInput);
    tmpInput.style.display = 'none';
    tmpInput.value = roomURL;
    tmpInput.select();
    tmpInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(tmpInput.value).then(() => {
        console.log('Copied to clipboard Join Link ', roomURL);
        document.body.removeChild(tmpInput);
        popupMessage(
            'html',
            'Room sharing',
            `<div id="qrRoomContainer">
                <canvas id="qrRoom"></canvas>
            </div>
            <br/>
            <p style="color:rgb(8, 189, 89);">Join from your mobile device</p>
            <p style="background:transparent; color:white; font-family: Arial, Helvetica, sans-serif;">No need for apps, simply capture the QR code with your mobile camera Or Invite someone else to join by sending them the following URL</p>
            <p style="color:rgb(8, 189, 89);">${roomURL}</p>`
        );
        makeRoomQR();
    });
}

async function shareRoom() {
    try {
        await navigator.share({ url: roomURL });
    } catch (err) {
        console.error('[Error] navigator share', err);
    }
}

function handleBodyEvents() {
    checkElements();
    document.body.onmousemove = () => {
        if (buttonsBar.style.display == 'none' && waitingDivContainer.style.display == 'none') {
            toggleClassElements('videoHeader', true);
            elemDisplay(buttonsBar, true);
            animateCSS(buttonsBar, 'fadeInUp');
        }
    };
}

function checkElements() {
    if (buttonsBar.style.display != 'none') {
        toggleClassElements('videoHeader', false);
        animateCSS(buttonsBar, 'fadeOutDown').then((msg) => {
            elemDisplay(buttonsBar, false);
        });
    }
    setTimeout(checkElements, 20000);
}

function toggleClassElements(className, displayState) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elemDisplay(elements[i], displayState);
    }
}

function startSessionTime() {
    let sessionElapsedTime = 0;
    setInterval(function printTime() {
        sessionElapsedTime++;
        sessionTime.innerText = secondsToHms(sessionElapsedTime);
    }, 1000);
}

function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);
    let hDisplay = h > 0 ? h + 'h' : '';
    let mDisplay = m > 0 ? m + 'm' : '';
    let sDisplay = s > 0 ? s + 's' : '';
    return hDisplay + ' ' + mDisplay + ' ' + sDisplay;
}

function getTime(seconds = true) {
    const date = new Date();
    return date.getHours() + ':' + date.getMinutes() + (seconds ? ':' + date.getSeconds() : '');
}

function getDataTimeString() {
    const d = new Date();
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().split(' ')[0];
    return `${date}-${time}`;
}

function escapeSpecialChars(regex) {
    return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
}

function getLineBreaks(message) {
    return (message.match(/\n/g) || []).length;
}

function elemDisplay(element, display, mode = 'block') {
    if (element) element.style.display = display ? mode : 'none';
}

function elemDisable(element, disable) {
    if (element) element.disabled = disable;
}

function animateCSS(element, animation, prefix = 'animate__') {
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        element.classList.add(`${prefix}animated`, animationName);
        function handleAnimationEnd(event) {
            event.stopPropagation();
            element.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }
        element.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
}

function handleClickOutside(targetElement, triggerElement, callback, minWidth = 0) {
    document.addEventListener('click', (e) => {
        if (minWidth && window.innerWidth > minWidth) return;
        let el = e.target;
        let shouldExclude = false;
        while (el) {
            if (el instanceof HTMLElement && (el === targetElement || el === triggerElement)) {
                shouldExclude = true;
                break;
            }
            el = el.parentElement;
        }
        if (!shouldExclude) callback();
    });
}

function makeDraggable(element, dragObj) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (dragObj) {
        dragObj.onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = element.offsetTop - pos2 + 'px';
        element.style.left = element.offsetLeft - pos1 + 'px';
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function makeUnDraggable(element, dragObj) {
    if (dragObj) {
        dragObj.onmousedown = null;
    } else {
        element.onmousedown = null;
    }
    element.style.top = '';
    element.style.left = '';
}

function makeRoomQR() {
    const qr = new QRious({
        element: document.getElementById('qrRoom'),
        value: roomURL,
    });
    qr.set({
        size: 256,
    });
}

function setPeerVideoAvatarImgName(elem, peerName) {
    if (elem && isValidEmail(peerName)) {
        elem.setAttribute('src', genGravatar(peerName));
    }
}

function genGravatar(email, size = false) {
    const hash = md5(email.toLowerCase().trim());
    const gravatarURL = `https://www.gravatar.com/avatar/${hash}` + (size ? `?s=${size}` : '?s=250') + '?d=404';
    return gravatarURL;
    function md5(input) {
        return CryptoJS.MD5(input).toString();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getCurrentTimeString() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function playSound(name) {
    const sound = '../sounds/' + name + '.mp3';
    const audioToPlay = new Audio(sound);
    try {
        audioToPlay.volume = 0.5;
        await audioToPlay.play();
    } catch (err) {
        return false;
    }
}
