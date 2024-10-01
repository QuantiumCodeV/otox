const backendDomain =
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("127.0.0.1") ||
  window.location.hostname.includes("91.184.243.94")
    ? "https://casintymi.com"
    : `https://api.${window.location.hostname}`;

// Функция для сохранения данных в localStorage
const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

// Функция для получения данных из localStorage
const getFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};

// Функция для регистрации пользователя
async function registerUser(username, email, password) {
  const code = getFromLocalStorage("inviteCode");
  const requestBody = code
    ? { username, email, password, code }
    : { username, email, password };
  console.log(requestBody);
  console.log(code);       
  const response = await fetch(`${backendDomain}/otox/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  if (response.ok) {
    showSuccessMessage(
      "Registration successful",
      "#modal_registration .modal_rect_bottom_text_success",
      ".modal_registration"
    );
    loginUser(username, password);
  } else {
    showErrorMessage(
      result.error || "Registration error",
      "#modal_registration .modal_rect_bottom_text_error",
      ".modal_registration"
    );
  }
}

// Функция для логина пользователя
async function loginUser(username, password) {
  const response = await fetch(`${backendDomain}/backend/api/user/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  if (response.ok) {
    saveToLocalStorage("accessToken", result.access);
    saveToLocalStorage("refreshToken", result.refresh);
    saveToLocalStorage("password", password);

    (async function () {
      var profile = await getProfile(); // Ждем, пока получим данные профиля
      console.log(profile);

      if (profile) {
        saveToLocalStorage("username", profile.username);
        saveToLocalStorage("email", profile.email);
      } else {
        console.error("Не удалось получить профиль");
      }
    })();

    window.location.reload();
  } else {
    // Обработка ошибок и вывод сообщения
    showErrorMessage(
      result.non_field_errors || "Login error",
      ".modal_rect_bottom_text_error",
      ".modal_login"
    );
  }
}

// Функция для получения данных профиля
async function getProfile() {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/otox/profile/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const result = await response.json();
  if (response.ok) {
    console.log(result);
    return result;
  } else {
    return null;
  }
}

// Функция для изменения данных профиля
async function updateProfile(data) {
  $("#error_profile_text").hide();
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/otox/profile/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  console.log(result);
  if (response.ok) {
    //window.location.reload();
  } else {
    $("#error_profile_text").text(result.error).show();
  }
}

// Функция для удаления профиля
async function deleteProfile() {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/otox/profile/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const result = await response.json();
  if (response.ok) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("inviteCode");
    window.location.reload();
  } else {
    console.error("Profile deletion error:", result.error);
  }
}

// Функция для получения ссылки на загрузку
async function getDownloadLink(conferenceCode) {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(
    `${backendDomain}/otox/retreive/${conferenceCode}/`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const result = await response.json();
  if (response.ok) {
    return result.link;
  } else {
    return null;
  }
}

// Проверка на наличие кода в URL и сохранение в localStorage
const urlParams = new URLSearchParams(window.location.search);
const inviteCode = urlParams.get("join");
if (inviteCode) {
  saveToLocalStorage("inviteCode", inviteCode);
  window.location.href = window.location.origin; // Перенаправление на пустой путь
}
