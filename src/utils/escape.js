function escape(value) {
  if (!value) return null;
  var e;
  e = document.createElement('div');
  e.innerText = value;
  return e.innerHTML;
}

export default escape;
