// Валидация формы на contact.html
const form = document.querySelector('.contact_form');
const btn = form.querySelector('.btn');

form.addEventListener('input', () => {
    const hasValue = Array.from(form.querySelectorAll('input, textarea'))
        .some(input => input.value.trim() !== ''); // Проверяем, есть ли хотя бы одно незакрытое значение

    btn.disabled = !hasValue; // Если есть значение, снимаем disabled, иначе - добавляем
});

//Фейковая отправка и вызов класса success
const successMessage = document.querySelector('.success');

form.addEventListener('submit', function(event) {
		event.preventDefault(); // Предотвращаем стандартное поведение формы

		// Стираем данные из формы
		form.reset();

		// Показываем сообщение об успешной отправке
		successMessage.classList.add('active');

		// Убираем сообщение через 4 секунды
		setTimeout(() => {
				successMessage.classList.remove('active');
		}, 4000);
		btn.disabled = true;
});