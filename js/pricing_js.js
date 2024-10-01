function showErrorMessage(message, selectorError, selectorModal) {
  $(selectorError).text(message); // Отображаем сообщение об ошибке
  $(selectorModal).addClass("modal_login_failed"); // Добавляем класс для отображения ошибки
}
function showSuccessMessage(message, selectorSuccess, selectorModal) {
  $(selectorSuccess).text(message); // Отображаем сообщение об ошибке
  $(selectorModal).addClass("modal_login_success"); // Добавляем класс для отображения ошибки
}

$(document).ready(function () {
  $("#avatarInput").on("change", function () {
    // Получаем выбранный файл
    const file = this.files[0]; // Получаем первый файл из массива files

    // Проверяем, выбран ли файл
    if (file) {
      // Изменяем текст в label на имя выбранного файла
      $("#labelAvatarInput").text("Selected file: " + file.name);
    } else {
      // If no file is selected, return the default text
      $("#labelAvatarInput").text("Update picture");
    }
  });
});
$(document).ready(function () {
  // Проверяем наличие токена доступа при загрузке страницы
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    // Если токен существует, пользователь авторизован
    $("body").addClass("avtoriz"); // Добавляем класс 'avtoriz' к body

    (async function () {
      var profile = await getProfile(); // Ждем, пока получим данные профиля
      console.log(profile);

      if (profile) {
        $("#email").text(profile.email);
        $("#login").text(profile.username);
        $("#login_2").text(profile.username);
        $("#settingsLoginInput").val(profile.username);
        $("#settingsEmailInput").val(profile.email);
        if (profile.avatar) {
          $("#avatar").attr("src", "data:image/png;base64, " + profile.avatar);
        }
      } else {
        console.error("Не удалось получить профиль");
        loginUser(
          getFromLocalStorage("username"),
          getFromLocalStorage("password")
        );
      }
    })();
  } else {
    // Если токен отсутствует, пользователь не авторизован
    $("body").removeClass("avtoriz"); // Убедимся, что класс 'avtoriz' отсутствует
  }

  // Обработка нажатия на кнопку "Log In"
  $(".modal_login .modal_rect_bottom_button").on("click", function () {
    const email = $("#modal_login input[type='text']").val();
    const password = $("#modal_login input[type='password']").val();

    // Сбрасываем класс ошибки и текст ошибки перед новой попыткой
    $(".modal_login").removeClass("modal_login_failed");

    // Простая валидация полей
    if (!email || !password) {
      showErrorMessage(
        "Please fill in all fields.",
        ".modal_rect_bottom_text_error",
        ".modal_login"
      ); // Отображаем сообщение
      return; // Прерываем выполнение, если поля пустые
    }

    // Вызов функции логина
    loginUser(email, password);
  });

  // Обработка нажатия на кнопку "Register"
  $("#modal_registration .modal_rect_bottom_button").on("click", function () {
    const username = $("#modal_registration input[type='text']").eq(0).val();
    const email = $("#modal_registration input[type='text']").eq(1).val();
    const password = $("#modal_registration input[type='password']")
      .eq(0)
      .val();
    const repeatPassword = $("#modal_registration input[type='password']")
      .eq(1)
      .val();
    console.log("43423");
    // Сбрасываем класс ошибки и текст ошибки перед новой попыткой
    $("#modal_registration .modal_registration").removeClass(
      "modal_login_failed"
    );
    $("#modal_registration .modal_rect_block").removeClass("error");

    // Простая валидация полей
    let hasError = false;
    if (!username) {
      console.log("username");
      $("#modal_registration .modal_rect_block").eq(0).addClass("error");
      hasError = true;
    }
    if (!email) {
      console.log("email");
      $("#modal_registration .modal_rect_block").eq(1).addClass("error");
      hasError = true;
    }
    if (!password) {
      console.log("password");
      $("#modal_registration .modal_rect_block").eq(2).addClass("error");
      hasError = true;
    }
    if (!repeatPassword) {
      console.log("repeatPassword");
      $("#modal_registration .modal_rect_block").eq(3).addClass("error");
      hasError = true;
    }

    if (hasError) {
      showErrorMessage(
        "Please fill in all fields.",
        "#modal_registration .modal_rect_bottom_text_error",
        ".modal_registration"
      ); // Отображаем сообщение
      return; // Прерываем выполнение, если поля пустые
    }

    if (password !== repeatPassword) {
      console.log("password !== repeatPassword");
      $("#modal_registration .modal_rect_block").eq(2).addClass("error");
      $("#modal_registration .modal_rect_block").eq(3).addClass("error");
      showErrorMessage(
        "Passwords do not match.",
        "#modal_registration .modal_rect_bottom_text_error",
        ".modal_registration"
      ); // Отображаем сообщение
      return; // Прерываем выполнение, если пароли не совпадают
    }
    console.log("412341234123423");
    // Вызов функции регистрации
    registerUser(username, email, password);
  });
});

// ПЕРЕКЛЮЧЕНИЕ СЕКЦИЙ В PRICING

$(document).ready(function () {
  // Hide all sections initially
  $(".picing_section").hide();

  // Show the first section on page load
  $(".picing_section:first").show();

  // Add event listener to buttons
  $(".picing_button").click(function () {
    // Get the index of the clicked button
    var index = $(this).index();

    // Hide all sections
    $(".picing_section").hide();

    // Show the corresponding section
    $(".picing_section:eq(" + index + ")").show();

    // Remove active class from all buttons
    $(".picing_button").removeClass("picing_button_active");

    // Add active class to the clicked button
    $(this).addClass("picing_button_active");
  });
});

// ДРОПМЕНЮ

$(".pricing_avtoriz_user").on("click", function () {
  var $this = $(this);
  var $menu = $(".pricing_avtoriz_menu");
  var $arrow = $this.find(".pricing_avtoriz_user_arrow");

  if ($menu.is(":hidden")) {
    $menu.slideDown();
    $arrow.css("transform", "rotate(180deg)");
  } else {
    $menu.slideUp();
    $arrow.css("transform", "rotate(0deg)");
  }
});

// Добавляем обработчик клика для элементов меню
$(".pricing_avtoriz_menu_item").on("click", function () {
  var $menu = $(".pricing_avtoriz_menu");
  var $arrow = $(".pricing_avtoriz_user_arrow");

  $menu.slideUp(); // Скрываем меню
  $arrow.css("transform", "rotate(0deg)"); // Возвращаем стрелку в исходное положение
});

// ПОКАЗАТЬ / СКРЫТЬ ПАРОЛЬ В МОДАЛЬНОМ ОКНЕ В PASSWORD

$(document).ready(function () {
  $(".modal_rect_block_eyes").on("click", function () {
    var $passwordInput = $(".modal_input_pass");

    if ($passwordInput.attr("type") === "password") {
      // Меняем тип на текст для отображения пароля
      $passwordInput.attr("type", "text");
      // Меняем изображение на открытое
      $(this).attr("src", "./img/modal/yeyes_open.svg");
    } else {
      // Меняем тип обратно на password для скрытия пароля
      $passwordInput.attr("type", "password");
      // Меняем изображение на закрытое
      $(this).attr("src", "./img/modal/yeyes.svg");
    }
  });

  $(".modal_rect_block_eyes2").on("click", function () {
    var $passwordInput = $(".modal_input_pass2");

    if ($passwordInput.attr("type") === "password") {
      // Меняем тип на текст для отображения пароля
      $passwordInput.attr("type", "text");
      // Меняем изображение на открытое
      $(this).attr("src", "./img/modal/yeyes_open.svg");
    } else {
      // Меняем тип обратно на password для скрытия пароля
      $passwordInput.attr("type", "password");
      // Меняем изображение на закрытое
      $(this).attr("src", "./img/modal/yeyes.svg");
    }
  });
});

// СКРИПТ НА МОДАЛЬНЫЕ ОКНА ОТКРЫТИЕ И ЗАКРЫТИЕ
$(document).ready(function () {
  // Функция для открытия модального окна
  $(".open-modal").on("click", function () {
    // Закрываем все открытые модальные окна перед открытием нового
    $(".modal_new").fadeOut();

    // Получаем ID модального окна из data-атрибута
    var modalId =
      $(this).data("modal_login") ||
      $(this).data("modal_setting") ||
      $(this).data("modal_delete") ||
      $(this).data("modal_registration");

    if (modalId) {
      $(modalId).fadeIn(0); // Показываем модальное окно с плавным эффектом (duration: 500ms)
    }
  });

  // Закрытие модального окна при нажатии на .modal_rect_close
  $(".modal_rect_close").on("click", function () {
    $(this).closest(".modal_new").fadeOut(0); // Скрываем родительское модальное окно с плавным эффектом (duration: 500ms)
  });

  // Закрытие модального окна при клике на затемненную область
  $(".modal_overlay").on("click", function (event) {
    if ($(event.target).is(this)) {
      // Проверяем, был ли клик на затемнённой области
      $(this).closest(".modal_new").fadeOut(0); // Скрываем модальное окно с плавным эффектом (duration: 500ms)
    }
  });
});

// СКРИПТ ДЛЯ ЗАПРЕЩЕНИЯ ПОВТОРНОГО СКАЧИВАНИЯ

$(document).ready(function () {
  const downloadLink = document.getElementById("join-download-link");
  const message = document.getElementById("message");

  downloadLink.addEventListener("click", function () {
    downloadLink.style.display = "none"; // Скрываем ссылку
    message.textContent = "You have already downloaded this file.";
  });
});

// СКРИПТ НА ВВОД ДАННЫХ В ИНПУТЕ В SETTINGS
$(document).ready(function () {
  $("#modal_input_check").on("input", function () {
    // Получаем количество символов в инпуте
    const inputText = $(this).val();

    // Проверяем, минимальная ли длина 5 символов
    if (inputText.length >= 5) {
      $("#modal_img_check").css("opacity", 1); // Устанавливаем opacity 1
    } else {
      $("#modal_img_check").css("opacity", 0.5); // Возвращаем opacity 0.5
    }
  });
});

// ВЫХОД ИЗ АККАУНТА УДАЛЕНИЕ AVTORIZ из BODY
$(document).ready(function () {
  $("#button_logout").on("click", function () {
    // Удаляем класс 'avtoriz' из body
    $("body").removeClass("avtoriz");

    // Очистка токенов из localStorage (если они есть)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("inviteCode");

    // Дополнительно: Перенаправление на главную страницу или страницу логина
    window.location.href = "/"; // или '/login' если есть такая страница
  });
});

// ЕСЛИ НЕ АВТОРИЗОВАН ТО РЕГИСТРАЦИ ВЫСКАКИВАЕТ НА ГЛАНЫХ СТРАНИЦАХ
$(document).ready(function () {
  $("#index_button_join, #index_button_create").on("click", function (event) {
    event.preventDefault(); // prevent default behavior of the button
    if (!$("body").hasClass("avtoriz")) {
      $("#modal_registration").css("display", "block"); // Show the modal registration
      $(".connect").removeClass("show"); // remove the 'show' class from .connect elements
      $(".modal").removeClass("show"); // remove the 'show' class from .modal elements
    }
  });
});

// ЗАКРЫТИЕ CONNECT ПОСЛЕ ОТКРЫТИЯ JOIN
$(document).ready(function () {
  $(".connect__submit").on("click", function () {
    $(".connect").removeClass("show");
  });
});

// УДАЛЕНИЕ АККАУНТА
$(document).ready(function () {
  $(".modal_delete_rect_button").on("click", function () {
    deleteProfile();
  });
});

$(document).ready(function () {
  // Обработка нажатия на кнопку "Save"
  $("#saveButton").on("click", async function () {
    const email = $("#settingsEmailInput").val();
    const username = $("#settingsLoginInput").val();
    const currentPassword = $("#currentPasswordInput").val();
    const newPassword = $("#newPasswordInput").val();
    const avatarInput = $("#avatarInput")[0];
    console.log(avatarInput);
    const avatarFile = avatarInput ? avatarInput.files[0] : null; // Получаем файл аватара, если он существует
    console.log(avatarFile);
    $("#avatarInputError").text("Maximum file size is 512KB").hide();
    // Проверка на максимальный размер файла (512KB)
    if (avatarFile && avatarFile.size > 512 * 1024) {
      $("#avatarInputError").text("Maximum file size is 512KB").show();
      return;
    }
    var profile = await getProfile(); // Ждем, пока получим данные профиля
    console.log(profile);

    if (profile) {
      console.log(email);
      console.log(profile.email);
      console.log(username);
      console.log(profile.username);
    } else {
      console.error("Не удалось получить профиль");
      return;
    }

    // Создаем объект данных для отправки на сервер
    const data = {};

    // Добавляем в объект только те поля, которые были изменены
    if (email && email != profile.email) {
      data.email = email;
    }
    if (username && username != profile.username) {
      data.username = username;
    }
    if (currentPassword) {
      if (currentPassword == getFromLocalStorage("password")) {
        if (newPassword) {
          data.password = newPassword; // Отправляем новый пароль
      }
      else{
       $("#error_profile_text").text("Password is incorrect").show();
      }
    }
    console.log(avatarFile);
    // Если файл аватара выбран, добавляем его в данные
    if (avatarFile) {
      console.log(avatarFile);
      const reader = new FileReader();
      reader.readAsDataURL(avatarFile);
      reader.onload = function () {
        const base64Image = reader.result.split(",")[1]; // Получаем строку Base64
        data.avatar = base64Image; // Добавляем в объект данных
        updateProfile(data); // Вызываем функцию для обновления профиля
      };
      reader.onerror = function (error) {
        console.error("Error converting file to Base64:", error);
      };
    } else {
      // Если аватар не выбран, просто обновляем профиль без него
      updateProfile(data);
    }
  });
});

$(document).ready(function () {
  // Обработчик события нажатия на кнопку "Submit"
  $("#connect_submit").click(async function (e) {
    const inputVal = $("#id_input").val(); // Получаем значение из поля ввода

    // Проверяем, если поле ввода не пустое
    $("#modal_room_connection").removeClass("form_error_custom");
    if (inputVal.length < 0) {
      $("#connect_submit").addClass("non-active"); // Делаем кнопку неактивной
    } else {
      // Если поле пустое, получаем ссылку на загрузку
      const link = await getDownloadLink(inputVal); // Предполагается, что getDownloadLink возвращает ссылку

      // Проверяем, получена ли ссылка
      if (link) {
        $(".connect").removeClass("show"); // Скрываем модальное окно
        $("#join-download-link").attr("href", link); // Устанавливаем ссылку
        $("#modal_join").css("display", "block"); // Показываем модальное окно
      } else {
        $("#modal_room_connection").addClass("form_error_custom");
      }
    }
  });

  // Обработчик события ввода в поле
  $("#id_input").on("input", function () {
    const inputVal = $(this).val(); // Получаем текущее значение поля ввода

    // Проверяем, если поле ввода не пустое
    if (inputVal.length > 0) {
      $("#connect_submit").removeClass("non-active"); // Делаем кнопку активной
    } else {
      $("#connect_submit").addClass("non-active"); // Делаем кнопку неактивной
    }
  });
});
