function BlobDownload(blob, filename) {
  this.blob = blob;
  this.filename = filename;
}

BlobDownload.prototype.download = function() {
  var a, event;
  a = document.createElement('a');
  a.href = window.URL.createObjectURL(this.blob);
  a.download = this.filename;
  document.body.appendChild(a);
  event = document.createEvent('MouseEvents');
  event.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(event);
  document.body.removeChild(a);
};

export default BlobDownload;
