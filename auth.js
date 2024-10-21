let form = document.querySelector("form");
let phoneInput = form.querySelector(".phone");

let btnNext = form.querySelector(".btnNext");
let btnBack = document.getElementById("btnBack"); // Кнопка "Назад"
let fieldsets = document.querySelectorAll("fieldset");
let completeBtn = document.getElementById("btnComplete");
let sendBtn = document.getElementById("send_code")
let getCodeNumberDiv = document.getElementById("get_code_number"); // Див для вывода телефона
// Создаем маску в инпуте
const phoneMask = new IMask(phoneInput, {
	mask: "+{7}(000)000-00-00",
});

// Установим кнопку в состояние disabled по умолчанию
btnNext.disabled = true;

// Обработчик события для инпута
phoneInput.addEventListener("input", phoneInputHandler);

function phoneInputHandler() {
	btnNext.disabled = !phoneMask.masked.isComplete; // Активируем или деактивируем кнопку
}

sendBtn.addEventListener("click", function () {
	getCodeNumberDiv.textContent = `${phoneInput.value}`;

});

// Обработчик клика на кнопку "Продолжить"
btnNext.addEventListener("click", function () {
	switchFieldset(1); // Переход к следующему fieldset
});


if (btnBack) {
	btnBack.addEventListener("click", function() {
			switchFieldset(0); // Возврат к предыдущему fieldset
	});
}

function switchFieldset(index) {
	fieldsets.forEach((fieldset, i) => {
		// Убираем классы и скрываем все fieldset
		fieldset.classList.remove('active');
		fieldset.disabled = true;

		// Если индекс совпадает, показываем его
		if (i === index) {
			fieldset.classList.add('active');
			fieldset.disabled = false;
			btnBack.classList.toggle('d-none', index === 0); // Скрываем кнопку "Назад", если это первый fieldset
		}
	});
}

// Изначально показываем первый fieldset
switchFieldset(0);

// Валидация кода смс
const inputs = document.querySelectorAll('.input-digit');


// Устанавливаем maxlength на стороне JavaScript и добавляем события
inputs.forEach(input => {
	input.setAttribute('maxlength', '1');
	input.addEventListener('input', handleInput);
	input.addEventListener('keydown', handleKeyDown);
});

// Функция обработки ввода
function handleInput(event) {
	// Заменяем значение на цифру, если введено несколько символов
	this.value = this.value.replace(/\D/g, '').substr(0, 1); // Ограничиваем ввод одним символом

	// Перемещение фокуса на следующее поле
	if (this.value.length === 1) {
		const nextIndex = Array.from(inputs).indexOf(this) + 1;
		if (nextIndex < inputs.length) {
			inputs[nextIndex].focus();
		}
	}

	// Проверка, заполнены ли все поля
	completeBtn.disabled = !Array.from(inputs).every(input => input.value.length === 1);
}

// Функция обработки нажатия "Backspace"
function handleKeyDown(event) {
	if (event.key === 'Backspace' && this.value.length === 0) {
		const prevIndex = Array.from(inputs).indexOf(this) - 1;
		if (prevIndex >= 0) {
			inputs[prevIndex].focus();
		}
	}
}

// Обработчик клика на кнопку
completeBtn.addEventListener("click", function () {
	// Проверка заполненных полей
	if (Array.from(inputs).every(input => input.value.length === 1)) {
		const code = Array.from(inputs).map(input => input.value).join('');

		// Проверка на условие "1111"
		if (code === '1111') {
			alert("Код " + code + " успешно принят");
			inputs.forEach(input => input.classList.remove('error'));
			window.location.href = "/gymkids/feed.html";//Редирект на вёрстку профиля
		} else {
			alert("Ошибка в введенном коде из смс");
			inputs.forEach(input => {
				input.value = ""; // Стираем значение каждого input
			});
			inputs.forEach(input => input.classList.add('error'));
		}
	}
});

const resendLink = document.getElementById('resend_code');
let timerRunning = false; // Флаг, указывающий на статус таймера

resendLink.addEventListener('click', function () {
	if (timerRunning) return; // Если таймер запущен, выходим из функции

	timerRunning = true; // Устанавливаем флаг, что таймер запущен

	// Запускаем обратный отсчет
	let countdown = 10;//10 секунд таймер для теста
	resendLink.textContent = `Отправить повторно через ${countdown} секунд`;

	const interval = setInterval(function () {
		countdown--;
		resendLink.textContent = `Отправить повторно через ${countdown} секунд`;

		if (countdown <= 0) {
			clearInterval(interval);
			resendLink.textContent = 'Отправить код заново'; // Вернуть текст
			timerRunning = false; // Сбрасываем флаг, чтобы можно было кликнуть снова
		}
	}, 1000);//1 секунду убавляем число

	// Деактивируем ссылку для повторной отправки на время отсчета
	resendLink.style.pointerEvents = 'none';
	setTimeout(() => {
		resendLink.style.pointerEvents = 'auto'; // Возвращаем возможность клика
	}, 10000);
	// Очищаем значения всех input
	inputs.forEach(input => {
		input.value = ""; // Стираем значение каждого input
	});
	completeBtn.disabled = true;
});