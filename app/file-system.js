const getFileBtn = document.getElementById('fs-get')

getFileBtn.onclick = async () => {
    const [handle] = await window.showOpenFilePicker();
    const file = await handle.getFile();
    console.log(file)
};


const saveFileBtn = document.getElementById('fs-save')

saveFileBtn.onclick = async () => {
  const textFile = new File(["hello world"], "hello.txt", {
    type: "text/plain",
  });
  const handle = await window.showSaveFilePicker();
  const writable = await handle.createWritable();
  await writable.write(textFile);
  await writable.close();
};