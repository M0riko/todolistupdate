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
    const savedTasks = JSON.parse(localStorage.getItem('arr'));
    let elements = [];
    if (savedTasks && savedTasks.length > 0) {
        savedTasks.forEach(task => {
            create(task);
            showOrNotPaginat(elements);
            elements.push([...savedTasks]);
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

showOrNotPaginat(elements)

    btnChangeHeader.addEventListener('click', () => {
        let promptChange = prompt('Введи Наздвание', '');
        if(!promptChange.length == 0 && promptChange.length < 13) {
            headerText.innerHTML = promptChange;
        }
    });

    btnAddList.addEventListener('click', () => {
        const inputTask = input.value.trim();
        if(inputTask !== '') {
                create(inputTask);
                showItem(currentPage);
                elements.push(1);
                console.log(elements)
                showOrNotPaginat(elements);
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
        div.querySelector('.done').addEventListener('click', () => {
            if(!div.querySelector('.task-text').classList.contains('line')) {
                div.querySelector('.task-text').classList.add('line');
            } else {
                div.querySelector('.task-text').classList.remove('line');
            } 
        });
        div.querySelector('.task-text').addEventListener('click', () => {
            if(!div.querySelector('.task-text').classList.contains('line')) {
                div.querySelector('.task-text').classList.add('line')
            } else {
                div.querySelector('.task-text').classList.remove('line')
            }
        })
        div.querySelector('.del').addEventListener('click', () => {
            div.innerHTML = `Вы удалили задание: ${div.querySelector('.task-text').textContent}`;
            setTimeout(() => {
                div.remove();
                elements.pop()
                console.log(elements)
                showOrNotPaginat(elements)
                showItem(currentPage);
            }, 1000);
            saveTasksToLocalStorage();
        })
        div.querySelector('.change').addEventListener('click', () => {
            if(div.querySelector('.change-task').classList.contains('none')) {
                div.querySelector('.task-text').classList.add('none');
                div.querySelector('.change-task').classList.remove('none');
                div.querySelector('#change-text').value = task;
                div.querySelector('.doneChange').addEventListener('click', () => {
                    if(div.querySelector('#change-text').value.trim() !== '') {
                        div.querySelector('.task-text').innerHTML = div.querySelector('#change-text').value;
                        div.querySelector('.task-text').classList.remove('none');
                        div.querySelector('.change-task').classList.add('none');
                    }
                    saveTasksToLocalStorage();
                });
            } else if(div.querySelector('.task-text').classList.contains('none')) {
                div.querySelector('.task-text').classList.remove('none');
                div.querySelector('.change-task').classList.add('none');
            }
        });
        list.appendChild(div);   
        input.value = ''; 
        saveTasksToLocalStorage();
        function saveTasksToLocalStorage() {
            const tasks = Array.from(document.querySelectorAll('.task-text')).map(taskElement => taskElement.textContent);
            localStorage.setItem('arr', JSON.stringify(tasks));
        }
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
    console.log(1);
});
