var hidden1 = document.querySelector('.hidden1');
var hidden2 = document.querySelector('.hidden2');
var uploadbox = document.querySelector('.upload-box');
let abhay = {};
abhay.imagePreviews = document.querySelector('#previews');
abhay.fileSelector = document.querySelector('input[type=file]');
function addImageBox(container) {
  let imageBox = document.createElement("div");
  let progressBox = document.createElement("progress");
  imageBox.appendChild(progressBox);
  container.appendChild(imageBox);
  return imageBox;
}
function processFile(file) {
  if (!file) {
    return;
  }
  console.log(file);
hidden1.classList.add('active');
  let imageBox = addImageBox(abhay.imagePreviews);
  new Promise(function (resolve, reject) {
    let rawImage = new Image();
    rawImage.addEventListener("load", function () {
      resolve(rawImage);
    });
    rawImage.src = URL.createObjectURL(file);
  }).
  then(function (rawImage) {
    return new Promise(function (resolve, reject) {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext("2d");
      canvas.width = rawImage.width;
      canvas.height = rawImage.height;
      ctx.drawImage(rawImage, 0, 0);
      canvas.toBlob(function (blob) {
        resolve(URL.createObjectURL(blob));
      }, "image/webp");
    });
  }).
  then(function (imageURL) {
    return new Promise(function (resolve, reject) {
      let scaledImg = new Image();
      scaledImg.addEventListener("load", function () {
        resolve({ imageURL, scaledImg });
      });
      scaledImg.setAttribute("src", imageURL);
    });
  }).
  then(function (data) {
    let imageLink = document.createElement("a");
    imageLink.setAttribute("href", data.imageURL);
    imageLink.setAttribute('download', `${file.name}.webp`);
    imageLink.appendChild(data.scaledImg);
    imageBox.innerHTML = "";
    imageBox.appendChild(imageLink);
    document.querySelector('.link').value= data.imageURL;
    hidden1.classList.add('active');
    hidden2.classList.add('active');
    uploadbox.classList.add('active');
  });
}
function processFiles(files) {
  for (let file of files) {
    processFile(file);
  }
}
function fileSelectorChanged() {
  processFiles(abhay.fileSelector.files);
  abhay.fileSelector.value = "";
}
abhay.fileSelector.addEventListener("change", fileSelectorChanged);
var link = document.querySelector('.link');
function download(){
  const anchor = document.createElement("a");
     anchor.href =  link.value;
     anchor.download='';
     document.body.appendChild(anchor);
     anchor.click();
     document.body.removeChild(anchor);

}
function Clear(){
  document.querySelector('#previews').innerHTML = '';
  hidden1.classList.remove('active');
  hidden2.classList.remove('active');
  uploadbox.classList.remove('active');
}