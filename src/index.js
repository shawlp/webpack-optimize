import './css/main/index.css';

document.getElementById('btn').onclick = function() {
  import('./handle').then(fn => fn.default());
}

document.getElementById('login').onclick = function() {
  location.href = '/login.html';
}

// $('#login').click(function() {
//   location.href = '/login.html';
// });
console.log('Dev', DEV);
//我们在开发环境中会使用预发环境或者是本地的域名，生产环境中使用线上域名，我们可以在 webpack 定义环境变量，然后在代码中使用
if(DEV === 'development') {
  //开发环境
  let myMap = new Map();
  myMap.set("foo", {name: 'baz', desc: 'inga'});
  // let name = myMap.get('bar')?.name;
  console.log('name1', name);
}else {
  //生产环境
}
