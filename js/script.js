document.addEventListener('DOMContentLoaded', function() {
    const btnChangeHeader = document.querySelector('#change-header'),
          input = document.querySelector('#input-text'),
          btnAddList = document.querySelector('.btn'),
          headerText = document.querySelector('.header-text'),
          list = document.querySelector('.task-list'),
          next = document.querySelector('.next'),
          prev = document.querySelector('.prev'),
          countPage = document.querySelector('.countPaginat'),
          paginat = document.querySelector('.paginat');
    const maxElement = 4;
    let currentPage = 1;
    countPage.innerHTML = currentPage;
    const savedTasks = () => JSON.parse(localStorage.getItem('arr'));
    console.log(savedTasks().length)
    if (savedTasks().length > 0) {
        savedTasks().forEach(task => {
            create(task);
            showOrNotPaginat(savedTasks());
        });
    }

function showOrNotPaginat(arr) {
    if(arr.length >= 5) {
        paginat.classList.add('active');
        paginat.classList.remove('none');
    } else if(arr.length < 5) {
        paginat.classList.remove('active');
        paginat.classList.add('none');
        currentPage = 1;
        countPage.innerHTML = currentPage;
    }
}

showOrNotPaginat(savedTasks())

    btnChangeHeader.addEventListener('click', () => {
        let promptChange = prompt('Введи Заголовок', '');
        if(promptChange.length !== 0 && promptChange.length < 13) {
            headerText.innerHTML = promptChange;
        }
    });

    btnAddList.addEventListener('click', (e) => {
        e.preventDefault();
        const inputTask = input.value.trim();
        const lowerCaseSaveArr = savedTasks().reduce((arr, e) => {
            arr.push(e.toLowerCase());
            return arr;
        }, [])
        if(lowerCaseSaveArr.indexOf(inputTask.toLowerCase()) >= 0) {
            const errorDiv = document.createElement('div')
            errorDiv.innerHTML = `Такая задача уже есть!`;
            errorDiv.style.position = 'absolute';
            errorDiv.style.color = 'red';
            errorDiv.style.top = '62px';
            errorDiv.style.fontSize = '25px';
            document.querySelector('.form').appendChild(errorDiv)
            setTimeout(() => {
                errorDiv.remove()
            }, 1000)
        } else if(inputTask !== '') {
                savedTasks();
                create(inputTask);
                showItem(currentPage);
                savedTasks().push(`${inputTask}`);
                console.log(savedTasks())
                showOrNotPaginat(savedTasks());

        } else {
            const errorDiv = document.createElement('div')
            errorDiv.innerHTML = `Вы ничего не ввели!`;
            errorDiv.style.position = 'absolute';
            errorDiv.style.color = 'red';
            errorDiv.style.top = '62px';
            errorDiv.style.fontSize = '25px';
            document.querySelector('.form').appendChild(errorDiv)
            setTimeout(() => {
                errorDiv.remove()
            }, 1000)
        }
    }); 


    function create(task) {
        const div = document.createElement('div');
        div.classList.add('task');
        div.innerHTML= `
            <form action="#" class="change-task none">
            <input type="text" id="change-text">
            <button class="doneChange">EDIT</button>
            </form>
                <div class="task-text">${task}</div>
                <div class="task-buttons">
                <button class="change"><img src="img/change.png" alt="change"></button>
                <button class="done"><img src="img/done.png" alt="change"></button>
                <button class="del"><img src="img/dalete.png" alt="change"></button>
            </div>
        `;
        const doneButton = div.querySelector('.done');
        const taskText = div.querySelector('.task-text');
        const delButton = div.querySelector('.del');
        const changeButton = div.querySelector('.change');
        const changeTaskInput = div.querySelector('#change-text');
        const doneChangeButton = div.querySelector('.doneChange');
        
        doneButton.addEventListener('click', () => {
            if (!taskText.classList.contains('line')) {
                taskText.classList.add('line');
            } else {
                taskText.classList.remove('line');
            }
        });
        
        taskText.addEventListener('click', () => {
            if (!taskText.classList.contains('line')) {
                taskText.classList.add('line');
            } else {
                taskText.classList.remove('line');
            }
        });
        
        delButton.addEventListener('click', (e) => {
            div.innerHTML = `Вы удалили задание: ${taskText.textContent}`;
            console.log(savedTasks().indexOf(taskText.textContent))
            setTimeout(() => {
                div.remove();
                console.log(savedTasks())
                showOrNotPaginat(savedTasks());
                showItem(currentPage);
            }, 1000);
            saveTasksToLocalStorage();
        });
        
        changeButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (taskText.classList.contains('none')) {
                taskText.classList.remove('none');
                changeTaskInput.classList.add('none');
            } else {
                taskText.classList.add('none');
                changeTaskInput.classList.remove('none');
                changeTaskInput.value = taskText.textContent;
            }
        });
        
        doneChangeButton.addEventListener('click', () => {
            if (changeTaskInput.value.trim() !== '') {
                taskText.innerHTML = changeTaskInput.value;
                taskText.classList.remove('none');
                changeTaskInput.classList.add('none');
            }
            saveTasksToLocalStorage();
        });

        
        list.appendChild(div);   
        input.value = ''; 
        saveTasksToLocalStorage();
    } 
    function saveTasksToLocalStorage() {
            const tasks = Array.from(document.querySelectorAll('.task-text')).map(taskElement => taskElement.textContent);
            localStorage.setItem('arr', JSON.stringify(tasks));
    }

    function showItem(page) {
        const elemetnPage = list.querySelectorAll('.task');
        const startIndex = (page - 1) * maxElement;
        const endIndex = startIndex + maxElement ;
        elemetnPage.forEach((item, index) => {
            if(index >= startIndex && index < endIndex) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        })
    };
    showItem(currentPage);
    next.addEventListener('click', () => {
        const elemetnPage = list.querySelectorAll('.task');
        const totalPage = Math.ceil(elemetnPage.length / maxElement);
        if(currentPage < totalPage) {
            currentPage++;
            countPage.innerHTML = currentPage;
            showItem(currentPage);
        }
    })
    prev.addEventListener('click', () => {
        
        if(currentPage > 1) {
            currentPage--;
            countPage.innerHTML = currentPage;
            showItem(currentPage);
        }
    })
});