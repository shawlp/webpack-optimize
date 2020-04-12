export default function Hello() {
  console.log('hello');
  fetch("/user")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

  console.log('DEV', DEV);
} 