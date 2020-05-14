"use strict";

const tasks = [
    //таски по дефолту
    {
        _id: "5d2ca9e2e03d40b326596aa7",
        completed: false,
        body: "Купить 30 литров воды на дачу .\r\n",
        title: "Вода",
    },
    {
        _id: "5d2ca9e29c8a94095c1288e0",
        completed: false,
        body: "Забрать велосипеды с гаража и поехать на шашлыки в субботу.\r\n",
        title: "Вело-шашлыки",
    },
    {
        _id: "5d2ca9e2e03d40b3232496aa7",
        completed: true,
        body: "Скупиться на отдых в Турцию.\r\n",
        title: "Турция",
    },
    {
        _id: "5d2ca9e29c8a94095564788e0",
        completed: false,
        body: "Поехать на рыбалку с дедушкой\r\n",
        title: "Рыбалка",
    },
];

(function (arrOfTasks) {
    //закрытая самовызывающаеся функция
    //Elements UI
    const listContainer = document.querySelector(
        ".tasks-list-section .list-group"
    ); //лист контейнер моих тасков

    //Element UI для создания нового таска
    const form = document.forms["addTask"], //работа с формой addTask
        inputTitle = form.elements["title"], //элемент формы title
        inputBody = form.elements["body"];

    form.addEventListener("submit", onFormSubmitHandler);
    renderAllTasks(tasks); //ф-ция добавление тасков на страницу

    const tabLinks = document.querySelectorAll(".tablinks"); //табы на странице 
    tabLinks[1].addEventListener("click", (e) => {
        listContainer.style.display = "none";
    }); //записываем новый массивы и храним там данные и удаляем и пеермещаем их

    function renderAllTasks(tasksList) {
        //создадим фрагмент для добавление структуры на сайт
        const fragment = document.createDocumentFragment();
        //перебор тасков
        for (let i = 0; i < tasks.length; i++) {
            const li = listItemTemplate(tasks, i); //добавляем в li - таски
            fragment.appendChild(li); //добавляем каждый таск в фрагмент
        }
        listContainer.appendChild(fragment); //загружаем в наш контейнер фрагмент
        tasksIsEmpty(tasksList);
    }

    function listItemTemplate(array, i) {
        //шаблон - конструкция
        const li = document.createElement("li");
        li.classList.add(
            "list-group-item",
            "d-flex",
            "align-items-center",
            "flex-wrap",
            "mt-2"
        );
        li.setAttribute("data-task-id", array[i]._id); //устанавливаем атрибут нашему лист айтему //для реализации дальнейшего удаления таска
        //li.setAttribute("data-checkBox-check", array[i].completed);


        const span = document.createElement("span");
        span.textContent = array[i].title;
        span.style.fontWeight = "bold";
        span.style.fontSize = "20px";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete task";
        deleteBtn.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");


        const switchBox = document.createElement("label");
        switchBox.classList.add("switch");
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        if (array[i].completed == true) { //если выгружаемая задача уже завершена то ставим чекедв тру
            checkBox.checked = true;
        }

        const spanBox = document.createElement("span");
        spanBox.classList.add("slider");
        switchBox.appendChild(checkBox);
        switchBox.appendChild(spanBox);

        const article = document.createElement("p");
        article.textContent = array[i].body;
        article.classList.add("mt-2", "w-100");


        li.appendChild(span);
        li.appendChild(deleteBtn);
        li.appendChild(article);
        li.appendChild(switchBox);

        isStatusCompleted(li, i); // проверка состояния таска
        return li;
    }

    //функция добавления нового таска при нажатие кнопки addTask
    function onFormSubmitHandler(e) {
        e.preventDefault(); //убираю стандартное поведение браузера
        const titleValue = inputTitle.value,
            bodyValue = inputBody.value;

        if (!titleValue || !bodyValue) {
            alert("Пожалуйста заполните поля Title and Body");
            return;
        }

        createNewTask(titleValue, bodyValue);

        const listItem = listItemTemplate(tasks, tasks.length - 1); //добавление шаблона нового таска
        listContainer.insertAdjacentElement("afterbegin", listItem); //добавление нашего таска в начало контейнра тасков
        form.reset(); //очистка формы
        tasksIsEmpty(tasks);
    }

    //ф-ция создания нового таска по введенным значениям
    function createNewTask(title, body) {
        const newTask = {
            _id: `New Task - ${Math.random()}`,
            completed: false,
            body,
            title,
        };

        tasks.push(newTask);
    }

    //Удаление таска через делегирование, по сколько елемент изначально не является созданным в html документе
    listContainer.addEventListener("click", (e) => {
        const parent = e.target.closest("[data-task-id]"); //поиск ближайшего родителя с нужным для нас атрибутом
        const id = parent.dataset.taskId; //получение нашего айдишника
        if (e.target.classList.contains("delete-btn")) {
            //проверка на наличиек ласса у нашего клик
            const confirmed = deleteTask(id);
            deleteTaskFromHtmlContainer(confirmed, parent);
            tasksIsEmpty(tasks);
        } else if (e.target.classList.contains("slider")) {
            const myObj = tasks.find((item) => item._id == id); //нахожу искомый обьект в массиве
            const valueCheck = myObj.completed; //получае булиновое значение из массива тассков

            finallyTask(valueCheck, parent, tasks.indexOf(myObj)); //третий параметр- возращаемый индекс по найденному значению в массиве
        }
    });
    //чек бокс выполнения таска
    function finallyTask(valueCheck, parent, index) {
        if (valueCheck == false) {
            tasks[index].completed = true;
            parent.style.background = "rgba(79, 79, 79, 0.1)";
            parent.style.color = "rgba(79, 79, 79, 0.4)";
        } else if (valueCheck == true) {
            tasks[index].completed = false;
            parent.style.background = "white";
            parent.style.color = "black";
        }
    }
    //фунция проверки свойста completed
    function isStatusCompleted(parent, i) {
        if (tasks[i].completed == true) {
            parent.style.background = "rgba(79, 79, 79, 0.1)";
            parent.style.color = "rgba(79, 79, 79, 0.4)";
        }
    }

    function deleteTaskFromHtmlContainer(confirmed, element) {
        if (confirmed) {
            element.remove();
        } else {
            return;
        }
    }

    function deleteTask(id) {
        const findId = tasks.find((item) => item._id == id); //нахожу нужный обьект в своем массиве тасков
        const isConfirm = confirm(`Удалить задачу с именем: "${findId.title}" ?`);
        if (!isConfirm) {
            return isConfirm;
        } else {
            return isConfirm;
        }
    }

    //проверка на наличие тасков и вывод соотвествующего сообщения
    function tasksIsEmpty(tasks) {
        const message = "У Вас нет задач. Создайте пожалуйста новую задачу";
        const tamplateMessage = document.createElement("div");
        tamplateMessage.classList.add("massageEmptyTasks");
        tamplateMessage.style.margin = "0 auto";
        tamplateMessage.style.fontSize = "25px";
        tamplateMessage.style.textAlign = "center";
        tamplateMessage.style.width = "720px";
        tamplateMessage.textContent = message;

        if (listContainer.childElementCount == 0) {
            listContainer.appendChild(tamplateMessage);
        } else if (listContainer.firstElementChild.className !== 'massageEmptyTasks' &&
            listContainer.lastElementChild.className == 'massageEmptyTasks') {
            listContainer.lastChild.remove();
        }
    }


})(tasks);

// function openCity(evt, cityName) {
//     // Declare all variables
//     var i, tabcontent, tablinks;

//     // Get all elements with class="tabcontent" and hide them
//     tabcontent = document.getElementsByClassName("tabcontent");
//     for (i = 0; i < tabcontent.length; i++) {
//         tabcontent[i].style.display = "none";
//     }

//     // Get all elements with class="tablinks" and remove the class "active"
//     tablinks = document.getElementsByClassName("tablinks");
//     for (i = 0; i < tablinks.length; i++) {
//         tablinks[i].className = tablinks[i].className.replace(" active", "");
//     }

//     // Show the current tab, and add an "active" class to the button that opened the tab
//     document.getElementById(cityName).style.display = "block";
//     evt.currentTarget.className += " active";
// }