export const logObject = (obj, label = '') =>
  console.log(`${label}`, JSON.stringify(obj, null, 2));

export const logRender = msg => {
  let ENV = process.env.REACT_APP_ENV;
  if (ENV !== 'production') {
    console.log(msg, new Date().getTime());
  }
};
