// Image accordion: opens on click, tap or keyboard focus. No network, no storage.
const items = document.querySelectorAll('.acc__item');
function openItem(target) {
  items.forEach((item) => {
    const on = item === target;
    item.classList.toggle('is-open', on);
    item.querySelector('.acc__btn').setAttribute('aria-expanded', String(on));
  });
}
items.forEach((item) => {
  const btn = item.querySelector('.acc__btn');
  btn.addEventListener('click', () => openItem(item));
  btn.addEventListener('focus', () => openItem(item));
});
