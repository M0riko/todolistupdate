document.addEventListener('DOMContentLoaded', function() {
    const btnChangeHeader = document.querySelector('#change-header'),
          input = document.querySelector('#input-text'),
          btnAddList = document.querySelector('.btn'),
          headerText = document.querySelector('.header-text'),
          list = document.querySelector('.task-list'),
          listTask = document.querySelector('.task');
    let countTask = 0;




    const savedTasks = JSON.parse(localStorage.getItem('arr'));

    if (savedTasks && savedTasks.length > 0) {
        savedTasks.forEach(task => {
            create(task);
        });
    }




    btnChangeHeader.addEventListener('click', () => {
        let promptChange = prompt('Введи Наздвание', '');
        headerText.innerHTML = promptChange;
    });


    btnAddList.addEventListener('click', () => {
        const inputTask = input.value.trim();
        if(inputTask !== '') {
            if(countTask < 4){
                create(inputTask);
            }
        }
    }); 


    function create(task) {
        
        countTask ++;
        const div = document.createElement('div');
        div.classList.add('task');
        div.innerHTML= `
            <form action="#" class="change-task none">
            <input type="text" id="change-text">
            <button class="doneChange">CHANGE</button>
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
                div.querySelector('.task-text').classList.add('line')
            } else {
                div.querySelector('.task-text').classList.remove('line')
            }
            saveTasksToLocalStorage();
        });
        div.querySelector('.task-text').addEventListener('click', () => {
            if(!div.querySelector('.task-text').classList.contains('line')) {
                div.querySelector('.task-text').classList.add('line')
            } else {
                div.querySelector('.task-text').classList.remove('line')
            }
        })
        div.querySelector('.del').addEventListener('click', () => {
            countTask--;
            div.remove();
            saveTasksToLocalStorage()
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
});