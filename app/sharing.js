const shareBtn = document.getElementById('share');

shareBtn.onclick = async (filesArray) => {
    if (navigator.canShare) {
        navigator.share({
            files: filesArray,
            title: 'PWAs are awesome!',
            text: 'I learned how to build a PWA today',
        })
    }
}
