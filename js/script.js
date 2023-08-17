document.addEventListener('DOMContentLoaded', function () {
    const todo = () => JSON.parse(localStorage.getItem('todos')) || [];
    const btnChangeHeader = document.querySelector('#change-header'),
        input = document.querySelector('#input-text'),
        btnAddList = document.querySelector('.btn'),
        headerText = document.querySelector('.header-text'),
        list = document.querySelector('.task-list'),
        next = document.querySelector('.next'),
        prev = document.querySelector('.prev'),
        countPage = document.querySelector('.countPaginat'),
        paginat = document.querySelector('.paginat'),
        sorts = document.querySelector('#mySelect');
    const maxElement = 4;
    let currentPage = 1;
    countPage.innerHTML = currentPage;


    //создание сохранных тасок с локал сторедж
    todo().forEach(task => {
        createHtml(task);
    });
    
    function showOrNotPaginat(length) {
        if (length >= 5) {
            paginat.classList.add('active');
            paginat.classList.remove('none');
        } else {
            paginat.classList.remove('active');
            paginat.classList.add('none');
            currentPage = 1;
            countPage.innerHTML = currentPage;
        }
        showItem(currentPage)
    }
    showOrNotPaginat(todo().length)


    function errorDiv(text, color = 'red', time = 1000) {
        const errorDiv = document.createElement('div')
        errorDiv.innerHTML = `${text}`;
        errorDiv.style.position = 'absolute';
        errorDiv.style.color = color;
        errorDiv.style.top = '62px';
        errorDiv.style.fontSize = '25px';
        document.querySelector('.form').appendChild(errorDiv)
        setTimeout(() => {
            errorDiv.remove()
        }, time)
    }
    btnChangeHeader.addEventListener('click', () => {
        let promptChange = prompt('Введи Заголовок', '');
        if (promptChange.length !== 0 && promptChange.length < 13) {
            headerText.innerHTML = promptChange;
        }
    });

    btnAddList.addEventListener('click', (e) => {
        e.preventDefault();
        const todo  = JSON.parse(localStorage.getItem('todos')) || [];
        const searchDuplicate = () => todo.reduce((arr, el) => {
            arr.push(el.name)
            return arr;
        }, [])
        if(searchDuplicate().indexOf(input.value.trim()) >= 0) {
            errorDiv('Такая задача уже есть!');
        } else if(input.value.length > 0) {
            todo.push({
                name: input.value.trim(),
                id: Math.random().toString(36).substr(2, 9),
                done: false
            })
            createHtml(todo[todo.length - 1])
            localStorage.setItem('todos', JSON.stringify(todo))
            showOrNotPaginat(todo.length + 1)
            input.value = ''
        } else {
            errorDiv('Введите что-то!')
        }
    });


    function createHtml({ id, name, done }) {
        const div = document.createElement('div');
        div.id = id
        div.classList.add('addTask')
        setTimeout(() => {
            div.classList.add('task');
            div.innerHTML = `
                <form action="#" class="change-task none">
                <input type="text" id="change-text">
                <button class="doneChange">EDIT</button>
                </form>
                    <div class="task-text ${done && 'line'}">${name}</div>
                    <div class="task-buttons">
                    <button class="change"><img src="img/change.png" alt="change"></button>
                    <button class="done"><img src="img/done.png" alt="change"></button>
                    <button class="del"><img src="img/dalete.png" alt="change"></button>
                </div>
            `;
            showOrNotPaginat(todo().length)
        }, 200)

        setTimeout(() => {
            listner(id)
        }, 0);
        showOrNotPaginat(todo().length)
        list.appendChild(div);

    }

    function showItem(page) {
        const elemetnPage = list.querySelectorAll('.task');
        const startIndex = (page - 1) * maxElement;
        const endIndex = startIndex + maxElement;
        elemetnPage.forEach((item, index) => {
            if (index >= startIndex && index < endIndex) {
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
        if (currentPage < totalPage) {
            currentPage++;
            countPage.innerHTML = currentPage;
            showItem(currentPage);
        }
    })
    prev.addEventListener('click', () => {

        if (currentPage > 1) {
            currentPage--;
            countPage.innerHTML = currentPage;
            showItem(currentPage);
        }
    })

    const handleSaveChanges = (id) => {
        const todo = JSON.parse(localStorage.getItem('todos'));
        const containerTodo = document.getElementById(id)
        const todoText = containerTodo.querySelector('.task-text')
        const form = containerTodo.querySelector('.change-task')
        const saveChanges = containerTodo.querySelector('#change-text');

        if (saveChanges.value.trim() !== '') {
            todoText.innerHTML = saveChanges.value;
            form.classList.add('none');
            todoText.classList.remove('none');
        }
        const changesTodo = todo.map((el) => {
            if (el.id === id) {
                return {
                    ...el,
                    name: saveChanges.value
                };
            }
            return el;
        });

        localStorage.setItem('todos', JSON.stringify(changesTodo));
    }

    const handlerChangeTodos = (id) => {
        const containerTodo = document.getElementById(id)
        const form = containerTodo.querySelector('.change-task')
        const input = containerTodo.querySelector('input')
        const todoText = containerTodo.querySelector('.task-text')
        todoText.classList.add('none')
        form.classList.remove('none')
        input.value = todoText.textContent;

        todo.forEach(el => {
            if (el.id === id) {
                el.name = input.value
            }
        })
    }

    const handlerRemoveTodo = (id) => {
        const todo = JSON.parse(localStorage.getItem('todos'));
        const deleteTodo = todo.filter(el => el.id !== id)
        const removeDiv = document.getElementById(id)
        removeDiv.classList.remove('addTask')
        removeDiv.classList.add('removeTask')
        setTimeout(() => {
            removeDiv.remove()
            showOrNotPaginat(deleteTodo.length)
        }, 300)
        localStorage.setItem('todos', JSON.stringify(deleteTodo));
    }

    const handlerswitch = (id) => {
        const containerTodo = document.getElementById(id)
        const switchDoneBtn = containerTodo.querySelector('.task-text');
        switchDoneBtn.classList.toggle('line')
        // const todo = JSON.parse(localStorage.getItem('todos'));
        const updatedTodos = todo().map((el) => {
            if (el.id === id) {
                return {
                    ...el,
                    done: !el.done
                };
            }
            return el;
        });
        showOrNotPaginat(updatedTodos.length)
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
    };

    const listner = (id) => {
        const todoConteiner = document.getElementById(id)
        todoConteiner.addEventListener('click', (e) => {
            const btnDone = e.target.closest('.done')
            const btnRemove = e.target.closest('.del')
            const btnChange = e.target.closest('.change')
            const btnSavehanges = e.target.closest('.doneChange')
            if (btnDone) {
                handlerswitch(id)
            }
            if (btnRemove) {

                handlerRemoveTodo(id)
            }
            if (btnChange) {
                handlerChangeTodos(id)
            }
            if (btnSavehanges) {
                handleSaveChanges(id)
            }

        })

    }

    const sortingDone = () => {
        const dones = [];
        todo().forEach(e => {
            if(document.getElementById(e.id)) {
                const el = document.getElementById(e.id);
                el.remove()
            }   
            if(e.done) {
                dones.push(e)
            }
        })
        dones.forEach(e => {
            createHtml({...e})
        })
        showOrNotPaginat(dones.length)
        sortsaddEventListener()
    }

    const sortingFalse = () => {
        const falses = [];
        todo().forEach(e => {
            if(document.getElementById(e.id)) {
                const el = document.getElementById(e.id);
                el.remove()
            }   
            if(!e.done) {
                falses.push(e)
            }
        })
        falses.forEach(e => {
            createHtml({...e})
        })        
        showOrNotPaginat(falses.length)
        sortsaddEventListener()
    }

    const sortsaddEventListener = () => sorts.addEventListener('change', (e) => {
        if(sorts.value === 'default') {
            todo().forEach(e => {
                if(document.getElementById(e.id)) {
                    document.getElementById(e.id).remove();
                }
            })
            todo().forEach(e => {
                createHtml({...e})
            })
        }
        if(sorts.value === 'true') {
            sortingDone();
        }
        if(sorts.value === 'false') {
            sortingFalse();
        }
    })
    sortsaddEventListener()
});